module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jasmine": true,
        "commonjs": true
    },
    "globals": {
        "dump": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 7,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
        },
        "sourceType": "module"
    },
    "rules": {
        "no-unused-vars": 0
    }
};
