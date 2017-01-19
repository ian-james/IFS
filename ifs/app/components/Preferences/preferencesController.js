app.controller( "prefCtrl", function($scope, $http) {

    $scope.prefssList = [];
    $http.get('/preference/data').then( function(res) {
        $scope.prefsList= res.data;
        console.log(JSON.stringify(res.data) );
    });
});