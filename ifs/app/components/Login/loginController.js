
app.controller( "loginCtrl", function($scope, $http) {
    
    $scope.isLoggedIn = false;
    $http.get('/user/data').then( function(res) {
        console.log("SUCCESS->", res.data );
        $scope.isLoggedIn = res.data.user ? true : false;
    }, function(res){
        console.log("FAILURES");
        $scope.isLoggedIn = false;
    });
});