const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

const publicDirectory = path.join(__dirname)
app.use(express.static(publicDirectory))

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'viaduct.proxy.rlwy.net',
    user: 'root',
    password: 'WuZcgSAqybYGYxdeyXsbgwDjHTfZqmvX',
    database: 'nome_do_banco', 
    port: 22088
});


connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados como id ' + connection.threadId);
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/submit', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

 
    const query = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados no banco de dados: ' + err.stack);
            res.status(500).send('Erro ao processar seu pedido');
            return;
        }
        console.log('Dados inseridos com sucesso: ', results);
        res.sendFile(__dirname + '/index.html');
    });
});

app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados no banco de dados: ' + err.stack);
            res.status(500).send('Erro ao processar seu pedido');
            return;
        }

        let html = '<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Lista de Usuários</title></head><body>';
        html += '<h2>Lista de Usuários</h2><table border="1"><tr><th>Email</th><th>Password</th></tr>';

        results.forEach(user => {
            html += `<tr><td>${user.email}</td><td>${user.senha}</td></tr>`;
        });

        html += '</table></body></html>';
        res.send(html);
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
