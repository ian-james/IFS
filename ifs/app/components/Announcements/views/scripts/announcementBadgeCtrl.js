app.controller('annBadge', function($scope, $http) {
  $scope.unseen = ''

  $scope.init = () => {
    $.get('/announcements/newCount')
    .then ((data) => {
      if ( data.unseen > 0 ) {
        $scope.unseen = data.unseen;
      }
    })
  }

  $scope.init();
});
