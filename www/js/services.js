angular.module('my.services', [])

.factory('API', ['$http' , function($http,$httpProvider) {
  var baseUrl = "http://localhost:5000"; //"http://192.168.1.104:3300"
          return {
            cadastroUsuario: function(data, success, error) {
              $http.post(baseUrl + '/cadastro', data).success(success).error(error)
            },
            getSexo: function(success, error) {
              $http.get(baseUrl + '/getSexo').success(success).error(error)
            },
            loginUsuario: function(data,success,error){
              $http.post(baseUrl + '/usuario/auth', data).success(success).error(error)
            },
            logout: function(success) {
                //delete $localStorage.token;
                success();
            }
          };

}])
