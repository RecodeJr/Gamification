var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))


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

//Criptografia da senha
var sha1 = require('sha1');


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




var Usuario = require('./Usuario');
app.use('/usuario', Usuario)



//Essa funçao retorna os sexos cadastrados no banco de dados
app.get('/sexo', function(req, res) {
    var sexo = new dbfun.Sexo();
    sexo.find('all', {
        fields: "idSexo,nomeSexo",
    }, function(err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });
});



//Funçao para o cadastro dos usuários
app.post('/cadastro', function(req, res) {
    var data = new Date();
    //Gera a data atual para salvar no banco Formato: DD/MM/YYYY
    var dataIngresso = ("0" + data.getDate()).substr(-2) + "/" +
        ("0" + (data.getMonth() + 1)).substr(-2) + "/" + data.getFullYear();
    var user = {
        nome: req.body.nome,
        email: req.body.email,
        senha: (req.body.senha != undefined) || (req.body.senha != null) ? sha1(req.body.senha) : undefined,
        sexo: req.body.sexo,
        dataIngresso: dataIngresso,
        matricula: req.body.matricula,
        userIDHabi: req.body.userIDHabi,
        tokenHabi: req.body.tokenHabi,
        userGit: req.body.userGit == undefined ? '' : req.body.userGit,
        userFacebook: req.body.userFacebook == undefined ? 0 : req.body.userFacebook
    }
    var listUser = [user.nome, user.email, user.senha, user.sexo, user.dataIngresso, user.matricula, user.userIDHabi, user.tokenHabi, user.userGit, user.userFacebook]
    //Essa função pega os campos do usuário e faz uma validação de tipos. Ela utiliza o Map/Reduce de FP.
    //Com a função map eu faço um verificador lógico e ela me retorna um novo vetor de tipos booleanos
    //Depois aplicamos a funcao reduce que aplica o OU em cada termo da lista. Ao fim teremos um True ou False.
    var verify = listUser.map((a) => a == undefined).reduce((a, b) => a || b)
    if (!verify) {
        usuario = new dbfun.Usuario(user)
        usuario.save(function(err) {
                if(err){
                  console.log(err);
                  res.json({
                    status: false
                  });
                }else{
                  console.log('Novo usuario cadastrado');
                  res.json({
                      status: true
                  });
                }
        });
      }else{
        res.json({
          status: false
        });
      }
});



//Código para rodar a aplicação
app.listen(app.get('port'), function() {
  console.log("Aplicação rodando na porta: " + app.get('port'))
})
