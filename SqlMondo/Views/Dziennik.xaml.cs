using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SqlMondo.Models;
using Xamarin.Forms;
using static SqlMondo.UtilityMethods;

namespace SqlMondo.Views
{
    public partial class Dziennik : ContentPage
    {
        public Dziennik()
        {
            InitializeComponent();
            CheckPerm();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            var activities = new List<Activity>();

            // Create a Note object from each file.
            try
            {
                var files = Directory.EnumerateFiles(App.FolderPath, "activities/*.json");
                foreach (var filename in files)
                {
                    Activity activity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@filename));
                    TimeSpan duration = activity.EndTime - activity.StartTime;
                    Activity readActivity = new Activity
                    {
                        Filepath = filename,
                        Name = activity.Name,
                        StartTime = activity.StartTime,
                        Type = activity.Type,
                        Steps = "Kroki: " + activity.Steps,
                        ShownDate = activity.Date.ToString("dd-MM-yy"),
                        Kilometres = Math.Round(System.Convert.ToDecimal(activity.Kilometres), 3).ToString() + " km"
                    };
                    if (duration.Hours == 0)
                    {
                        readActivity.Duration = Math.Abs(System.Convert.ToDecimal(duration.Minutes)) + " min";
                    }
                    else
                    {
                        readActivity.Duration = Math.Abs(System.Convert.ToDecimal(duration.Hours)) + " g " + Math.Abs(System.Convert.ToDecimal(duration.Minutes)) + " min";
                    }
                    activities.Add(readActivity);
                }
                var sortedActivities = activities.OrderByDescending(d => d.ShownDate).ToList();
                collectionView.ItemsSource = sortedActivities;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        async void OnAddClicked(object sender, EventArgs e)
        {
            // Navigate to the NoteEntryPage, without passing any data.
            try
            {
                await Shell.Current.GoToAsync(nameof(DodajAktywnosc));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        async void OnSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (e.CurrentSelection != null)
            {
                // Navigate to the NoteEntryPage, passing the filename as a query parameter.
                Activity note = (Activity)e.CurrentSelection.FirstOrDefault();
                await Shell.Current.GoToAsync($"{nameof(PodgladAktywnosci)}?{nameof(PodgladAktywnosci.ItemId)}={note.Filepath}");
            }
        }

        async void OnAccClicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new Konto());
        }
    }

}