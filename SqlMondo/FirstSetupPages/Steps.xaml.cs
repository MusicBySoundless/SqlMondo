using System;
using static SqlMondo.FirstSetupPage;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SqlMondo.FirstSetupPages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Steps : ContentPage
    {
        int stepsCount;
        public Steps()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            stepsCount = Convert.ToInt32(settings.CelKroki);
            stepsEditor.Text = stepsCount.ToString();
        }
        async void Next(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new Kilometres());
        }
        async void Previous(object sender, EventArgs e)
        {
            await Navigation.PopAsync();
        }
        void Add500(object sender, EventArgs e)
        {
            if (stepsCount < 30000)
            {
                stepsCount += 500;
                stepsEditor.Text = stepsCount.ToString();
                settings.CelKroki = stepsCount.ToString();
            }
        }
        void Remove500(object sender, EventArgs e)
        {
            if (stepsCount > 0)
            {
                stepsCount -= 500;
                stepsEditor.Text = stepsCount.ToString();
                settings.CelKroki = stepsCount.ToString();
            }
        }
    }
}