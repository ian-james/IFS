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
    $scope.wasRated = false;

    $scope.test = function() {
        $scope.showSideBar = !$scope.showSideBar;
    }

    $scope.setSelectedItem = function(event) {
        // Array of items matching this error are passed

        if( event.target.getAttribute("data-feedback")){
            $scope.selectedArray = event.target.getAttribute("data-feedback");
            $scope.selectedArray = $scope.selectedArray.split(",");

            $scope.sideSelectedArrId = 0;
            $scope.wasRated = false;

            // Set the first item for the mini popover
            $scope.sideSelectedId = $scope.selectedArray[ $scope.sideSelectedArrId ];
            $scope.selectedFeedback = $scope.feedbackItems[ $scope.sideSelectedId ];
        }
    };

    $scope.getNextSelected = function() {
        $scope.sideSelectedArrId++;
        $scope.sideSelectedArrId =  $scope.sideSelectedArrId  % $scope.selectedArray.length;

        // Set the first item for the mini popover
        $scope.sideSelectedId =  $scope.selectedArray[ $scope.sideSelectedArrId ];
        $scope.selectedFeedback = $scope.feedbackItems[ $scope.sideSelectedId ];
        $scope.wasRated = false;
    };

    $scope.getPrevSelected = function() {
        if( $scope.sideSelectedArrId <= 0 )
            $scope.sideSelectedArrId = $scope.selectedArray.length-1;
        else
            $scope.sideSelectedArrId--;

        $scope.wasRated = false;

    // Set the first item for the mini popover
        $scope.sideSelectedId =  $scope.selectedArray[ $scope.sideSelectedArrId ];
        $scope.selectedFeedback = $scope.feedbackItems[ $scope.sideSelectedId ];
    };

    // Storing backend information into the front end.
    $scope.files = [];
    $scope.toolsUsed = [];
    $scope.feedbackItems=[];
    $scope.feedbackStats=[];
    $scope.filterByTool =null;

    $scope.allowFeedbackType = function(feedbackItem) {
        return ( $scope.filterByTool == "All" || feedbackItem.toolName == $scope.filterByTool);
    }

    $scope.inDisplayStats = function(feedbackItem) {
        var result = [];
        if( feedbackItem ) {
            var displayStats = [ 'chCount','wordCount','nSens', 'avgWrdPerSen', 'nPar',
                                'avgSenPerPar', 'correctWordCount', 'misspelledWordCount'];

            angular.forEach(displayStats, function(value){
                if(feedbackItem.hasOwnProperty(value)) {
                    result.push( feedbackItem[value] );
                }
            });
        }
        return result;
    };

    $http.get("/feedback/data").then(function(res) {
        $scope.feedbackItems = res.data.feedbackItems;
        $scope.files = res.data.files;
        $scope.toolsUsed = res.data.toolsUsed;
        $scope.feedbackStats = res.data.feedbackStats;
        $scope.filterByTool = res.data.selectedTool;
    });
});
