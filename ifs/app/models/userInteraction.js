const { Model } = require('objection');

class UserInteraction extends Model {
  /* Name getter */
  static get tableName() {
    return 'user_interactions';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_interactions.userId',
          to: 'users.id'
        },
      },
    };
  };
};

module.exports = UserInteraction;