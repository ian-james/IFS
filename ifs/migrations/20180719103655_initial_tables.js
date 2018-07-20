const dbcfg = require('../config/databaseConfig');

exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable(dbcfg.assignment_table, (t) => {
      t.increments('id').primary()
      t.integer('classId').unsigned().notNull()
      t.string('name')
      t.string('title')
      t.string('description')
      t.dateTime('deadline').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.assignment_task_table, (t) => {
      t.increments('id').primary()
      t.integer('assignmentId').unsigned().notNull()
      t.string('name').defaultTo(null)
      t.string('description').defaultTo(null)
    }),

    knex.schema.createTable(dbcfg.class_table, (t) => {
      t.increments('id').primary()
      t.string('code', 40).notNull()
      t.string('name').defaultTo(null)
      t.string('description').defaultTo(null)
      t.enu('disciplineType', ['computer science', 'psychology', 'other'])
    }),

    knex.schema.createTable(dbcfg.class_skill_table, (t) => {
      t.increments('id').primary()
      t.integer('classId').unsigned()
      t.integer('assignmentId').unsigned()
      t.string('name').defaultTo(null)
      t.string('description').defaultTo(null)
    }),

    knex.schema.createTable(dbcfg.ifs_tips_table, (t) => {
      t.increments('id').primary()
      t.string('name').defaultTo(null)
      t.string('description').defaultTo(null)
    }),

    knex.schema.createTable(dbcfg.login_table, (t) => {
      t.increments('id').primary();
      t.integer('userId').notNull();
      t.integer('sessionId').notNull();
      t.timestamp('timestamp').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.preferences_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.string('toolType', 60).notNull()
      t.string('toolName', 60).notNull()
      t.string('toolValue').notNull()
    }),

    knex.schema.createTable(dbcfg.question_table, (t) => {
      t.increments('id').primary()
      t.integer('surveyId').unsigned().notNull()
      t.specificType('language', 'char(10)').notNull()
      t.integer('origOrder').unsigned().notNull()
      t.string('text').notNull()
      t.string('visualFile')
      t.enu('type', ['matrix', 'rating', 'text', 'radiogroup'])
    }),

    knex.schema.createTable(dbcfg.role_table, (t) => {
      t.increments('id').primary()
      t.string('role', 40).defaultTo('student').notNull()
    }),

    knex.schema.createTable(dbcfg.student_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.text('name');
      t.text('bio')
    }),

    knex.schema.createTable(dbcfg.student_assignment_task_table, (t) => {
      t.increments('id').primary()
      t.integer('studentId').unsigned().notNull()
      t.integer('assignmentTaskId').unsigned().notNull()
      t.boolean('isComplete').defaultTo(0);
    }),

    knex.schema.createTable(dbcfg.student_class_table, (t) => {
      t.increments('id').primary();
      t.integer('studentId').unsigned().notNull()
      t.integer('classId').unsigned().notNull()
    }),

    knex.schema.createTable(dbcfg.student_skill_table, (t) => {
      t.increments('id').primary()
      t.integer('studentId').unsigned().notNull()
      t.integer('classSkillId').unsigned().notNull()
      t.decimal('value', 4, 2)
      t.timestamp('lastRated').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.submission_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.integer('sessionId').unsigned().defaultTo(0)
      t.timestamp('date').defaultTo(knex.fn.now())  
    }),
    
    knex.schema.createTable(dbcfg.survey_table, (t) => {
      t.increments('id').primary()
      t.string('surveyName', 60).notNull().unique()
      t.string('authorNames', 60).notNull()
      t.string('title', 60)
      t.integer('totalQuestions').unsigned()
      t.string('surveyField', 40).notNull()
      t.string('surveyFreq', 20).notNull()
      t.string('fullSurveyFile', 80).notNull()
    }),

    knex.schema.createTable(dbcfg.survey_preferences_table, (t) => {
      t.increments('id').primary()
      t.integer('surveyId').unsigned().notNull()
      t.integer('userId').unsigned().notNull()
      t.dateTime('surveyStartDate').defaultTo(knex.fn.now())
      t.timestamp('lastRevision').defaultTo(knex.fn.now())
      t.boolean('pauseAsking').defaultTo(0)
      t.time('pauseTime')
      t.boolean('allowedToAsk').defaultTo(1)
      t.integer('currentIndex').defaultTo(0)
      t.integer('lastIndex').defaultTo(10)
      t.integer('currentSurveyIndex').notNull().defaultTo(0)
    }),

    knex.schema.createTable(dbcfg.survey_results_table, (t) => {
      t.increments('id').primary()
      t.integer('surveyId').unsigned().notNull()
      t.integer('userId').unsigned().notNull()
      t.integer('questionId').unsigned().notNull()
      t.string('questionAnswer', 80).notNull()
      t.integer('surveyResponseId').notNull().defaultTo(0)
      t.timestamp('answeredOn').defaultTo(knex.fn.now())
      t.boolean('pulseResponse').defaultTo(0)
    }),

    knex.schema.createTable(dbcfg.upcoming_event_table, (t) => {
      t.increments('id').primary()
      t.integer('classId').notNull().unsigned()
      t.text('name')
      t.text('title')
      t.text('description')
      t.dateTime('openDate').defaultTo(knex.fn.now())
      t.dateTime('closedDate').defaultTo(knex.fn.now())
      t.timestamp('dateCreated').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.users_interation_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.integer('sessionId').unsigned().notNull()
      t.string('eventType', 40).notNull()
      t.string('name', 40).notNull()
      t.text('data').notNull()
      t.timestamp('date').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.user_registration_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.boolean('isRegistered').defaultTo(0)
      t.boolean('completedSetup').defaultTo(0)
    }),

    knex.schema.createTable(dbcfg.user_role_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').notNull().unsigned()
      t.integer('roleId').unsigned().notNull()
    }),

    knex.schema.createTable(dbcfg.users_table, (t) => {
      t.increments('id').primary()
      t.string('username', 80).notNull()
      t.string('password', 60).notNull()
      t.integer('sessionId').notNull()
      t.boolean('optedIn').defaultTo(1)
    }),

    knex.schema.createTable(dbcfg.verify_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.string('type', 10).notNull()
      t.string('token', 40).notNull()
      t.timestamp('timestamp').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.feedback_input_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.integer('feedbackId').unsigned().notNull()
      t.text('input').notNull()
      t.timestamp('date').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.feedback_interaction_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull();
      t.integer('sessionId').unsigned().defaultTo(0)
      t.integer('submissionId').unsigned().notNull()
      t.integer('feedbackId').unsigned().notNull()
      t.text('action').notNull()
      t.timestamp('date').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.feedback_rating_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.integer('feedbackId').unsigned().notNull()
      t.integer('ratingUp').unsigned().notNull()
      t.integer('ratingDown').unsigned().notNull()
      t.timestamp('date').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.feedback_stats_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.integer('sessionId').unsigned().notNull()
      t.text('filename').notNull()
      t.text('toolName').notNull()
      t.text('name').notNull()
      t.text('type').notNull()
      t.text('level').notNull()
      t.text('category').notNull()
      t.text('statName').notNull()
      t.decimal('statValue', 8, 3)
      t.timestamp('date').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable(dbcfg.feedback_table, (t) => {
      t.increments('id').primary()
      t.integer('userId').unsigned().notNull()
      t.integer('sessionId').unsigned().notNull()
      t.integer('submissionId').unsigned().notNull()
      t.text('toolName').notNull()
      t.text('filename').notNull()
      t.text('runeType').notNull()
      t.text('type').notNull()
      t.text('route').notNull()
      t.integer('charPos').unsigned()
      t.integer('charNum').unsigned()
      t.integer('lineNum').unsigned()
      t.text('target')
      t.text('suggestions')
      t.text('feedback')
      t.text('severity')
      t.integer('hlBeginChar').unsigned()
      t.integer('hlEndChar').unsigned()
      t.integer('hlBeginLine').unsigned()
      t.integer('hlEndLine').unsigned()
      t.timestamp('date').defaultTo(knex.fn.now())
    })
  ]);
};

exports.down = function(knex, Promise) {
  
};
