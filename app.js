const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const controller = require('./controller/cntrl');
const bodyParser = require('body-parser');
const { connectDB, closeDB } = require("./database/db.js");


connectDB();




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());



app.use(express.static(__dirname + '/script'));
app.use(express.static(__dirname + '/public'));
app.use(express.static( __dirname + '/views/img'));
app.use(express.static(__dirname + '/partials' ));


app.get('/surah', controller.surah);
app.get('/Doakeseharian', controller.doaKeseharian);
app.get('/surah/:id', controller.Persurah);
app.get('/tafsir', controller.tafsir);
app.get('/tafsir/:id', controller.Pertafsir);
app.post('/surah', controller.postSurah);
app.post('/tafsir', controller.postTafsir);

process.on('SIGINT', async () => {
    await closeDB();
    process.exit();
});

app.use('/', (req,res) => {
    res.status(404);
    res.send('<h1>404<h1>')
})


app.listen(port, () => {
    console.log('hello')
})