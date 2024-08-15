using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

public class MeetingUpdateRequest
{
    public required string Name { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public required string Description { get; set; }

    // List of documents (files) to be uploaded
    public List<IFormFile>? Documents { get; set; }

    // List of document URLs to be deleted
    public List<string>? DocumentsToDelete { get; set; }

    // Flag to delete all existing documents
    public bool DeleteAllDocuments { get; set; }
}
