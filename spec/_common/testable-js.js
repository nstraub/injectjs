import createTester from 'testable-js';

import uuid                                from 'util/uuid';
import * as getDescriptorModule            from 'injection/get-descriptor';
import * as assertCircularReferencesModule from 'injection/assert-circular-references';
import * as buildGraphModule               from 'injection/build-graph';
import * as buildProviderModule            from 'providers/build-provider';
import * as provideTransientModule         from 'providers/provide-transient';
import * as provideCachedModule            from 'providers/provide-cached';
import * as provideProviderModule          from 'providers/provide-provider';
import * as provideParentModule            from 'providers/provide-parent';
import * as provideRootModule              from 'providers/provide-root';
import * as registerInstantiableModule              from 'registration/register-instantiable';
import * as registerModule              from 'registration/register';
import * as buildAnonymousDescriptorModule from '../../src/injection/build-anonymous-descriptor';


const tester = createTester();

tester.registerStub('getUuid', uuid, 'getNext');
tester.registerStub('getDescriptor', getDescriptorModule, 'default');
tester.registerStub('assertCircularReferences', assertCircularReferencesModule, 'default');
tester.registerStub('buildGraph', buildGraphModule, 'default');
tester.registerStub('buildProvider', buildProviderModule, 'default');
tester.registerStub('provideTransient', provideTransientModule, 'default');
tester.registerStub('provideCached', provideCachedModule, 'default');
tester.registerStub('provideProvider', provideProviderModule, 'default');
tester.registerStub('provideParent', provideParentModule, 'default');
tester.registerStub('provideRoot', provideRootModule, 'default');
tester.registerStub('buildAnonymousDescriptor', buildAnonymousDescriptorModule, 'default');
tester.registerStub('registerInstantiable', registerInstantiableModule, 'default');
tester.registerStub('register', registerModule, 'default');

export default tester;
