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
  $scope.chartType = 'bar';
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
        console.log($scope.graphData);
      });
  };

  $scope.updateMetaData = () => {
    $scope.field = $scope.selectedSurvey.surveyField;
    $scope.author = $scope.selectedSurvey.authorNames;
    $scope.numQuestions = $scope.selectedSurvey.totalQuestions;
  };

  /* Mutate chart type between bar and pie */
  $scope.switchChartType = () => {
    $scope.chartType = ($scope.chartType == 'bar') ? 'pie' : 'bar';
  };

  $scope.init = () => {
    $scope.initSurveys();
    $scope.graphData.labels = $scope.labels;
    $scope.graphData.type = $scope.chartType;
    $scope.graphData.data = [];
  };

  $scope.init();
});
