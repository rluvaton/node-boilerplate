module.exports = {
  extension: ['ts'],
  spec: ['src/**/*.test.ts', 'test/**/*.test.ts'],
  import: 'tsx/esm',

  require: [
    './test/setup/mocha-env.js',

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
