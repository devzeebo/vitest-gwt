import {
  test as vitest,
  beforeEach as vitestBeforeEach,
  afterEach as vitestAfterEach,
} from "vitest";
import { gwtRunner, TestContext } from "gwt-runner";
import withAspectBuilder, { type WithAspectBuilder } from "./withAspect";

const test: ReturnType<typeof gwtRunner> = gwtRunner(vitest);

export default test;
export { TestContext };

export const withAspect: ReturnType<WithAspectBuilder> = withAspectBuilder(
  vitestBeforeEach,
  vitestAfterEach,
);
