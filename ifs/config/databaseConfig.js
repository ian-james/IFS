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
    //
    // database must match dbConnectionConfig
    'database':                         'IFS',

    // databse tables
    // All users
    'users_table':                      'users',
    'role_table':                       'roles',
    'user_role_table':                  'user_role',
    'preferences_table':                'preferences',
    'login_table':                      'login',

    // Registration
    'user_registration_table':          'user_registration',
    'verify_table':                     'verify',

    // Skills
    'skills_table':                     'skills',

    // Class
    'student_table':                    'student',
    'class_table':                      'class',
    'student_class_table':              'student_class',
    'class_skill_table':                'class_skill',
    'student_skill_table':              'student_skill',
    'upcoming_event_table':             'upcoming_event',
    'class_choices_table':              'class_choices',
    'class_options_table':              'class_options',

    // Assignments
    'assignment_table':                 'assignment',
    'assignment_task_table':            'assignment_task',
    'assignment_options_table':         'assignment_options',
    'assignment_choices_table':         'assignment_choices',
    'student_assignment_task_table':    'student_assignment_task',

    // Surveys
    'survey_table':                     'survey',
    'survey_results_table':             'survey_result',
    'survey_preferences_table':         'survey_preferences',
    'question_table':                   'questions',

    // Feedback
    'feedback_table':                   'feedback',
    'feedback_interaction_table':       'feedback_interactions',

    // Interactions
    'users_interation_table':           'user_interactions',
    'user_feedback_table':              'user_feedback',
    'submission_table':                 'submission',

    // feedback stats and ratings
    'feedback_stats_table':             'feedback_stats',
    'feedback_rating_table':            'feedback_rating',
    'feedback_input_table':             'feedback_input',
    'ifs_tips_table':                   'ifs_tips',

    // Announcements
    'announcements_table':              'announcements',
    'announcement_exposure_table':       'announcement_exposure'
};