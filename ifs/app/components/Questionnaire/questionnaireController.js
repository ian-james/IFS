var i = 0;

var list = [
	{num: 'Question 1', text: 'What is the name of the assignment?', fields: [{type: 'text', placeholder: 'Assignment 1', model: ''}]},
	{num: 'Question 2', text: 'When is the assignment due?', fields: [{type: 'date', model: ''}]},
	{num: 'Question 3', text: 'How comfortable are you with this assignment?', fields: [{type: 'radio', model: 'Low', options: ['Low', 'Medium', 'High']}]}
];

app.controller("questionnaireCtrl", function($scope, $http) {
	$scope.modalTitle = "Task Decomposition"
	$scope.question = list[i];

	$scope.next = function() {
		//Ensure we don't go out of bounds
		if (i+1 > list.length-1) {
			console.log($scope);
			return;
		}

		i++;
		$scope.question = list[i];
		$scope.saveProgress();
	}

	$scope.prev = function() {
		console.log($scope);

		//Ensure we don't go out of bounds
		if (i-1 < 0) return;

		i--;
		$scope.question = list[i];
		$scope.saveProgress();
	}

	$scope.saveProgress = function() {

	}

	$http.get('taskDecompBaseRetrieve').then(function(res) {
		console.log(res.data);
	})
});