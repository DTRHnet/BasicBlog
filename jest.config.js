export default {
    testEnvironment: 'node',
    transform: {},
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    testMatch: [
        '**/tests/**/*.test.js',
        '**/__tests__/**/*.js',
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}',
        '!src/main.jsx',
    ],
    coverageDirectory: 'coverage',
    verbose: true,
};
