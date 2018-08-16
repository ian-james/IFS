const { Model } = require('objection');

class ClassSurvey extends Model {
  /* Name getter */
  static get tableName() {
    return 'class_survey';
  }
  /* Relationships */
  static get relationMappings() {
    const { Survey } = require('./survey');
    const { Course } = require('./course');

    return {
      survey: {
        relation: Model.BelongsToOneRelation,
        modelClass: Survey,
        join: {
          from: 'class_survey.surveyId',
          to: 'survey.id'
        },
      },
      class: {
        relation: Model.BelongsToOneRelation,
        modelClass: Course,
        join: {
          from: 'class_survey.classId',
          to: 'class.id'
        },
      },
    };
  };
};

module.exports.ClassSurvey = ClassSurvey;