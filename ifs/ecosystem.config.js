module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */

  /**
   * This file manage the IFS project in development and production.
   * Settings impact both development and production so tests both.
   */
  apps : [

    // First application
    {
      name      : 'IFS',
      script    : './config/index.js',
      instances: 0,
      exec_mode: "cluster",
      watch: true,
      increment_var: "PORT",
      env: {
        COMMON_VARIABLE: 'true'
      },
      env: {
        NODE_ENV: 'development',
        "PORT": 3000
      },
      env_production : {
        NODE_ENV: 'production',
        "PORT": 80
      },
      watch_delay: 1000,
      ignore_watch : ["node_modules", "data", "uploads", "logs",  "tests", "tools", "users", "app/shared/img/user"],
      watch_options: {
        "followSymlinks": false
      }
    }
  ]
};
