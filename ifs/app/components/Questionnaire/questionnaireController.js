app.controller("questionnaireCtrl", function($scope, $http) {
	$scope.modalTitle = "Task Decomposition"
	$scope.question = null;
	$scope.list = null;
	$scope.i = 0;

	$scope.next = function() {
		$scope.changeFedModels();

		//Feed the next item in the list, if applicable
		if ($scope.list[$scope.i].feedsNext) {
			if ($scope.list[$scope.i].feedsNext == 'moduleNames') {
				for (var field of $scope.list[$scope.i].fields) {
					if (field.type == 'select') {
						$scope.list[$scope.i+1].fed = parseInt(field.model);
						//Clear models if necessary
						if ($scope.list[$scope.i+1].prevFed != $scope.list[$scope.i+1].fed) {
							$scope.list[$scope.i+1].fields = [];
							for (var j = 0; j < $scope.list[$scope.i+1].fed; j++) {
								$scope.list[$scope.i+1].fields.push({type: 'text', placeholder: 'Module name', model: ''});
							}
						}
					}
				}
			} else if ($scope.list[$scope.i].feedsNext == 'moduleDifficulty') {
				console.log('test');
				$scope.list[$scope.i+1].fields = [];
				for (var field of $scope.list[$scope.i].fields) {
					$scope.list[$scope.i+1].fields.push({type: 'slider', label: field.model, model: 5});
				}
				console.log($scope.list[$scope.i+1]);
			}
		}

		$scope.i++;
		$scope.question = $scope.list[$scope.i];
		$scope.saveProgress();
	}

	$scope.prev = function() {
		$scope.changeFedModels();

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
		},function(err){
			console.log(err);
		});
	}

	$scope.changeFedModels = function() {
		//Change variables for items where the previously fed and currently fed items need to be kept track of
		if ($scope.list[$scope.i].feedsNext == 'moduleNames') {
			$scope.list[$scope.i].prevFed = $scope.list[$scope.i].fed;
		} 
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
	},function(err){
		console.log(err);
	});
});