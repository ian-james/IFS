const { Model } = require('objection');

class Survey extends Model {
  /* Name getter */
  static get tableName() {
    return 'survey';
  }
  /* Relationships */
  static get relationMappings() {
    const { Question } = require('./question');
    const { SurveyResult } = require('./surveyResult');
    const SurveyPreference = require('./surveyPreference');

    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        filter: query => query.select('id', 'surveyId', 'text'),
        join: {
          from: 'survey.id',
          to: 'questions.surveyId'
        },
      },
      results: {
        relation: Model.HasManyRelation,
        modelClass: SurveyResult,
        join: {
          from: 'survey.id',
          to: 'survey_result.surveyId'
        }
      },
      preferences: {
        relation: Model.HasManyRelation,
        modelClass: SurveyPreference,
        join: {
          from: 'survey.id',
          to: 'survey_preferences.surveyId'
        }
      }
    };
  };
};

const getAvailableSurveys = async () => {
  const surveys = await Survey.query()
    .where('allowedToAsk', true);
  return surveys;
}

module.exports.Survey = Survey;
module.exports.getAvailableSurveys = getAvailableSurveys;


