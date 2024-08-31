import { TestContext } from 'gwt-runner';
import { vi, describe, expect } from 'vitest';

import test from './index';
import withAspectBuilder from './withAspect';

describe('withAspect', () => {
  test('creates context BEFORE the before each', {
    given: {
      mock_vitest_functions,
      mock_context_provider,
      before_each,
    },
    when: {
      using_aspect,
    },
    then: {
      aspect_gets_new_context,
    },
  });

  test('releases context AFTER the after each', {
    given: {
      mock_vitest_functions,
      mock_context_provider,
      before_each,
      after_each,
    },
    when: {
      using_aspect,
    },
    then: {
      context_released_after_cleanup,
      context_is_released,
    },
  });

  test('after each is optional', {
    given: {
      mock_vitest_functions,
      mock_context_provider,
      before_each,
    },
    when: {
      using_aspect,
    },
    then: {
      context_is_released,
    },
  });
});

type MockContext = Partial<{
  context_value: string,
  before_each: string | null,
}>;

type Context = Partial<{
  mock_context: MockContext,
  vitest: {
    beforeEach: (...args: any[]) => any,
    afterEach: (...args: any[]) => any,
  },
  before_each: (this: MockContext) => void,
  after_each: (this: MockContext) => void,
}>;

function mock_vitest_functions(this: Context) {
  this.vitest = {
    beforeEach: vi.fn((it: any) => it()),
    afterEach: vi.fn((it: any) => it()),
  };
}

function mock_context_provider(this: Context) {
  vi.spyOn(TestContext, 'releaseContext').mockImplementation(vi.fn());
  vi.spyOn(TestContext, 'createContext').mockImplementation(() => {
    this.mock_context = {
      context_value: 'before',
    };
  });

  Object.defineProperty(TestContext, 'context', {
    configurable: true,
    get: () => this.mock_context,
  });
}

function before_each(this: Context) {
  this.before_each = function (this: MockContext) {
    this.before_each = this.context_value;
  };
}

function after_each(this: Context) {
  this.before_each = function (this: MockContext) {
    this.before_each = null;
  };
}

function using_aspect(this: Context) {
  withAspectBuilder(
    this.vitest!.beforeEach,
    this.vitest!.afterEach,
  )(
    this.before_each!,
    this.after_each!,
  );
}

function aspect_gets_new_context(this: Context) {
  expect(this.mock_context?.before_each).toEqual(this.mock_context?.context_value);
}

function context_released_after_cleanup(this: Context) {
  expect(this.mock_context?.before_each).toBeNull();
}

function context_is_released(this: Context) {
  expect(TestContext.releaseContext).toHaveBeenCalled();
}
