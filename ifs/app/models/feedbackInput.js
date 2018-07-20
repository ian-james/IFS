const { Model } = require('objection');

class FeedbackInput extends Model {
  /* Name getter */
  static get tableName() {
    return 'feedback_input';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');
    const { Feedback } = require('./feedback');
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'feedback_input.userId',
          to: 'user.id'
        },
      },
      feedback: {
        relation: Model.BelongsToOneRelation,
        modelClass: Feedback,
        join: {
          from: 'feedback_input.feedbackId',
          to: 'feedback.id'
        }
      }
    };
  };
};

module.exports = FeedbackInput;