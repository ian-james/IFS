app.controller("questionnaireCtrl", function($scope, $http, $rootScope) {
	$scope.modalTitle = "Task Decomposition"
	$rootScope.question = null;
	$rootScope.list = null;
	$rootScope.i = 0;

	$scope.next = function() {
		$scope.changeFedModels();

		//Feed the next item in the list, if applicable
		if ($rootScope.list[$rootScope.i].feedsNext) {
			var field = $rootScope.question.fields[0];
			if ($rootScope.list[$rootScope.i].feedsNext == 'moduleNames') {
				$rootScope.list[$rootScope.i+1].fed = parseInt(field.model);
				//Clear all fields in further questions if the user inputs a new number of modules
				if ($rootScope.list[$rootScope.i+1].prevFed != $rootScope.list[$rootScope.i+1].fed) {
					$rootScope.list[$rootScope.i+1].fields = [];
					$rootScope.list[$rootScope.i+2].fields = [];
					for (var j = 0; j < $rootScope.list[$rootScope.i+1].fed; j++) {
						$rootScope.list[$rootScope.i+1].fields.push({type: 'text', placeholder: 'Module name', model: ''});
						$rootScope.list[$rootScope.i+2].fields.push({type: 'slider', label: '', model: 5});
					}
				}
			} else if ($rootScope.list[$rootScope.i].feedsNext == 'moduleDifficulty') {
				//If the number of modules changed, truncate the list to build a new set of task questions later
				$rootScope.list[$rootScope.i+1].fed = $rootScope.list[$rootScope.i].fed;
				if ($rootScope.list[$rootScope.i+1].prevFed != $rootScope.list[$rootScope.i+1].fed) {
					$rootScope.list.length = 8;
				}
				
				//Grab all header items from the lists for title change
				var taskHeaders = [];
				for (var item of $rootScope.list) {
					if (item.taskHeader) taskHeaders.push(item);
				}

				//Change labels to match user input
				for (var j in $rootScope.list[$rootScope.i].fields) {
					$rootScope.list[$rootScope.i+1].fields[j].label = $rootScope.list[$rootScope.i].fields[j].model;
					if (taskHeaders.length > 0) taskHeaders[j].num = '"' + $rootScope.list[$rootScope.i].fields[j].model + '" Task Decomposition';
				}

				//Build the task questions if applicable	
				if ($rootScope.list[$rootScope.i+1].prevFed != $rootScope.list[$rootScope.i+1].fed) {
					for (var field of $rootScope.list[$rootScope.i].fields) {
						$rootScope.list.push({taskHeader: true, num: '"' + field.model + '" Task Decomposition', text: 'The following section will ask you questions about the tasks in this module to help you break them down. You may exit this survey at any time.', fields: []});
						$rootScope.list.push({num: 'Question 1', text: 'Do you know how to complete this module?', feedsNext: 'taskModuleDifficulty', fields: [{type: 'radio', model: 'No', options: ['No', 'Yes']}]});
						$rootScope.list.push({num: 'Question 2', text: 'How many tasks are there in this module?', fed: 'No', prevFed: 'No', feedsNext: 'taskNames', fields: [{type: 'select', model: '1', label: 'Tasks', options: ['1', '2', '3', '4', '5']}]});
						$rootScope.list.push({num: 'Question 3', text: 'What are the names of these tasks?', fed: 0, prevFed: 0, feedsNext: 'timeEstimates', fields: [{type: 'text', placeholder: 'Task name', model: ''}]});
						$rootScope.list.push({num: 'Question 4', text: 'Do you now know how to complete this module given the tasks you listed?', fields: [{type: 'radio', model: 'No', options: ['No', 'Yes']}]});
						$rootScope.list.push({num: 'Question 5', text: 'Estimate how long it will take you to complete each task:', fields: [{type: 'timeEstimate', label: '', model: [1, 0]}]});
					}
				}
			} else if ($rootScope.list[$rootScope.i].feedsNext == 'taskModuleDifficulty') {		
				//Check if the user knows how to complete this module
				$rootScope.list[$rootScope.i+1].fed = $rootScope.list[$rootScope.i].fields[0].model;
				if ($rootScope.list[$rootScope.i+1].prevFed != $rootScope.list[$rootScope.i+1].fed) {
					//If the user does or doesn't know how to complete the model, do or do not ask them questions about task difficulty
					if ($rootScope.list[$rootScope.i+1].fed == 'No') {
						$rootScope.list[$rootScope.i + 3].num = 'Question 5';
						$rootScope.list.splice($rootScope.i + 3, 0, {num: 'Question 4', text: 'Do you now know how to complete this module given the tasks you listed?', fields: [{type: 'radio', model: 'No', options: ['No', 'Yes']}]});
					} else {
						$rootScope.list.splice($rootScope.i + 3, 1);
						$rootScope.list[$rootScope.i + 3].num = 'Question 4';
					}
				}
			} else if ($rootScope.list[$rootScope.i].feedsNext == 'taskNames') {
				//If the number of tasks has changed, clear all fields and rebuild them for the appropriate number of tasks
				var field = $rootScope.question.fields[0];
				$rootScope.list[$rootScope.i+1].fed = parseInt(field.model);
				if ($rootScope.list[$rootScope.i+1].prevFed != $rootScope.list[$rootScope.i+1].fed) {
					$rootScope.list[$rootScope.i+1].fields = [];
					$rootScope.list[$rootScope.i+2].fields = [];
					if ($rootScope.list[$rootScope.i].fed == 'No') {
						$rootScope.list[$rootScope.i+2].fields = [{type: 'radio', model: 'No', options: ['No', 'Yes']}];
						$rootScope.list[$rootScope.i+3].fields = [];
					}
					for (var j = 0; j < $rootScope.list[$rootScope.i+1].fed; j++) {
						$rootScope.list[$rootScope.i+1].fields.push({type: 'text', placeholder: 'Task name', model: ''});
						if ($rootScope.list[$rootScope.i].fed == 'No') {
							$rootScope.list[$rootScope.i+3].fields.push({type: 'timeEstimate', label: '', model: [1, 0]});
						} else {
							$rootScope.list[$rootScope.i+2].fields.push({type: 'timeEstimate', label: '', model: [1, 0]});
						}
					}
				}
			} else if ($rootScope.list[$rootScope.i].feedsNext == 'timeEstimates') {
				//Change labels to match user input for task time estimates
				var j = $rootScope.i + 1
				if ($rootScope.list[$rootScope.i-1].fed == 'No') j++;
	
				for (var k in $rootScope.list[$rootScope.i].fields) {
					$rootScope.list[j].fields[k].label = $rootScope.list[$rootScope.i].fields[k].model;
				}
			}
		}

		$rootScope.i++;
		$rootScope.question = $rootScope.list[$rootScope.i];
		$scope.saveProgress();
		console.log($rootScope.list);
	}

	$scope.prev = function() {
		$scope.changeFedModels();

		$rootScope.i--;
		$rootScope.question = $rootScope.list[$rootScope.i];
		$scope.saveProgress();
	}

	$scope.finish = function() {
		UIkit.modal("#questionnaireModal").hide();
		$scope.saveProgress();
		$rootScope.i++;
	}

	$scope.saveProgress = function() {
		$http.post('taskDecompStore', {'list': $rootScope.list, 'i': $rootScope.i}).then(function(res) {
		},function(err){
		});
	}

	$scope.changeFedModels = function() {
		//Change variables for items where the previously fed and currently fed items need to be kept track of
		if ($rootScope.question.feedsNext == 'moduleNames' || 
			$rootScope.question.feedsNext == 'moduleDifficulty' ||
			$rootScope.question.feedsNext == 'taskNames' ||
			$rootScope.question.feedsNext == 'taskDifficulty' || 
			$rootScope.question.feedsNext == 'taskModuleDifficulty') {
			$rootScope.list[$rootScope.i+1].prevFed = $rootScope.list[$rootScope.i+1].fed;
		}
	}

	$scope.getList = function() {
		$http.get('taskDecompRetrieve').then(function(res) {
			$rootScope.list = res.data.list;
			$rootScope.i = res.data.i;
			$rootScope.question = $rootScope.list[$rootScope.i];

			//Convert stringified date entries to Date objects
			for (var entry of $rootScope.list)
				for (var field of entry.fields)
					if (field.type == 'date')
						field.model = new Date(field.model);		
		},function(err){
		});
		UIkit.modal("#questionnaireModal").show();
		console.log($rootScope.list);
		console.log($rootScope.i);
		console.log($rootScope.question);	
	}
});