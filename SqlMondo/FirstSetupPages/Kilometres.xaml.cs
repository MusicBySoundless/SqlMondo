using System;
using static SqlMondo.FirstSetupPage;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SqlMondo.FirstSetupPages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Kilometres : ContentPage
    {
        double kilometres;
        public Kilometres()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            kilometres = Convert.ToDouble(settings.KilometryCel);
            kilometresEditor.Text = kilometres.ToString();
        }
        async void Next(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new TrainingTime());
        }
        async void Previous(object sender, EventArgs e)
        {
            await Navigation.PopAsync();
        }
        void Add(object sender, EventArgs e)
        {
            if (kilometres < 30)
            {
                kilometres += 0.5;
                kilometresEditor.Text = kilometres.ToString();
                settings.KilometryCel = kilometres.ToString();
            }
        }
        void Remove(object sender, EventArgs e)
        {
            if (kilometres > 0)
            {
                kilometres -= 0.5;
                kilometresEditor.Text = kilometres.ToString();
                settings.KilometryCel = kilometres.ToString();
            }
        }
    }
}