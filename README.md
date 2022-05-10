# rdf_app

## Konfigurácia serverovej časti
Pre nastavenie serverovaj časti je potrebné vykonať nasledujúce kroky:
1. Nainštalovať službu Apache Tomcat z ich oficiálnej stránky https://tomcat.apache.org/
2. Stiahnuť RDF4J z ich oficiálnej stránky https://rdf4j.org/
3. V stiahnutej zložke sa bude nachádzat rdf4j-server.war, ktorý treba nasadiť na službu Tomcat
4. V zložke kde bol nainštalovaný Tomcat je zložka webapps, kde by mala byť po nasadení súboru v 3. bode zložka rdf4j-server. V tejto zložke je zložka WEB-INF, ktorá obsahuje súbor web.xml. V tomto súbore treba odkomentovať časti pre povolenie cors-origin žiadosti.

### Spustenie klientskej časti
1. Rozbaliť zlozku xtomov02.zip
2. Rozbalenú zložku otvoriť v ľubovolnom IDE
3. V termináli napísať príkazy:
	1. npm install - pre nainštalovanie všetkých potrebných balíčkov
	2. npm run serve - pre spustenie aplikácie


