# Scenarios

A flat `given`/`when`/`then` does not fit every test — integration tests often
need to assert, act again, then assert something else. For those, use the
**`scenario`** definition: an array of `when`/`then` and `then_when`/`then`
blocks chained together.

```js
test('checkout flow', {
  given: {
    an_empty_cart,
  },
  scenario: [
    {
      when: { adding_an_item },
      then: { the_cart_has_one_item },
    },
    {
      then_when: { submitting_the_order },
      then: {
        the_order_is_created,
        the_cart_is_empty,
      },
    },
    {
      then_when: { payment_fails },
      then: {
        expect_error: the_order_is_cancelled,
        and: { the_cart_is_restored },
      },
    },
  ],
});
```

### How blocks run

- A block with **`when`** runs actions, then its **`then`** asserts.
- A block with **`then_when`** runs more actions (after the prior assertions),
  then its **`then`** asserts.
- The **`and`** key nests additional `then` clauses under a block.
- **`expect_error`** inside a `then` block works exactly as in
  [Expecting Errors](./expecting-errors.md) — it receives the thrown error.

All blocks share the same per-test Context (`this`), so state accumulates
across the whole scenario.

## Naming steps

When a step fails, the error is wrapped with the step index. Give each block a
**`name`** to make failures readable:

```js
test('checkout flow', {
  given: { an_empty_cart },
  scenario: [
    {
      name: 'Adding to cart',
      when: { adding_an_item },
      then: { the_cart_has_one_item },
    },
    {
      name: 'Checking out',
      then_when: { submitting_the_order },
      then: { the_order_is_created },
    },
    {
      name: 'Paying',
      then_when: { payment_fails },
      then: { expect_error: the_order_is_cancelled },
    },
  ],
});
```

## Deprecated flat scenario syntax

> [!WARNING]
> The flat object syntax below is **deprecated** and will be removed in
> `gwt-runner` 3.0. Use the array form above for new tests.

The old style encodes order in key prefixes (`when_*`, `then_*`):

```js
test('checkout flow', {
  given: { mock_vitest_test_function, GOOD_test_case },
  scenario: {
    when_executing_test_case,
    then_assert_something,
    when_user_submits_form,
    then_something_else_happens,
    then_yet_another_thing_is_true,
  },
});
```

Scenario-level `expect_error` is also supported in the deprecated form:

```js
test('checkout flow with error', {
  given: { mock_vitest_test_function, GOOD_test_case },
  scenario: {
    when_executing_test_case,
    then_assert_something,
    when_user_submits_form,
    then_something_else_happens,
    when_an_error_happens,
  },
  expect_error: the_error_happened,
});
```

Next: [Shared Context](./shared-context.md).
