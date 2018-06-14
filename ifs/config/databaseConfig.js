/**
 * @file databaseConfig.js
 * @brief This file contains the configuration to be used for the host
 *        system's mysql server. IFS database and table names are configuable
 *        here.
 **/
module.exports = {
    // database user authentication
    // WARNING: the password here is stored in plain-text. It is recommended
    // that the database user has permissions restricted only to access and
    // modify the database specified below.
    'connection': {
        'host' :                        'localhost',
        'user' :                        'root',
        'password' :                    'mysqlRootPassword',
        'connectionLimit':              500
    },
    // database name
    'database':                         'IFS',

    // databse tables
    'users_table':                      'users',
    'user_registration_table':          'user_registration',
    'verify_table':                     'verify',
    'survey_table':                     'survey',
    'survey_results_table':             'survey_result',
    'survey_preferences_table':         'survey_preferences',
    'feedback_table':                   'feedback',
    'feedback_interaction_table':       'feedback_interactions',
    'users_interation_table':           'user_interactions',
    'user_feedback_table':              'user_feedback',
    'preferences_table':                'preferences',
    'question_table':                   'questions',
    'submission_table':                 'submission',
    'student_table':                    'student',
    'class_table':                      'class',
    'student_class_table':              'student_class',
    'assignment_table':                 'assignment',
    'class_skill_table':                'class_skill',
    'student_skill_table':              'student_skill',
    'upcoming_event_table':             'upcoming_event',
    'role_table':                       'roles',
    'user_role_table':                  'user_role',
    'feedback_stats_table':             'feedback_stats',
    'assignment_task_table':            'assignment_task',
    'student_assignment_task_table':    'student_assignment_task',
    'feedback_rating_table':            'feedback_rating',
    'feedback_input_table':             'feedback_input',
    'ifs_tips_table':                   'ifs_tips',
};
