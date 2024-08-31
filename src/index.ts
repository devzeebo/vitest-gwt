import {
  test as vitest,
  beforeEach as vitestBeforeEach,
  afterEach as vitestAfterEach,
} from 'vitest';
import gwtRunner, { TestContext } from 'gwt-runner';
import withAspectBuilder from './withAspect';

export default gwtRunner(vitest);
export { TestContext };

export const withAspect = withAspectBuilder(vitestBeforeEach, vitestAfterEach);
