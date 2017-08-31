import {ProviderBuilder, ProviderProxy, providers} from '../util/setup.teardown';
/*global describe*/
/*global it*/
/*global expect*/
/*global spyOn*/

/*global beforeEach*/
/*global jasmine*/

export default function () {
    let _provider;
    beforeEach(() => _provider = Object.create(ProviderBuilder));

    describe('lifetime methods', function () {

        describe('withLifetime method', function () {

            it('should set the appropriate lifetime provider', function () {
                _provider.withLifetime('singleton');
                expect(_provider._lifetime_provider).toBeInstanceOf(providers.singleton);
            });

            it('should throw an error if lifetime provider doesn\'t exist', function () {
                expect(function () { _provider.withLifetime('nothing'); }).toThrowError('provider \'nothing\' doesn\'t exist');
            });

            it('should call lifetime provider\'s _assert_usable method if present', function () {
                providers.test = Object.create(providers.base);
                providers.test._assert_usable = jasmine.createSpy();

                _provider.withLifetime('test');

                expect(providers.test._assert_usable).toHaveBeenCalledTimes(1);
                delete providers.test;
            });

            it('should return itself', function () {
                expect(_provider.withLifetime('singleton')).toBe(_provider);
            });
        });

        describe('lifetime method shortcuts', function () {
            beforeEach(function () {
                _provider.withLifetime = jasmine.createSpy('withLifetime', function () { return _provider; }).and.callThrough();
            });

            ['asTransient', 'asSingleton', 'asState', 'asRoot', 'asParent'].forEach(function (lifetimeMethod) {
                describe(`${lifetimeMethod} method`, function () {
                    it('should call withLifetime with appropriate lifetime provider name', function () {
                        _provider[lifetimeMethod]();
                        expect(_provider.withLifetime).toHaveBeenCalledWith(lifetimeMethod.substr(2).toLowerCase());
                    });
                    it('should return itself', function () {
                        expect(_provider[lifetimeMethod]()).toBe(_provider);
                    });
                });
            });
        });
    });

    describe('dependsOn method', function () {
        it('should set the _inject property with passed array', function () {
            const inject = [
                {
                    name: 'test',
                    provider: null
                }
            ];

            _provider.dependsOn(inject);

            expect(_provider._inject).toBe(inject);
        });
        it('should transform text entries into dependency objects', function () {
            _provider.dependsOn(['test']);
            expect(_provider._inject).toEqual([{name: 'test', provider: undefined}]);
        });
        it('should warn if any static dependencies aren\'t registered', function () {
            const inject = [
                {
                    name: 'test',
                    static: true,
                    provider: null
                }
            ];

            spyOn(console, 'warn');
            _provider.dependsOn(inject);

            expect(console.warn).toHaveBeenCalledWith('static dependency test is not registered');
        });
        it('should assert circular references for static dependencies');
        it('should throw an error if passed argument isn\'t an array', function () {
            expect(function () { _provider.dependsOn('invalid'); }).toThrowError('array expected. \'invalid\' is not an array');
            expect(function () { _provider.dependsOn({}); }).toThrowError('array expected. \'[object Object]\' is not an array');
        });

        it('should throw an error if dependency in passed array is not an object nor a string', function () {
            expect(function () { _provider.dependsOn([[]]); }).toThrowError('dependency at index 0 is [object Array]. it should be either a string or an object');
        });

        it('should return itself', function () {
            expect(_provider.dependsOn([])).toBe(_provider);
        });
    });

    describe('to method', function () {
        it('should register passed argument on _dependency as a constructor when passed a function', function () {
            const ctor = function () {
            };
            _provider.to(ctor);

            expect(_provider._dependency).toBe(ctor);
            expect(_provider._dependencyType).toEqual('ctor');
        });
        it('should register passed argument on _dependency as a prototype when passed an object', function () {
            const ctor = {};
            _provider.to(ctor);

            expect(_provider._dependency).toBe(ctor);
            expect(_provider._dependencyType).toEqual('proto');
        });
        it('should prepend _dependency to the _inject array of _post_provider if present', function () {
            const ctor = {};
            _provider._post_provider = {_inject: []};
            _provider.to(ctor);

            expect(_provider._post_provider._inject[0]).toBe(ctor);
        });
        it('should throw an error if argument is not a function or an object', function () {
            expect(() => _provider.to('invalid')).toThrowError('Object or Function expected. \'invalid\' is neither');
        });
        it('should throw an error if there already is a registered provider', function () {
            _provider.to({});
            expect(() => _provider.to({})).toThrowError('This interface is already bound to a type');
        });
        it('should return itself', function () {
            expect(_provider.to({})).toBe(_provider);
        });
    });

    describe('toProvider method', function () {
        it('should register passed function as the provider for the dependency', function () {
            let provider = ()=>{};
            _provider.toProvider(provider);
            expect(_provider._dependency).toBeInstanceOf(ProviderProxy);
            expect(_provider._dependency.$get).toBe(provider);
            expect(_provider._dependencyType).toEqual('provider');
        });
        it('should throw an error if there already is a registered constructor or prototype', function () {
            let provider = ()=>{};
            _provider.to({});
            expect(()=>_provider.toProvider(provider)).toThrowError('This interface is already bound to a type');
        });
        it('should throw an error if passed argument is not a function', function () {
            expect(function () { _provider.toProvider('invalid'); }).toThrowError('function expected. \'invalid\' is not a function');
        });
        it('should return itself', function () {
            expect(_provider.toProvider(()=>{})).toBe(_provider);
        });
    });

    describe('withPostProvider method', function () {
        it('should register passed function as a provider proxy on _post_provider property', function () {
            let provider = ()=>{};
            _provider.withPostProvider(provider);

            expect(_provider._post_provider).toBeInstanceOf(ProviderProxy);
            expect(_provider._post_provider.$get).toBe(provider);
        });
        it('should register passed provider proxy on _post_provider property', function () {
            let provider = Object.create(ProviderProxy);

            _provider.withPostProvider(provider);
            expect(_provider._post_provider).toBe(provider);
        });
        it('should default _inject to _inject on current provider proxy', function () {
            _provider._inject = ['test', 'test2'];
            _provider.withPostProvider(()=>{});

            expect(_provider._post_provider._inject).toBe(_provider._inject);
        });
        it('should throw an error if passed argument isn\'t a function nor a provider proxy', function () {
            expect(()=> _provider.withPostProvider('invalid')).toThrowError('ProviderProxy instance or Function expected. \'invalid\' is neither');
        });
        it('should return itself', function () {
            expect(_provider.withPostProvider(()=>{})).toBe(_provider);
        });
    });
}