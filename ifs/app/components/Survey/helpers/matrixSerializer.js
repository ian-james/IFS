
/**
* Default parameters for our surveys, add more as necessary.
* @param  {[type]} surveyData [description]
* @return {[type]}            [description]
*/
let buildMatrixSurvey = (surveyData) => {
  return {
    "questions": [
        {
            "type": "matrix",
            "name": surveyData[0].surveyName || "NAME-ME",
            "title": surveyData[0].title || "Title-Me",
            "columns": [
                { "value": 1, "text": "Strongly Disagree" },
                { "value": 2, "text": "Disagree" },
                { "value": 3, "text": "Neutral" },
                { "value": 4, "text": "Agree" },
                { "value": 5, "text": "Strongly Agree" }
            ],
            "rows": []
        }
    ]
  };
};

/**
 * Default parameters for our surveys, add more as necessary.
 * @param  {[type]} surveyData [description]
 * @return {[type]}            [description]
 */
let buildDefaultSurveyData = (surveyData) => {
  return {
      "title": surveyData[0].title,
      "showProgressBar": "bottom",
      "goNextPageAutomatic": false,
      "showNavigationButtons": true,
      "pages":[]
  };
}

/* Specific format for matrix questions serialization */
let matrixRowSerializer = (row) => {
  return ({"value": row.id.toString(), "text": row.text});
}

let serialize = (surveyMeta, surveyQuestions, serializer) => {
  const template = buildDefaultSurveyData(surveyMeta);
  const page = buildMatrixSurvey(surveyMeta);

  for (let question of surveyQuestions) {
    const row = serializer(question);
    page.questions[0].rows.push(row);
  }
  template.pages[0] = page;
  return template;
};

module.exports.serializeSurvey = serialize;
module.exports.matrixSerializer = matrixRowSerializer;
