app.controller( "studentModelCtrl", function($scope, $http) {

    // Backend Data passed in.
    $scope.graphData= {};
    // Graph Types
    $scope.graphTypes = [];
    $scope.selectedGraphType= 0;

    // Dates, format YYYY-MM-DD
    $scope.lowDate;
    $scope.highDate;

    // Data to show
    $scope.selectedData = {};
    $scope.dataOptions =[];
    
    // Color Schemes
    $scope.selectedColorScheme = 0;
    $scope.colorSchemes = [];

    $scope.today = function() {
        $scope.dt = new Date();
    }

    $scope.initColors = function() {
        $scope.colorSchemes = [
            {
                'name': 'primary',
                'colors': [ '#3498DB', '#72C02C', '#F1C40F', '#E72525','#FEEF37','#A20078','#717984']
            },
            {
                'name': 'secondary',
                'colors': ['#B88FFF','#98F5C7','#62E3F2', '#3498DB',  '#FFBF6B', '#807F82', '#E9E37B','#800B81' ]
            }
        ];
        $scope.selectedColorScheme = $scope.colorSchemes[0];
    }


    $scope.initDates = function() {
        $scope.lowDate = new Date(2017,6,1);
        $scope.highDate = new Date();
    }

    $scope.initGraphTypes = function() {
        $scope.selectedGraphType = 0;
        $scope.graphTypes = [ 'line', 'bar' ];
    }

    $scope.initMetrics = function() {
        $scope.selectedData = 0;
        $scope.dataOptions = [
            { 'name': 'Submissions', 'key': 'nsubs' },
            { 'name': 'Feedback Items', 'key': 'nerrs' },
            { 'name': 'Feedback Items Viewed', 'key': 'nfiv' },
            { 'name': "Self-Assessments", 'key':'sass'}
        ];
    }

    $scope.init = function() {
        $scope.initColors();
        $scope.initDates();
        $scope.initGraphTypes();
        $scope.initMetrics();
    }

    $scope.updateForm = function() {
        $http.post('/studentModel/data', {'minDate': $scope.lowDate, 'maxDate': $scope.highDate, 'studentData': $scope.selectedData }).then( function(res) {
            if(res.data) {
                $scope.graphData = res.data;
            }
        }, function(err){
            console.log("ERROR:", err);
        });
    }

    //Initialize some values
    $scope.init();

    $http.get('/studentModel/data').then( function(res) {
        $scope.graphData = res.data;
    });

  
});
