/** @type {import("eslint").ESLint.ConfigData} */
const config = {
    root: true,

    env: {
        browser: true,
        es2022: true,
    },

    parser: "@typescript-eslint/parser",

    plugins: ["@typescript-eslint"],

    extends: [
        "eslint:recommended",
        "preact",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],

    rules: {
        "no-useless-escape": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "react/no-deprecated": "off",
        "no-else-return": "off",
        radix: "off",
    },

    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },

        ecmaVersion: 2022,
        sourceType: "module",
    },

    settings: {
        react: {
            pragma: "h",
            version: "detect",
        },
    },

    overrides: [
        {
            files: ["*.js"],
            rules: {
                "@typescript-eslint/explicit-function-return-type": "off",
            },
        },
    ],
};

// eslint-disable-next-line no-undef
module.exports = config;
