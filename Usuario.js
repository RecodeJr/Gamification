var express = require('express');
var dbfun = require('./db.js');
var jwt = require('jsonwebtoken');

var RoutUsuario = express.Router();

var sha1 = require('sha1');


RoutUsuario.post('/auth', function(req, res) {
    var usuariof = new dbfun.Usuario();
    var r = /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/;
    //Com a expressao regular r, podemos garantir que a string extraida será um email válido.
    var email = req.body.email.match(r);
    var senha = sha1(req.body.senha);
    if (email != null) {
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
        })
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
                console.log("token Ok")
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
      })
    }
});


RoutUsuario.get('/ranking', function(req,res){
  var ranking = new dbfun.Ranking();

});


RoutUsuario.post('/criarTarefa', function(req,res){
  var ntarefa = req.body;
  var data = new Date();

  var dataCriacao = ("0" + data.getDate()).substr(-2) + "/" +
      ("0" + (data.getMonth() + 1)).substr(-2) + "/" + data.getFullYear();
  ntarefa.idUserCriador = req.token.id;
  ntarefa.dataCriacao = dataCriacao;
  if(ntarefa != undefined){
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


RoutUsuario.get('/tarefas', function(req,res){
  var tarefa = new dbfun.Tarefa();
  var status = 1
  var qr = "SELECT t.idTarefa, t.titulo, t.dataCriacao, t.dataLimite FROM tarefa as t where idStatusT = "+ status +" order by (t.idTarefa)"
  tarefa.query(qr ,function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);
  });
});


module.exports = RoutUsuario;
