const { Model } = require('objection');

class User extends Model {
  /* Name getter */
  static get tableName() {
    return 'users';
  }
  /* Mother of all relationships - user touches everything */
  static get relationMappings() {
    
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_interactions.userId',
          to: 'user.id'
        },
      },
    };
  };
};

module.exports.User = User;