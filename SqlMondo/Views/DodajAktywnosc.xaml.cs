using System;
using System.IO;
using Newtonsoft.Json;
using Plugin.Permissions;
using SqlMondo.Models;
using Xamarin.Forms;
using static SqlMondo.UtilityMethods;

namespace SqlMondo.Views
{
    [QueryProperty(nameof(ItemId), nameof(ItemId))]
    public partial class DodajAktywnosc : ContentPage
    {
        public string ItemId
        {
            set
            {
                LoadActivity(value);
            }
        }

        public DodajAktywnosc()
        {
            InitializeComponent();
            try
            {
                CheckPerm();
                // Set the BindingContext of the page to a new Activity object.
                BindingContext = new Activity();
                // Initialize data into few pickers
                dataPicker.Date = DateTime.Today;
                TimeSpan now = DateTime.Now.TimeOfDay;
                start.Time = now;
                end.Time = now + TimeSpan.FromHours(1);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        void LoadActivity(string filename)
        {
            try
            {
                // Read and deserialize .json into new Activity object, then set it as Binding Context.
                Activity activity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@filename));
                BindingContext = activity;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        // File saving method. Probably will put it in a separate class.
        async void OnSaveButtonClicked(object sender, EventArgs e)
        {
            try
            {
                // Set Binding Context to a new Activity object.
                Activity activity = (Activity)BindingContext;

                Console.WriteLine(activity.ToString());

                // Get filepath of the file.
                var filepath = activity.Filepath;
                // Generate new filepath and
                var activitiesPath = Path.Combine(App.FolderPath, "activities/");

                SaveFile(activity, activitiesPath, $"{GetFileName(activity.Date)}.json");

                // Add stats from new activity to daily activities object.
                App.DailyStatsHandler(DateTime.Today, add: true);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            // Navigate backwards.
            await Shell.Current.GoToAsync("..");
        }

        /// <summary>
        /// Generates filename based on provided date and file iterator. Iterator defaults to 1 if not provided.
        /// </summary>
        /// <param name="date">Specify the date of the activity.</param>
        /// <param name="i">Optional iterator parameter which is added to the end of the file so that there's no two files with the same name.</param>
        /// <returns>File path with file name ready to be used in File.* and System.IO methods.</returns>
        private string GetFileName(DateTime date, int i = 1)
        {
            string FileName = date.ToString("dd") + "_" + date.ToString("MM") + "_" + date.ToString("yyyy") + "_" + i;
            var FilePath = Path.Combine(App.FolderPath, "activities/", $"{FileName}.json");
            try
            {
                if(File.Exists(FilePath))
                {
                    i++;
                    return GetFileName(date, i);
                }
                else
                {
                    return FileName;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return null;
            }
        }

        async void OnDeleteButtonClicked(object sender, EventArgs e)
        {
            var activity = (Activity)BindingContext;

            // Delete the file.
            try
            {
                if (File.Exists(activity.Filepath))
                {
                    File.Delete(activity.Filepath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            // Navigate backwards
            await Shell.Current.GoToAsync("..");
        }

        void OnPropertyChanged(object sender, EventArgs e)
        {
            end.Time = start.Time + TimeSpan.FromHours(1);
        }
    }
}