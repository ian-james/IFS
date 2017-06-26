app.controller( "prefCtrl", function($scope, $http) {
    $scope.prefsList = [];
    $http.get('/preferences/data.json').then( function(res) {
        $scope.prefsList= res.data;
    });
});
