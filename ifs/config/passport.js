var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');

var connection = mysql.createConnection( dbconfig.connection );

connection.connect( function(err) {
    if(err) {
        console.log('error connecting: ' + err.stack );
    }
    else {
        console.log("Connected on id " + connection.threadId );
        // Tell mysql to use the database
        connection.query ('USE ' + dbconfig.database );
    }
});



module.exports = function (passport) {

    console.log("Adding ")

    passport.serializeUser ( function(user,done) {
        done(null, user.id);
    });

    passport.deserializeUser( function(id,done) {
        connection.query( "SELECT * FROM users where id = ? ", [id], function(err,rows) {
            done( err, rows[0]);
        });
    });

    // This is the initialized of the local-signup strategy used by passport, it calls this callback upcon
    // an attempted signup, basically just hashes password and tries to insert new user.
    passport.use( 'local-signup',
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField : 'password',
                passReqToCallback : true
            },
            function (req, username, password, done ) {

                console.log("Trying Local Loggin");

                connection.query("SELECT * FROM users WHERE username = ?", [username], function(err,rows) {
                    if(err)
                    {
                        console.log( err );
                        return done(err);
                    }

                    if(rows.length) {
                        console.log(" Nothing Found", rows[0]);
                        return done( null, false );//, req.flash('signupMessage', 'That user is already taken'));                    
                    }
                    else{
                        console.log("INSIDE ADD");
                        var newUser = { 
                            username: username,
                            password: bcrypt.hashSync( password, null, null )
                        };

                        var insertQuery = "INSERT INTO users (username, password) values (?,?)";

                        connection.query( insertQuery,[newUser.username, newUser.password], function(err,rows) {
                            newUser.id = rows.insertId;
                            return done(null, newUser);
                        });
                    }// Else
                });// QUery
            } // Function
        )
    );


    // This is the initialized of the local-login strategy used by passport, it calls this callback upcon
    // an attempted login, basically a simple check to see if user exists.
    passport.use( 'local-login',
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField : 'password',
                passReqToCallback : true
            },
            function (req, username, password, done ) {

                console.log("Trying Local Loggin");

                connection.query("SELECT * FROM users WHERE username = ?", [username], function(err,rows) {
                    if(err) {
                        return done(err);
                    }

                    if(!rows.length) {
                        return done( null, false); //req.flash('signupMessage', 'User not found!'));
                    }

                    if( !bcrypt.compareSync(password, rows[0].password))
                        return done( null, false);// req.flash('loginMessage', 'Incorrect password'));

                    return done(null, rows[0]);
                });
            }
        )
    );

};