import injector from '../instantiate.injector';


export default function() {
    beforeEach(function() {
        let test_type;
        return injector.types = {
            test: {
                name: 'test',
                dependencies: null,
                type: (test_type = class test_type {
                    constructor(test_dependency) {
                        this.test_dependency = test_dependency;
                    }
                }),
                lifetime: 'transient'
            }
        };
    });

    it('gets the type for a requested dependency', () => expect(injector.getType('test')).toBe(injector.types.test.type));

    it('returns null when requested dependency isn`t registered', () => expect(injector.getType('nothing')).toBeNull());

    return it('prioritizes fakes over types', function() {
        let fake_type;
        injector.fakes = {
            test: {
                name: 'test',
                dependencies: null,
                type: (fake_type = class fake_type {
                    constructor(test_dependency) {
                        this.test_dependency = test_dependency;
                    }
                }),
                lifetime: 'transient'
            }
        };

        expect(injector.getType('test')).toBe(injector.fakes.test.type);

        return injector.fakes = {};
});
};
