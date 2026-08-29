import { vi, describe, expect, type Mock } from "vitest";
import type { RunnerTestSuite, SuiteCollector } from "vitest";

import test from "./index";
import withTestOptionsBuilder, {
  resolveTestOptions,
  type TestOptionsContext,
} from "./withTestOptions";

describe("withTestOptions", () => {
  test("stores options on the suite", {
    given: {
      mock_suite_collector,
      configure_timeout,
    },
    when: {
      using_test_options,
    },
    then: {
      options_resolved_for_suite,
    },
  });

  test("child suite inherits and overrides parent options", {
    given: {
      mock_nested_suite_collectors,
      configure_parent_and_child,
    },
    when: {
      using_nested_test_options,
    },
    then: {
      child_has_merged_options,
      parent_keeps_original_options,
      sibling_does_not_see_child_options,
    },
  });
});

type SuiteFixtures = {
  parent_suite: RunnerTestSuite;
  child_suite: RunnerTestSuite;
  sibling_suite: RunnerTestSuite;
  parent_collector: SuiteCollector;
  child_collector: SuiteCollector;
  sibling_collector: SuiteCollector;
};

type Context = Partial<
  SuiteFixtures & {
    get_suite: Mock<() => SuiteCollector>;
    configure: (this: TestOptionsContext) => void;
    parent_configure: (this: TestOptionsContext) => void;
    child_configure: (this: TestOptionsContext) => void;
  }
>;

function create_suite(
  name: string,
  parent?: RunnerTestSuite,
): RunnerTestSuite {
  return {
    id: name,
    type: "suite",
    name,
    mode: "run",
    tasks: [],
    meta: Object.create(null),
    file: undefined as any,
    suite: parent,
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

function mock_nested_suite_collectors(this: Context) {
  this.parent_suite = create_suite("parent");
  this.child_suite = create_suite("child", this.parent_suite);
  this.sibling_suite = create_suite("sibling", this.parent_suite);
  this.parent_collector = create_collector(this.parent_suite!);
  this.child_collector = create_collector(this.child_suite!);
  this.sibling_collector = create_collector(this.sibling_suite!);
  this.get_suite = vi.fn(() => this.parent_collector!);
}

function configure_timeout(this: Context) {
  this.configure = function (this: TestOptionsContext) {
    this.testOptions.timeout = 100_000;
  };
}

function configure_parent_and_child(this: Context) {
  this.parent_configure = function (this: TestOptionsContext) {
    this.testOptions.timeout = 10_000;
    this.testOptions.retry = 1;
  };
  this.child_configure = function (this: TestOptionsContext) {
    this.testOptions.timeout = 50_000;
  };
}

function using_test_options(this: Context) {
  withTestOptionsBuilder(this.get_suite! as any)(this.configure!);
}

function using_nested_test_options(this: Context) {
  const builder = withTestOptionsBuilder(this.get_suite! as any);

  this.get_suite!.mockReturnValue(this.parent_collector!);
  builder(this.parent_configure!);

  this.get_suite!.mockReturnValue(this.child_collector!);
  builder(this.child_configure!);
}

function options_resolved_for_suite(this: Context) {
  expect(resolveTestOptions(this.parent_collector!)).toEqual({
    timeout: 100_000,
  });
}

function child_has_merged_options(this: Context) {
  expect(resolveTestOptions(this.child_collector!)).toEqual({
    timeout: 50_000,
    retry: 1,
  });
}

function parent_keeps_original_options(this: Context) {
  expect(resolveTestOptions(this.parent_collector!)).toEqual({
    timeout: 10_000,
    retry: 1,
  });
}

function sibling_does_not_see_child_options(this: Context) {
  expect(resolveTestOptions(this.sibling_collector!)).toEqual({
    timeout: 10_000,
    retry: 1,
  });
}
