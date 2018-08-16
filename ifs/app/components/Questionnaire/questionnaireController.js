app.controller("questionnaireCtrl", function($scope, $http) {
	$scope.modalTitle = "Task Decomposition"
	$scope.question = null;
	$scope.list = null;
	$scope.i = 0;

	$scope.next = function() {
		$scope.changeFedModels();

		//Feed the next item in the list, if applicable
		if ($scope.list[$scope.i].feedsNext) {
			var field = $scope.question.fields[0];
			if ($scope.list[$scope.i].feedsNext == 'moduleNames') {
				$scope.list[$scope.i+1].fed = parseInt(field.model);
				//Clear all fields in further questions if the user inputs a new number of modules
				if ($scope.list[$scope.i+1].prevFed != $scope.list[$scope.i+1].fed) {
					$scope.list[$scope.i+1].fields = [];
					$scope.list[$scope.i+2].fields = [];
					for (var j = 0; j < $scope.list[$scope.i+1].fed; j++) {
						$scope.list[$scope.i+1].fields.push({type: 'text', placeholder: 'Module name', model: ''});
						$scope.list[$scope.i+2].fields.push({type: 'slider', label: '', model: 5});
					}
				}
			} else if ($scope.list[$scope.i].feedsNext == 'moduleDifficulty') {
				//If the number of modules changed, truncate the list to build a new set of task questions later
				$scope.list[$scope.i+1].fed = $scope.list[$scope.i].fed;
				if ($scope.list[$scope.i+1].prevFed != $scope.list[$scope.i+1].fed) {
					$scope.list.length = 8;
				}
				
				//Grab all header items from the lists for title change
				var taskHeaders = [];
				for (var item of $scope.list) {
					if (item.taskHeader) taskHeaders.push(item);
				}

				//Change labels to match user input
				for (var j in $scope.list[$scope.i].fields) {
					$scope.list[$scope.i+1].fields[j].label = $scope.list[$scope.i].fields[j].model;
					if (taskHeaders.length > 0) taskHeaders[j].num = '"' + $scope.list[$scope.i].fields[j].model + '" Task Decomposition';
				}

				//Build the task questions if applicable	
				if ($scope.list[$scope.i+1].prevFed != $scope.list[$scope.i+1].fed) {
					for (var field of $scope.list[$scope.i].fields) {
						$scope.list.push({taskHeader: true, num: '"' + field.model + '" Task Decomposition', text: 'The following section will ask you questions about the tasks in this module to help you break them down. You may exit this survey at any time.', fields: []});
						$scope.list.push({num: 'Question 1', text: 'Do you know how to complete this module?', feedsNext: 'taskModuleDifficulty', fields: [{type: 'radio', model: 'No', options: ['No', 'Yes']}]});
						$scope.list.push({num: 'Question 2', text: 'How many tasks are there in this module?', fed: 'No', prevFed: 'No', feedsNext: 'taskNames', fields: [{type: 'select', model: '1', label: 'Tasks', options: ['1', '2', '3', '4', '5']}]});
						$scope.list.push({num: 'Question 3', text: 'What are the names of these tasks?', fed: 0, prevFed: 0, feedsNext: 'timeEstimates', fields: [{type: 'text', placeholder: 'Task name', model: ''}]});
						$scope.list.push({num: 'Question 4', text: 'Do you now know how to complete this module given the tasks you listed?', fields: [{type: 'radio', model: 'No', options: ['No', 'Yes']}]});
						$scope.list.push({num: 'Question 5', text: 'Estimate how long it will take you to complete each task:', fields: [{type: 'timeEstimate', label: '', model: [1, 0]}]});
					}
				}
			} else if ($scope.list[$scope.i].feedsNext == 'taskModuleDifficulty') {		
				//Check if the user knows how to complete this module
				$scope.list[$scope.i+1].fed = $scope.list[$scope.i].fields[0].model;
				if ($scope.list[$scope.i+1].prevFed != $scope.list[$scope.i+1].fed) {
					//If the user does or doesn't know how to complete the model, do or do not ask them questions about task difficulty
					if ($scope.list[$scope.i+1].fed == 'No') {
						$scope.list[$scope.i + 3].num = 'Question 5';
						$scope.list.splice($scope.i + 3, 0, {num: 'Question 4', text: 'Do you now know how to complete this module given the tasks you listed?', fields: [{type: 'radio', model: 'No', options: ['No', 'Yes']}]});
					} else {
						$scope.list.splice($scope.i + 3, 1);
						$scope.list[$scope.i + 3].num = 'Question 4';
					}
				}
			} else if ($scope.list[$scope.i].feedsNext == 'taskNames') {
				//If the number of tasks has changed, clear all fields and rebuild them for the appropriate number of tasks
				var field = $scope.question.fields[0];
				$scope.list[$scope.i+1].fed = parseInt(field.model);
				if ($scope.list[$scope.i+1].prevFed != $scope.list[$scope.i+1].fed) {
					$scope.list[$scope.i+1].fields = [];
					$scope.list[$scope.i+2].fields = [];
					if ($scope.list[$scope.i].fed == 'No') {
						$scope.list[$scope.i+2].fields = [{type: 'radio', model: 'No', options: ['No', 'Yes']}];
						$scope.list[$scope.i+3].fields = [];
					}
					for (var j = 0; j < $scope.list[$scope.i+1].fed; j++) {
						$scope.list[$scope.i+1].fields.push({type: 'text', placeholder: 'Task name', model: ''});
						if ($scope.list[$scope.i].fed == 'No') {
							$scope.list[$scope.i+3].fields.push({type: 'timeEstimate', label: '', model: [1, 0]});
						} else {
							$scope.list[$scope.i+2].fields.push({type: 'timeEstimate', label: '', model: [1, 0]});
						}
					}
				}
			} else if ($scope.list[$scope.i].feedsNext == 'timeEstimates') {
				//Change labels to match user input for task time estimates
				var j = $scope.i + 1
				if ($scope.list[$scope.i-1].fed == 'No') j++;
	
				for (var k in $scope.list[$scope.i].fields) {
					$scope.list[j].fields[k].label = $scope.list[$scope.i].fields[k].model;
				}
			}
		}

		$scope.i++;
		$scope.question = $scope.list[$scope.i];
		$scope.saveProgress();
		console.log($scope.list);
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
		if ($scope.question.feedsNext == 'moduleNames' || 
			$scope.question.feedsNext == 'moduleDifficulty' ||
			$scope.question.feedsNext == 'taskNames' ||
			$scope.question.feedsNext == 'taskDifficulty' || 
			$scope.question.feedsNext == 'taskModuleDifficulty') {
			$scope.list[$scope.i+1].prevFed = $scope.list[$scope.i+1].fed;
		}
	}

	$http.get('taskDecompRetrieve').then(function(res) {
		$scope.list = res.data.list;
		$scope.i = res.data.i;
		$scope.question = $scope.list[$scope.i];

		console.log($scope.list);

		//Convert stringified date entries to Date objects
		for (var entry of $scope.list)
			for (var field of entry.fields)
				if (field.type == 'date')
					field.model = new Date(field.model);		
	},function(err){
	});
});