# Shared Context with `withAspect`

`withAspect` wraps Vitest's `beforeEach` and `afterEach` to prepare and clean
up the test **Context** before and after every test.

```js
import test, { withAspect } from 'vitest-gwt';

withAspect(
  // beforeEach — prep work. Bound to the Context.
  function () {
    this.db = openTestDatabase();
  },
  // afterEach — OPTIONAL cleanup. Bound to the SAME Context.
  function () {
    this.db.close();
  },
);
```

## Behavior

- **`beforeEach`** runs before each test. A new Context is created and bound to
  it, so values assigned here (e.g. `this.db`) are visible to every `given`,
  `when`, and `then` clause of that test.
- **`afterEach`** is **optional**. If supplied, it runs after each test, bound
  to the same Context, so it can release resources allocated in `beforeEach`.
  It does **not** see values added to the Context during the specific test body
  (those belong to the test run, which has already completed by teardown).
- After `afterEach`, the Context is released.

## Example

```js
import { describe } from 'vitest';
import test, { withAspect } from 'vitest-gwt';

describe('with a seeded database', () => {
  withAspect(
    function () {
      this.users = [{ id: 1, name: 'Ada' }];
    },
  );

  test('finds the seeded user', {
    when: { looking_up_user_by_id },
    then: { the_user_is_found },
  });
});
```

## `TestContext`

`withAspect` is built on `gwt-runner`'s `TestContext`, which manages the
underlying per-test Context. `TestContext` is re-exported from `vitest-gwt`
for advanced or testing scenarios (for example, mocking the provider when
testing the library itself):

```js
import test, { TestContext } from 'vitest-gwt';

TestContext.createContext();
// ... interact with TestContext.context ...
TestContext.releaseContext();
```

You rarely need `TestContext` directly in application tests — `withAspect` and
the `this` binding cover normal setup.

Next: [API Reference](./api-reference.md).
