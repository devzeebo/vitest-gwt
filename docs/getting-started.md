# Getting Started

## Install

```bash
npm install --save-dev vitest-gwt
```

`vitest` is a peer dependency; install it if you have not already:

```bash
npm install --save-dev vitest
```

## Version compatibility

`vitest-gwt` stays in lockstep with Vitest's **major version**. Match the
major version of Vitest you run:

| Vitest | vitest-gwt |
| ------ | ---------- |
| `4.x`  | `4.x`      |
| `3.x`  | `3.x`      |
| `2.x`  | `2.x`      |

## Your first test

Import `test` from `vitest-gwt` (not `vitest`) and describe a test with
`given`, `when`, and `then`:

```js
import { describe } from "vitest";
import test from "vitest-gwt";

describe("addition", () => {
  test("adds two numbers", {
    given: {
      two_numbers,
    },
    when: {
      adding_them,
    },
    then: {
      the_sum_is_correct,
    },
  });
});

// Clause signatures are explained in Writing Tests.
function two_numbers() {
  this.a = 2;
  this.b = 3;
}

function adding_them() {
  this.result = this.a + this.b;
}

function the_sum_is_correct() {
  expect(this.result).toBe(5);
}
```

`describe` and `expect` come from Vitest directly; only the `test` function
comes from `vitest-gwt`.

## How a test runs

1. All **`given`** clauses run, in order.
2. All **`when`** clauses run, in order.
3. All **`then`** clauses run, in order.

A fresh Context object is created for each test and bound to every clause, so
`this` inside any clause points at the same per-test state.

Next: [Writing Tests](./writing-tests.md).
