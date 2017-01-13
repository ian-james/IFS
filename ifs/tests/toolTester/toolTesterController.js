ngApp.controller('toolController', [$'http', function($http){
    var thisCtrl = this;

    this.getData = function( filename ) {
        this.route = filename;
        $http.get(thisCtrl.route )
    }

}]);
