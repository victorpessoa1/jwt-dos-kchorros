const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SECRET = 'segredosecreto';
const blacklist = [];

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: "Por aqui ta tudo certo"});
});

function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  const index = blacklist.findIndex(item => item === token);
  if(index !== -1) return res.status(401).end();

  jwt.verify(token, SECRET, (err, decoded) => {
    if(err) return res.status(401).end();

    req.userId = decoded.userId;
    next();
  })
}

app.get('/clientes', verifyJWT, (req, res) => {
  console.log(req.userId + ' Fez essa chamada (so mostrando quem chegou aqui nessa informação secreta)');
  res.json([
    {
      info: "Informação secreta sendo visualizada"
    },
    {
      id:1,
      nome: 'Cachorro Zé'
    },
    {
      id: 2,
      nome: "Cachorro darth"
    },
    {
      id: 3,
      nome: "Cachorro veio"
    }
  ]);
});

app.post('/login', (req, res) => {
  if (req.body.user === 'Seu Zé' && req.body.password === 'Zezinho123') {
    const token = jwt.sign({userId: 1}, SECRET, {expiresIn: 300});
    return res.json({auth: true, token});
  }

  res.status(401).end();
})

app.post('/logout', function(req, res) {
  blacklist.push(req.headers['x-access-token']);
  res.end();
})

const server = http.createServer(app);
server.listen(3000);
console.log("Servidor escutando na porta 3000..."); 