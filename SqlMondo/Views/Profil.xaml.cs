using Newtonsoft.Json;
using System;
using System.IO;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace SqlMondo.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Profil : ContentPage
    {
        public Profil()
        {
            InitializeComponent();
            BindingContext = new ProfileSettings();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            try
            {
                var profilePath = Path.Combine(App.FolderPath, "profile.json");
                if (!File.Exists(profilePath)||File.ReadAllText(profilePath) == "")
                {
                    ProfileSettings settings = new ProfileSettings();
                    settings = (ProfileSettings)BindingContext;
                    JsonSerializer serializer = new JsonSerializer();
                    serializer.NullValueHandling = NullValueHandling.Ignore;
                    using (StreamWriter sw = new StreamWriter(@profilePath))
                    using (JsonWriter writer = new JsonTextWriter(sw))
                    {
                        serializer.Serialize(writer, settings);
                    }
                    BindingContext = settings;
                }
                else
                {
                    ProfileSettings settings = JsonConvert.DeserializeObject<ProfileSettings>(File.ReadAllText(@profilePath));
                    BindingContext = settings;
                }
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
            public string CzasTreninguCel { get; set; }
            public string Plec { get; set; }
            public int PlecId { get; set; }
            public DateTime DataUr { get; set; }
            public string Waga { get; set; }
            public string Wzrost { get; set; }
            public bool DarkMode { get; set; }
            public bool UseSystemTheme { get; set; }

        }

        private void Element_Unfocused(object sender, FocusEventArgs e)
        {
            try
            {
                var profilePath = Path.Combine(App.FolderPath, "profile.json");
                ProfileSettings saveSettings = new ProfileSettings();
                saveSettings = (ProfileSettings)BindingContext;
                JsonSerializer serializer = new JsonSerializer();
                serializer.NullValueHandling = NullValueHandling.Ignore;
                using (StreamWriter sw = new StreamWriter(@profilePath))
                using (JsonWriter writer = new JsonTextWriter(sw))
                {
                    serializer.Serialize(writer, saveSettings);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        public void OnDarkModeToggled(object sender, EventArgs e)
        {
            try
            {
                var profilePath = Path.Combine(App.FolderPath, "profile.json");           
                ProfileSettings settings = JsonConvert.DeserializeObject<ProfileSettings>(File.ReadAllText(@profilePath));
                settings = (ProfileSettings)BindingContext;
                Console.WriteLine("BS: settings.DarkMode: " + settings.DarkMode);
                Console.WriteLine("BS: OSAppTheme: " + Application.Current.UserAppTheme);
                JsonSerializer serializer = new JsonSerializer();
                serializer.NullValueHandling = NullValueHandling.Ignore;
                using (StreamWriter sw = new StreamWriter(@profilePath))
                using (JsonWriter writer = new JsonTextWriter(sw))
                {
                    serializer.Serialize(writer, settings);
                }
                if (settings.DarkMode)
                {
                    Console.WriteLine("Tryb nocny wł.");

                    Application.Current.UserAppTheme = OSAppTheme.Dark;
                }
                else
                {
                    Console.WriteLine("Tryb nocny wył.");
                    Application.Current.UserAppTheme = OSAppTheme.Light;

                }
                Console.WriteLine("AS: settings.DarkMode: " + settings.DarkMode);
                Console.WriteLine("AS: OSAppTheme: " + Application.Current.UserAppTheme);
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
                var profilePath = Path.Combine(App.FolderPath, "profile.json");
                ProfileSettings settings = JsonConvert.DeserializeObject<ProfileSettings>(File.ReadAllText(@profilePath));
                settings = (ProfileSettings)BindingContext;
                JsonSerializer serializer = new JsonSerializer();
                serializer.NullValueHandling = NullValueHandling.Ignore;
                using (StreamWriter sw = new StreamWriter(@profilePath))
                using (JsonWriter writer = new JsonTextWriter(sw))
                {
                    serializer.Serialize(writer, settings);
                }
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