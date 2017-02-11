/* Feedback -
        Tool Controller includes a 2nd route /tool/data for collecting information in this controller
        The main route /tool is server side in toolRoutes.js
*/
app.controller( "feedbackCtrl", function($scope, $http, $sce) {

    /* This refers to the user selected item. */
    $scope.selectedFeedback = {};
    $scope.setSelectedItem = function( event ) {
        $scope.selectedFeedback = JSON.parse(event.target.getAttribute("data-feedback"));
    };

    // This is for the further feedback in case multiple erorrs on a single word
    $scope.selectedExpandItem = {};


    $scope.files = [];
    $scope.toolsUsed = [];
    $scope.toolsUsedIdx = 0;

    $scope.feedbackItems=[];
    $http.get("/feedbackTest/data").then( function(res) {
        $scope.feedbackItems = res.data.feedbackItems;
        $scope.files = res.data.files;
        $scope.toolsUsed = res.data.toolsUsed;
    });
});