import sinon from 'sinon';
import {curry} from 'ramda';

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

const stubbers = {
    uuid: curry(sinon.stub)(uuid),
    getDescriptorModule: curry(sinon.stub)(getDescriptorModule),
    assertCircularReferencesModule: curry(sinon.stub)(assertCircularReferencesModule),
    buildGraphModule: curry(sinon.stub)(buildGraphModule),
    buildProviderModule: curry(sinon.stub)(buildProviderModule),
    provideTransientModule: curry(sinon.stub)(provideTransientModule),
    provideCachedModule: curry(sinon.stub)(provideCachedModule),
    provideProviderModule: curry(sinon.stub)(provideProviderModule),
    provideParentModule: curry(sinon.stub)(provideParentModule),
    provideRootModule: curry(sinon.stub)(provideRootModule)
};
export default function () {
    let stubbed, directives = {}, keys = [];

    return {
        addStubDirective(moduleName, methodName = 'default') {
            let key = `${moduleName}::${methodName}`;
            directives[key] = [stubbers[moduleName], methodName];
            keys.push(key);
        },
        stub() {
            stubbed = keys.reduce(function (acc, key) {
                let member = directives[key];

                acc[key] = member[0](member[1]);
                return acc;
            }, {});
        },
        get(key) {
            return stubbed[key];
        },
        unstub() {
            keys.forEach(function (key) {
                stubbed[key].restore();
                delete stubbed[key];
            });
        }
    };
}
