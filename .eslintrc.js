module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'rules': {
    'max-len': [2, 140, 2, {"ignoreUrls": true}],
    'no-invalid-this': 'off',
    'new-cap': 'off'
  },
};
