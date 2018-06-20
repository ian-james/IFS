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
  $scope.type = 'bar';
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

  /* Mutate chart type between bar and pie */
  $scope.switchChartType = () => {
    $scope.type = ($scope.type == 'bar') ? 'pie' : 'bar';
    /*if ($scope.type == 'bar') {
      console.log('Now pie');
      $scope.type = 'pie'
    } else {
      console.log('now bar');
      $scope.type = 'bar';
    }*/
    $scope.graphData.type = $scope.chartType;
  };

  $scope.init = () => {
    $scope.initSurveys();
    $scope.graphData.labels = $scope.labels;
    $scope.graphData.type = $scope.chartType;
    $scope.graphData.data = [];
    $scope.graphData.options = {};
    $scope.graphData.options.title = { display: true };
  };

  $scope.init();
});
