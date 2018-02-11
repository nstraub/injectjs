import injector from '../instantiate.injector';
const lifetimes = ['transient', 'root', 'state', 'singleton', 'parent'];


export default {
    reset_injector() {
        injector.currentHashCode = 1;
        injector.types = {};
        injector.providers = {};
        injector.fakes = {};
        this.reset_injector_cache();

    },
    reset_injector_cache() {
        injector.cache = {};
        injector.state = {};

    },
    next_hash() {
        return injector.currentHashCode++;
    },
    make_descriptor(options) {
        const val = options.target,
            target = val != null ? val : 'types',
            {name} = options,
            val1 = options.lifetime,
            lifetime = val1 != null ? val1 : target === 'types' ? 'transient' : undefined,
            val2 = options.type,
            type = val2 != null ? val2 : function () {
            },
            {
                dependencies,
                provider
            } = options;

        injector[target][name] = {
            name,
            type,
            hashCode: this.next_hash(),
            dependencies,
            lifetime,
            provider
        };

    },
    assign_base_types() {
        for (let lifetime of lifetimes) {
            this.make_descriptor({name: `base_${lifetime}_type`, lifetime});
        }

    },

    assign_base_providers() {
        this.make_descriptor({target: 'providers', name: 'base_provider'});
        this.make_descriptor({
            target: 'providers', name: 'provider_returns_context', type() {
                return this;
            }
        });

    },

    assign_passive_types() {
        for (let lifetime of lifetimes) {
            this.make_descriptor({
                name: `passive_${lifetime}_type`,
                lifetime,
                provider: `passive_${lifetime}_provider`
            });
            this.make_descriptor({
                name: `passive_${lifetime}_type_with_anon_provider`,
                lifetime,
                provider(type) {
                    type.passively_provided = true;
                    return type;
                }
            });
            this.make_descriptor({
                name: `passive_${lifetime}_type_with_anon_array`,
                lifetime,
                provider: ['type', function (type) {
                    type.passively_provided = true;
                    return type;
                }
                ]
            });

            this.make_descriptor({
                target: 'providers',
                name: `passive_${lifetime}_provider`,
                type(type) {
                    type.passively_provided = true;
                    return type;
                },
                dependencies: [`passive_${lifetime}_type`]
            });
        }

    },

    assign_basic_dependent_types() {
        for (let lifetime of lifetimes) {
            for (let dependency_lifetime of lifetimes) {
                this.make_descriptor({
                    name: lifetime + '_depends_on_' + dependency_lifetime,
                    lifetime,
                    type(dependency) {
                        this.dependency = dependency;
                    },
                    dependencies: [`base_${dependency_lifetime}_type`]
                });
            }
        }

    },

    assign_context_dependent_types() {
        this.assign_base_providers();
        return (() => {
            const result = [];
            for (var lifetime of lifetimes) {
                this.make_descriptor({
                    lifetime,
                    name: lifetime + '_provides_context',
                    dependencies: ['provider_returns_context'],
                    type(dependency) {
                        this.dependency = dependency;
                    }
                });
                result.push(lifetimes.map((dependency_lifetime) => {
                    return this.make_descriptor({
                        lifetime,
                        name: lifetime + '_provides_context_through_' + dependency_lifetime,
                        dependencies: [dependency_lifetime + '_provides_context'],
                        type(dependency) {
                            this.dependency = dependency;
                        }
                    });
                }));
            }
            return result;
        })();
    }
};
