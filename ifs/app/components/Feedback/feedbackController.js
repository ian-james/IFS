/* Feedback -
        Tool Controller includes a 2nd route /tool/data for collecting information in this controller
        The main route /tool is server side in toolRoutes.js
*/
app.controller( "feedbackCtrl", function($scope, $http, $sce) {

    $scope.selectedFeedback = {};

    $scope.setSelectedItem = function( event ) {
        $scope.selectedFeedback = JSON.parse(event.target.getAttribute("data-feedback"));
    };

    $scope.files = [];
    $scope.feedbackItems=[];
    $http.get("/feedbackTest/data").then( function(res) {
        $scope.feedbackItems = res.data.feedbackItems;
        $scope.files = res.data.files;
    });
});