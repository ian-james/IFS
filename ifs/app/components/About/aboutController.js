app.controller("aboutCtrl", function($scope, $http) {


    $scope.toolAbtList = [];
    $http.get('/about/data').then(function(res) {

        console.log(res);
        // Res.data contains two variables for each prog and lang files.
        $scope.toolAbtList = res.data;
        console.log($scope.toolAbtList); // this just prints the page source??
    });
});
