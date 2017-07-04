app.controller( "prefCtrl", function($scope, $http) {
    $scope.prefsList = [];
    $http.get('/preferences/data.json').then(function(res) {
        $scope.prefsList = res.data;
    });
    $scope.courses = [];
    $http.get('/preferences/courses.json').then(function(res) {
       // console.log("COURSES: " + JSON.stringify(res.data));
        $scope.courses = res.data;
    });
    $scope.enrolled = [];
    $http.get('/preferences/enrolled.json').then(function(res) {
        console.log("ENROLLED: " + JSON.stringify(res.data));
        $scope.enrolled = res.data;
    });
    $scope.isEnrolled = function(code) {
        console.log("COURSES: " + JSON.stringify($scope.courses));
        $scope.codes = []
        for (i in $scope.enrolled) {
            console.log("ENROLLED IN" + JSON.stringify($scope.enrolled[i].code));
            $scope.codes.push($scope.enrolled[i].code);
        }
        console.log(JSON.stringify($scope.codes));
        console.log("CODE (" + code + ") in enrolled? " + $scope.codes.indexOf(code));
        return $scope.codes.indexOf(code);
    }
});
