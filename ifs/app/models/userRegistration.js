const { Model } = require('objection');

class UserRegistration extends Model {
  /* Name getter */
  static get tableName() {
    return 'user_registration';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_registration.userId',
          to: 'user.id'
        },
      },
    };
  };
};

module.exports = UserRegistration;