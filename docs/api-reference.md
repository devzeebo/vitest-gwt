# API Reference

`vitest-gwt` is a thin binding over [`gwt-runner`](https://github.com/devzeebo/gwt-runner).
It calls Vitest's `test`, `beforeEach`, and `afterEach` for you.

```js
import test, { withAspect, withTestOptions, TestContext } from "vitest-gwt";
```

## `test` (default export)

The GWT test function, bound to Vitest's runner.

```ts
function test<TContext>(name: string, definition: GwtDefinition<TContext>): void;
```

- **`name`** — test name passed to Vitest.
- **`definition`** — `{ given, when, then }` clauses, **or** a
  `{ given, scenario }` definition (see [Scenarios](./scenarios.md)).

Clauses are unbound function declarations bound to a per-test Context
(accessed via `this`). Arrow functions are not supported. See
[Writing Tests](./writing-tests.md).

When the current suite has options from `withTestOptions`, they are forwarded
to Vitest as `test(name, options, fn)`.

## `withAspect`

Registers `beforeEach`/`afterEach` hooks that prepare and tear down the test
Context.

```ts
function withAspect<T>(before: AspectFunction<T>, after?: AspectFunction<T>): void;
```

- **`before`** — runs before each test, bound to the Context. May set an
  optional `timeout` (ms) that is forwarded to Vitest's `beforeEach`.
- **`after`** — optional; runs after each test, bound to the same Context,
  then releases the Context.

### `AspectFunction`

```ts
type AspectFunction<T = unknown> = {
  (this: T): unknown;
  timeout?: number;
};
```

Use this type when you need a longer hook timeout:

```ts
import { withAspect, type AspectFunction } from "vitest-gwt";

const setup: AspectFunction<Context> = function () {
  // slow prep
};
setup.timeout = 100_000;
withAspect(setup);
```

See [Shared Context](./shared-context.md).

## `withTestOptions`

Sets Vitest `TestOptions` for every GWT test registered in the current
`describe`. Runs immediately at collection time (not in `beforeEach`).

```ts
function withTestOptions<T extends { testOptions: TestOptions }>(
  configure: (this: T) => void,
): void;
```

```ts
import test, { withTestOptions, type TestContext } from "vitest-gwt";

type Context = TestContext<"vitest">;

describe("slow", () => {
  withTestOptions(function (this: Context) {
    this.testOptions.timeout = 100_000;
  });

  test("takes a while", { when: { slow_op }, then: { done } });
});
```

- Configure **synchronously**; only assign `testOptions` fields.
- Nested describes inherit parent options and may override individual fields.

Use `withTestOptions` for test-level Vitest options. Use `AspectFunction.timeout`
for hook timeouts. See [Shared Context](./shared-context.md).

## `TestContext`

### Value (from `gwt-runner`)

Manages the per-test Context. Rarely needed in application tests.

```ts
TestContext.createContext(): void; // create a new Context
TestContext.releaseContext(): void; // release the current Context
TestContext.context: object;        // the active Context
```

### Type

```ts
type TestContext<"vitest"> = {
  testOptions: TestOptions;
};
```

Compose with your own fields: `type Context = TestContext<"vitest"> & { ... }`.

## Type-only exports

`gwt-runner` exposes supporting types (e.g. `GwtDefinition`, `TestFunction`,
`Step`) that flow through `vitest-gwt`. Infer your Context type from the
`definition` rather than importing these directly:

```ts
import test from "vitest-gwt";

type Context = {
  email: string;
  result?: boolean;
};

function valid_email(this: Context) {
  this.email = "valid@email.com";
}
```

## What is intentionally not supported

- **Arrow-function clauses** — the runner binds clauses to the Context, which
  arrow functions reject. Use `function` declarations.
- **Passing arguments to clauses** — share state via `this` only.
- **A built-in `xtest` / skip helper** — Vitest's own `test.skip`,
  `test.todo`, and `test.only` apply to Vitest's test, not the GWT wrapper.
  To skip a GWT test, comment it out or guard it outside the runner.
