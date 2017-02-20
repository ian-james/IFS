
app.controller( "loginCtrl", function($scope, $http) {
    
    $scope.isLoggedIn = false;
    $http.get('/user/data').then( function(res) {
        $scope.isLoggedIn = res.data.user ? true : false;
    }, function(res){
        $scope.isLoggedIn = false;
    });
});