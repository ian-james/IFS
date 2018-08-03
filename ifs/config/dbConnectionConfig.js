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
        'host' :                        '127.0.0.1',
        'user' :                        'IFS',
        'password' :                    'IFSPASS',
        'connectionLimit':              500
    },
    // database name
    'database':                         'IFS',
};
