import {global_setup, local_teardown} from './util/setup.teardown';
import InjectJS_spec from './InjectJS/InjectJS.spec';
import providers_spec from './providers/providers.spec';
/*global describe*/
/*global beforeAll*/
/*global afterEach*/
describe("InjectJS", function () {
    beforeAll(global_setup);
    afterEach(local_teardown);

    describe("Main Module", InjectJS_spec);
    describe("Providers", providers_spec);
});