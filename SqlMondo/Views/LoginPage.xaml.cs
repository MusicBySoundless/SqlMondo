using SqlMondo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static SqlMondo.UtilityMethods;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SqlMondo.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class LoginPage : ContentPage
    {
        public LoginPage()
        {
            InitializeComponent();
            BindingContext = new User();
        }
        private async void LoginButton(object sender, EventArgs e)
        {
            User user = (User)BindingContext;
            var login = await App.RestService.Login(user);
            if (login.JsonToken != "null" && login.Msg == "1")
            {
                UtilityMethods.SaveFile(login, App.InternalStorage, "LoginToken.json");
                Console.WriteLine(login.ToString());
                var settings = ReadSettings();
                if (!settings.CompletedSetup)
                {
                    App.Current.MainPage = new NavigationPage(new SqlMondo.FirstSetupPage());
                }
                else
                {
                    App.Current.MainPage = new AppShell();
                }
            }
            else if (login.JsonToken == null)
            {
                resultLabel.Text = login.Msg switch
                {
                    "2" => "Błędny login lub hasło.",
                    "3" => "Błąd wprowadzonych danych.",
                    "200" => "Zwrócono wynik (aktywności).",
                    "201" => "Zapisano poprawnie.",
                    "202" => "Usunięto poprawnie.",
                    "400" => "Brak niektórych danych.",
                    "401" => "Brak tokena uwierzytelniającego.",
                    "403" => "Błędny token uwierzytelniający",
                    "500" => "Błąd serwera.",
                    _ => "Unhandled exception type.",
                };
            }
            loginEditor.Text = "";
            passwordEditor.Text = "";
        }
        void PasswordToggle(object sender, EventArgs e)
        {
            if (passwordEditor.IsPassword) { passwordEditor.IsPassword = false; }
            else { passwordEditor.IsPassword = true; }
        }
    }
}