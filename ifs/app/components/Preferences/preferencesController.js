app.controller( "preferencesCtrl", function($scope) {
    $scope.classesCIS = [
        'CIS1500',
        'CIS2500',
        'CIS2750',
        'CIS3100',
        "None"
    ];

    $scope.classesPSY = [
        'PSY1500',
        "None"
    ];

    $scope.department = [ 'CIS', 'PSY'];
});