// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="jest-extended" />

/* eslint-disable @typescript-eslint/no-empty-interface */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AsymmetricMatchers, Expect, Matchers } from 'expect'

declare module 'expect' {
  export interface AsymmetricMatchers extends jest.InverseAsymmetricMatchers {}

  export interface Matchers<R> extends jest.Matchers<R> {}
}
