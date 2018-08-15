const { Model } = require('objection');

class ClassChoices extends Model {
  /* Name getter */
  static get tableName() {
    return 'class_choices';
  }
};

module.exports = FeedbackInput;