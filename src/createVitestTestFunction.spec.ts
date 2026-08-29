import { vi, describe, expect, type Mock } from "vitest";
import type { RunnerTestSuite, SuiteCollector } from "vitest";

import test from "./index";
import withTestOptionsBuilder, {
  type TestOptionsContext,
} from "./withTestOptions";
import createVitestTestFunction from "./createVitestTestFunction";

describe("createVitestTestFunction", () => {
  test("passes resolved options as vitest second argument", {
    given: {
      mock_vitest_test_fn,
      mock_suite_with_options,
    },
    when: {
      registering_test_with_options,
    },
    then: {
      vitest_called_with_options,
    },
  });

  test("omits options when suite has none", {
    given: {
      mock_vitest_test_fn,
      mock_suite_without_options,
    },
    when: {
      registering_test_without_options,
    },
    then: {
      vitest_called_without_options,
    },
  });
});

type Context = Partial<{
  parent_suite: RunnerTestSuite;
  parent_collector: SuiteCollector;
  get_suite: Mock<() => SuiteCollector>;
  configure: (this: TestOptionsContext) => void;
  vitest_test: Mock<(...args: any[]) => any>;
  registered_callback: () => void;
}>;

function create_suite(name: string): RunnerTestSuite {
  return {
    id: name,
    type: "suite",
    name,
    mode: "run",
    tasks: [],
    meta: Object.create(null),
    file: undefined as any,
  } as unknown as RunnerTestSuite;
}

function create_collector(suite: RunnerTestSuite): SuiteCollector {
  return {
    type: "collector",
    name: suite.name,
    mode: "run",
    suite,
    tasks: [],
    file: undefined as any,
    test: undefined as any,
    task: undefined as any,
    collect: undefined as any,
    clear: undefined as any,
    on: undefined as any,
  } as SuiteCollector;
}

function mock_suite_collector(this: Context) {
  this.parent_suite = create_suite("parent");
  this.parent_collector = create_collector(this.parent_suite!);
  this.get_suite = vi.fn(() => this.parent_collector!);
}

function configure_timeout(this: Context) {
  this.configure = function (this: TestOptionsContext) {
    this.testOptions.timeout = 100_000;
  };
}

function using_test_options(this: Context) {
  withTestOptionsBuilder(this.get_suite! as any)(this.configure!);
}

function mock_vitest_test_fn(this: Context) {
  this.vitest_test = vi.fn();
  this.registered_callback = vi.fn();
}

function mock_suite_with_options(this: Context) {
  mock_suite_collector.call(this);
  configure_timeout.call(this);
  using_test_options.call(this);
}

function mock_suite_without_options(this: Context) {
  mock_suite_collector.call(this);
}

function registering_test_with_options(this: Context) {
  createVitestTestFunction(this.vitest_test! as any, this.get_suite! as any)(
    "case",
    this.registered_callback!,
  );
}

function registering_test_without_options(this: Context) {
  createVitestTestFunction(this.vitest_test! as any, this.get_suite! as any)(
    "case",
    this.registered_callback!,
  );
}

function vitest_called_with_options(this: Context) {
  expect(this.vitest_test).toHaveBeenCalledWith(
    "case",
    { timeout: 100_000 },
    this.registered_callback,
  );
}

function vitest_called_without_options(this: Context) {
  expect(this.vitest_test).toHaveBeenCalledWith(
    "case",
    this.registered_callback,
  );
}
