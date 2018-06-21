app.controller('surveyStatCtrl', ($scope, $http) => {
  /* Available surveys, questions, and responses */
  $scope.surveys = [];
  $scope.questions = [];
  /* Current graph datasets */
  $scope.graphData = {};
  /* Current selections */
  $scope.selectedSurvey = $scope.surveys[0];
  $scope.selectedQuestion = $scope.questions[0];
  /* Current chart type */
  $scope.availableTypes = ['bar', 'pie'];
  $scope.type = 'bar';
  /* Filter bindings */
  $scope.startDate;
  $scope.endDate;
  $scope.responseType = ['Both', 'Manual', 'Pulse'];
  $scope.selectedResponseType;
  /* Chart meta data */
  $scope.author = '-';
  $scope.numQuestions = '-';
  $scope.field = '-';

  /* Labels */
  $scope.labels = ['1', '2', '3', '4', '5'];
  
  /* Grabs a list of all surveys */
  $scope.initSurveys = () => {
    $http.get('/surveys/meta')
      .then ((res) => {
        $scope.surveys = res.data;
      });
  };

  /* Updates available questions based on the selected survey */
  $scope.getSurveyQuestions = () => {
    $scope.selectedQuestion = 0;
    const surveyID = $scope.selectedSurvey.id;
    $http.get('/surveys/questions/' + surveyID)
      .then ((res) => {
          $scope.questions = res.data;
          /* Update meta data information */
          $scope.updateMetaData();
      });
  };
  
  /* Gets all responses for a particular question and updates the scope values */
  $scope.getQuestionResponses = () => {
    const questionID = $scope.selectedQuestion.id;
    $http.get('/surveys/responses/' + questionID)
      .then((res) => {
        $scope.graphData.data = res.data;
        $scope.graphData.options.title.text = $scope.selectedQuestion.text;
        console.log($scope.graphData);
      });
  };

  $scope.updateMetaData = () => {
    $scope.field = $scope.selectedSurvey.surveyField;
    $scope.author = $scope.selectedSurvey.authorNames;
    $scope.numQuestions = $scope.selectedSurvey.totalQuestions;
  };

  $scope.updateGraphData = () => {
    if ($scope.selectedQuestion) {
      const questionID = $scope.selectedQuestion.id;
      $http.post('/surveys/responses/' + questionID, {'startDate': $scope.startDate, 'endDate': $scope.endDate, 'responseType': $scope.selectedResponseType})
        .then((res) => {
          if (res.data) {
            if (res.data.length > 0) {
              $scope.graphData.data = res.data;
            } 
          } 
        }); 
    } else {
      console.log('No set question');
    }
  }

  $scope.init = () => {
    $scope.initSurveys();
    /* Set date ranges */
    $scope.startDate = new Date(2018,4,1);
    $scope.endDate = new Date();
    /* Setup Graph Stats */
    $scope.graphData.labels = $scope.labels;
    $scope.graphData.type = $scope.chartType;
    $scope.graphData.data = [];
    $scope.graphData.options = {};
    $scope.graphData.options.title = { display: true };
  };

  $scope.init();
});
