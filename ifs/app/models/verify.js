const { Model } = require('objection');

class Verify extends Model {
  /* Name getter */
  static get tableName() {
    return 'verify';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'verify.userId',
          to: 'user.id'
        },
      },
    };
  };
};

module.exports = Verify;