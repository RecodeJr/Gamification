
//Biblioteca para facilitar uso do Mysql
var mysqlModel = require('mysql-model');
//  Add no module.exports cada objeto com as tabelas q eles manipulam
//  Obj: connection.extend({
//            tableName: "tab1,tab2"
//        }) //QuestaoResolvida
//
//


// Conexão com o banco de dados
var connection = mysqlModel.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    connectionLimit: 1,
    database: ''
});



// chave privada utilizada para criptografia do usuário.
// Criar outras entidades para o acesso ao banco.
module.exports = {
    secret: ''  //Colocar chave gerada 
};
