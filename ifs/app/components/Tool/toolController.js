/* ToolController -
        Tool Controller includes a 2nd route /tool/data for collecting information in this controller
        The main route /tool is server side in toolRoutes.js
*/
app.controller( "toolCtrl", function($scope, $http) {
    /*

    //TODO: WIll remove on a seperate commit.
    $scope.toolList=[];
    $scope.prefsList = [];
    $http.get('/tool/data').then( function(res) {
        // NOTE: This uses a second route to load data into controller.
        // Main Layout information and more static information is loaded via Express routes.
        $scope.toolList = res.data;
    });
    */
});
