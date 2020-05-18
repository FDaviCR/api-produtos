const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const connection = require("./database/database");

app.listen(3000, () => {
    console.log("O servidor está rodando!")
});

app.get('/produtos', (req, res) => {
    connection.query('select * from produtos', (err, data) => {
        res.json(data);
    })
});
