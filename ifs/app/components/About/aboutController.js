app.controller("aboutCtrl", function($scope, $http) {
    $scope.toolAbtList = [];
    $http.get('/about').then(function(res) {
        $scope.toolAbtList = res.data;
        console.log($scope.toolAbtList); // this just prints the page source??
    });
});
