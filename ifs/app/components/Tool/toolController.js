/* ToolController -
        Tool Controller includes a 2nd route /tool/data for collecting information in this controller
        The main route /tool is server side in toolRoutes.js
*/
app.controller( "toolCtrl", function($scope, $http) {
    //This tool controller is now unused, as all angular has been removed from the tool pug

    /*
    $scope.toolList=[];
    $http.get('/tool/data').then( function(res) {
        // NOTE: This uses a second route to load data into controller.
        // Main Layout information and more static information is loaded via Express routes.
        $scope.toolList = res.data;
        console.log(res.data);
    });
    */
});
