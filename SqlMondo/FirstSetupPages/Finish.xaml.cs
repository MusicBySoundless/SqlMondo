using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using static SqlMondo.FirstSetupPage;
namespace SqlMondo.FirstSetupPages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Finish : ContentPage
    {
        public Finish()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
        }
        void End(object sender, EventArgs e)
        {
            settings.CompletedSetup = true;
            UtilityMethods.SaveFile(settings, App.FolderPath, "settings.json");
            App.Current.MainPage = new AppShell();
        }
        async void Previous(object sender, EventArgs e)
        {
            await Navigation.PopAsync();
        }
    }
}