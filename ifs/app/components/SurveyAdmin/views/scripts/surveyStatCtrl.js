app.controller('surveyStatCtrl', ($scope, $http) => {
  /* Available surveys, questions, and responses */
  $scope.surveys = [];
  $scope.questions = [];
  /* Current graph datasets */
  $scope.graphData = {};
  /* Current selections */
  $scope.selectedSurvey = $scope.surveys[0];
  $scope.selectedQuestions = [];
  $scope.series = [];
  /* Current chart type */
  $scope.availableTypes = ['bar', 'pie'];
  $scope.type = 'bar';
  /* Filter bindings */
  $scope.startDate;
  $scope.endDate;
  $scope.responseType = ['both', 'manual', 'pulse'];
  $scope.selectedResponseType;
  $scope.availableToolPref = ['both', 'Programming', 'Writing'];
  $scope.selectedToolPref;
  /* Chart meta data */
  $scope.author = '-';
  $scope.numQuestions = '-';
  $scope.field = '-';

  /* Labels */
  $scope.labels = ['1', '2', '3', '4', '5'];
  
  /* Grabs a list of all surveys */
  $scope.initSurveys = () => {
    $http.get('/admin/surveys/meta')
      .then ((res) => {
        $scope.surveys = res.data;
      });
  };

  /* Updates available questions based on the selected survey */
  $scope.getSurveyQuestions = () => {
    $scope.selectedQuestion = 0;
    const surveyID = $scope.selectedSurvey.id;
    $http.get('/admin/surveys/questions/' + surveyID)
      .then ((res) => {
          $scope.questions = res.data;
          /* Update meta data information */
          $scope.updateMetaData();
      });
  };
  
  /* Gets all responses for a particular question and updates the scope values */
  $scope.getQuestionResponses = () => {
    $scope.graphData.data = [];
    $scope.graphData.series = [];
    for (let question of $scope.selectedQuestions) {
      const questionID = question.id;
      $http.post('/admin/surveys/responses/' + questionID, $scope.buildPrefObject())
        .then((res) => {
          $scope.graphData.data.push(res.data);
          $scope.series.push(question.text);
        });
    };
  };

  $scope.updateMetaData = () => {
    $scope.field = $scope.selectedSurvey.surveyField;
    $scope.author = $scope.selectedSurvey.authorNames;
    $scope.numQuestions = $scope.selectedSurvey.totalQuestions;
  };

  /* Returns an object with selected preferences */
  $scope.buildPrefObject = () => (
    {
      'startDate': $scope.startDate,
      'endDate': $scope.endDate,
      'responseType': $scope.selectedResponseType,
      'toolPref': $scope.selectedToolPref
    }
  );

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
    $scope.graphData.options.scales = {};
    $scope.graphData.options.scales.yAxes = [{ticks: {min: 0}}];
    $scope.graphData.options.title = { display: true };
    $scope.graphData.options.legend = { display: true };
  };

  $scope.init();
});
