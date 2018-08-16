const { Model } = require('objection');

class AssignmentChoices extends Model {
  /* Name getter */
  static get tableName() {
    return 'assignment_choices';
  }
};

module.exports = FeedbackInput;