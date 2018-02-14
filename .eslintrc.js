module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jasmine": true
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
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1,
                "flatTernaryExpressions": true
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-console": 0,
        "no-extra-semi": 0,
        "quotes": [
            "error",
            "single",
            {"allowTemplateLiterals": true}
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
