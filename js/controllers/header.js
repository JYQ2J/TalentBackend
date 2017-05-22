'use strict';

app.controller('HeaderController', ['$scope', '$http', '$state','$cookies', 
    function ($scope, $http, $state, $cookies) {
        $scope.adminImg = "img/a0.jpg";
        $scope.adminName = "管理员";
        $http({
          method: "get",
          url:$scope.app.url + '/v1.0/user',
          headers:{Access_token:$cookies.user_token}
        })
        .success(function (json) {
            $scope.adminImg = json.image;
            $scope.adminName = json.name;
        })
        .error(function () {
        });
    }
]);