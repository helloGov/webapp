module.exports = {
    'rules': {
        'indent': [
            'error',
            4
        ],
        'semi': [
            'error',
            'always'
        ],
        'space-before-function-paren': [
            'error',
            'never'
        ],
        'no-console': [
            'warn'
        ]
    },
    'env': {
        'es6': true,
        'browser': true,
        'node': true
    },
    'extends': ['standard'],
    'parserOptions': {
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true
        }
    },
    'globals': {
        'angular': false
    }
};
