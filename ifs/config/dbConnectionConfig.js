/**
 * @file databaseConfig.js
 * @brief This file contains the configuration to be used for the host
 *        system's mysql server. IFS database and table names are configuable
 *        here.
 **/
module.exports = {
    // database user authentication
    // WARNING: the password here is stored in plain-text. It is recommended
    // that the database user has permissions restricted only to access and
    // modify the database specified below.
    'connection': {
        'host' :                        'localhost',
<<<<<<< HEAD
        'user' :                        'root',
        'password' :                    'cowscows',
=======
        'user' :                        'USER',
        'password' :                    'PASSWORD',
>>>>>>> a153b373a4bbf7390b88e10e12b57e0ee61acf82
        'connectionLimit':              500
    },
    // database name
    'database':                         'IFS',
};
