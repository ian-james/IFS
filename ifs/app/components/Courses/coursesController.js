app.controller("coursesCtrl", function($scope, $http) {
    $scope.courses = [];
    $http.get('/courses/courses.json').then(function(res) {
        $scope.courses = res.data;
    });
    $scope.enrolled = [];
    $http.get('/courses/enrolled.json').then(function(res) {
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
