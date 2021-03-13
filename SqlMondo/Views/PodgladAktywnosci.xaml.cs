using System;
using System.IO;
using Newtonsoft.Json;
using static SqlMondo.UtilityMethods;
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
                notka.Filepath = filename;
                if (notka.Type == "Inne")
                {
                    Label.Text = "Inna aktywność z dnia " + notka.Date.ToString().Substring(0, 9);
                }
                else
                {
                    Label.Text = notka.Type.ToString() + " z dnia " + notka.Date.ToString().Substring(0, 9);
                }
                Nazwa.Text = notka.Name;
                Rodzaj.SelectedIndex = notka.TypeId;
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
            var filepath = note.Filepath;

            JsonSerializer serializer = new JsonSerializer
            {
                NullValueHandling = NullValueHandling.Ignore
            };
            // Update the file
            using (StreamWriter sw = new StreamWriter(@filepath))
            using (JsonWriter writer = new JsonTextWriter(sw))
            {
                serializer.Serialize(writer, note);
            }
            //}
            if (note.Type == "Inna")
            {
                Label.Text = "Inna aktywność z dnia " + note.Date.ToString().Substring(0, 9);
            }
            else
            {
                Label.Text = note.Type.ToString() + " z dnia " + note.Date.ToString().Substring(0, 9);
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
            App.DailyStatsHandler(DateTime.Today, delete: true, deletedFile: note.Filepath);
            // Delete the file.
            if (File.Exists(note.Filepath))
            {
                File.Delete(note.Filepath);
                await Shell.Current.GoToAsync("..");
            }
            else
            {
                await DisplayAlert("Alert", "Nie znaleziono pliku " + note.Filepath, "OK");
            }

            // Navigate backwards

        }
    }
}