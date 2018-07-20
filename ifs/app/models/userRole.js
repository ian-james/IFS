const { Model } = require('objection');

class UserRole extends Model {
  /* Name getter */
  static get tableName() {
    return 'user_role';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');
    const { Role } = require('./role');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_role.userId',
          to: 'user.id'
        },
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'user_role.roleId',
          to: 'role.id'
        }
      }
    };
  };
};

module.exports = UserRole;