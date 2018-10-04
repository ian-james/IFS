var _ = require('lodash');

module.exports = {
  /**
   * Information is stored to quickly create survey information
   * This information shouldn't change unless a new survey is added.
   * @return {[type]} [description]
   */
  getStaticSurveyData: () => {
    //Note Survey Questions is not part of the survey database, its parts of question databasde
    // Thus it's last in the allData variable, so it can be easily extracted.
    var surveyNames = ["CPSEPS","GSE","SEWS", "AGQ", "OSE", "SCEQ", "GRIT"];
    var surveyAuthors = ["Unknown", "Unknown","Unknown","Unknown","Unknown","Unknown","Unknown"];
    var surveyTitle = ["Computer Programming Self-Efficacy Survey",
                       "General Self-Efficacy Survey",
                       "Self-Efficacy Writing Scale",
                       "Achievement Goal Questionnaire",
                       "Online Student Engagement Scale",
                       "Student Course Engagement Questionnaire",
                       "GRIT"];
    var surveyQuestions = ["data/surveys/CPSEPS.json", "data/surveys/GSE.json",
                        "data/surveys/SEWS.json", "data/surveys/AGQ.json",
                        "data/surveys/OSE.json", "data/surveys/SCEQ.json",
                        "data/surveys/GRIT.json" ];
    var numQs = [28,10,16,12, 19,23,8];
    var field = ["programming", "general", "writing", "general","general", "general", "general"];
    var freq = ['reg','reg','reg','set', 'reg', 'set',"set"];
    var surveyFiles = [ "data/surveys/surveyCPSEPS.json", "data/surveys/surveyGSE.json",
                        "data/surveys/surveySEWS.json", "data/surveys/surveyAGQ.json",
                        "data/surveys/surveyOSE.json", "data/surveys/surveySCEQ.json",
                        "data/surveys/surveyGRIT.json" ];
    var allData = _.zip(surveyNames, surveyAuthors, surveyTitle,numQs,field,freq, surveyFiles, surveyQuestions);
    return allData;
  }
};
