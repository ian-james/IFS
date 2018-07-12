const path = require('path');
const SurveyBuilder = require(path.join(__components, 'Survey/helpers/surveyBuilder'));


/* Specific format for matrix questions serialization */
let matrixRowSerializer = (row) => {
  return ({"value": row.id.toString(), "text": row.text});
}

let serialized = (surveyMeta, surveyQuestions, serializer) => {
  const template = SurveyBuilder.buildDefaultSurveyData(surveyMeta);
  const page = SurveyBuilder.buildMatrixSurvey(surveyMeta);

  for (let question of surveyQuestions) {
    const row = serializer(question);
    page.questions[0].rows.push(row);
  }
  template.pages[0] = page;
  return template;
};



module.exports.serializeSurvey = serialized;
module.exports.matrixSerializer = matrixRowSerializer;
//module.exports.pulseSurvey = getPulseSurveySerialized;