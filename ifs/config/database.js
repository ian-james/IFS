module.exports = {
    'connection': {
        'host' : 'localhost',
        'user' : 'root',
        'password' : 'mysqlRootPassword',
    },
    'database' :  'IFS',
    'users_table' : 'users',
    'raw_feedback_table' : 'rawFeedback',
    'survey_table': 'survey',
    'survey_results_table': 'surveyResult',
    'feedback_table':'feedback',
    'users_interation_table': 'usersInteraction',
    'preferences_table': 'preferences'
};

var mysql = require('mysql');

/*
var pool = mysql.createPool( {
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'mysqlRootPassword',
    database: 'IFS',
    debug: false
});

module.exports = function( app) {

    function handleDatabase( req, res ) {

        pool.getConnection( function(err,connection ) {
            if(err ) {
                connection.release();
                res.json({"code":100, "status": "Error in connection database"});
                return;
            }

            console.log("connected as id " + connection.threadId);

            connection.query("select * from user", function (err, rows) {
                connection.release();
                if(!err) {
                    res.json(rows);
                }
            });

            connection.on( 'error' , function (err ) {
                res.json({"code":100, "status": "Error in connection database"});
                return;
            });
        });
    }

    app.get('/',function(req,res){
        handle_database(req,res);
    });


};

*/