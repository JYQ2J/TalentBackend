'use strict';
// signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state','$cookies', 
  function ($scope, $http, $state, $cookies) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function () {
        $scope.authError = null;

        $http.post($scope.app.url + '/v1.0/auth', 
        {
          phone: $scope.user.phone, password: $scope.user.password
        })
        .then(function(response) {
            $cookies.user_token = response.data.access_token;
            $state.go('app.user');
        }, function(x) {
            if(x==null || x.data==null || x.data.reason==null){
                $scope.authError = "服务器错误，请联系管理员";
            }else{
                $scope.authError = x.data.reason;
            }
        });
    };
  }]);