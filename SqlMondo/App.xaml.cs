using Android.Content;
using Newtonsoft.Json;
using SqlMondo.Models;
using System;
using System.IO;
using Xamarin.Forms;
using static SqlMondo.Views.Profil;

[assembly: ExportFont("Font Awesome 5 Brands-Regular-400.otf")]
[assembly: ExportFont("Font Awesome 5 Free-Regular-400.otf")]
[assembly: ExportFont("Font Awesome 5 Free-Solid-900.otf")]

namespace SqlMondo
{
    public partial class App : Application
    {
        public static string FolderPath { get; private set; }

        public App()
        {
            InitializeComponent();
            FolderPath = Path.Combine(GetExternalStorage());
            App.Current.UserAppTheme = OSAppTheme.Unspecified;

            var profilePath = Path.Combine(App.FolderPath, "profile.json");
            try
            {
                if (!File.Exists(profilePath))
                {
                    ProfileSettings profile = new ProfileSettings();
                    JsonSerializer serializer = new JsonSerializer();
                    using (StreamWriter sw = new StreamWriter(@profilePath))
                    using (JsonWriter writer = new JsonTextWriter(sw))
                    {
                        serializer.Serialize(writer, profile);
                    }
                }
                ProfileSettings settings = JsonConvert.DeserializeObject<ProfileSettings>(File.ReadAllText(@profilePath));
                if (!settings.UseSystemTheme)
                {
                    if (settings.DarkMode)
                    {
                        Application.Current.UserAppTheme = OSAppTheme.Dark;
                        Console.WriteLine("Ustawiono tryb ciemny");
                    }
                    else
                    {
                        Application.Current.UserAppTheme = OSAppTheme.Light;
                        Console.WriteLine("Ustawiono tryb jasny");

                    }
                }
                Console.WriteLine("settings.DarkMode: " + settings.DarkMode);
                Console.WriteLine("OSAppTheme: " + Application.Current.UserAppTheme);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            DailyStatsHandler(DateTime.Today);
            MainPage = new AppShell();
        }
        public string GetExternalStorage()
        {
            Context context = Android.App.Application.Context;
            var filePath = context.GetExternalFilesDir("");
            return filePath.Path;
        }
        protected override void OnStart()
        { 
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }

        public class DailyStats
        {
            public DateTime Day { get; set; }
            public Int32 DzienneKroki { get; set; }
            public decimal Kilometry { get; set; }
            public TimeSpan CzasTreningu { get; set; }
            public int IloscTreningow { get; set; }
        }

        static public void DailyStatsHandler(DateTime day, bool add = false, bool delete = false, string deletedFile = "", bool edit = false)
        {
            var fileName = day.ToString("dd") + "_" + day.ToString("MM") + "_" + day.ToString("yyyy");
            var statsPath = Path.Combine(App.FolderPath, "user", $"{fileName}.json");

            var statsDir = Path.Combine(App.FolderPath, "user/");
            DirectoryInfo di = new DirectoryInfo(@statsDir);

            if (!di.Exists)
            {
                Directory.CreateDirectory(@statsDir);
            }

            JsonSerializer serializer = new JsonSerializer();
            //serializer.NullValueHandling = NullValueHandling.Ignore;

            DailyStats dailystats = new DailyStats
            {
                Day = day,
                CzasTreningu = TimeSpan.Zero
            };
            di = new DirectoryInfo(Path.Combine(App.FolderPath, "activities"));
            if (!di.Exists)
            {
                Directory.CreateDirectory(Path.Combine(App.FolderPath, "activities"));
            }
            var dailyActivities = Directory.EnumerateFiles(App.FolderPath, "activities/*.json");
            if (!File.Exists(statsPath)&&!add)
            {
                foreach (var file in dailyActivities)
                {
                    Activity activity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@file));
                    if (activity.Data == day)
                    {
                        TimeSpan activityDuration = activity.EndTime - activity.StartTime;
                        dailystats.DzienneKroki += System.Convert.ToInt32(activity.Kroki);
                        dailystats.CzasTreningu += activityDuration;
                        dailystats.Kilometry += System.Convert.ToDecimal(activity.Kilometry);
                        dailystats.IloscTreningow++;
                    }
                };
            }
            else if (File.ReadAllLines(statsPath) == null)
            {

            }
            else if(add)
            {
                dailystats = JsonConvert.DeserializeObject<DailyStats>(File.ReadAllText(statsPath));
                foreach (var file in dailyActivities)
                {
                    Activity activity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@file));
                    if (File.GetCreationTime(file)>File.GetCreationTime(statsPath)&&activity.Data==day)
                    {
                        TimeSpan activityDuration = activity.EndTime - activity.StartTime;
                        dailystats.DzienneKroki += System.Convert.ToInt32(activity.Kroki);
                        dailystats.CzasTreningu += activityDuration;
                        dailystats.Kilometry += System.Convert.ToDecimal(activity.Kilometry);
                        dailystats.IloscTreningow++;
                    }
                };
            }
            else if (!add&&!delete||edit)
            {
                DailyStats checksum = new DailyStats();
                checksum.Day = day;
                checksum.CzasTreningu = TimeSpan.Zero;
                foreach (var file in dailyActivities)
                {
                    Activity activity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@file));
                    if (activity.Data == day)
                    {
                        TimeSpan activityDuration = activity.EndTime - activity.StartTime;
                        checksum.DzienneKroki += System.Convert.ToInt32(activity.Kroki);
                        checksum.CzasTreningu += activityDuration;
                        checksum.Kilometry += System.Convert.ToDecimal(activity.Kilometry);
                        checksum.IloscTreningow++;
                    }
                };
                dailystats = JsonConvert.DeserializeObject<DailyStats>(File.ReadAllText(statsPath));
                if (checksum.DzienneKroki != dailystats.DzienneKroki
                    || checksum.CzasTreningu != dailystats.CzasTreningu
                    || checksum.Kilometry != dailystats.Kilometry
                    || checksum.IloscTreningow != dailystats.IloscTreningow)
                {
                    dailystats = checksum;
                }
            }
            if (delete)
            {
                Activity DeletedFile = new Activity();
                if (File.Exists(deletedFile))
                {
                    DeletedFile = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(deletedFile));
                }
                if(DeletedFile.Data == day)
                {
                    TimeSpan duration = DeletedFile.EndTime - DeletedFile.StartTime;
                    dailystats = JsonConvert.DeserializeObject<DailyStats>(File.ReadAllText(statsPath));
                    dailystats.DzienneKroki -= System.Convert.ToInt32(DeletedFile.Kroki);
                    dailystats.Kilometry -= System.Convert.ToDecimal(DeletedFile.Kilometry);
                    dailystats.CzasTreningu -= duration;
                    dailystats.IloscTreningow--;
                }
            }
            using (StreamWriter sw = new StreamWriter(@statsPath))
            using (JsonWriter writer = new JsonTextWriter(sw))
            {
                serializer.Serialize(writer, dailystats);
            }
        }
    }
}