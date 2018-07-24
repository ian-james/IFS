const { Model } = require('objection');

class FeedbackStats extends Model {
  /* Name getter */
  static get tableName() {
    return 'feedback_stats';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');
    const { Submission } = require('./submission');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'feedback_stats.userId',
          to: 'user.id'
        },
      },
      submission: {
        relation: Model.BelongsToOneRelation,
        modelClass: Submission,
        join: {
          from: 'feedback_stats.submissionId',
          to: 'submission.id'
        }
      }
    };
  };
};

module.exports = FeedbackStats;