using MeetingApp.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class MeetingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public MeetingsController(AppDbContext context)
    {
        _context = context;
    }

    // Fetch all meetings
    [HttpGet]
    public async Task<IActionResult> GetMeetings()
    {
        var meetings = await _context.Meetings.ToListAsync();
        return Ok(meetings);
    }

    // Fetch a single meeting by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMeetingById(int id)
    {
        var meeting = await _context.Meetings.FindAsync(id);
        if (meeting == null)
        {
            return NotFound();
        }

        return Ok(meeting);
    }

    // Create a new meeting
    [HttpPost("create")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateMeeting([FromForm] MeetingCreateRequest request)
    {
        var documentUrls = new List<string>();

        if (request.Documents != null && request.Documents.Count > 0)
        {
            foreach (var file in request.Documents)
            {
                var filePath = Path.Combine("wwwroot", "uploads", file.FileName);

                // Create the directory if it doesn't exist
                if (!Directory.Exists(Path.Combine("wwwroot", "uploads")))
                {
                    Directory.CreateDirectory(Path.Combine("wwwroot", "uploads"));
                }

                // Save the document to the specified file path
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                documentUrls.Add($"/uploads/{file.FileName}"); // Add the URL to the list
            }
        }

        // Create a new Meeting entity based on the received data
        var meeting = new Meeting
        {
            Name = request.Name,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Description = request.Description,
            DocumentUrls = documentUrls // DocumentUrls can be empty or null
        };

        // Save the meeting details to the database
        _context.Meetings.Add(meeting);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Meeting created successfully" });
    }

    [HttpPost("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateMeeting(int id, [FromForm] MeetingUpdateRequest request)
    {
        var meeting = await _context.Meetings.FindAsync(id);
        if (meeting == null) return NotFound();

        meeting.Name = request.Name;
        meeting.StartDate = request.StartDate;
        meeting.EndDate = request.EndDate;
        meeting.Description = request.Description;

        // Handle document deletions
        if (request.DeleteAllDocuments)
        {
            DeleteAllDocuments(meeting);
        }
        else if (request.DocumentsToDelete != null && request.DocumentsToDelete.Count > 0)
        {
            DeleteSelectedDocuments(meeting, request.DocumentsToDelete);
        }

        // Handle new document uploads
        if (request.Documents != null && request.Documents.Count > 0)
        {
            foreach (var document in request.Documents)
            {
                var filePath = Path.Combine("wwwroot/uploads", document.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await document.CopyToAsync(stream);
                }

                if (meeting.DocumentUrls == null)
                    meeting.DocumentUrls = new List<string>();

                meeting.DocumentUrls.Add($"/uploads/{document.FileName}");
            }
        }

        _context.Entry(meeting).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(meeting);
    }

    private void DeleteAllDocuments(Meeting meeting)
    {
        if (meeting.DocumentUrls != null && meeting.DocumentUrls.Count > 0)
        {
            foreach (var url in meeting.DocumentUrls)
            {
                var filePath = Path.Combine("wwwroot", url.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
            meeting.DocumentUrls.Clear(); // Clear the list of document URLs
        }
    }

    private void DeleteSelectedDocuments(Meeting meeting, List<string> documentsToDelete)
    {
        foreach (var url in documentsToDelete)
        {
            var filePath = Path.Combine("wwwroot", url.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            meeting.DocumentUrls.Remove(url); // Remove the URL from the list
        }
    }


    // Delete a meeting
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMeeting(int id)
    {
        var meeting = await _context.Meetings.FindAsync(id);
        if (meeting == null) return NotFound();

        _context.Meetings.Remove(meeting);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
