angular.module('app').directive( "auth", [ '$state','$cookies',
        function( $state, $cookies ) { 
            return { 
                restrict: "A", 
                link: function( scope, element, attrs ) { 
                    if($cookies.user_token == "null" || $cookies.user_token == undefined){
                        $state.go('access.signin');
                    }
                } 
            }; 
}]);