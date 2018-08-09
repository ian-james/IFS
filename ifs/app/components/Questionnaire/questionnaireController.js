app.controller("questionnaireCtrl", function($scope, $http) {
	$scope.modalTitle = "Task Decomposition"
	$scope.question = null;
	$scope.list = null;
	$scope.i = 0;

	$scope.next = function() {
		$scope.i++;
		$scope.question = $scope.list[$scope.i];
		$scope.saveProgress();
	}

	$scope.prev = function() {
		$scope.i--;
		$scope.question = $scope.list[$scope.i];
		$scope.saveProgress();
	}

	$scope.finish = function() {
		UIkit.modal("#questionnaireModal").hide();
		$scope.saveProgress();
		$scope.i++;
	}

	$scope.saveProgress = function() {
		$http.post('taskDecompStore', {'list': $scope.list, 'i': $scope.i}).then(function(res) {
		});
	}

	$http.get('taskDecompRetrieve').then(function(res) {
		$scope.list = res.data.list;
		$scope.i = res.data.i;

		//Convert stringified date entries to Date objects
		for (var entry of $scope.list)
			for (var field of entry.fields)
				if (field.type == 'date')
					field.model = new Date(field.model);
				
		$scope.question = $scope.list[$scope.i];
	});
});