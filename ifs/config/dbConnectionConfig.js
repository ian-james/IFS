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
        'user' :                        'root',
        'password' :                    'mysqlRootPassword',
        'connectionLimit':              5000
    },
    // database name
    'database':                         'IFS',
};
