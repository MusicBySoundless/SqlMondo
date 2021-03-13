using System;

namespace SqlMondo.Models
{
    // Activity Object Model
    // Stores activity data to be used throughout the app
    public class Activity
    {
        public string Filepath { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int TypeId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Info { get; set; }
        public string Calories { get; set; }
        public string Steps { get; set; }
        public string Kilometres { get; set; }
        public string ShownDate { get; set; }
        public string Duration { get; set; }
    }
}
