var _. require('lodash');

module.exports = function (app) { 

    /* This function will pre-catch all calls to the server 
       and keep track of basic usage stats.
    */

    app.get('/', function(req,res, next) {

        if( req.user && req.isAuthenticated())
        {
            console.log("session", req.user );
            var pickReq = ['originalUrl','baseUrl','path','params.name','body'];
            var pickUser = ['username'];
            var date = Date.now();
            //TODO In Progress, just collecting informatioon about what we might want
            // to observe per submission.
        }

        next();
    });

}