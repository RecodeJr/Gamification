angular.module('my.controllers', [])

// Controller responsavel pela página Home
.controller('homeCtrl', ['$rootScope', function($rootScope){
    $rootScope.teste = ":)";
    $rootScope.nome = "Recode Jr.";
}])

// Controller responsavel pela página de AddTarefa
.controller('addTarefaCtrl', ['$rootScope', function($rootScope){


}])

// Controller responsavel pela página de Cadastro
.controller('cadastroCtrl', ['$rootScope', function($rootScope){

}])

// Controller responsavel pela página de Login
.controller('loginCtrl', ['$rootScope', function($rootScope){

}])

// Controller responsavel pela página de Ranking
.controller('rankingCtrl', ['$rootScope', function($rootScope){

  $rootScope.listaUsuarios = [
    {nome: "Joshua", pontuacao: 256},
    {nome: "Gabriel", pontuacao: 128},
    {nome: "Fabio", pontuacao: 120},
    {nome: "João", pontuacao: 90},
    {nome: "Marcelo", pontuacao: 50},


  ]


}])

// Controller responsavel pela página de adm
.controller('admCtrl', ['$rootScope', function($rootScope){

}])
