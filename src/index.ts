import {
    test as vitest,
    beforeEach as vitestBeforeEach,
    afterEach as vitestAfterEach,
} from 'vitest';
import withAspectBuilder from './withAspect';
import gwtRunner, { TestContext } from 'gwt-runner';

export default gwtRunner(vitest);
export { TestContext };

export const withAspect = withAspectBuilder(vitestBeforeEach, vitestAfterEach);