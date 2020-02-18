module.exports = {
  env: {
    node: true,
    browser: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 10,
  },
  rules: {
    // NOTE(beekley) Let's leave this in til we get a proper logging library
    'no-console': 'warn',
  },
}
