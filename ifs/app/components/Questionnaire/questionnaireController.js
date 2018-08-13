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
						//Clear all fields in further questions if the user inputs a new number of modules
						if ($scope.list[$scope.i+1].prevFed != $scope.list[$scope.i+1].fed) {
							$scope.list[$scope.i+1].fields = [];
							$scope.list[$scope.i+2].fields = [];
							$scope.list[$scope.i+3].fields = [];
							for (var j = 0; j < $scope.list[$scope.i+1].fed; j++) {
								$scope.list[$scope.i+1].fields.push({type: 'text', placeholder: 'Module name', model: ''});
								$scope.list[$scope.i+2].fields.push({type: 'slider', label: '', model: 5});
								$scope.list[$scope.i+3].fields.push({type: 'timeEstimate', label: '', model: [1, 0], hours: [1,2,3,4,5], minutes:[0,15,30,45]});
							}
						}
					}
				}
			} else if ($scope.list[$scope.i].feedsNext == 'moduleDifficulty') {
				//Change labels to match user input
				for (var j in $scope.list[$scope.i].fields) {
					$scope.list[$scope.i+1].fields[j].label = $scope.list[$scope.i].fields[j].model;
				}
			} else if ($scope.list[$scope.i].feedsNext == 'timeEstimates') {
				//Change labels to match user input
				for (var j in $scope.list[$scope.i].fields) {
					$scope.list[$scope.i+1].fields[j].label = $scope.list[$scope.i-1].fields[j].model;
				}
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
		});
	}

	$scope.changeFedModels = function() {
		//Change variables for items where the previously fed and currently fed items need to be kept track of
		if ($scope.question.feedsNext == 'moduleNames') {
			$scope.list[$scope.i+1].prevFed = $scope.list[$scope.i+1].fed;
		}
	}

	$http.get('taskDecompRetrieve').then(function(res) {
		$scope.list = res.data.list;
		$scope.i = res.data.i;
		$scope.question = $scope.list[$scope.i];
		console.log($scope.list);
		console.log($scope.i);

		//Convert stringified date entries to Date objects
		for (var entry of $scope.list)
			for (var field of entry.fields)
				if (field.type == 'date')
					field.model = new Date(field.model);		
	},function(err){
	});
});