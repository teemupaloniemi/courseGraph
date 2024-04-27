
# Yliopiston Kurssien Visualisointisovellus

![CourseGraph App](./courseGraph.png)

Tämä sovellus visualisoi yliopiston kursseja ja niiden välisiä esitietoja.

## Online-versio

Voit käyttää sovelluksen online-versiota seuraavassa linkissä:
[Yliopiston kurssien verkostokaavio](http://users.jyu.fi/~tealjapa/ops)

### Käyttö 

Jos haluat ajaa sovellusta paikallisesti omalla koneellasi, seuraa alla olevia ohjeita:

- Asenna Python
- Asenna Flask

### Palvelimen käynnistäminen

0. Kloonaa repo tai lataa lähdekoodi omalle koneellesi komennolla: `git clone https://github.com/teemupaloniemi/courseGraph.git`
1. Siirry kansioon komennolla `cd courseGraph` 
1.1 Kopioi kurssisisällöt osoitteesta `http://users.jyu.fi/~tealjapa/ops/reqs.json` ja `http://users.jyu.fi/~tealjapa/ops/courses.json`
    - Tallenna nämä samaan kansioon kuin `server.py`-koodi (haetaan seuraavassa vaiheessa)
    - Jos laittestoosi on asennettu `wget`-ohjelma, niin lataaminen onnistuu ajamalla komennot: `wget http://users.jyu.fi/~tealjapa/ops/reqs.json` ja `wget http://users.jyu.fi/~tealjapa/ops/courses.json`
2. Käynnistä palvelin komennolla:
```bash
python server.py
`````
3. Ohjelma on käynnissä osoitteessa http://127.0.0.1:5000
