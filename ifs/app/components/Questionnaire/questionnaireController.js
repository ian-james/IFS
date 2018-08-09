var i = 0;

app.controller("questionnaireCtrl", function($scope, $http) {
	$scope.modalTitle = "Task Decomposition"
	$scope.question = null;

	$scope.next = function() {
		//Ensure we don't go out of bounds
		if (i+1 > list.length-1) return;

		i++;
		$scope.question = list[i];
		$scope.saveProgress();
	}

	$scope.prev = function() {
		//Ensure we don't go out of bounds
		if (i-1 < 0) return;

		i--;
		$scope.question = list[i];
		$scope.saveProgress();
	}

	$scope.saveProgress = function() {

	}

	$http.get('taskDecompRetrieve').then(function(res) {
		list = res.data;
		for (var entry of list) {
			for (var field of entry.fields)
				if (field.type == 'date')
					field.model = new Date(field.model);
		}
		$scope.question = list[i];
	})
});