
# Yliopiston Kurssien Visualisointisovellus

![CourseGraph App](./courseGraph.png)

Tämä sovellus visualisoi yliopiston kursseja ja niiden välisiä esitietoja.

## Online-versio

Voit käyttää sovelluksen online-versiota vierailemalla seuraavassa linkissä:
[Yliopiston kurssien verkostokaavio](http://users.jyu.fi/~tealjapa/ops)

### Käyttö 

Jos haluat ajaa sovellusta paikallisesti omalla koneellasi, seuraa alla olevia ohjeita:

- Python asennettuna omalle koneellesi.
- Asenna Flask.
- Kopioi kurssisisällöt osoitteesta `http://users.jyu.fi/~tealjapa/ops/reqs.json` ja `http://users.jyu.fi/~tealjapa/ops/courses.json`.
- Tallenna nämä samassa kansioon kuin `server.py`-koodi.

### Palvelimen käynnistäminen

1. Kloonaa repo tai lataa lähdekoodi omalle koneellesi. `git clone {repo url}`
2. Suorita seuraava komento pääteikkunassa palvelimen käynnistämiseksi:

```bash
python server.py
`````