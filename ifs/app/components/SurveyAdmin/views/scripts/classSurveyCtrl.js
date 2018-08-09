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
    payload = JSON.stringify(payload);
    $.ajax({
      method: 'POST',
      url: '/admin/surveys/classes',
      data: payload,
      contentType: 'application/json'
    })
      .then((res) => {
        UIkit.notification({
          message: 'Successfully updated survey preferences',
          timeout: 2000,
          status: 'success'
        });
      });
  }

  $scope.init = () => {
    $scope.fetchClasses();
  }

  $scope.init();
});