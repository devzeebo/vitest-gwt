import type { beforeEach as vitestBeforeEach, afterEach as vitestAfterEach } from "vitest";
import { TestContext } from "gwt-runner";

type Callback<T> = (this: T) => any;

export type WithAspectBuilder = (
  beforeEach: typeof vitestBeforeEach,
  afterEach: typeof vitestAfterEach,
) => <T>(before: Callback<T>, after?: Callback<T>) => void;

const withAspectBuilder: WithAspectBuilder =
  (beforeEach, afterEach) =>
  <T>(before: Callback<T>, after?: Callback<T>): void => {
    beforeEach(async () => {
      TestContext.createContext();

      await (before.bind(TestContext.context as T) as any)();
    });

    afterEach(async () => {
      if (after) {
        await (after.bind(TestContext.context as T) as any)();
      }

      TestContext.releaseContext();
    });
  };

export default withAspectBuilder;
