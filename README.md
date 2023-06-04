
# ServHub Api- Lista serwerów gier

ServHub jest małym projektem majacym na celu zapoznanie się z technologiami wykorzystywanymi w Nest.js. Projekt powstał wyłacznie w celach edukacyjnych i nie jest zalecane korzystanie z niego publicznie.


# Uruchamianie aplikacji
``` 
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Licencja


Aplikacja nie posiada żadnej licencji. Autor zezwala na eksploatowanie aplikacji w pełnym zakresie zgodnym z prawem. Autor nie ponosi odpowiedzialności za powstałe szkody.

## Zmienne środowiskowe

Aby uruchomić aplikację muszisz dodać następujące zmienne środowiskowe do pliku .env

`JWT_SECRET` - Losowy ciąg, Klucz szyfrujący wykorzystywany przez moduł JWT 

`PAGE_SIZE` - Numer przestawiający ilość serwerów wyświetlanych na jednej stronie

`TAKE_SERVER_OWNERSHIP_PREFIX` - Ciąg, Prefiks wykorzystywany przy generowaniu i weryikowaniu właściciela serwera, przykładowo `SERVHUB-GET-OWNER-`

`DB_HOST` - Adres ip bazy danych

`DB_PORT` - Port bazy danych

`DB_USERNAME` - Nazwa użytkownika bazy danych

`DB_PASSWORD` - Hasło bazy danych

`DB_DATABASE` - Nazwa bazy danych

`SERVER_STATUS_MICROSERVICE_URL` - Adres url mikroserwisu do sprawdzania statutu serwera 

`MAIL_HOST` - Host Poczty

`MAIL_PORT` - Port Poczty

`MAIL_USER` - Nazwa użytkownika Poczty

`MAIL_PASS` - Hasło poczty

`GEOLOCATION_DB_KEY` - Klucz api z serwisu https://geolocation-db.com/
## Koleckja Endpointów

[Postman](https://www.postman.com/galactic-sunset-757990/workspace/servhub/collection/21826280-b0b8c1cf-4f24-48c4-b2e2-341521ec749f?action=share&creator=21826280)

