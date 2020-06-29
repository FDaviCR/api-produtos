const express = require('express');
const app = express();
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const JWTSecret = "YouShallNotPass";

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function auth(req, res, next){
    const authToken = req.headers['authorization'];

    if(authToken != undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1];
        //console.log(token);

        jwt.verify(token, JWTSecret,(err, data) => {
            if(err){
                res.status(401);
                res.json({err:"Token inválido!"});
            }else{
                req.token = token;
                req.loggedUser = {id: data.id, login: data.login};
                next();
            }
        });
    }else{
        res.status(401);
        res.json({err:"Token inválido!"});
    }
}

const connection = require("./database/database");

app.listen(3000, () => {
    console.log("O servidor está rodando!")
});

app.get('/produtos', auth, (req, res) => { 
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

app.post('/users', (req, res) => {
    let login = req.body;
    
    connection.query('select * from users where login = ?',[login.login], (err, data) => {
        let logs = data[0];

        if(logs != undefined){
            if(data[0].password == login.password){

                jwt.sign({id: data[0].id, login: data[0].login},JWTSecret,{expiresIn:'4h'},(err, token) =>{
                    if(err){
                        res.status(400);
                        res.json({err:"Falha interna!"});
                    }else{
                        res.status(200);
                        res.json({token:token});
                    }
                })
            }else{
                res.status(401);
                res.json({err: "Credenciais inválidas!"});
            }
        }else{
            res.status(404);
            res.json({token: "Login inexistente!"});
        }
    })
});
