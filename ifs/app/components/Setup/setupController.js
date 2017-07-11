app.controller( "setupCtrl", function($scope, $http) {
    $scope.setup = [];
    $http.get('/setup/data.json').then(function(res) {
        $scope.setup = res.data;
    });
    $scope.values = [];
    $http.get('/setup/values.json').then(function(res) {
        $scope.values = res.data
    });
    $scope.isEnabled = function(optionName) {
        $scope.valueNames = []
        for (i in $scope.values) {
            $scope.valueNames.push($scope.values[i].name);
        }
        var index = $scope.valueNames.indexOf(optionName);
        if (index >= 0)
            return $scope.values[index].value;
        else
            return 0;
    }
});
