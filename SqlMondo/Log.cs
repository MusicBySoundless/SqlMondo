using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;


namespace SqlMondo
{
    public class Log
    {
        private static string GetLogPath()
        {
            string logDir = Path.Combine(App.FolderPath, "logs");
            DirectoryInfo di = new DirectoryInfo(logDir);
            if (!di.Exists)
            {
                di.Create();
            }
            logDir = Path.Combine(App.FolderPath, $"logs/{DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss")}.log");
            return logDir;
        }

        static string logPath = GetLogPath();

        /// <summary>
        /// Clears log file and starts a new one.
        /// </summary>
        public static void Start()
        {
            File.WriteAllText(@logPath, string.Empty);
            var files = Directory.EnumerateFiles(App.FolderPath, "logs/*.json");
            foreach (var filename in files)
            {
                if(File.GetCreationTime(filename) < DateTime.Now.Subtract(TimeSpan.FromDays(2)))
                {
                    File.Delete(filename);
                }
            }
        }

        /// <summary>
        /// Appends a line to log file.
        /// </summary>
        /// <param name="line"></param>
        public static async void Write(string line)
        {
            try
            {
                using StreamWriter log = new StreamWriter(logPath, append: true);
                await log.WriteLineAsync("LOG: ["+Environment.TickCount+"]: " + line);
                log.Close();
            }
            catch(DirectoryNotFoundException ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        /// <summary>
        /// Reads a set number of lines of the log file. By default reads all lines.
        /// </summary>
        /// <param name="numberoflines">(Default) -1 = Reads all lines;
        /// int > 0 = Read provided number of lines.</param>
        /// <returns>Returns a List<string> with all the lines.</returns>
        public static List<string> Read(int numberoflines = -1)
        {
            var logLines = new List<string>();
            using StreamReader sr = new StreamReader(@logPath);
            while (!sr.EndOfStream)
            {
                logLines.Add(sr.ReadLine());
            }
            logLines.Reverse();
            if (numberoflines == -1)
            {
                sr.Close();
                return logLines;
            }
            else if (numberoflines > 0 && numberoflines <= logLines.Count)
            {
                sr.Close();
                return logLines.Take(numberoflines).ToList();
            }
            else
            {
                sr.Close();
                return null;
            }
        }

        /// <summary>
        /// Ends a log file.
        /// </summary>
        public static void End()
        {
            using StreamWriter log = new StreamWriter(@logPath, append: true);
            log.WriteLine("---- END OF LOG FILE ----");
            log.Close();
        }
    }
}
