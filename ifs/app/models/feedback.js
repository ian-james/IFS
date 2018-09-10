const { Model } = require('objection');

class Feedback extends Model {
  /* Name getter */
  static get tableName() {
    return 'feedback';
  }
  /* Relationships */
  static get relationMappings() {
    const { User } = require('./user');
    const { Submission } = require('./submission');
    const { FeedbackInput } = require('./feedbackInput');
    const { FeedbackInteraction } = require('./feedbackInteraction');
    const { FeedbackRating } = require('./feedbackRating');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'feedback.userId',
          to: 'users.id'
        },
      },
      submission: {
        relation: Model.BelongsToOneRelation,
        modelClass: Submission,
        join: {
          from: 'feedback.submissionId',
          to: 'submission.id'
        },
      },
      inputs: {
        relation: Model.HasManyRelation,
        modelClass: FeedbackInput,
        join: {
          from: 'feedback.id',
          to: 'feedback_input.feedbackId'
        },
      },
      interactions: {
        relation: Model.HasManyRelation,
        modelClass: FeedbackInteraction,
        join: {
          from: 'feedback.id',
          to: 'feedback_interactions.feedbackId'
        }
      },
      ratings: {
        relation: Model.HasManyRelation,
        modelClass: FeedbackRating,
        join: {
          from: 'feedback.id',
          to: 'feedback_ratings.feedbackId'
        } 
      }
    };
  };
};

module.exports.Feedback = Feedback;