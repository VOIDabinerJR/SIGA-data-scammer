const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: 'sistema.cziy4480u3ys.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Junior.@12', // Substitua pela sua senha do MySQL
    database: 'nome_do_banco' // Substitua pelo nome do seu banco de dados
});

// Conectando ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados como id ' + connection.threadId);
});

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Rota para processar o formulário
app.post('/submit', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Inserindo os dados no banco de dados
    const query = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados no banco de dados: ' + err.stack);
            res.status(500).send('Erro ao processar seu pedido');
            return;
        }
        console.log('Dados inseridos com sucesso: ', results);
        res.send('Dados enviados com sucesso');
    });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
