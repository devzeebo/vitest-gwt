import type {
  beforeEach as vitestBeforeEach,
  afterEach as vitestAfterEach,
} from 'vitest';
import { TestContext } from 'gwt-runner';

type Callback<T> = (this: T) => any;

export default (
  beforeEach: typeof vitestBeforeEach,
  afterEach: typeof vitestAfterEach,
) => (
  <T>(
    before: Callback<T>,
    after?: Callback<T>,
  ) => {
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
  }
);
