let i = 0;
export const defaultFactory = {
    createDescriptor(type, dependencies) {
        return {
            name: 'test',
            type,
            dependencies,
            hashCode: ++i
        };
    },
    createSpec(descriptor) {
        return {
            id: ++i,
            dependencies: [
                {id: ++i, provider: () => () => 5, descriptor: 'test'},
                {id: ++i, provider: () => () => 3, descriptor: 'test2'}
            ],
            descriptor
        };
    }
};

export const providerFactory = {
    createDescriptor() {
        return {
            name: 'test::provider',
            hashCode: ++i,
            type: function (a, b, c) {
                a.b = b;
                a.c = c;
                return a;
            },
            dependencies: ['b', 'c']
        };
    },
    createSpec: defaultFactory.createSpec
};

export const passiveProviderFactory = {
    createDescriptor(name, provider) {
        return {
            name: `${name}::passive`,
            type: provider,
            dependencies: [name]
        };
    },
    createSpec(descriptor) {
        const dependencies = [{id: ++i, provider(adhoc){return adhoc.instance;}}];
        return {
            id: ++i,
            provider: (adhoc) => dependencies.map((dep)=> dep.provider(adhoc))[0],
            descriptor,
            dependencies
        };
    }
};

export const constantValueFactory = {
    createDescriptor() {
        return {
            name: 'test',
            hashCode: 999
        };
    },
    createSpec() {
        return {
            id: 1000,
            descriptor: constantValueFactory.createDescriptor()
        };
    }
};

export function buildRuntimeStores() {
    return {
        types: {},
        fakes: {},
        state: {},
        cache: {},
        DEFAULT_LIFETIME: 'transient'
    };
}
