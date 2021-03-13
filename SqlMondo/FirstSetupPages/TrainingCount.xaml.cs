using System;
using static SqlMondo.FirstSetupPage;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SqlMondo.FirstSetupPages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TrainingCount : ContentPage
    {
        int trainingCount;
        public TrainingCount()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            trainingCount = Convert.ToInt32(settings.IloscTreningowCel);
            trainingCountEditor.Text = trainingCount.ToString();
        }
        async void Next(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new Finish());
        }
        async void Previous(object sender, EventArgs e)
        {
            await Navigation.PopAsync();
        }
        void Add(object sender, EventArgs e)
        {
            if (trainingCount < 10)
            {
                trainingCount++;
                trainingCountEditor.Text = trainingCount.ToString();
                settings.IloscTreningowCel = trainingCount.ToString();
            }
        }
        void Remove(object sender, EventArgs e)
        {
            if (trainingCount > 0)
            {
                trainingCount--;
                trainingCountEditor.Text = trainingCount.ToString();
                settings.IloscTreningowCel = trainingCount.ToString();
            }
        }
    }
}