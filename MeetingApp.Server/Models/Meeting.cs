public class Meeting
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Description { get; set; }
    public List<string> DocumentUrls { get; set; } // Change to a list of document URLs
}
