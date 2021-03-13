using System;
using System.IO;
using Newtonsoft.Json;
using Xamarin.Forms;
using Microcharts;
using SkiaSharp;
using static SqlMondo.UtilityMethods;
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
                MaxValue = 100,
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
            float trainingCount = Clamp<float>((float.Parse(GetStats(DateTime.Today).IloscTreningow.ToString()) / float.Parse(ReadSettings().IloscTreningowCel) * 100), 0, 100);
            float trainingTime = Clamp<float>((float.Parse((GetStats(DateTime.Today).CzasTreningu.TotalMinutes / 60).ToString()) / float.Parse((ReadSettings().CzasTreninguCel.TotalMinutes / 60).ToString()) * 100), 0, 100);
            float kilometres = Clamp<float>((float.Parse(GetStats(DateTime.Today).Kilometry.ToString()) / float.Parse(ReadSettings().KilometryCel) * 100),0,100);
            float steps = Clamp<float>((float.Parse(GetStats(DateTime.Today).DzienneKroki.ToString()) / float.Parse(ReadSettings().CelKroki) * 100),0,100);
            ChartEntry[] dailyEntries = new[]
                {
                new ChartEntry(trainingCount)
                {
                    Label = "Ilość treningów",
                    TextColor = SKColor.Parse("#CCCCCC"),
                    ValueLabelColor = SKColor.Parse("#ee9a3a"),
                    Color = SKColor.Parse("#ee9a3a")
                },
                new ChartEntry(trainingTime)
                {
                    Label = "Czas treningu",
                    TextColor = SKColor.Parse("#CCCCCC"),
                    ValueLabelColor = SKColor.Parse("#eb548c"),
                    Color = SKColor.Parse("#eb548c")
                },
                new ChartEntry(kilometres)
                {
                    Label = "Kilometry",
                    TextColor = SKColor.Parse("#CCCCCC"),
                    ValueLabelColor = SKColor.Parse("#7d3ac1"),
                    Color = SKColor.Parse("#7d3ac1")
                },
                new ChartEntry(steps)
                {
                    Label = "Kroki",
                    TextColor = SKColor.Parse("#CCCCCC"),
                    ValueLabelColor = SKColor.Parse("#1de4bd"),
                    Color = SKColor.Parse("#1de4bd")
                }
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

        async void OnAccClicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new Konto());
        }
    }
}