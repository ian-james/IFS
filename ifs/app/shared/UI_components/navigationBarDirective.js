app.directive( 'navbarDirective', function() {
    return {
        restrict: "E",
        scope: {
            loggedIn:'='
        },
        templateUrl: "shared/UI_components/navigationBar.pug",
        link: function( scope, element, attrs ) {
        }
    };
})