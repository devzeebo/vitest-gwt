# Expecting Errors

To assert that a test throws, add a `then` clause **named `expect_error`**.
`vitest-gwt` (via `gwt-runner`) detects it, runs it, and passes the thrown
error as the argument. Assert on the error and the test passes.

If code throws an error **and** there is no `expect_error` clause, the test
fails with that error.

```js
test("should throw error", {
  given: {
    an_error_message,
  },
  when: {
    throwing_error,
  },
  then: {
    expect_error,
  },
});

function an_error_message() {
  this.error_message = "an error";
}

function throwing_error() {
  throw new Error(this.error_message);
}

function expect_error(error) {
  expect(error.message).toBe(this.error_message);
}
```

## Named `expect_error`

The key must be `expect_error`, but the function itself can have any name.
Using a more descriptive function name keeps assertions readable:

```js
test("rejects invalid email", {
  given: { invalid_email },
  when: { validating_email },
  then: {
    expect_error: rejected_with_server_message,
  },
});

function rejected_with_server_message(error) {
  expect(error).toBe("error message from server");
}
```

## Scenarios

`expect_error` also works inside scenario `then` blocks. See
[Scenarios](./scenarios.md).

Next: [Scenarios](./scenarios.md).
