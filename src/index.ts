import {
  test as vitest,
  beforeEach as vitestBeforeEach,
  afterEach as vitestAfterEach,
  TestRunner,
} from "vitest";
import type { TestOptions } from "vitest";
import { gwtRunner, TestContext as TestContextProvider } from "gwt-runner";
import withAspectBuilder, {
  type AspectFunction,
  type WithAspectBuilder,
} from "./withAspect";
import withTestOptionsBuilder, {
  type WithTestOptions,
  type WithTestOptionsBuilder,
} from "./withTestOptions";
import createVitestTestFunction from "./createVitestTestFunction";

type RunnerContexts = {
  vitest: {
    testOptions: TestOptions;
  };
};

export type TestContext<R extends keyof RunnerContexts> = RunnerContexts[R];
export const TestContext: typeof TestContextProvider = TestContextProvider;

const test: ReturnType<typeof gwtRunner> = gwtRunner(
  createVitestTestFunction(vitest, TestRunner.getCurrentSuite),
);

export default test;
export { test };
export type { AspectFunction, WithTestOptions };

export const withAspect: ReturnType<WithAspectBuilder> = withAspectBuilder(
  vitestBeforeEach,
  vitestAfterEach,
);

export const withTestOptions: ReturnType<WithTestOptionsBuilder> =
  withTestOptionsBuilder(TestRunner.getCurrentSuite);
