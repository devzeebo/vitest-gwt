# Writing Tests

A `test` is invoked with two arguments:

- **`name`** — the test name, passed through to Vitest.
- **`definition`** — the GWT definition object.

The definition has three keys: `given`, `when`, and `then`. Any other top-level
key (except `scenario`, see [Scenarios](./scenarios.md)) makes the test fail
with an error.

```js
test('has no expected errors', {
  given: {
    mock_vitest_test_function,
    GOOD_test_case,
  },
  when: {
    executing_test_case,
  },
  then: {
    all_GIVENS_called,
    all_WHENS_called,
    all_THENS_called,
  },
});
```

## The Context (`this`)

Each test execution creates a new **Context** and binds every clause to it, so
`this` inside a clause is that per-test Context. State is shared between
clauses **only** through `this`. No arguments are passed to clauses.

```js
function valid_email() {
  this.email = 'test@mail.com';
}

async function validating_email() {
  this.validation_result = await validateEmailAsync(this.email);
}

function email_is_valid() {
  expect(this.validation_result).toBe(true);
}
```

Clauses may be regular or `async` functions. Use `this` to hand data from
`given` to `when` to `then`.

## DO NOT use arrow functions

> [!IMPORTANT]
> Only unbound function declarations work as clauses. **Never use arrow
> functions** — they cannot be rebound, so the Context binding breaks and
`this` is wrong.

```js
// GOOD — function declaration
function valid_email() {
  this.email = 'test@mail.com';
}

// BAD — arrow function, Context binding fails
const valid_email = () => {
  this.email = 'test@mail.com';
};
```

## Clause keys are descriptive only

The definition relies on ES6 shorthand object syntax. Key names inside
`given`, `when`, and `then` do **not** affect execution — only the values
(functions) are run. The keys exist for readability:

```js
// Shorthand (preferred)
then: {
  the_value_is_correct: the_value_is(15),
}

// Equivalent, explicit
then: {
  the_value_is_correct: the_value_is(15),
}
```

One reserved key is `expect_error` in a `then` block — see
[Expecting Errors](./expecting-errors.md).

## Array steps

Instead of a keyed object, each phase may be an **array** of functions. Useful
with curried factories (below) or when order is what matters:

```js
test('uses array steps', {
  given: [
    mock_vitest_test_function,
    GOOD_test_case,
  ],
  when: [
    executing_test_case,
  ],
  then: [
    all_GIVENS_called,
    all_WHENS_called,
    all_THENS_called,
  ],
});
```

## Curried step factories

A factory can close over arguments and return a clause. Mix keyed and array
forms freely:

```js
test('curried step', {
  given: {
    some_given,
  },
  when: [
    user_enters_data({ some: 'data' }),
  ],
  then: {
    the_form_has_data,
  },
});
```

The function **returned** by the factory must still be an unbound function
declaration — never an arrow function:

```js
// GOOD
function user_enters_data(data) {
  return function () {
    do_the_thing_with_the_data(data);
  };
}

// BAD — returned arrow function breaks Context binding
function user_enters_data(data) {
  return () => {
    do_the_thing_with_the_data(data);
  };
}
```

## Full example

A contrived `validateEmailAddress` API call, tested with `vi.mock`:

```js
// validateEmailAddress.js
import axios from 'axios';

export default (email) => axios
  .post('/api/validateEmail', { email })
  .then((res) => (res.data.success
    ? Promise.resolve(true)
    : Promise.reject(res.data.error)));
```

```js
// validateEmailAddress.spec.js
import { describe, expect, vi } from 'vitest';
import axios from 'axios';
import test from 'vitest-gwt';

import validateEmailAddress from './validateEmailAddress';

vi.mock('axios');

describe('the validate email address api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns true for valid email addresses', {
    given: {
      valid_email_address,
    },
    when: {
      validating_email_address,
    },
    then: {
      email_address_is_valid,
    },
  });

  test('extracts error for invalid email address', {
    given: {
      INVALID_email_address,
    },
    when: {
      validating_email_address,
    },
    then: {
      expect_error: email_address_is_INVALID,
    },
  });
});

function valid_email_address() {
  this.mock_email = 'valid@email.com';
  axios.post.mockResolvedValue({ data: { success: true } });
}

function INVALID_email_address() {
  this.mock_email = 'invalid';
  axios.post.mockResolvedValue({
    data: { success: false, error: 'error message from server' },
  });
}

async function validating_email_address() {
  this.result = await validateEmailAddress(this.mock_email);
}

function email_address_is_valid() {
  expect(this.result).toBe(true);
}

function email_address_is_INVALID(error) {
  expect(error).toBe('error message from server');
}
```

Next: [Expecting Errors](./expecting-errors.md).
