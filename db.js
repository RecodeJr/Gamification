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
    user: 'recodejr',
    password: '123456789',
    connectionLimit: 1,
    database: 'gamification'
});



// chave privada utilizada para criptografia do usuário.
// Criar outras entidades para o acesso ao banco.
module.exports = {
    Usuario: connection.extend({
        tableName: "usuario"
    }),
    Ranking: connection.extend({
        tableName: "usuario,classe,tarefa,registro"
    }),
    Classe: connection.extend({
        tableName: "classe"
    }),
    Tarefa: connection.extend({
        tableName: "tarefa"
    }),
    Sexo: connection.extend({
        tableName: "sexo"
    }),
    secret: 'lolololololol' //Colocar chave gerada
};
