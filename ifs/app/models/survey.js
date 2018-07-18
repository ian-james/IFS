const { Model } = require('objection');

class Survey extends Model {
  /* Name getter */
  static get tableName() {
    return 'survey';
  }
};

module.exports = Survey;