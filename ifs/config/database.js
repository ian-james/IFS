module.exports = {
    'connection': {
        'host' : 'localhost',
        'user' : 'root',
        'password' : 'mysqlRootPassword',
    },
    'database' :  "IFS",
    'users_table' : "users",
    'raw_feedback_table' : 'rawFeedback'
};

/*var mysql = require('mysql');

var connection  = mysql.createConnection( {
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'mysqlRootPassword',
    database: 'users',
    'users_table': 'users'
});
*/


/*
connection.connect( function(err) {
    if( !err ) {
        console.log("Database is connected ... \n\n");
    }
    else {
        console.log("Error connecting to database. \n\n");   
    }
})



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
*/
