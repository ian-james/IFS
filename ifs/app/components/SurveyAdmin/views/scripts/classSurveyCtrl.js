app.controller('classSurveyCtrl', ($scope, $http) => {
  $scope.classes = [];
  $scope.surveyPref = [];
  $scope.selectedClass = {};

  $scope.fetchClasses = () => {
    $http.get('/admin/surveys/classlist')
      .then ((res) => {
        $scope.classes = res.data;
      })
  }

  $scope.fetchPreferences = () => {
    $http.get(`/admin/surveys/classes/${$scope.selectedClass.id}`)
      .then((res) => {
        $scope.surveyPref = res.data;
        console.log($scope.surveyPref);
      })
  }

  $scope.buildDataObj = () => {
    const obj =  {};
    obj.classId = $scope.selectedClass.id
    obj.prefs = [];
    for (let pref of $scope.surveyPref) {
      obj.prefs.push ({
        surveyId: pref.id,
        viewable: pref.viewable
      });
    }
    return obj;
  }
  $scope.updatePreferences = () => {
    let payload = $scope.buildDataObj();
    console.log('In update');
    payload = JSON.stringify(payload);
    console.log(payload);
    $.ajax({
      method: 'POST',
      url: '/admin/surveys/classes',
      data: payload,
      contentType: 'application/json'
    })
      .then((res) => {
        console.log('OK');
      });
  }

  $scope.init = () => {
    $scope.fetchClasses();
  }

  $scope.init();
});