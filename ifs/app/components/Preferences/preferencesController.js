app.controller( "prefCtrl", function($scope, $http) {
    $scope.prefsList = [];
    $http.get('/preference/data').then( function(res) {
        $scope.prefsList= res.data;
    });
});
