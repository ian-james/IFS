const { Model } = require('objection');
const _ = require('lodash');

class Survey extends Model {
  /* Name getter */
  static get tableName() {
    return 'survey';
  }
  /* Relationships */
  static get relationMappings() {
    const { Question } = require('./question');
    const { SurveyResult } = require('./surveyResult');
    const { SurveyPreference } = require('./surveyPreference');
    const { ClassSurvey } = require('./classSurvey');

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
      },
      classes: {
        relation: Model.HasManyRelation,
        modelClass: ClassSurvey,
        join: {
          from: 'survey.id',
          to: 'class_survey.surveyId'
        }
      }
    };
  };
};

const getAvailableSurveys = async (studentId) => {
  const surveys = await Survey.query()
    .select(['survey.title', 'survey.id', 'survey_preferences.lastRevision', 'survey_preferences.currentSurveyIndex'])
    .whereIn('survey.id', (builder) => {
      builder.select('surveyId')
        .from('class_survey')
        .whereIn('classId', (b) => {
          b.select('classId')
            .from('student_class')
            .where('student_class.studentId', studentId);
        })
    })
    .leftJoin('survey_preferences', 'survey.id', 'survey_preferences.surveyId')
    .where('survey_preferences.userId', '=',  studentId );
  return surveys;
}

const getPulseSurveyState = async (studentId, toolType) => {
  const surveys = await Survey.query()
    .select(['survey.id', 'survey.title', 'survey.totalQuestions', 'survey_preferences.lastRevision', 'survey_preferences.lastIndex', 'survey_preferences.currentIndex'])
    .whereIn('survey.surveyField', [toolType, 'general'])
    .andWhere('survey.surveyFreq', 'reg')
    .leftJoin('survey_preferences', 'survey.id', 'survey_preferences.surveyId')
    .where('survey_preferences.userId', '=',  studentId );
  const unfinishedSurveys = _.filter(surveys, (survey) => {
    return survey.currentIndex < survey.lastIndex;
  });
  return unfinishedSurveys;
}

module.exports.Survey = Survey;
module.exports.getAvailableSurveys = getAvailableSurveys;
module.exports.getPulseSurveyState = getPulseSurveyState;
