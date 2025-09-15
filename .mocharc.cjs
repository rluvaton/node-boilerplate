module.exports = {
  extension: ['ts'],
  spec: ['src/**/*.test.ts', 'test/**/*.test.ts'],
  require: [
    './test/setup/mocha-env.js',

    // TypeScript Support
    'ts-node/esm',
    // "ts-node-esm/register",

    // Global Setup
    './test/setup/global-setup-and-teardown-mocha.ts',

    // Test Setup
    './test/setup/setup-global.ts',

    // Test Setup
    './test/setup/setup-tests.ts',
  ],
  exit: true,
  timeout: '5s',
  watch: false,
  reporter: 'spec',
}
