app.directive( 'questionDirective', function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            questiondata:'=',
            bulletid:'=',
        },
        templateUrl: "components/Survey/question.pug",
        controller: "surveyCtrl",
        link: function( scope, element, attrs ) {
            //Todo
        }
    };
});
