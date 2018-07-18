const { Model } = require('objection');

class User extends Model {
  /* Name getter */
  static get tableName() {
    return 'users';
  }
};

module.exports = User;