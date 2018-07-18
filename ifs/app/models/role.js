const { Model } = require('objection');

class Roles extends Model {
  /* Name getter */
  static get tableName() {
    return 'roles';
  }
};

module.exports = Roles;