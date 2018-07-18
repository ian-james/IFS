const { Model } = require('objection');

class Course extends Model {
  /* Name getter */
  static get tableName() {
    return 'class';
  }
};

module.exports = Course;