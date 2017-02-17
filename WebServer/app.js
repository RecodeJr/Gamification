//Servidor web


//Express é a framework utilizado para o Back-End.
var express = require('express');
var app = express();

//Usado para manipulação do Body. 
var bodyParser = require('body-parser')

//Usado para manipulação do Json.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));


//Ferramenta para proteger aplicação.
var helmet = require('helmet'); 
app.use(helmet());



//Conexao com o banco será feita no arquivo db.js
var dbfun = require('./db.js');


//Permite Acesso externo na aplicação 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,x-access-token, Content-Type, Accept");
    next();
});


//Pasta utilizada para o frontEnd vai ser a pasta WWW 
app.use('/', express.static(__dirname + '/www'));


//Exemplo de módulo para cada componente da aplicação 
//var Mod1 = require('./Mod1');
//app.use('/mod1', Mod1)







// Quando quiser rodar a aplicação sem especificar a porta use esse comando 
// app.listen(process.env.PORT_APP, function() {
//     console.log('Rodando porta' + process.env.PORT_APP);
// });

app.listen(3000, function() {
   console.log('Rodando porta 3000');
});



