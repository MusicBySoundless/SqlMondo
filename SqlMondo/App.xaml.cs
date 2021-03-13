using Android.Content;
using Newtonsoft.Json;
using SqlMondo.Models;
using System;
using System.IO;
using Xamarin.Forms;
using static SqlMondo.Log;
using static SqlMondo.Views.Profil;
using static SqlMondo.UtilityMethods;
using System.Collections.Generic;
using System.Net.Http;
using SqlMondo.Views;

[assembly: ExportFont("Font Awesome 5 Brands-Regular-400.otf")]
[assembly: ExportFont("Font Awesome 5 Free-Regular-400.otf")]
[assembly: ExportFont("Font Awesome 5 Free-Solid-900.otf")]

namespace SqlMondo
{
    public partial class App : Application
    {
        public static string FolderPath { get; private set; }
        public static string InternalStorage { get; private set; }
        static RestService restService;

        public App()
        {
            FolderPath = Path.Combine(GetExternalStorage());
            InternalStorage = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData));

            Start();
            Write("[APP] Attempting to initialize App...");

            InitializeComponent();
            CheckPerm();

            Write("[APP] App initialized.");
            Write("[APP] Setting App theme to unspecified...");

            Current.UserAppTheme = OSAppTheme.Unspecified;

            Write("[APP] App theme set to unspecified.");
            Write("[APP] Initializing profilePath variable...");

            var profilePath = Path.Combine(FolderPath, "settings.json");

            Write("[APP] profilePath initialized.");
            Write("[APP] Trying to read profile data...");
            ProfileSettings settings;
            Write("[APP] Checking if profile file exists...");

            if (!File.Exists(@profilePath))
            {
                Write("[APP] Profile file not found. Instantiating new profile object...");

                ProfileSettings profile = new ProfileSettings();

                SaveFile(profile, App.FolderPath, "settings.json");

                //Write("[APP] Profile object instantiated. Instantiating new JsonSerializer...");

                //JsonSerializer serializer = new JsonSerializer();
                //serializer.NullValueHandling = NullValueHandling.Ignore;

                //Write("[APP] Instantiated new JsonSerializer. Instantiating new StreamWriter...");

                //using (StreamWriter sw = new StreamWriter(@profilePath))
                //using (JsonWriter writer = new JsonTextWriter(sw))
                //{
                //    Write("[APP] StreamWriter instantiated. Saving file...");

                //    serializer.Serialize(writer, profile);

                //    Write("[APP] File saved. Closing writers...");

                //    sw.Close();
                //    writer.Close();

                //    Write("[APP] Writers closed.");
                //}
            }
            Write("[APP] Deserializing profile settings into new profile object...");

            settings = ReadSettings();

            Write("[APP] Settings deserialized.");
            Write("[APP] Checking if custom theme is set...");

            if (!settings.UseSystemTheme)
            {
                Write("[APP] Custom theme is set. Checking type...");

                if (settings.DarkMode)
                {
                    Write("[APP] Type set to Dark. Setting app theme to dark...");

                    Application.Current.UserAppTheme = OSAppTheme.Dark;

                    Write("[APP] Theme set to dark.");
                }
                else
                {
                    Write("[APP] Type set to Light. Setting app theme to light...");

                    Application.Current.UserAppTheme = OSAppTheme.Light;

                    Write("[APP] Theme set to light.");
                }
            }
            else
            {
                Write("[APP] Theme set to system theme. (unspecified)");
            }
            Write("[APP] Starting daily stats handling...");

            DailyStatsHandler(DateTime.Today);

            Write("[APP] Daily stats handled.");

            try
            {
                //if (!settings.CompletedSetup)
                //{
                //    MainPage = new NavigationPage(new SqlMondo.FirstSetupPage());
                //}
                //else
                //{
                //    MainPage = new AppShell();
                //}
                MainPage = new LoginPage();
            }
            catch(Exception ex)
            {
                Write("[APP Exception]!!! "+ex.ToString());
            }
        }
        public string GetExternalStorage()
        {
            Context context = Android.App.Application.Context;
            var filePath = context.GetExternalFilesDir("");
            return filePath.Path;
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
            Write("[APP.DailyStatsHandler] Daily stats handling initiated...");
            Write("[APP.DailyStatsHandler] Setting file name.");
            var fileName = day.ToString("dd") + "_" + day.ToString("MM") + "_" + day.ToString("yyyy");
            Write("[APP.DailyStatsHandler] File name set. Setting file path...");
            var statsPath = Path.Combine(App.FolderPath, "user", $"{fileName}.json");
            Write("[APP.DailyStatsHandler] File path set.");
            var statsDir = Path.Combine(App.FolderPath, "user/");

            Write("[APP.DailyStatsHandler] Checking if path exists...");
            DirectoryInfo di = new DirectoryInfo(@statsDir);
            if (!di.Exists)
            {
                Write("[APP.DailyStatsHandler] Path not found. Creating directory...");
                Directory.CreateDirectory(@statsDir);
                Write("[APP.DailyStatsHandler] Directory created.");
            }

            Write("[APP.DailyStatsHandler] Path found. Instantiating new JsonSerializer...");
            JsonSerializer serializer = new JsonSerializer
            {
                NullValueHandling = NullValueHandling.Ignore
            };

            Write("[APP.DailyStatsHandler] Instantiating new Daily stats object...");
            DailyStats dailystats = new DailyStats
            {
                Day = day,
                CzasTreningu = TimeSpan.Zero
            };
            Write("[APP.DailyStatsHandler] Object instantiated. Checking if activities path exists...");
            di = new DirectoryInfo(Path.Combine(App.FolderPath, "activities"));
            if (!di.Exists)
            {
                Write("[APP.DailyStatsHandler] Path not found. Creating directory...");
                Directory.CreateDirectory(Path.Combine(App.FolderPath, "activities"));
                Write("[APP.DailyStatsHandler] Directory created.");
            }
            Write("[APP.DailyStatsHandler] Path found.");

            Write("[APP.DailyStatsHandler] Enumerating files in activities path...");
            var dailyActivities = Directory.EnumerateFiles(App.FolderPath, "activities/*.json");
            Write("[APP.DailyStatsHandler] Files enumerated.");

            Write("[APP.DailyStatsHandler] Checking for add, delete and edit conditions...");
            if (!File.Exists(statsPath)&&!add)
            {
                Write("[APP.DailyStatsHandler] File not found. Creating a new file...");
                foreach (var file in dailyActivities)
                {
                    Write("[APP.DailyStatsHandler] Deserializing activity object "+file+"...");
                    Activity activity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@file));
                    Write("[APP.DailyStatsHandler] Object deserialized.");

                    Write("[APP.DailyStatsHandler] Checking if activity is from today...");
                    if (activity.Date == day)
                    {
                        Write("[APP.DailyStatsHandler] Activity from today. Adding stats to daily stats...");
                        Write("[APP.DailyStatsHandler] Calculating duration time...");
                        TimeSpan activityDuration = activity.EndTime - activity.StartTime;
                        Write("[APP.DailyStatsHandler] Duration time calculated. Adding steps count...");
                        dailystats.DzienneKroki += System.Convert.ToInt32(activity.Steps);
                        Write("[APP.DailyStatsHandler] Steps added. Adding duration...");
                        dailystats.CzasTreningu += activityDuration;
                        Write("[APP.DailyStatsHandler] Duration added. Adding kilometres...");
                        dailystats.Kilometry += System.Convert.ToDecimal(activity.Kilometres);
                        Write("[APP.DailyStatsHandler] Kilometres added. Increasing training count...");
                        dailystats.IloscTreningow++;
                        Write("[APP.DailyStatsHandler] Training count increased. All stats have been added. Checking next file...");
                    }
                    else { Write("[APP.DailyStatsHandler] Activity is not from today. Skipping..."); }
                };
            }
            else if (File.ReadAllLines(statsPath) == null)
            {
                Write("[APP.DailyStatsHandler] File is empty.");
            }
            else if(add)
            {
                dailystats = JsonConvert.DeserializeObject<DailyStats>(File.ReadAllText(statsPath));
                foreach (var file in dailyActivities)
                {
                    Activity activity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@file));
                    if (File.GetCreationTime(file)>File.GetCreationTime(statsPath)&&activity.Date==day)
                    {
                        TimeSpan activityDuration = activity.EndTime - activity.StartTime;
                        dailystats.DzienneKroki += System.Convert.ToInt32(activity.Steps);
                        dailystats.CzasTreningu += activityDuration;
                        dailystats.Kilometry += System.Convert.ToDecimal(activity.Kilometres);
                        dailystats.IloscTreningow++;
                    }
                };
            }
            else if (!add&&!delete||edit)
            {
                DailyStats checksum = new DailyStats
                {
                    Day = day,
                    CzasTreningu = TimeSpan.Zero
                };
                foreach (var file in dailyActivities)
                {
                    Activity activity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@file));
                    if (activity.Date == day)
                    {
                        TimeSpan activityDuration = activity.EndTime - activity.StartTime;
                        checksum.DzienneKroki += System.Convert.ToInt32(activity.Steps);
                        checksum.CzasTreningu += activityDuration;
                        checksum.Kilometry += System.Convert.ToDecimal(activity.Kilometres);
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
                if(DeletedFile.Date == day)
                {
                    TimeSpan duration = DeletedFile.EndTime - DeletedFile.StartTime;
                    dailystats = JsonConvert.DeserializeObject<DailyStats>(File.ReadAllText(statsPath));
                    dailystats.DzienneKroki -= System.Convert.ToInt32(DeletedFile.Steps);
                    dailystats.Kilometry -= System.Convert.ToDecimal(DeletedFile.Kilometres);
                    dailystats.CzasTreningu -= duration;
                    dailystats.IloscTreningow--;
                }
            }
            using StreamWriter sw = new StreamWriter(@statsPath);
            using JsonWriter writer = new JsonTextWriter(sw);
            serializer.Serialize(writer, dailystats);
        }

        //private Token loginHandling()
        //{
        //    return token;
        //}

        public static RestService RestService
        {
            get
            {
                if(restService == null)
                {
                    restService = new RestService();
                }
                return restService;
            }
        }

        public async void CheckLogin()
        {
            var tokenPath = Path.Combine(InternalStorage, "LoginToken.json");
            string token = JsonConvert.DeserializeObject<Token>(tokenPath).JsonToken;
            var weburl = "http://46.41.137.179/remoteapi/check";
            var postData = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("token", token),
            };
            var content = new FormUrlEncodedContent(postData);
            var result = await RestService.PostResponse(weburl, content);
            Console.WriteLine(result.ToString());
        }
    }
}