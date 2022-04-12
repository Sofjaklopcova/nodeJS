/* Konstanty připojující požadované knihovny-moduly */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require("moment");
const csvtojson = require('csvtojson');
const path = require('path');

/* Aplikace využívající framework Express */
const app = express();
/* Nastavení portu pro naslouchající server */
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));





let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post('/save', urlencodedParser, (req, res) => {
    
    let str = `${req.body.name},${req.body.surname},${req.body.age},${req.body.city},${req.body.school},${req.body.specializ},${req.body.year}\n`;
    fs.appendFile('./data/result.csv', str, function (err) {
        if (err) {
            console.error(`Nastala chyba při zápisu souboru: ${err}`);
            return res.status(400).json({
                success: false,
                message: `Nastala chyba při zápisu souboru: ${err}`
            });
        }
    });
    res.redirect(301, '/');
});

app.get('/results', (req, res) => {
    csvtojson().fromFile('./data/result.csv')
        .then(data => {
            console.log(data);
            res.render('results.pug', { 'nadpis': 'Výsledky', 'students': data });
        })
        .catch(err => {
            console.log(err);
            
        });

});

/* Ošetření požadavku poslaného metodou get na adresu http://localhost:3000/about */
app.get('/about', (req, res) => {
    res.send('Serverová aplikace Kostka');
});

/* Ošetření požadavku poslaného metodou get na adresu http://localhost:3000/version */
app.get('/version', (req, res) => {
    res.send('Verze 1.0.1');
});

/* Spouští webový server - naslouchá na daném portu */
app.listen(port, () => {
    console.log(`Server is running, port: ${port}`);
});