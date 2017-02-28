/*
   This might become options  available to switch settings.
 */
app.controller( "wordCloudCtrl", function($scope, $http) {

    $scope.shapes = ["circle","cardioid", "diamond", "triangle", "pentagon", "star"]
    $scope.selectedShape = $scope.shapes[0];

    $scope.shuffle=false;

    $scope.setRotation = function() {
       $scope.selectedRotationValue = $scope.selectedRotation;
    };

    $scope.minRotation = Math.PI / 12; // 15 degrees
    $scope.maxRotation = Math.PI/2 // 90 degrees
    $scope.rotations = [15,30,45,60,90];
    $scope.selectedRotation = $scope.rotations[3];
    $scope.selectedRotationValue = $scope.setRotation();
   

    $scope.fontSizes= [12,16,20,24,28,30];
    $scope.selectedFontSize = $scope.fontSizes[3];

    $scope.minFontSize = 12;
    $scope.maxFontSize = 40;
    $scope.fontFamily = "helvetica";
    $scope.fontWeight = "bold";
    $scope.weightFactor = 3; // Scale size of each word.

    $scope.colors = [ "darkgray", "black", "lightgray", "white", "blue","yellow"];
    $scope.selectedColor = $scope.colors[0];

/*
    $scope.wordsList=[];
    $http.get('/cloud/data').then( function(res) {
        // NOTE: This uses a second route to load data into controller.
        // Main Layout information and more static information is loaded via Express routes.        
        $scope.wordsList = res.data;
    });
*/
});