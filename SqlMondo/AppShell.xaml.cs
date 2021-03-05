using SqlMondo.Views;
using Xamarin.Forms;
[assembly: ExportFont("Font Awesome 5 Brands-Regular-400.otf")]
[assembly: ExportFont("Font Awesome 5 Free-Regular-400.otf")]
[assembly: ExportFont("Font Awesome 5 Free-Solid-900.otf")]

namespace SqlMondo
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();
            Routing.RegisterRoute(nameof(DodajAktywnosc), typeof(DodajAktywnosc));
            Routing.RegisterRoute(nameof(PodgladAktywnosci), typeof(PodgladAktywnosci));
        }
    }
}