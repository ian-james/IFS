const { Model } = require('objection');

class Login extends Model {
  /* Name getter */
  static get tableName() {
    return 'login';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'login.userId',
          to: 'user.id'
        },
      },
    };
  };
};

module.exports = Login;