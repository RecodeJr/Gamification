angular.module('my.routes', [])


.directive('simpleNavbar', function () {
   return {
     restrict: 'E',
     templateUrl: 'views/navbar.html'
   };
})

.config(function($routeProvider,$locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/views/home.html",
        controller: "homeCtrl"
    })
    .when("/addtarefa", {
        templateUrl : "/views/addtarefa.html"
    })
    .when("/cadastro", {
        templateUrl : "/views/cadastro.html"
    })
    .when("/login", {
        templateUrl : "/views/login.html"
    })
    .when("/ranking", {
        templateUrl : "/views/ranking.html",
        controller: "rankingCtrl"
    })
    .when("/tarefas/:tipoTarefa", {
        templateUrl : "/views/tarefas.html",
        controller: "tarefasCtrl"

    })
    .when('/404', {
         templateUrl: '/views/erro.html',
     })
     .otherwise('/404');
})
