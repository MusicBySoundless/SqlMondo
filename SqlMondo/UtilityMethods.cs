using Newtonsoft.Json;
using System;
using System.IO;
using Xamarin.Essentials;
using static SqlMondo.Views.Profil;

namespace SqlMondo
{
    class UtilityMethods
    {
        public static void SaveFile(object obj, string path, string filename)
        {
            // Instantiate new JsonSerializer and ignore null values.
            JsonSerializer serializer = new JsonSerializer
            {
                NullValueHandling = NullValueHandling.Ignore
            };

            // Check if the directory exists, if not create one.
            DirectoryInfo di = new DirectoryInfo(@path);
            if (!di.Exists)
            {
                Directory.CreateDirectory(@path);
            }

            var filepath = Path.Combine(path, filename);

            using StreamWriter sw = new StreamWriter(@filepath);
            using JsonWriter writer = new JsonTextWriter(sw);
            serializer.Serialize(writer, obj);
            writer.Close();
            sw.Close();

        }
        public static ProfileSettings ReadSettings()
        {
            var profilePath = Path.Combine(App.FolderPath, "settings.json");
            if (File.Exists(profilePath))
            {
                ProfileSettings settings = JsonConvert.DeserializeObject<ProfileSettings>(File.ReadAllText(profilePath));
                return settings;
            }
            else
            {
                ProfileSettings settings = new ProfileSettings();
                return settings;
            }
        }

        public static T Clamp<T>(T value, T min, T max) where T : IComparable<T>
        {
            if(value.CompareTo(min) < 0)
            {
                return min;
            }
            if(value.CompareTo(max) > 0)
            {
                return max;
            }
            return value;
        }

        public static async void CheckPerm()
        {
            var status = await Permissions.CheckStatusAsync<Permissions.StorageRead>();
            if (status != PermissionStatus.Granted)
            {
                try
                {
                    status = await Permissions.RequestAsync<Permissions.StorageRead>();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
            status = await Permissions.CheckStatusAsync<Permissions.StorageWrite>();
            if (status != PermissionStatus.Granted)
            {
                try
                {
                    status = await Permissions.RequestAsync<Permissions.StorageWrite>();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
            status = await Permissions.CheckStatusAsync<Permissions.NetworkState>();
            if (status != PermissionStatus.Granted)
            {
                try
                {
                    status = await Permissions.RequestAsync<Permissions.NetworkState>();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
        }
    }
}
