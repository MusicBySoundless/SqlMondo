using Newtonsoft.Json;
using System;
using System.IO;
using static SqlMondo.UtilityMethods;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using System.Collections.Generic;

namespace SqlMondo.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Profil : ContentPage
    {
        public Profil()
        {
            InitializeComponent();
            var kroki = new List<string>();
            int x = 0;
            while (x <= 30000)
            {
                kroki.Add(x.ToString());
                x += 500;
            }
            CelKroki.ItemsSource = kroki;
            ProfileSettings settings = UtilityMethods.ReadSettings();
            for (int i = 0; i < kroki.Count; i++)
            {
                if (kroki[i] == settings.CelKroki)
                {
                    CelKroki.SelectedIndex = i;
                    settings.CelKrokiId = i;
                    UtilityMethods.SaveFile(settings, App.FolderPath, "settings.json");
                    break;
                }
            }
            CheckPerm();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            try
            {
                ProfileSettings settings = UtilityMethods.ReadSettings();
                BindingContext = settings;
                CzasTreningu.Text = settings.CzasTreninguCel.TotalHours.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

        }

        public class ProfileSettings
        {
            public string CelKroki { get; set; }
            public int CelKrokiId { get; set; }
            public string KilometryCel { get; set; }
            public string IloscTreningowCel { get; set; }
            public TimeSpan CzasTreninguCel { get; set; }
            public bool DarkMode { get; set; }
            public bool UseSystemTheme { get; set; }
            public bool CompletedSetup { get; set; }
        }

        private void Element_Unfocused(object sender, FocusEventArgs e)
        {
            ProfileSettings saveSettings = (ProfileSettings)BindingContext;
            saveSettings.CzasTreninguCel = TimeSpan.FromHours(Convert.ToDouble(CzasTreningu.Text));
            Console.WriteLine(saveSettings.ToString());
            UtilityMethods.SaveFile(saveSettings, App.FolderPath, "settings.json");
        }

        public void OnDarkModeToggled(object sender, EventArgs e)
        {
            try
            {
                ProfileSettings settings = (ProfileSettings)BindingContext;
                UtilityMethods.SaveFile(settings, App.FolderPath, "settings.json");
                if (settings.DarkMode)
                {
                    Application.Current.UserAppTheme = OSAppTheme.Dark;
                }
                else
                {
                    Application.Current.UserAppTheme = OSAppTheme.Light;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
        void ChangeTheme(object sender, EventArgs e)
        {
            try
            {
                ProfileSettings settings = (ProfileSettings)BindingContext;
                UtilityMethods.SaveFile(settings, App.FolderPath, "settings.json");
                if (settings.UseSystemTheme)
                {
                    Application.Current.UserAppTheme = OSAppTheme.Unspecified;
                }
                else
                {
                    if (settings.DarkMode)
                    {
                        Application.Current.UserAppTheme = OSAppTheme.Dark;
                    }
                    else
                    {
                        Application.Current.UserAppTheme = OSAppTheme.Light;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}