import {createInjector} from '../../../src/index';
import {uuid}           from '../../../src/util';


const lifetimes = ['transient', 'root', 'state', 'singleton', 'parent'];

let injector;
export default {
    reset_injector() {
        uuid.reset();
        return injector = createInjector();
    },
    next_hash() {
        return uuid.getNext();
    },
    make_descriptor(options) {
        let target = options.target,
            {name, provider, type, dependencies} = options,
            lifetime = options.lifetime;

        switch (target) {
            case 'providers':
                target = 'registerProvider';
                break;
            case 'fakes':
                target = 'registerFake';
                break;
            default:
                target = 'registerType';
        }

        if (type === undefined) {
            type = function () {
            };
        }

        if (dependencies !== undefined) {
            type = [...dependencies, type]
        }
        injector[target](name, type, lifetime, provider);
    },
    assign_base_types() {
        for (let lifetime of lifetimes) {
            injector.registerType(`base_${lifetime}_type`, function () {
            }, lifetime);
        }

    },

    assign_base_providers() {
        injector.registerProvider('base_provider', function () {
        });
        injector.registerProvider('provider_returns_context', function () {
            return this;
        });
    },

    assign_passive_types() {
        for (let lifetime of lifetimes) {
            injector.registerType(`passive_${lifetime}_type`, function () {
            }, lifetime, function (type) {
                type.passively_provided = true;
                return type;
            });
            injector.registerType(`passive_${lifetime}_type_with_anon_provider`, function () {
            }, lifetime, function (type) {
                type.passively_provided = true;
                return type;
            });
            injector.registerType(`passive_${lifetime}_type_with_anon_array`, function () {
            }, lifetime, [
                'type', function (type) {
                    type.passively_provided = true;
                    return type;
                }
            ]);
        }

    },

    assign_basic_dependent_types() {
        for (let lifetime of lifetimes) {
            injector.registerType(lifetime + '_depends_on_transient', function (base_transient_type) {
                this.dependency = base_transient_type;
            }, lifetime);
            injector.registerType(lifetime + '_depends_on_state', function (base_state_type) {
                this.dependency = base_state_type;
            }, lifetime);
            injector.registerType(lifetime + '_depends_on_parent', function (base_parent_type) {
                this.dependency = base_parent_type;
            }, lifetime);
            injector.registerType(lifetime + '_depends_on_root', function (base_root_type) {
                this.dependency = base_root_type;
            }, lifetime);
            injector.registerType(lifetime + '_depends_on_singleton', function (base_singleton_type) {
                this.dependency = base_singleton_type;
            }, lifetime);
        }

    },

    assign_context_dependent_types() {
        this.assign_base_providers();
        return (() => {
            const result = [];
            for (var lifetime of lifetimes) {
                injector.registerType(lifetime + '_provides_context', function (provider_returns_context) {
                    this.dependency = provider_returns_context;
                }, lifetime);
                result.push(injector.registerType(lifetime + '_provides_context_through_transient', function (transient_provides_context) {
                        this.dependency = transient_provides_context;
                    }, lifetime)
                );
                result.push(injector.registerType(lifetime + '_provides_context_through_root', function (root_provides_context) {
                        this.dependency = root_provides_context;
                    }, lifetime)
                );
                result.push(injector.registerType(lifetime + '_provides_context_through_state', function (state_provides_context) {
                        this.dependency = state_provides_context;
                    }, lifetime)
                );
                result.push(injector.registerType(lifetime + '_provides_context_through_singleton', function (singleton_provides_context) {
                        this.dependency = singleton_provides_context;
                    }, lifetime)
                );
                result.push(injector.registerType(lifetime + '_provides_context_through_parent', function (parent_provides_context) {
                        this.dependency = parent_provides_context;
                    }, lifetime)
                );
            }
        })();
    }
};
