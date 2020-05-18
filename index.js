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
        if(!err){
            res.statusCode = 200;
            res.json(data);
        }else{
            console.log(err);
        }
    })
});

app.get('/produtos/:id', (req, res) => { 
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        connection.query('select * from produtos where id = ?',[req.params.id], (err, data) => {
            if(!err){
                res.statusCode = 200;
                res.json(data);
            }else{
                res.send(err);
            }
        })
    }  
});
