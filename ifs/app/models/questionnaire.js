const { Model } = require('objection');

class Questionnaire extends Model {
  /* Name getter */
  static get tableName() {
    return 'questionnaire';
  }
};

module.exports = Questionnaire;