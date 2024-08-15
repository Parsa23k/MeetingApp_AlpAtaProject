using Microsoft.EntityFrameworkCore;

namespace MeetingApp.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Meeting> Meetings { get; set; }
    }
}
