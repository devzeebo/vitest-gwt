import {
  test as vitest,
  beforeEach as vitestBeforeEach,
  afterEach as vitestAfterEach,
} from "vitest";
import { gwtRunner, TestContext } from "gwt-runner";
import withAspectBuilder, {
  type AspectFunction,
  type WithAspectBuilder,
} from "./withAspect";

const test: ReturnType<typeof gwtRunner> = gwtRunner(vitest);

export default test;
export { TestContext };
export type { AspectFunction };

export const withAspect: ReturnType<WithAspectBuilder> = withAspectBuilder(
  vitestBeforeEach,
  vitestAfterEach,
);
