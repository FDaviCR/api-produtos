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

app.post('/produtos', (req, res) => {
    let produto = req.body;
    connection.query('insert into produtos (produto,valor,unidade,ativo)values(?,?,?,?)',[produto.produto,produto.valor,produto.unidade,produto.ativo], (err, data) =>{
        if(!err){
            const response = {
                status: 200,
                mensagem: 'Produto inserido com sucesso!'}
            res.send(response);
        }else{
            res.send(err);
        }
    })
});

app.delete('/produtos/:id', (req, res) => { 
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        connection.query('delete from produtos where id = ?',[req.params.id], (err, data) => {
            if(!err){
                const response = {
                    status: 200,
                    mensagem: 'Produto deletado com sucesso!'}
                res.send(response);
            }else{
                res.send(err);
            }
        })
    }  
});

app.put('/produtos/:id', (req, res) => { 
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        let produto = req.body;
        connection.query('update produtos set produto=?,valor=?,unidade=?,ativo=? where id=?',[produto.produto,produto.valor,produto.unidade,produto.ativo,req.params.id], (err, data) =>{
            if(!err){
                const response = {
                    status: 200,
                    mensagem: 'Produto atualizado com sucesso!'}
                res.send(response);
            }else{
                res.send(err);
            }
        })
    }  
});
