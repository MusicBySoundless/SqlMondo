using System;
using static SqlMondo.FirstSetupPage;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SqlMondo.FirstSetupPages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TrainingTime : ContentPage
    {
        TimeSpan trainingTime;
        public TrainingTime()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            trainingTime = settings.CzasTreninguCel;
            trainingTimeEditor.Text = trainingTime.ToString(@"hh\:mm");
        }
        async void Next(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new TrainingCount());
        }
        async void Previous(object sender, EventArgs e)
        {
            await Navigation.PopAsync();
        }
        void Add(object sender, EventArgs e)
        {
            if (trainingTime < TimeSpan.FromHours(12))
            {
                trainingTime += TimeSpan.FromMinutes(30);
                trainingTimeEditor.Text = trainingTime.ToString(@"hh\:mm");
                settings.CzasTreninguCel = trainingTime;
            }
        }
        void Remove(object sender, EventArgs e)
        {
            if (trainingTime > TimeSpan.Zero)
            {
                trainingTime -= TimeSpan.FromMinutes(30);
                trainingTimeEditor.Text = trainingTime.ToString(@"hh\:mm");
                settings.CzasTreninguCel = trainingTime;
            }
        }
    }
}