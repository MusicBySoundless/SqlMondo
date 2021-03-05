using System;

namespace SqlMondo.Models
{
    public class Activity
    {
        public string Filename { get; set; }
        public string Nazwa { get; set; }
        public string Rodzaj { get; set; }
        public int RodzajId { get; set; }
        public DateTime Data { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Uwagi { get; set; }
        public string Kalorie { get; set; }
        public string Kroki { get; set; }
        public string Kilometry { get; set; }
        public string ShownDate { get; set; }
        public string Duration { get; set; }
    }
}
