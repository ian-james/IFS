const { Model } = require('objection');

class Submission extends Model {
  /* Name getter */
  static get tableName() {
    return 'submission';
  }
  /* Relationships */ 
  static get relationMappings() {
    const { Feedback } = require('./feedback');
    const { FeedbackInteraction } = require('./feedbackInteraction');
    const { FeedbackStat } = require('./feedbackStat');
    const { User } = require('./user');

    return {
      feedback: {
        relation: Model.HasManyRelation,
        modelClass: Feedback,
        join: {
          from: 'submission.id',
          to: 'feedback.submissionId'
        },
      },
      interactions: {
        relation: Model.HasManyRelation,
        modelClass: FeedbackInteraction,
        join: {
          from: 'submission.id',
          to: 'feedback_interactions.submissionId'
        },
      },
      stats: {
        relation: Model.HasManyRelation,
        modelClass: FeedbackStat,
        join: {
          from: 'submission.id',
          to: 'feedback_stats.submissionId'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'submission.userId',
          to: 'user.id'
        }
      }
    }
  };
}

module.exports = Submission;