// Remove once https://github.com/microsoft/TypeScript/issues/53255 is fixed.
// noinspection JSUnusedGlobalSymbols

type ExtractEachCallbackArgs<T extends ReadonlyArray<any>> = {
  1: [T[0]]
  2: [T[0], T[1]]
  3: [T[0], T[1], T[2]]
  4: [T[0], T[1], T[2], T[3]]
  5: [T[0], T[1], T[2], T[3], T[4]]
  6: [T[0], T[1], T[2], T[3], T[4], T[5]]
  7: [T[0], T[1], T[2], T[3], T[4], T[5], T[6]]
  8: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7]]
  9: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8]]
  10: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9]]
  fallback: Array<T extends ReadonlyArray<infer U> ? U : any>
}[T extends Readonly<[any]>
  ? 1
  : T extends Readonly<[any, any]>
    ? 2
    : T extends Readonly<[any, any, any]>
      ? 3
      : T extends Readonly<[any, any, any, any]>
        ? 4
        : T extends Readonly<[any, any, any, any, any]>
          ? 5
          : T extends Readonly<[any, any, any, any, any, any]>
            ? 6
            : T extends Readonly<[any, any, any, any, any, any, any]>
              ? 7
              : T extends Readonly<[any, any, any, any, any, any, any, any]>
                ? 8
                : T extends Readonly<[any, any, any, any, any, any, any, any, any]>
                  ? 9
                  : T extends Readonly<[any, any, any, any, any, any, any, any, any, any]>
                    ? 10
                    : 'fallback']

// biome-ignore lint/style/noNamespace: shut up
declare namespace Mocha {
  interface Each {
    // Exclusively arrays.
    <T extends any[] | [any]>(
      cases: ReadonlyArray<T>,
    ): (name: string, fn: (...args: T) => any, timeout?: number) => void

    <T extends ReadonlyArray<any>>(
      cases: ReadonlyArray<T>,
    ): (name: string, fn: (...args: ExtractEachCallbackArgs<T>) => any) => void

    // Not arrays.
    <T>(cases: ReadonlyArray<T>): (name: string, fn: (arg: T, done: Done) => any) => void

    (cases: ReadonlyArray<ReadonlyArray<any>>): (name: string, fn: (...args: any[]) => any) => void

    (strings: TemplateStringsArray, ...placeholders: any[]): (name: string, fn: (arg: any, done: Done) => any) => void
  }

  export interface TestFunction {
    each: Each
  }

  export interface SuiteFunction {
    each: Each
  }
}
