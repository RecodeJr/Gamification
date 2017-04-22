var express = require('express');
var dbfun = require('./db.js');
var jwt = require('jsonwebtoken');

var RoutUsuario = express.Router();

var sha1 = require('sha1');
var R = require('ramda');


RoutUsuario.post('/auth', function(req, res) {
    var usuariof = new dbfun.Usuario();
    var r = /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/;
    //Com a expressao regular r, podemos garantir que a string extraida será um email válido.
    var email = req.body.email.match(r);
    var senha = sha1(req.body.senha);
    if (email !== null) {
        email = email[0];
        usuariof.find('all', {
            fields: ['email', 'idUser', 'nome', 'senha'],
            where: "email=\"" + email + "\""
        }, function(err, rows, fields) {
            if (err) throw err;
            var user = null;
            if (rows[0]) {
                user = {
                    id: rows[0].idUser
                };
            }
            if (!user) {
                res.json({
                    status: false,
                    message: 'Erro. Usuário não encontrado.'
                });
            } else if (user) {
                //verifica se a senha esta correta
                if (rows[0].senha != String(senha)) {
                    res.json({
                        status: false,
                        message: 'Erro. Senha Errada.'
                    });
                } else {
                    // Se a conta for encontrada e a senha bater com a verdadeira
                    // Cria uma token
                    var token = jwt.sign(user, dbfun.secret, {
                        expiresIn: 24 * 60 * 60 * 1 // Expira em 1 hours
                    });
                    res.json({
                        status: true,
                        message: 'Token Gerada',
                        token: token,
                        nome: user.nome,
                        id: user.id
                    });
                }
            }
        });
    } else {
        res.json({
            status: false,
            message: 'Erro. Usuário não encontrado.'
        });
    }
});

RoutUsuario.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // Faz verificação da Token
        jwt.verify(token, dbfun.secret, function(err, token_decoded) {
            if (err) {
                // Se a verificação falhar
                return res.json({
                    status: false,
                    message: "Falha para autentificar a Token."
                });
            } else {
                console.log("token Ok");
                // Token é verificada, Salva as informações
                req.token = token_decoded;
                req.user = token_decoded.user;
                req.authenticated = true;
                next();
            }

        });
    }else{
      res.json({
          status: false,
          message: "Falha para autentificar a Token."
      });
    }
});

//Retorna o Rankig de usuários
RoutUsuario.get('/ranking', function(req,res){
  var ranking = new dbfun.Ranking();

});



//Método POST para criar tarefas

RoutUsuario.post('/criarTarefa', function(req,res){
  var ntarefa = req.body;
  var data = new Date();
  var dataCriacao = ("0" + data.getDate()).substr(-2) + "/" +
      ("0" + (data.getMonth() + 1)).substr(-2) + "/" + data.getFullYear();
  ntarefa.idUserCriador = req.token.id;
  ntarefa.dataCriacao = dataCriacao;
  listTarefa = [ntarefa.idUserCriador,ntarefa.dataCriacao,ntarefa.idClasse,ntarefa.datalimite,ntarefa.titulo,ntarefa.descricao,ntarefa.tarefaFixa];
  var verify = listTarefa.map((a) => a === undefined).reduce((a, b) => a || b);
  console.log(listTarefa);
  if(!verify){
      var tarefa = new dbfun.Tarefa(ntarefa);
      tarefa.save(function(err) {
              if(err){
                console.log(err);
                res.json({
                  status: false
                });
              }else{
                console.log('Nova tarefa cadastrada');
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



RoutUsuario.get('/classes', function(req,res){
  var classe = new dbfun.Classe();
  classe.find('all', {
      fields: "idClasse,nomeClasse",
  }, function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);
  });
});






RoutUsuario.post('/tarefas', function(req,res){
  var tarefa = new dbfun.Tarefa();
  console.log(req.body);
  var status = req.body.idStatusT;
  var idUser = req.body.idUser;
  var qr;
  if((idUser === null)){
     if(status === null){
        qr = "SELECT r.idRegistro, r.idTarefa, r.idStatusT,st.nomeStatus,  t.titulo, t.dataCriacao, t.dataLimite, t.descricao, t.idClasse, t.nomeClasse, t.nome as nomeCriador FROM registro as r, status_tarefa as st, (select t.idTarefa , t.titulo, t.dataCriacao, t.dataLimite, t.descricao, t.idClasse, c.nomeClasse, t.idUserCriador,  CONCAT(SUBSTRING_INDEX(u.nome,' ',1), ' ', SUBSTRING_INDEX(u.nome,' ',-1)) as nome from tarefa as t, usuario as u, classe as c where c.idClasse = t.idClasse and t.idUserCriador = u.idUser) as t where st.idStatusT = r.idStatusT and r.idTarefa = t.idTarefa;"
     }else{
        qr = "SELECT r.idRegistro, r.idTarefa, r.idStatusT,st.nomeStatus,  t.titulo, t.dataCriacao, t.dataLimite, t.descricao, t.idClasse, t.nomeClasse, t.nome as nomeCriador FROM registro as r, status_tarefa as st, (select t.idTarefa , t.titulo, t.dataCriacao, t.dataLimite, t.descricao, t.idClasse, c.nomeClasse, t.idUserCriador,  CONCAT(SUBSTRING_INDEX(u.nome,' ',1), ' ', SUBSTRING_INDEX(u.nome,' ',-1)) as nome from tarefa as t, usuario as u, classe as c where c.idClasse = t.idClasse and t.idUserCriador = u.idUser) as t where st.idStatusT = r.idStatusT and r.idTarefa = t.idTarefa and r.idStatusT= "+ status + "";
     }
  }else{
     qr = "SELECT r.idRegistro, r.idTarefa, r.idStatusT,st.nomeStatus, r.idUserResp,CONCAT(SUBSTRING_INDEX(u.nome,' ',1), ' ', SUBSTRING_INDEX(u.nome,' ',-1)) as nomeResponsavel,  t.titulo, t.dataCriacao, t.dataLimite, t.descricao, t.idClasse, t.nomeClasse, t.nome as nomeCriador FROM registro as r, status_tarefa as st, (select t.idTarefa , t.titulo, t.dataCriacao, t.dataLimite, t.descricao, t.idClasse, c.nomeClasse, t.idUserCriador,  CONCAT(SUBSTRING_INDEX(u.nome,' ',1), ' ', SUBSTRING_INDEX(u.nome,' ',-1)) as nome from tarefa as t, usuario as u, classe as c where c.idClasse = t.idClasse and t.idUserCriador = u.idUser) as t, usuario as u where st.idStatusT = r.idStatusT and r.idTarefa = t.idTarefa and u.idUser = r.idUserResp and r.idUserResp="+ idUser +""
 }

  tarefa.query(qr ,function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);
  });
});


RoutUsuario.post('/pegarTarefa',function(req,res){
   console.log(req.body);
   res.json({status: true});
});



RoutUsuario.post('/finalizarTarefa',function(req,res){
   console.log(req.body);
   res.json({status: true});
});



RoutUsuario.post('/cancelarTarefa',function(req,res){
   console.log(req.body);
   res.json({status: true});
});

module.exports = RoutUsuario;
