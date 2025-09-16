/* eslint-disable no-console */
// noinspection JSUnusedGlobalSymbols

import path from 'node:path'
import { execa } from 'execa'
import { PROJECT_ROOT_PATH } from '../../src/project-root-path.js'

async function runTsFile(filePath: string) {
  await execa('./node_modules/.bin/tsx', [filePath], {
    cwd: path.join(PROJECT_ROOT_PATH, '../'),
    env: {
      NODE_ENV: 'test',
    },

    // Make it output to this process stdout / stderr
    stdout: 'inherit',
    stderr: 'inherit',
  })
}

// Not running global setup and teardown in this process to avoid importing stuff
// we avoid importing stuff cause in `setup-tests.js` file we have certain order we need to import
// and mock things before they are used

export const mochaGlobalSetup = async () => {
  console.log('Global setup')
  console.log('-------------')

  console.time('global setup')
  await runTsFile('./test/setup/global-setup.js')
  console.timeEnd('global setup')
}

export const mochaGlobalTeardown = async () => {
  console.log('Global teardown')
  console.log('-------------')
  console.time('global teardown')
  await runTsFile('./test/setup/global-teardown.js')
  console.timeEnd('global teardown')
}
