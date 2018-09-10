app.controller('announceCtrl', function($scope, $http) {
  $scope.announcements = [];

  $scope.populate = function () {
    $http.get('/announcements/list')
      .then((res) => {
        $scope.announcements = res.data;
      });
  };

  $scope.deleteAnnounce = function(id) {
    if (confirm('Do you really want to delete this announcement?')) {
      $http.delete(`/admin/announcements/${id}`)
      .then((res) => {
        $scope.announcements = res.data;
      });
    } 
  };

  $scope.populate();
});