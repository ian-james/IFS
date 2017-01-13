
app.controller( "toolCtrl", function($scope) {
    $scope.toolName = "Tim the Tool man";
    $scope.tool = {
        "toolName": "cppCheck",
        "options": [
            {
                "displayName": "add C99",
                "type": "checkbox",
            },
            {
                "displayName": "add Another Type",
                "type": "text",
            },
            {
                "displayName": "Select Button",
                "type": "select",
                "values": [ 'ansi/c89', 'c99','c11','gnu11' ]
            }
        ]
        
    };
});