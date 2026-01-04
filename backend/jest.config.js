/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/index.ts',
        '!src/**/*.test.ts',
        '!src/types/**/*.ts',
    ],
    coverageThreshold: {
        global: {
            lines: 70,
            functions: 70,
            branches: 70,
        },
    },
    testMatch: ['**/src/**/*.test.ts', '**/tests/**/*.test.ts'],
};
