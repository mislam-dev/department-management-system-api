module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Require a commit type
    'type-empty': [2, 'never'],

    // Require a commit scope
    'scope-empty': [2, 'never'],

    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'docs',
        'style',
        'refactor',
        'test',
        'perf',
        'build',
        'ci',
        'revert',
      ],
    ],

    'scope-enum': [
      2,
      'always',
      [
        'users',
        'student',
        'course',
        'course-schedule',
        'attendance',
        'auth',
        'user',
        'teacher',
        'staff',
        'semester',
        'config',
        'chore',
        'logging',
        'security',
        'testing',
        'notifications',
        'uploads',
        'activity',
        'notice',
        'report',
      ],
    ],
  },
};
