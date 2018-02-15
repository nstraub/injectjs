import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';

let injector;
export default function() {
    beforeAll(function() {
        injector = setup.reset_injector();
        return setup.assign_context_dependent_types();
    });

    it('applies a context when provided', function() {
        const result = injector.get('provider_returns_context', null, this);
        return expect(result).toBe(this);
    });

    for (let lifetime of lifetimes) {
        for (let dependency_lifetime of lifetimes) {
            if ((dependency_lifetime !== 'singleton') && (dependency_lifetime !== 'state')) {
                ((lifetime, dependency_lifetime) =>
                    it(lifetime + ' passes context up ' + dependency_lifetime + ' dependency tree', function() {
                        const type = injector.get(lifetime + '_provides_context_through_' + dependency_lifetime, null, this);

                        return expect(type.dependency.dependency).toBe(this);
                    })
                )(lifetime, dependency_lifetime);
            }
        }
    }

    return describe('providers', function() {
        beforeAll(() => setup.assign_base_types());
        it('returns the type`s provider when ::provider suffix is passed', function() {
            const provider = injector.get('base_transient_type::provider');
            return expect(provider()).toBeInstanceOf(injector.getType('base_transient_type'));
        });
        it('doesn`t interfere with parent lifetime in dependency tree', function() {
            setup.assign_passive_types();
            setup.make_descriptor({
                name: 'base_type',
                type(transient1) { this.transient1 = transient1; },
                dependencies: ['transient1']});

            setup.make_descriptor({
                name: 'transient1',
                type(passive_parent_type) { this.parent_lifetime = passive_parent_type; },
                dependencies: ['passive_parent_type']});

            const provider = injector.get('base_type::provider');
            const type1 = provider();
            const type2 = provider();
            return expect(type1.transient1.parent_lifetime).not.toBe(type2.transient1.parent_lifetime);
        });

        it('doesn`t interfere with parent lifetime when child of a root object in dependency tree', function() {
            setup.assign_passive_types();
            setup.make_descriptor({
                name: 'base_type',
                type(root1) { this.root_provider = root1; },
                dependencies: ['root1']});

            setup.make_descriptor({
                name: 'root1',
                type(passive_parent_type) { this.parent_lifetime = passive_parent_type; },
                dependencies: ['passive_parent_type'],
                lifetime: 'root'
            });

            const type1 = injector.get('base_type');
            const type2 = injector.get('base_type');
            return expect(type1.root_provider.parent_lifetime).not.toBe(type2.root_provider.parent_lifetime);
        });

        return it('undescribed bug', function() {
            injector = setup.reset_injector();
            setup.make_descriptor({
                name: 'base_type',
                type(root_type_1) { this.root_type_1 = root_type_1; },
                dependencies: ['root_type_1']});

            setup.make_descriptor({
                name: 'root_type_1',
                type(root_type_2) { this.root_type_2 = root_type_2; },
                dependencies: ['root_type_2'],
                lifetime: 'root'
            });

            setup.make_descriptor({
                name: 'root_type_2',
                type: ['provider1', 'ad_hoc_1', 'transient_1::provider', function (provider1, ad_hoc_1, transient_1_provider) {
                    this.provider1 = provider1;
                    this.ad_hoc_1 = ad_hoc_1;
                    this.transient_1_provider = transient_1_provider;
                    this.transients = [];
                    this.transients.push(this.transient_1_provider.call(this.provider1, {ad_hoc_1: this.ad_hoc_1}));
                    this.transients.push(this.transient_1_provider.call(this.provider1, {ad_hoc_1: this.ad_hoc_1}));
                    this.transients.push(this.transient_1_provider.call(this.provider1, {ad_hoc_1: this.ad_hoc_1}));
                }],
                lifetime: 'root'
            });

            setup.make_descriptor({
                target: 'providers',
                name: 'provider1',
                type() { return 'provider1'; }
            });

            setup.make_descriptor({
                name: 'transient_1',
                type(parent_type_1, parent_type_2) { this.parent_type_1 = parent_type_1; this.parent_type_2 = parent_type_2; },
                dependencies: ['parent_type_1', 'parent_type_2']});

            setup.make_descriptor({
                name: 'transient_2',
                provider: [
                    'type',
                    type => type
                ]});

            setup.make_descriptor({
                name: 'parent_type_1',
                type(transient_2) { this.transient_2 = transient_2; },
                dependencies: ['transient_2'],
                lifetime: 'parent',
                provider: [
                    'type',
                    'parent_type_2',
                    function(type, parent_type_2) {
                        type.parent_type_2 = parent_type_2;
                        return type;
                    }
                    ]});

            setup.make_descriptor({
                name: 'parent_type_2',
                type(transient_2) { this.transient_2 = transient_2; },
                dependencies: ['transient_2'],
                lifetime: 'parent',
                provider: [
                    'type',
                    type => type
                    ]});

            let type = injector.get('base_type', {ad_hoc_1: 'adhoc2'});
            type = injector.get('base_type', {ad_hoc_1: 'adhoc2'});
            const { transients } = type.root_type_1.root_type_2;

            expect(transients[0]).not.toBe(transients[1], 'transients');
            expect(transients[0]).not.toBe(transients[2], 'transients');
            expect(transients[1]).not.toBe(transients[2], 'transients');


            expect(transients[0].parent_type_1).not.toBe(transients[1].parent_type_1, 'parent1');
            expect(transients[0].parent_type_1).not.toBe(transients[2].parent_type_1, 'parent1');
            expect(transients[1].parent_type_1).not.toBe(transients[2].parent_type_1, 'parent1');

            expect(transients[0].parent_type_1.parent_type_2).not.toBe(transients[1].parent_type_1.parent_type_2, '01parent2');
            expect(transients[0].parent_type_2).not.toBe(transients[2].parent_type_2, '02parent2');
            return expect(transients[1].parent_type_2).not.toBe(transients[2].parent_type_2, '12parent2');
        });
    });
};

