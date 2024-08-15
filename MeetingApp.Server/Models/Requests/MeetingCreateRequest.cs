public class MeetingCreateRequest
{
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Description { get; set; }
    public List<IFormFile>? Documents { get; set; } // Handle multiple document uploads
}
