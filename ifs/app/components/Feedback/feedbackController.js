/* Feedback -
        Tool Controller includes a 2nd route /tool/data for collecting information in this controller
        The main route /tool is server side in toolRoutes.js

    This Controller mostly works with popovers (inc mini)
*/
app.controller( "feedbackCtrl", function($scope, $http, $sce) {

    /* This refers to the user selected item. */
    $scope.selectedFeedback = {};
    $scope.activeFeedback = {};

    $scope.selectedArray = [];
    $scope.sideSelectedArrId = 0;
    $scope.sideSelectedId = 0;

    $scope.showSideBar = false;

    $scope.test = function() {
        $scope.showSideBar = !$scope.showSideBar;
    }


    $scope.setSelectedItem = function( event ) {
        // Array of items matching this error are passed
        
        if( event.target.getAttribute("data-feedback")){
            $scope.selectedArray = event.target.getAttribute("data-feedback");
            $scope.selectedArray = $scope.selectedArray.split(",");

            $scope.sideSelectedArrId = 0;

            // Set the first item for the mini popover
            $scope.sideSelectedId = $scope.selectedArray[ $scope.sideSelectedArrId ];
            $scope.selectedFeedback = $scope.feedbackItems[ $scope.sideSelectedId ];
        }
        else
            console.log("SET SECLT ITEM");
    };
    

    $scope.getNextSelected = function() 
    {        
        $scope.sideSelectedArrId++;
        $scope.sideSelectedArrId =  $scope.sideSelectedArrId  % $scope.selectedArray.length;

        // Set the first item for the mini popover
        $scope.sideSelectedId =  $scope.selectedArray[ $scope.sideSelectedArrId ];
        $scope.selectedFeedback = $scope.feedbackItems[ $scope.sideSelectedId ];
        
    };

    $scope.getPrevSelected = function() 
    {
        if( $scope.sideSelectedArrId <= 0 )
            $scope.sideSelectedArrId = $scope.selectedArray.length-1;
        else
            $scope.sideSelectedArrId--;

    // Set the first item for the mini popover
        $scope.sideSelectedId =  $scope.selectedArray[ $scope.sideSelectedArrId ];
        $scope.selectedFeedback = $scope.feedbackItems[ $scope.sideSelectedId ];
    };

    // Storing backend information into the front end.
    $scope.files = [];
    $scope.toolsUsed = [];
    $scope.feedbackItems=[];

    $http.get("/feedback/data").then( function(res) {
        $scope.feedbackItems = res.data.feedbackItems;
        $scope.files = res.data.files;
        $scope.toolsUsed = res.data.toolsUsed;
    });

/*
    $http.get("/feedbackTest/data").then( function(res) {
        $scope.feedbackItems = res.data.feedbackItems;
        $scope.files = res.data.files;
        $scope.toolsUsed = res.data.toolsUsed;
    });
*/
});