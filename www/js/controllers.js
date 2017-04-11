angular.module('my.controllers', [])


    .config(function($httpProvider) {
        $httpProvider.interceptors.push(function() {
            return {
                'request': function(config) {
                    config.headers = config.headers || {};
                    if (localStorage.getItem('ngStorage-token') !== null) {
                        config.headers['x-access-token'] = localStorage.getItem('ngStorage-token').split("\"")[1];
                    }
                    return config;
                }
            };

        });
    })



    // Controller responsavel pela página Home
    .controller('homeCtrl', ['$rootScope', function($rootScope) {
        if (window.localStorage.getItem('ngStorage-token') === null) window.location = "#/login";
        $rootScope.teste = ":)";
        $rootScope.nome = "Recode Jr.";
    }])

    // Controller responsavel pela página de AddTarefa
    .controller('addTarefaCtrl', ['$rootScope', '$scope', 'API', function($rootScope, $scope, API) {
        if (window.localStorage.getItem('ngStorage-token') === null) window.location = "#/login";
        var date = new Date();
        var mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        $scope.datemin = date.getFullYear() + "-" + mm + "-" + date.getDate(); // getMonth() is zero-based
        API.getClasse(function(res) {
            if (res !== undefined)
                //Manda para view as classes disponiveis.
                $scope.listaClasse = res;
        }, function(err) {
            console.log(err);
        });
        $scope.botaoControle = true;
        $scope.addTarefa = function() {
            var tarefa = $scope.tarefa;
            tarefa.idClasse = $scope.cl.classe.idClasse; //Pegando os dados digitados na view
            if (!tarefa.tarefaFixa) {
                dt = new Date($scope.dataPrazo);
                dtmm = dt.getMonth() < 9 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1);
                tarefa.datalimite = dt.getDate()+"/"+dtmm+"/"+dt.getFullYear();
            } else {
              dt = new Date();
              dtmm = dt.getMonth() < 9 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1);
              tarefa.datalimite = dt.getDate()+"/"+dtmm+"/"+dt.getFullYear();
            }
            API.addTarefa(tarefa, function(res) { //Requerindo o POST do services
                if (res.status) { //Verificando se a tarefa foi cadastrada
                    console.log("Tarefa cadastrada");
                    $scope.alerta = false; //Enviando a view que não houve erro e que a tarefa foi adicionada
                    setTimeout(function() {
                        location.replace("/"); //Recarregando a página dps de 5 segundos
                    }, 1000);
                } else {
                    console.log("Erro ao cadastrar tarefa");
                    $scope.alerta = true; //Enviando a view que houve algum erro
                }
            }, function(err) {
                console.log(err);
                $scope.alerta = true; //Enviando a view que houve algum erro

                //location.reload()
            });
        };
    }])

    // Controller responsavel pela página de Cadastro
    .controller('cadastroCtrl', ['$rootScope', '$scope', 'API', function($rootScope, $scope, API) {
        API.getSexo(function(res) {
            if (res !== undefined)
                $scope.listaSexo = res; //Manda para view os sexos disponiveis.
        }, function(err) {
            console.log(err);
        });
        $scope.cadastrar = function() {
            var usuario = $scope.user; //Recebe os dados da view
            usuario.sexo = usuario.sexo.idSexo;
            console.log(usuario);
            API.cadastroUsuario(usuario, function(res) {
                if (res.status) {
                    console.log("Usuário registrado.");
                    location.replace('#/login');
                } else {
                    console.log("Algum erro no cadastro.");
                }
            }, function(err) {
                console.log(err);
            });
        };

    }])

    // Controller responsavel pela página de Login
    .controller('loginCtrl', ['$rootScope', '$scope', 'API', '$location', function($rootScope, $scope, API, $location) {
        window.localStorage.removeItem('ngStorage-token');
        window.localStorage.removeItem('idUser');
        $scope.logar = function() {
            var usuario = $scope.user; //Recebe os dados da view
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
                    var msg = "Login/Senha incorretos";
                    $scope.msg = msg;
                    console.log(msg);
                    // alert(msg)
                }
            }, function(err) {
                console.log(err);
            });
        };

    }])

    // Controller responsavel pela página de Ranking
    .controller('rankingCtrl', ['$rootScope', function($rootScope) {
        if (window.localStorage.getItem('ngStorage-token') === null) window.location = "#/login";
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


        ];


    }])

    // Controller responsavel pela página de adm
    .controller('tarefasCtrl', ['$rootScope', '$routeParams', '$scope', 'API', '$location', function($rootScope, $routeParams, $scope, API, $location) {
        if (window.localStorage.getItem('ngStorage-token') === null) window.location = "#/login";
        $scope.idUser = window.localStorage.getItem('idUser');
        API.getClasse(function(res) { //Solicita as classes
            if (res !== undefined)
                $scope.listaClasse = res; //Coloca as classes na variavel listaClasse
        }, function(err) {
            console.log(err);
        });
        $scope.listaTarefa = [{
                id: 1,
                titulo: "lalalalalalahahahaha",
                statusTarefa: "Disponivel",
                criador: "Júnior",
                idCriador: 1,
                idStatusT: 1,
                idPegou: 1
            },
            {
                id: 2,
                titulo: "2lalalalalalahahahaha",
                statusTarefa: "2Disponivel",
                criador: "Júnior",
                idCriador: 1,
                idStatusT: 1
            },
            {
                id: 3,
                titulo: "3lalalalalalahahahaha",
                statusTarefa: "3Disponivel",
                criador: "Júnior",
                idCriador: 2,
                idStatusT: 1,
                idPegou: 1
            },
            {
                id: 4,
                titulo: "4lalalalalalahahahaha",
                statusTarefa: "4Disponivel",
                criador: "4Júnior",
                idCriador: 1,
                idStatusT: 1,
                idPegou: 1
            }

        ];
        $scope.tipoTarefa = $routeParams.tipoTarefa;
        var controleTarefas;
        if ($scope.tipoTarefa == 'disponiveis') {
            controleTarefas = { //Colocando no JSON que será enviado que não queremos a tarefa a partir do StatusTarefa e sim a partir do idUser
                idStatusT: 1,
                idUser: null
            };
            API.tarefa(controleTarefas, function(res) { //Envia 1 para o banco, informando que são as tarefas disponiveis
                if (res !== undefined) {
                    $scope.listaTarefa = res; //pega a resposta do banco
                    console.log(res);
                } else {
                    console.log(err); //Algum erro
                }
            }, function(err) {
                console.log(err); //erro
            });

        } else if ($scope.tipoTarefa == 'emCurso') {
            controleTarefas = { //Colocando no JSON que será enviado que não queremos a tarefa a partir do StatusTarefa e sim a partir do idUser
                idStatusT: 2,
                idUser: null
            };
            API.tarefa(controleTarefas, function(res) { // Envia 2 para o banco, informando que são as tarefas em Curso
                if (res !== undefined) {
                    $scope.listaTarefa = res;
                } else {
                    console.log(err);
                }
            }, function(err) {
                console.log(err);
            });
        } else if ($scope.tipoTarefa == 'minhasTarefas') {
            controleTarefas = { //Colocando no JSON que será enviado que não queremos a tarefa a partir do StatusTarefa e sim a partir do idUser
                idStatusT: null,
                idUser: $scope.idUser
            };
            API.tarefa(controleTarefas, function(res) { // Pegando tarefas a partir do ID do user logado.
                if (res !== undefined) {
                    $scope.listaTarefa = res;
                } else {
                    console.log(err);
                }
            }, function(err) {
                console.log(err);
            });
        } else if ($scope.tipoTarefa == 'historico') {
            controleTarefas = { //Colocando no JSON que será enviado que não queremos a tarefa a partir do StatusTarefa e sim a partir do idUser
                idStatusT: null,
                idUser: null
            };
            API.tarefa(controleTarefas, function(res) { //Envia null para o banco, mostrando que quer todas as tarefas existentes
                if (res !== undefined) {
                    //    $scope.listaTarefa = res;
                } else {
                    console.log(err);
                }
            }, function(err) {
                console.log(err);
            });
        }
        $scope.editarTarefa = function(idTarefa) { //Parametro de entrada é o id da tarefa selecionada
            for (x in $scope.listaTarefa) { //Faz a verificação de qual é a tarefa selecionada na view
                let aux = $scope.listaTarefa[x];
                if (aux.id == idTarefa) { //Achada qual é a tarefa é mandada a view a tarefa(que está na variavel aux)
                    $scope.tarefa = aux;
                    $scope.enviarEditarTarefa = function() { //Ao clicar no botão "Editar" entra nessa função e envia a tarefa editada para o back
                        var tarefa = $scope.tarefa;
                        tarefa.classe = $scope.cl.classe;
                        //Pegando os dados digitados na view
                        API.editarTarefa(tarefa, function(res) { //Requerindo o POST do services
                            if (res.status) { //Verificando se a tarefa foi cadastrada
                                console.log("Tarefa editada");
                                $scope.alerta = false; //Enviando a view que não houve erro e que a tarefa foi adicionada
                            } else {
                                console.log("Erro ao editar tarefa");
                                $scope.alerta = true; //Enviando a view que houve algum erro
                            }
                        }, function(err) {
                            console.log(err);
                            $scope.alerta = true; //Enviando a view que houve algum erro

                            //location.reload()
                        })
                    };
                    //window.location = "#/editarTarefa"
                }
            }

        };
        $scope.cancelarTarefa = function(idTarefa) { //Função que muda o status da tarefa para cancelada
            console.log(idTarefa);
            for (x in $scope.listaTarefa) { //For para rodar toda a listaTarefa
                var aux = $scope.listaTarefa[x]; //A variavel aux está recebendo os objetos de listaTarefa por vez
                if (aux.id == idTarefa) { //Mudando o status da tarefa para CANCELADA
                    API.cancelarTarefa($scope.listaTarefa[x].id, function(res) { //Enviando o id da tarefa a ser editada
                        if (res.status) { //Verificando se a tarefa foi atualizada
                            $scope.alerta = false;
                            console.log("Tarefa atualizada");
                        } else {
                          $scope.alerta = true;
                            console.log("Erro ao atualizar tarefa");
                        }
                    }, function(err) {
                      $scope.alerta = true;
                        console.log(err);
                    });
                }
            }
        };
        $scope.finalizarTarefa = function(idTarefa) {
            console.log(idTarefa);
            for (x in $scope.listaTarefa) { //For para rodar toda a listaTarefa
                var aux = $scope.listaTarefa[x]; //A variavel aux está recebendo os objetos de listaTarefa por vez
                if (aux.id == idTarefa) { //Mudando o status da tarefa para CANCELADA
                    API.finalizarTarefa($scope.listaTarefa[x].id, function(res) { //Enviando o id da tarefa a ser editada
                        if (res.status) { //Verificando se a tarefa foi atualizada
                          $scope.alerta = false;
                            console.log("Tarefa atualizada");
                        } else {
                          $scope.alerta = true;
                            console.log("Erro ao atualizar tarefa");
                        }
                    }, function(err) {
                      $scope.alerta = true;
                        console.log(err);
                    });
                }
            }
        };
        $scope.confirmacaoFinalizar = function(idTarefa) { //Fazendo a confirmação do botão Finalizar
            $scope.variavelConfirmacaoFinalizar = true; //A variavelConfirmacaoFinalizar é uma variavel auxiliar que está mostrando ou não o botão na view
            $scope.idConfirmacaoFinalizar = idTarefa; //id da tarefa que sera finalizada
            $scope.variavelConfirmacaoCancelar = false; //Desabilitando a confirmação de cancelar caso está tiver sido clicada antes
        };
        $scope.confirmacaoCancelar = function(idTarefa) { //Fazendo a confirmação do botão Cancedlar
            $scope.variavelConfirmacaoCancelar = true; //A variavelConfirmacaoCancelar é uma variavel auxiliar que está mostrando ou não o botão na view
            $scope.idConfirmacaoCancelar = idTarefa; //id da tarefa que sera cancelada
            $scope.variavelConfirmacaoFinalizar = false; //Desabilitando a confirmação de finalizar caso está tiver sido clicada antes
        };

    }]);
