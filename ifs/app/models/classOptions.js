const { Model } = require('objection');

class ClassOptions extends Model {
  /* Name getter */
  static get tableName() {
    return 'class_options';
  }
};

module.exports = FeedbackInput;