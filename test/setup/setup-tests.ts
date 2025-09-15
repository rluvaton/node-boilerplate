// biome-ignore assist/source/organizeImports: The imports order are important
import { faker } from '@faker-js/faker'
import { globalSeed } from './setup-global.ts'
import sinon from 'sinon'
import { logger } from '../../src/lib/logger.ts'

let currentSeed: number

// noinspection JSUnusedGlobalSymbols
export const mochaHooks = {
  beforeEach: function () {
    /* replace the undefined here with the test seed number to reproduce flaky test */
    const seedNumberToReproduce = undefined
    currentSeed = faker.seed(seedNumberToReproduce)
  },
  afterEach: async function (this: Mocha.Context) {
    sinon.restore()

    // In order to avoid the logs from the previous test to be printed in the next test
    await logger.flush()

    if (this.currentTest?.isFailed()) {
      console.log('# ######################################################################################## #')
      console.log(`       Test failed, global seed is: ${globalSeed}, test seed is: ${currentSeed}             `)
      console.log(`                   the seed is useful to reproduce flaky test failures                      `)
      console.log('')
      console.log('How to use:')
      console.log('1. Copy the global and test seed seed from the console (global seed is used before going all tests')
      console.log('2. Go to `setup-global.ts`')
      console.log(`3. Change the \`globalSeed\` variable value to ${globalSeed}`)
      console.log('4. Go to `setup-tests.ts`')
      console.log(`4. Change the \`seedNumberToReproduce\` value to be ${currentSeed}`)
      console.log('5. Run a SINGLE test (each test have different seed)')
      console.log('')
      console.log('# ######################################################################################## #')
    }
  },
}
