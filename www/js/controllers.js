angular.module('my.controllers', [])


.config(function($httpProvider) {
   $httpProvider.interceptors.push(function(){
        return {
        'request': function(config) {
                    config.headers = config.headers || {};
                    if (localStorage.getItem('ngStorage-token') != null) {
                        config.headers['x-access-token'] = localStorage.getItem('ngStorage-token').split("\"")[1];
                    }
                    return config;
                }
             }

   })
})



    // Controller responsavel pela página Home
    .controller('homeCtrl', ['$rootScope', function($rootScope) {
        if (window.localStorage.getItem('ngStorage-token') == null) window.location = "#/login";


        $rootScope.teste = ":)";
        $rootScope.nome = "Recode Jr.";
    }])

    // Controller responsavel pela página de AddTarefa
    .controller('addTarefaCtrl', ['$rootScope','$scope','API', function($rootScope,$scope,API) {
      if (window.localStorage.getItem('ngStorage-token') == null) window.location = "#/login";
      API.getClasse(function(res) {
          if (res != undefined)
              //Manda para view as classes disponiveis.
              $scope.listaClasse = res
      }, function(err) {
          console.log(err)
      })
      console.log($scope)
    }])

    // Controller responsavel pela página de Cadastro
    .controller('cadastroCtrl', ['$rootScope', '$scope', 'API', function($rootScope, $scope, API) {
        API.getSexo(function(res) {
            if (res != undefined)
                $scope.listaSexo = res //Manda para view os sexos disponiveis.
        }, function(err) {
            console.log(err)
        })
        $scope.cadastrar = function() {
            var usuario = $scope.user //Recebe os dados da view
            usuario.sexo = usuario.sexo.idSexo
            console.log(usuario)
            API.cadastroUsuario(usuario, function(res) {
                if (res.status) {
                    console.log("Usuário registrado.")
                    location.replace('#/login');
                }else{
                  console.log("Algum erro no cadastro.")
                }
            }, function(err) {
                console.log(err)
            })
        }

    }])

    // Controller responsavel pela página de Login
    .controller('loginCtrl', ['$rootScope', '$scope','API','$location', function($rootScope, $scope, API, $location) {
        window.localStorage.removeItem('ngStorage-token')
        window.localStorage.removeItem('idUser')
        $scope.logar = function() {
            var usuario = $scope.user //Recebe os dados da view
            API.loginUsuario(usuario,function(res){
              if(res.status){
                console.log("Logado");
                //Salva no navegador token para o usuário
                window.localStorage.setItem('ngStorage-token', "\"" + res.token + "\"");
                //Salva no navegador a id do usuário
                window.localStorage.setItem('idUser', res.id.toString());
                location.reload(); //Att a pag
                location.replace('#/'); //Redireciona para a pag inicial
              }else{
                var msg = "Login/Senha incorretos"
                $scope.msg = msg;
                console.log(msg);
                // alert(msg)
              }
            }, function(err){
              console.log(err)
            })
        }

    }])

    // Controller responsavel pela página de Ranking
    .controller('rankingCtrl', ['$rootScope', function($rootScope) {
      if (window.localStorage.getItem('ngStorage-token') == null) window.location = "#/login";
        $rootScope.listaUsuarios = [{
                nome: "Joshua",
                pontuacao: 256
            },
            {
                nome: "Gabriel",
                pontuacao: 128
            },
            {
                nome: "Fabio",
                pontuacao: 120
            },
            {
                nome: "João",
                pontuacao: 90
            },
            {
                nome: "Marcelo",
                pontuacao: 50
            },


        ]


    }])

    // Controller responsavel pela página de adm
    .controller('tarefasCtrl', ['$rootScope','$routeParams','$scope', function($rootScope,$routeParams,$scope) {
      if (window.localStorage.getItem('ngStorage-token') == null) window.location = "#/login";
      $scope.tipoTarefa = $routeParams.tipoTarefa
      console.log( $routeParams.tipoTarefa)
    }])
