const { Model } = require('objection');

class Roles extends Model {
  /* Name getter */
  static get tableName() {
    return 'roles';
  }
  static get relationMappings() {
    const { UserRole } = require('./user');

    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: UserRole,
        join: {
          from: 'role.id',
          to: 'user_role.roleId'
        },
      },
    }
  }
};

module.exports = Roles;