using System;
using System.IO;
using Newtonsoft.Json;
using Plugin.Permissions;
using SqlMondo.Models;
using Xamarin.Forms;

namespace SqlMondo.Views
{
    [QueryProperty(nameof(ItemId), nameof(ItemId))]
    public partial class DodajAktywnosc : ContentPage
    {
        public string ItemId
        {
            set
            {
                LoadNote(value);
            }
        }

        public DodajAktywnosc()
        {
            InitializeComponent();
            try
            {
                CheckPerm();

                // Set the BindingContext of the page to a new Note.
                BindingContext = new Activity();
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

        void LoadNote(string filename)
        {
            try
            {
                Activity notka = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@filename));
                Nazwa.Text = notka.Nazwa;
                Rodzaj.SelectedIndex = notka.RodzajId;
                BindingContext = notka;
            }
            catch (Exception)
            {
                Console.WriteLine("Nie udało się załadować aktywności.");
            }
        }

        async void OnSaveButtonClicked(object sender, EventArgs e)
        {
            try
            {
                                var activity = (Activity)BindingContext;
                var filepath = activity.Filename;
                JsonSerializer serializer = new JsonSerializer();
                serializer.NullValueHandling = NullValueHandling.Ignore;
                // Save the file.
                var FilePath = Path.Combine(App.FolderPath, "activities/");
                DirectoryInfo di = new DirectoryInfo(@FilePath);
                if (!di.Exists)
                {
                    Directory.CreateDirectory(FilePath);
                }
                var filename = Path.Combine(FilePath, $"{GetFileName(1, activity.Data)}.json");
                using (StreamWriter sw = new StreamWriter(@filename))
                using (JsonWriter writer = new JsonTextWriter(sw))
                {
                    serializer.Serialize(writer, activity);
                }

                App.DailyStatsHandler(DateTime.Today, add: true);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            // Navigate backwards
            await Shell.Current.GoToAsync("..");
        }

        private string GetFileName(int i, DateTime date)
        {
            string FileName = date.ToString("dd") + "_" + date.ToString("MM") + "_" + date.ToString("yyyy") + "_" + i;
            var FilePath = Path.Combine(App.FolderPath, "activities/", $"{FileName}.json");
            try
            {
                if(File.Exists(FilePath))
                {
                    i++;
                    return GetFileName(i, date);
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
                if (File.Exists(activity.Filename))
                {
                    File.Delete(activity.Filename);
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
        async void CheckPerm()
        {
            var status = await CrossPermissions.Current.CheckPermissionStatusAsync<StoragePermission>();
            if (status != Plugin.Permissions.Abstractions.PermissionStatus.Granted)
            {
                try
                {
                    status = await CrossPermissions.Current.RequestPermissionAsync<StoragePermission>();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
        }
    }
}