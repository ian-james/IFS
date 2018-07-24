const { Model } = require('objection');

class FeedbackInteraction extends Model {
  /* Name getter */
  static get tableName() {
    return 'feedback_interactions';
  }
  /* Relationships */ 
  static get relationMappings() {
    const { User } = require('./user');
    const { Submission } = require('./submission');
    const { Feedback } = require('./feedback');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'feedback_interactions.userId',
          to: 'user.id'
        },
      },
      submission: {
        relation: Model.BelongsToOneRelation,
        modelClass: Submission,
        join: {
          from: 'feedback_interactions.submissionId',
          to: 'submission.id'
        },
      },
      feedback: {
        relation: Model.BelongsToOneRelation,
        modelClass: Feedback,
        join: {
          from: 'feedback_interactions.feedbackId',
          to: 'feedback.id'
        },
      },
    }
  }
}

module.exports = FeedbackInteraction;