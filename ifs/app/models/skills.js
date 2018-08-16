const { Model } = require('objection');

class ClassOptions extends Model {
  /* Name getter */
  static get tableName() {
    return 'skills';
  }
};

module.exports = FeedbackInput;