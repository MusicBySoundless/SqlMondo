# SqlMondo va1.0

# [English]
SqlMondo is an app that me and a few of my fellow colleagues have been developing for past few weeks as our high school IT classes graduation project. 

Please, keep in mind we are still not experienced in our fields and the code CAN and WILL have a lot of weirdly-taught implementations, doing things the wrong way etc.
We will be very grateful for any feedback on how to improve our code, hence we're making it open-source.

# [Goals / Features]
The goal was to create a cross-platform app that implemented the following features:
// "-" indicates an unimplemented feature whereas "+" indicates an implemented feature. 
+ tracking user's activity and dispaly it in an accessible way, +
- tracking user's localization after activating a training and then displaying it as a route on a map,-
+ register as a student or a teacher by invitation code (EDU Account),+
- teachers can access students' data as long as the students are a part of a class the teacher teaches,-
+ students can access their data, add activities, edit them and track their daily goals,+
- teachers can generate a .csv, .xlsx, .pdf or a .png file to display selected data:-
   - particular student's stats (daily activities, no. trainings done, time spent training),-
   - class' comparison (two or more),-
   - particular class's data (the same as with student but either as an average or total values),-
+ teachers can manage classes their classes (add / remove students from them),+
- register as a non-education related person,-
- Regular Account has the same features as the EDU Account, except for class-related features.-

# [TODO]
Connecting the mobile app to the REST API that would handle user data.
Implement features that are a requirement of the project. 
Port the app to iOS and UWP, as of today (5th March 2021) it only works on browsers and has been tested on a handful of mobile devices running Android (8, 9 and 10).
Fix bugs and implement logging so that we can easily test the app and see what's going on.

# [Polski]
SqlMondo jest aplikacją, którą wraz z kolegami stworzyliśmy jako projekt na zaliczenie specjalizacji w szkole średniej.

Proszę mieć na uwadze fakt, że nie jesteśmy doświadczeni w tej dziedzinie i nasz kod MOŻE i BĘDZIE zawierał wiele dziwacznie wymyślonych implementacji, błędów, robienia rzeczy na około itp.
Będziemy wielce wdzięczni za każdą opinię i każdą sugestię odnośnie poprawienia przejrzystości, implementacji i poprawności kodu, stąd decyzja o udostępnieniu go jako open-source.

# [Cele / Funkcjonalność]
Celem było stworzenie wieloplatformowej aplikacji, która zawiera poniższe funkcje:
// "-" oznacza niezaimplementowaną funkcję, natomiast "+" zaimplementowaną.
+ śledzenie aktywności użytkownika i wyświetlanie jej w przystępny sposób,+
- śledzenie lokalizacji użytkownika po aktywowaniu treningu, po czym wyświetlenie jej jako trasa na mapie,-
+ rejestracja jako uczeń lub nauczyciel poprzez kod zaproszenia (Konto EDU),+
- nauczyciele mają dostęp do aktywności uczniów tylko wtedy, kiedy należą oni do klasy, którą nauczyciel uczy,-
+ uczniowie mają dostęp do swoich danych, aktywności, mogą je edytować i śledzić dzienne cele,+
- nauczyciele mogą wygenerować plik .csv, .xlsx, .pdf lub .png aby wyświetlić wybrany zbiór danych:-
   - dane konkretnego ucznia (dzienne aktywności, ilość wykonanych treningów, łączny czas treningu),-
   - porównanie klas (dwóch lub więcej),-
   - wyświetlanie danych konkretnej klasy (tak samo, jak danych ucznia z tym, że można wybrać czy jest to średnia czy łączna wartość wszystkich uczniów w klasie)-
+ nauczyciele mogą zarządzać klasami (dodawanie / usuwanie uczniów z klas)+
- rejestracja jako osoba niezwiązana z edukacją,-
- Zwykłe Konto posiada taką samą funkcjonalność, co Konto EDU za wyjątkiem funkcjonalności związanej z klasami.-

# [TODO]
Podpięcie aplikacji mobilnej do REST API, które będzie zajmowało się danymi użytkownika.
Implementacja funkcji, które są wymogami projektu.
Portowanie aplikacji na iOS oraz UWP, z dniem 5.03.2021 aplikacja działa tylko na przeglądarkach internetowych oraz była przetestowana na kilku urządzeniach z Androidem
(w wersji 8, 9 i 10).
Naprawa błędów i implementacja logowania (spisywania aktywności aplikacji do pliku) celem łatwego analizowania i diagnozowania problemów.
