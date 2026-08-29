import type { beforeEach as vitestBeforeEach, afterEach as vitestAfterEach } from "vitest";
import { TestContext } from "gwt-runner";

type AfterCallback<T> = (this: T) => unknown;

export type AspectFunction<T = unknown> = {
  (this: T): unknown;
  timeout?: number;
};

export type WithAspectBuilder = (
  beforeEach: typeof vitestBeforeEach,
  afterEach: typeof vitestAfterEach,
) => <T>(before: AspectFunction<T>, after?: AfterCallback<T>) => void;

const withAspectBuilder: WithAspectBuilder =
  (beforeEach, afterEach) =>
  <T>(before: AspectFunction<T>, after?: AfterCallback<T>): void => {
    beforeEach(async () => {
      TestContext.createContext();

      await (before.bind(TestContext.context as T) as any)();
    }, before.timeout);

    afterEach(async () => {
      if (after) {
        await (after.bind(TestContext.context as T) as any)();
      }

      TestContext.releaseContext();
    });
  };

export default withAspectBuilder;
