/* ToolController -
        Tool Controller includes a 2nd route /tool/data for collecting information in this controller
        The main route /tool is server side in toolRoutes.js
*/
app.controller( "surveyCtrl", function($scope, $http) {
    
    $scope.questionList = [{
        'text': "This is the first question that needs to be answered.",
        'type': 'text',
        'typeData': {
            'placeholder':"Describe your experience",
            'name':'textboxTst'
        },
        'footer': 'This goes in the end section'
    },
    {
        'text': "Second Question",
        'type': 'radio',
        'typeData': {
            'placeholder':"Describe your experience",
            'name':'radioTst'
        },
        'footer': 'This goes in the end section'
    },
     {
        'text': "Third Question",
        'type': 'checkbox',
        'typeData': {
            'placeholder':"Describe your experience",
            'name':'checkboxTst'
        },
        'footer': 'This goes in the end section'
    }];
    
});