

app.controller('announceCreate', function($scope, $http) {
  $scope.title = '';
  $scope.body = 'Enter Announcement Body';
  $scope.expiry = new Date();
  $scope.expiryDayMinimum = 14; // By default, announcements will expire in 14 days


  $scope.buildFormData = function () {
    return {
      title: $scope.title,
      body: $scope.body,
      expiry: $scope.expiry
    };
  };

  $scope.handleSubmit = function() {
    /* TODO: Validate */
    const formData = $scope.buildFormData();
    $.post('/announcements/create', formData)
      .done ((results) => {
        
      })
      .fail((results) => {
      
      });
  };

  $scope.init = function() {
    initDate = new Date();
    initDate.setTime(initDate.getTime() + ($scope.expiryDayMinimum * 24 * 60 * 60 * 1000))
    $scope.expiry = initDate;
  };

  $scope.init();
});