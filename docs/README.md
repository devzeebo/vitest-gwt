# vitest-gwt documentation

`vitest-gwt` is a thin [Vitest](https://vitest.dev) binding over
[`gwt-runner`](https://github.com/devzeebo/gwt-runner). It lets you write
**given-when-then** style tests with strong typing and almost no ceremony.

```js
import { describe } from 'vitest';
import test from 'vitest-gwt';

describe('a widget', () => {
  test('does the thing', {
    given: { a_widget },
    when: { the_thing_is_done },
    then: { the_thing_happened },
  });
});
```

## Sections

| Document | Covers |
| --- | --- |
| [Getting Started](./getting-started.md) | Install, version compatibility, your first test |
| [Writing Tests](./writing-tests.md) | The `given`/`when`/`then` definition, the Context (`this`), arrow-function rule, async, curried steps |
| [Expecting Errors](./expecting-errors.md) | The `expect_error` clause |
| [Scenarios](./scenarios.md) | Multi-step `scenario` flows with `when`/`then`/`then_when` |
| [Shared Context](./shared-context.md) | `withAspect` for `beforeEach`/`afterEach` setup and teardown |
| [API Reference](./api-reference.md) | Exports and signatures: `test`, `withAspect`, `TestContext` |

## Why GWT?

Given-when-then forces you to split a test into three phases:

- **given** — set up state
- **when** — perform the action under test
- **then** — assert the outcome

`vitest-gwt` runs every `given` first, then every `when`, then every `then`.
Each test gets a fresh **Context**, and every clause is bound to that Context,
so you read and write shared state through `this` instead of threading
arguments.

> [!NOTE]
> These docs are self-contained. They merge the `gwt-runner` core guide with
> the Vitest-specific details, so you do not need to jump to another repo for
> detailed usage.
