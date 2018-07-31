// Update with your config settings.
const dbcfg = require('./config/dbConnectionConfig');

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: dbcfg.database,
      user: dbcfg.connection.user,
      password: dbcfg.connection.password
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: dbcfg.database,
      user: dbcfg.connection.user,
      password: dbcfg.connection.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: dbcfg.database,
      user: dbcfg.connection.user,
      password: dbcfg.connection.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
