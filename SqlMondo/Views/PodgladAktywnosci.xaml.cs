using System;
using System.IO;
using Newtonsoft.Json;
using Plugin.Permissions;
using SqlMondo.Models;
using Xamarin.Forms;

namespace SqlMondo.Views
{
    [QueryProperty(nameof(ItemId), nameof(ItemId))]
    public partial class PodgladAktywnosci : ContentPage
    {
        public string filepath;
        public string ItemId
        {
            set
            {
                LoadNote(value);
            }
        }

        public PodgladAktywnosci()
        {
            InitializeComponent();
            CheckPerm();
            BindingContext = new Activity();
        }

        void LoadNote(string filename)
        {
            try
            {
                Activity notka = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@filename));
                notka.Filename = filename;
                if (notka.Rodzaj == "Inne")
                {
                    Label.Text = "Inna aktywność z dnia " + notka.Data.ToString().Substring(0, 9);
                }
                else
                {
                    Label.Text = notka.Rodzaj.ToString() + " z dnia " + notka.Data.ToString().Substring(0, 9);
                }
                Nazwa.Text = notka.Nazwa;
                Rodzaj.SelectedIndex = notka.RodzajId;
                BindingContext = notka;
            }
            catch (Exception)
            {
                Console.WriteLine("Nie udało się załadować notki.");
            }
        }

        void OnSaveButtonClicked(object sender, EventArgs e)
        {
            var note = (Activity)BindingContext;
            var filepath = note.Filename;

            JsonSerializer serializer = new JsonSerializer();
            serializer.NullValueHandling = NullValueHandling.Ignore;
                // Update the file
                using (StreamWriter sw = new StreamWriter(@filepath))
                using (JsonWriter writer = new JsonTextWriter(sw))
                {
                    serializer.Serialize(writer, note);
                }
            //}
            if (note.Rodzaj == "Inna")
            {
                Label.Text = "Inna aktywność z dnia " + note.Data.ToString().Substring(0, 9);
            }
            else
            {
                Label.Text = note.Rodzaj.ToString() + " z dnia " + note.Data.ToString().Substring(0, 9);
            }
            Nazwa.IsEnabled = false;
            Rodzaj.IsEnabled = false;
            dataPicker.IsEnabled = false;
            start.IsEnabled = false;
            end.IsEnabled = false;
            Uwagi.IsEnabled = false;
            Kalorie.IsEnabled = false;
            Kroki.IsEnabled = false;
            Kilometry.IsEnabled = false;
            EditSaveButton.Text = "Edytuj";
            EditSaveButton.Clicked -= OnSaveButtonClicked;
            App.DailyStatsHandler(dataPicker.Date, edit: true);
        }

        void OnEditButtonClicked(object sender, EventArgs e)
        {
            var note = (Activity)BindingContext;
            //await Shell.Current.GoToAsync($"{nameof(DodajAktywnosc)}?{nameof(DodajAktywnosc.ItemId)}={note.Filename}");
            Label.Text = "Edycja aktywności";
            Nazwa.IsEnabled = true;
            Rodzaj.IsEnabled = true;
            dataPicker.IsEnabled = true;
            start.IsEnabled = true;
            end.IsEnabled = true;
            Uwagi.IsEnabled = true;
            Kalorie.IsEnabled = true;
            Kroki.IsEnabled = true;
            Kilometry.IsEnabled = true;
            EditSaveButton.Text = "Zapisz";
            EditSaveButton.Clicked += OnSaveButtonClicked;
        }

        async void OnDeleteButtonClicked(object sender, EventArgs e)
        {
            var note = (Activity)BindingContext;
            App.DailyStatsHandler(DateTime.Today, delete: true, deletedFile: note.Filename);
            // Delete the file.
            if (File.Exists(note.Filename))
            {
                File.Delete(note.Filename);
                await Shell.Current.GoToAsync("..");
            }
            else
            {
                await DisplayAlert("Alert", "Nie znaleziono pliku " + note.Filename, "OK");
            }
            
            // Navigate backwards

        }
        async void CheckPerm()
        {
            var status = await CrossPermissions.Current.CheckPermissionStatusAsync<StoragePermission>();
            if (status != Plugin.Permissions.Abstractions.PermissionStatus.Granted)
            {
                status = await CrossPermissions.Current.RequestPermissionAsync<StoragePermission>();
            }
        }
    }
}