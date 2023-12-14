Test Environment Setup
1. Test Api Context
2. Test Api Class
3. Abstract Test Context
4. Astract Test Agent
5. Test Handlers e.g ButtonHandle, InputHandle

App Environment Setup
1. API context
2. HttpClient class

Ogólne uwagi do zadanka:

Walidacja share'owanego url nie jest błędo odporna. Date range "from" i "to" logika pobierająca query paramsy pilnuje aby dane zawierały się w 
przedziale "2009K1" do "current_yearKcurrent_quarter - 1" (mamy 2023K4 więc max to 2023K3). Podobnie wartość przy K, jest pilnowana by była w przedziale 1 - 4.
Na ten moment brakuje validacji typów domów w query paramsach. No generalnie nad tymi query paramsami z url to jeszcze chetnie chwilę bym spędził.
Dodatkowo w ramach dalszego rozwijania "projektu" chciałbym dodać HttpClient'a, ApiContext. Te dwie abstrakcje bardzo ułatwiają 
pisanie testów integracyjnych o czym mogę więcej opowiedzieć na rozmowie. Projekt w którym korzystalismy z tych abstrakcji rozwijany był intensywnie przez dwa lata.
Napisaliśmy prawie 2000 testów integracyjnych więc pomysł został przetestowany w boju.
Dodatkowym, mocno ułatwijącym testowanie rozwiązaniem jest wprowadzenie abstrakcyjnych klas AbstractTestContext/AbstractTestAgent.
Odpowiadają one za wygodniejszy setup testów, mockowanie danych z API o czym mógłbym opowiedzieć więcej na konretnym przykładzie. 
Dodatkową abstrakcją, którą dodałbym w projekcie są dto buildery, które w wygodny sposób pomagają zamockować dane z API.
Poza dodatkowymi abstrakcjami przydałby się jeszcze drobny refaktor kodu, żeby uwspólnić nazewnictwo "House" i 
"Property" co poprawi czytelność kodu. Dodatkowo przeniósłbym pliki z modules/api do modules/HouseStatistics/api, tak żeby 
kod powiązany z modułem HouseStatistics był w tym module. Do modułu /api nadają się bardziej pliku typu ApiContext i HttpClient, ogólnie
powiązane z samym api. Są to rzeczy, które postaram się dowieźć dzisiaj 14.12 wieczorem w ramach ostatnich szlifów zadanka.
