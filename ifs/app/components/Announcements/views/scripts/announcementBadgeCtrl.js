app.controller('annBadge', function($scope, $http) {
  $scope.unseen = ''

  $scope.init = () => {
    $http.get('/announcements/newCount')
    .then ((res) => {
      if ( res.data.unseen > 0 ) {
        $scope.unseen = res.data.unseen;
      }
    })
  }

  $scope.init();
});
