app.controller('announceCreate', function($scope, $http) {
  $scope.title;
  $scope.body;
  $scope.expiry = new Date();
  $scope.expiryDayMinimum = 14; // By default, announcements will expire in 14 days

  $scope.buildFormData = function () {
    return {
      title: $scope.title,
      body: $scope.body,
      expiryDate: $scope.expiry.toISOString()
    };
  };

  $scope.handleSubmit = function() {
    /* TODO: Validate */
    const formData = $scope.buildFormData();
    $.post('/announcements/create', formData)
      .done ((results) => {
        const id = results.id;
        window.location.href = `/announcements/${id}`;
      })
      .fail((res) => {
        
      });
  };

  $scope.init = function() {
    initDate = new Date();
    initDate.setTime(initDate.getTime() + ($scope.expiryDayMinimum * 24 * 60 * 60 * 1000))
    $scope.expiry = initDate;
  };

  $scope.init();
});