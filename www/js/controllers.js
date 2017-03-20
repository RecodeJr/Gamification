angular.module('my.controllers', [])


    .config(function($httpProvider) {
        $httpProvider.interceptors.push(function() {
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
    .controller('addTarefaCtrl', ['$rootScope', '$scope', 'API', function($rootScope, $scope, API) {
        if (window.localStorage.getItem('ngStorage-token') == null) window.location = "#/login";
        API.getClasse(function(res) {
            if (res != undefined)
                //Manda para view as classes disponiveis.
                $scope.listaClasse = res
        }, function(err) {
            console.log(err)
        })
        $scope.addTarefa = function() {
            var tarefa = $scope.tarefa;
            tarefa.classe = $scope.cl.classe; //Pegando os dados digitados na view
            API.addTarefa(tarefa, function(res) { //Requerindo o POST do services
                if (res.status) { //Verificando se a tarefa foi cadastrada
                    console.log("Tarefa cadastrada");
                    $scope.alerta = false; //Enviando a view que não houve erro e que a tarefa foi adicionada
                    setTimeout(function() {
                        location.reload() //Recarregando a página dps de 5 segundos
                    }, 5000);
                } else {
                    console.log("Erro ao cadastrar tarefa");
                    $scope.alerta = true; //Enviando a view que houve algum erro
                    setTimeout(function() {
                        location.reload() //Recarregando a página dps de 5 segundos
                    }, 5000);
                }
            }, function(err) {
                console.log(err);
                $scope.alerta = true; //Enviando a view que houve algum erro
                setTimeout(function() {
                    location.reload() //Recarregando a página dps de 5 segundos
                }, 5000);
                //location.reload()
            })
        }
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
                } else {
                    console.log("Algum erro no cadastro.")
                }
            }, function(err) {
                console.log(err)
            })
        }

    }])

    // Controller responsavel pela página de Login
    .controller('loginCtrl', ['$rootScope', '$scope', 'API', '$location', function($rootScope, $scope, API, $location) {
        window.localStorage.removeItem('ngStorage-token')
        window.localStorage.removeItem('idUser')
        $scope.logar = function() {
            var usuario = $scope.user //Recebe os dados da view
            API.loginUsuario(usuario, function(res) {
                if (res.status) {
                    console.log("Logado");
                    //Salva no navegador token para o usuário
                    window.localStorage.setItem('ngStorage-token', "\"" + res.token + "\"");
                    //Salva no navegador a id do usuário
                    window.localStorage.setItem('idUser', res.id.toString());
                    location.reload(); //Att a pag
                    location.replace('#/'); //Redireciona para a pag inicial
                } else {
                    var msg = "Login/Senha incorretos"
                    $scope.msg = msg;
                    console.log(msg);
                    // alert(msg)
                }
            }, function(err) {
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
    .controller('tarefasCtrl', ['$rootScope', '$routeParams', '$scope', 'API', '$location', function($rootScope, $routeParams, $scope, API, $location) {
        if (window.localStorage.getItem('ngStorage-token') == null) window.location = "#/login";
        $scope.idUser=window.localStorage.getItem('idUser')
        $scope.listaTarefa = [{
                titulo: "Tarefa 1",
                id: 1,
                statusTarefa: "Finalizada",
                criador: "João",
                idCriador: 0
            },
            {
                titulo: "Tarefa 2",
                id: 2,
                statusTarefa: "Em curso",
                criador: "Júnior",
                idCriador: 1
            },
            {
                titulo: "Tarefa 3",
                id: 3,
                statusTarefa: "Disponivel",
                criador: "Mateus",
                idCriador: 2,
                idStatusT: 0
            }
        ]
        API.getClasse(function(res) { //Solicita as classes
            if (res != undefined)
                $scope.listaClasse = res //Coloca as classes na variavel listaClasse
        }, function(err) {
            console.log(err)
        });
        $scope.tipoTarefa = $routeParams.tipoTarefa
        var statusTarefa=0;
        if ($scope.tipoTarefa == 'disponiveis') { //Ao clicar em disponiveis entra neste if e assim para os demais
            console.log('Estamos em disponiveis')
        } else if ($scope.tipoTarefa == 'emCurso') {
            console.log("Estamos em curso")
        } else if ($scope.tipoTarefa == 'minhasTarefas') {
            console.log("Estamos em minhas tarefas")
        } else if ($scope.tipoTarefa == 'historico') {
            console.log("Estamos em historico")
        }
        $scope.editarTarefa = function(idTarefa){
          console.log("Estamos no editar tarefa", idTarefa)
        }
        $scope.cancelarTarefa = function(idTarefa){ //Função que muda o status da tarefa para cancelada
          for(x in $scope.listaTarefa){ //For para rodar toda a listaTarefa
            var aux=$scope.listaTarefa[x];//A variavel aux está recebendo os objetos de listaTarefa por vez
            if(aux.id==idTarefa){
              $scope.listaTarefa[cont].idStatusT=4; //Mudando o status da tarefa para CANCELADA
              API.tarefa($scope.listaTarefa[cont], function(res) { //Requerindo o GET do services
                  if (res.status) { //Verificando se a tarefa foi atualizada
                      console.log("Tarefa atualizada");
                  } else {
                      console.log("Erro ao atualizar tarefa");
                  }
              }, function(err) {
                  console.log(err);
              })
            }
          }
        }
        $scope.finalizarTarefa = function(idTarefa){

        }
        $scope.confirmacaoFinalizar=function(idTarefa){ //Fazendo a confirmação do botão Finalizar
          $scope.variavelConfirmacaoFinalizar=true; //A variavelConfirmacaoFinalizar é uma variavel auxiliar que está mostrando ou não o botão na view
          $scope.idConfirmacaoFinalizar=idTarefa;//id da tarefa que sera finalizada
          $scope.variavelConfirmacaoCancelar=false;//Desabilitando a confirmação de cancelar caso está tiver sido clicada antes
        }
        $scope.confirmacaoCancelar=function(idTarefa){//Fazendo a confirmação do botão Cancedlar
          $scope.variavelConfirmacaoCancelar=true;//A variavelConfirmacaoCancelar é uma variavel auxiliar que está mostrando ou não o botão na view
          $scope.idConfirmacaoCancelar=idTarefa;//id da tarefa que sera cancelada
          $scope.variavelConfirmacaoFinalizar=false;//Desabilitando a confirmação de finalizar caso está tiver sido clicada antes
        }

    }])
