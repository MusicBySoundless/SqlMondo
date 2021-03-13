using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using static SqlMondo.Views.Profil;

namespace SqlMondo
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class FirstSetupPage : ContentPage
    {
        public static ProfileSettings settings = new ProfileSettings();
        public FirstSetupPage()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            settings.IloscTreningowCel = 1.ToString();
            settings.CzasTreninguCel = TimeSpan.FromHours(1);
            settings.KilometryCel = (1.0).ToString(@"0.0");
            settings.CelKroki = 1000.ToString();
        }

        async void StartSetup(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new FirstSetupPages.Steps());
        }
    }
}