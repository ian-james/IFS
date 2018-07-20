const { Model } = require('objection');

class FeedbackRating extends Model {
  /* Name getter */
  static get tableName() {
    return 'feedback_rating';
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
          from: 'feedback_ratings.userId',
          to: 'user.id'
        },
      },
      feedback: {
        relation: Model.BelongsToOneRelation,
        modelClass: Feedback,
        join: {
          from: 'feedback_ratings.feedbackId',
          to: 'feedback.id'
        }
      }
    };
  };
};

module.exports = FeedbackRating;