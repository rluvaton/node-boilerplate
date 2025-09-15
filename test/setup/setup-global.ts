import { faker } from '@faker-js/faker'
import expect from 'expect'
import { matchers as expectHttpMatchers } from 'expect-http-client-matchers'
import expectMatchers from 'expect-matchers'
import each from 'jest-each'
import jestExtendedMatchers from 'jest-extended'
import Mocha, { Suite } from 'mocha'

// @ts-ignore
import sinonMatchers from 'sinon-jest-matchers'

// @ts-ignore
global.expect = expect

const jestExtendedMatchersWithoutOverlapping = Object.assign({}, jestExtendedMatchers)
// @ts-ignore
delete jestExtendedMatchersWithoutOverlapping.toIncludeSameMembers
expect.extend(jestExtendedMatchers)
expect.extend(expectMatchers)
expect.extend(sinonMatchers)
expect.extend(expectHttpMatchers)

const { EVENT_FILE_PRE_REQUIRE } = Suite.constants

const oldLoadFilesAsync = Mocha.prototype.loadFilesAsync
Mocha.prototype.loadFilesAsync = function (...args) {
  registerEach(this.suite)
  return oldLoadFilesAsync.apply(this, args)
}

// @ts-ignore
const oldLoadFiles = Mocha.prototype.loadFiles
// @ts-ignore
Mocha.prototype.loadFiles = function (...args) {
  registerEach(this.suite)
  return oldLoadFiles.apply(this, args)
}

function registerEach(suite: Suite) {
  // Register the `each`
  suite.on(EVENT_FILE_PRE_REQUIRE, (context) => {
    // @ts-ignore in case this called already
    if (context.it.each) {
      return
    }
    // Allow to use it.each and describe.each in tests
    global.test = it

    // @ts-ignore this is needed for the jest-each to work
    it.concurrent = () => {
      throw new Error('concurrent is not supported, added just to allow it.each and describe.each')
    }
    // @ts-expect-error
    context.describe.each = (...args) => {
      // @ts-ignore
      return each(...args).describe
    }

    // @ts-expect-error
    context.it.each = (...args) => {
      // @ts-ignore
      return each(...args).it
    }
  })
}

export const globalSeed = Date.now()
// Seed so we can reproduce failed tests
faker.seed(globalSeed)

// eslint-disable-next-line no-console
console.log(`
== Using faker seed: '${globalSeed}' ==

If there are flaky tests you can set the seed in the setup-global.ts file - \`faker.seed(${globalSeed});\` 
and run all tests


`)
