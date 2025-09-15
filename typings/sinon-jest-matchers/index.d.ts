// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="sinon-jest-matchersd" />

/* eslint-disable @typescript-eslint/no-empty-interface */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AsymmetricMatchers, Expect, Matchers } from 'expect'
import { CustomExpect, CustomMatchers } from 'sinon-jest-matchers'

declare module 'expect' {
  export interface AsymmetricMatchers extends CustomExpect {}

  export interface Matchers<R> extends CustomMatchers<R> {}
}
