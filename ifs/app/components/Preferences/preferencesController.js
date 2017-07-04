app.controller( "prefCtrl", function($scope, $http) {
    $scope.prefsList = [];
    $http.get('/preferences/data.json').then(function(res) {
        $scope.prefsList = res.data;
        console.log(res.data);
    });
    $scope.courses = [];
    $http.get('/preferences/courses.json').then(function(res) {
        $scope.courses = res.data;
    });
    $scope.enrolled = [];
    $http.get('/preferences/enrolled.json').then(function(res) {
        $scope.enrolled = res.data;
    });
    $scope.isEnrolled = function(code) {
        $scope.codes = []
        for (i in $scope.enrolled) {
            $scope.codes.push($scope.enrolled[i].code);
        }
        return $scope.codes.indexOf(code);
    }
});
