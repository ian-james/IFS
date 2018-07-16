app.controller('annBadge', function($scope, $http) {
  $scope.unseen = ''

  $scope.init = () => {
    $http.get('/announcements/newCount')
    .then ((res) => {
      console.log(res.data);
      console.log(res);
      if ( res.data.unseen > 0 ) {
        $scope.unseen = res.data.unseen;
      } else {
        console.log('not taken');
      }
    })
  }

  $scope.init();
});
