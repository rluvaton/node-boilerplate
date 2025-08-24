import { SharedMatchers } from 'expect-http-client-matchers/types/shared'
import 'expect-http-client-matchers/jest'

import 'vitest'

declare module 'vitest' {
  interface Assertion<T = any> extends SharedMatchers<T> {}
  interface AsymmetricMatchersContaining<T = any> extends SharedMatchers<T> {}
}
