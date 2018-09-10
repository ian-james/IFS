const { Model } = require('objection');

class AssignmentOptions extends Model {
  /* Name getter */
  static get tableName() {
    return 'assignment_options';
  }
};

module.exports = FeedbackInput;