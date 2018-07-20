const { Model } = require('objection');

class Preferences extends Model {
  /* Name getter */
  static get tableName() {
    return 'preferences';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'preferences.userId',
          to: 'user.id'
        },
      },
    };
  };
};

module.exports = Preferences;