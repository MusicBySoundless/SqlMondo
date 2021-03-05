using System;
using System.IO;
using Newtonsoft.Json;
using Xamarin.Forms;
using Microcharts;
using SkiaSharp;
using Xamarin.Essentials;
using static SqlMondo.Views.Profil;
using static SqlMondo.App;
using System.Windows.Input;

namespace SqlMondo.Views
{
    public partial class Podsumowanie : ContentPage
    {
        public Podsumowanie()
        {
            InitializeComponent();
            CheckPerm();
            GoalsChart.Chart = new RadialGaugeChart
            {
                Entries = GetDailyEntries(),
                BackgroundColor = SKColor.Parse("#00FFFFFF"),
                LabelTextSize = 28,
                AnimationDuration = TimeSpan.FromMilliseconds(750),
                MaxValue = 1,
                Margin = 15
            };
            ICommand RefreshCommand = new Command(() =>
            {
                UpdateDailyEntries();
                RefreshView.IsRefreshing = false;
            });
            RefreshView.Command = RefreshCommand;
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            try
            {
                UpdateDailyEntries();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        #region Handling Goals Graph
        void UpdateDailyEntries()
        {
            try
            {
                GoalsChart.Chart.Entries = GetDailyEntries();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        private ChartEntry[] GetDailyEntries()
        {
            ChartEntry[] dailyEntries = new[]
                {
                #region NotWorkingData
                new ChartEntry(float.Parse(GetStats(DateTime.Today).IloscTreningow.ToString()) / float.Parse(GetGoals().IloscTreningowCel))
                {
                    Label = "Ilość treningów",
                    TextColor = SKColor.Parse("#CCCCCC"),
                    ValueLabelColor = SKColor.Parse("#ee9a3a"),
                    Color = SKColor.Parse("#ee9a3a")
                },
                new ChartEntry(float.Parse((GetStats(DateTime.Today).CzasTreningu.TotalMinutes/60).ToString()) / float.Parse(GetGoals().CzasTreninguCel))
                {
                    Label = "Czas treningu",
                    TextColor = SKColor.Parse("#CCCCCC"),
                    ValueLabelColor = SKColor.Parse("#eb548c"),
                    Color = SKColor.Parse("#eb548c")
                },
                new ChartEntry(float.Parse(GetStats(DateTime.Today).Kilometry.ToString()) / float.Parse(GetGoals().KilometryCel))
                {
                    Label = "Kilometry",
                    TextColor = SKColor.Parse("#CCCCCC"),
                    ValueLabelColor = SKColor.Parse("#7d3ac1"),
                    Color = SKColor.Parse("#7d3ac1")
                },
                new ChartEntry(float.Parse(GetStats(DateTime.Today).DzienneKroki.ToString()) / float.Parse(GetGoals().CelKroki))
                {
                    Label = "Kroki",
                    TextColor = SKColor.Parse("#CCCCCC"),
                    ValueLabelColor = SKColor.Parse("#1de4bd"),
                    Color = SKColor.Parse("#1de4bd")
                }
                #endregion
                //#region TestData
                //new ChartEntry(26)
                //{
                //    Label = "Ilość treningów",
                //    TextColor = SKColor.Parse("#CCCCCC"),
                //    ValueLabelColor = SKColor.Parse("#ee9a3a"),
                //    Color = SKColor.Parse("#ee9a3a")
                //},
                //new ChartEntry(320)
                //{
                //    Label = "Czas treningu",
                //    TextColor = SKColor.Parse("#CCCCCC"),
                //    ValueLabelColor = SKColor.Parse("#eb548c"),
                //    Color = SKColor.Parse("#eb548c")
                //},
                //new ChartEntry(550)
                //{
                //    Label = "Kilometry",
                //    TextColor = SKColor.Parse("#CCCCCC"),
                //    ValueLabelColor = SKColor.Parse("#7d3ac1"),
                //    Color = SKColor.Parse("#7d3ac1")
                //},
                //new ChartEntry(345)
                //{
                //    Label = "Kroki",
                //    TextColor = SKColor.Parse("#CCCCCC"),
                //    ValueLabelColor = SKColor.Parse("#1de4bd"),
                //    Color = SKColor.Parse("#1de4bd")
                //}
                //#endregion
            };
            return dailyEntries;
        }
        private DailyStats GetStats(DateTime day)
        {
            DailyStats dailyStats = new DailyStats();
            var fileName = day.ToString("dd") + "_" + day.ToString("MM") + "_" + day.ToString("yyyy");
            var statsPath = Path.Combine(App.FolderPath, "user", $"{fileName}.json");
            try
            {
                dailyStats = JsonConvert.DeserializeObject<DailyStats>(File.ReadAllText(@statsPath));
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return dailyStats;
        }

        public ProfileSettings GetGoals()
        {
            ProfileSettings settings = new ProfileSettings();
            var profilePath = Path.Combine(App.FolderPath, "profile.json");
            try
            {
                settings = JsonConvert.DeserializeObject<ProfileSettings>(File.ReadAllText(@profilePath));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return settings;
        }
        #endregion

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
        async void CheckPerm()
        {            
            var status = await Permissions.CheckStatusAsync<Permissions.StorageRead>();
            if (status != PermissionStatus.Granted)
            {
                try
                {
                    status = await Permissions.RequestAsync<Permissions.StorageRead>();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
            status = await Permissions.CheckStatusAsync<Permissions.StorageWrite>();
            if (status != PermissionStatus.Granted)
            {
                try
                {
                    status = await Permissions.RequestAsync<Permissions.StorageWrite>();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
            status = await Permissions.CheckStatusAsync<Permissions.NetworkState>();
            if (status != PermissionStatus.Granted)
            {
                try
                {
                    status = await Permissions.RequestAsync<Permissions.NetworkState>();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
        }
    }
}