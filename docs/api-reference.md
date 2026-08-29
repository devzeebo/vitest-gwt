# API Reference

`vitest-gwt` is a thin binding over [`gwt-runner`](https://github.com/devzeebo/gwt-runner).
It calls Vitest's `test`, `beforeEach`, and `afterEach` for you.

```js
import test, { withAspect, TestContext } from "vitest-gwt";
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

## `withAspect`

Registers `beforeEach`/`afterEach` hooks that prepare and tear down the test
Context.

```ts
function withAspect<T>(before: AspectFunction<T>, after?: (this: T) => unknown): void;
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

## `TestContext`

Re-exported from `gwt-runner`. Manages the per-test Context. Rarely needed in
application tests.

```ts
TestContext.createContext(): void; // create a new Context
TestContext.releaseContext(): void; // release the current Context
TestContext.context: object;        // the active Context
```

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
