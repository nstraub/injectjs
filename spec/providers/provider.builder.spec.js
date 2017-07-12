import {ProviderBuilder, providers} from '../util/setup.teardown';
/*global describe*/
/*global it*/
/*global expect*/
/*global spyOn*/

/*global beforeEach*/
/*global jasmine*/

export default function () {
    debugger;
    let _provider;
    beforeEach(function () {
        _provider = Object.create(ProviderBuilder);
    });
    describe("lifetime methods", function () {
        describe("withLifetime method", function () {
            it("should set the appropriate lifetime provider", function () {
                _provider.withLifetime('singleton');
                expect(_provider._lifetime_provider).toBeInstanceOf(providers.singleton);
            });
            it("should throw an error if lifetime provider doesn't exist", function () {
                expect(function () { _provider.withLifetime('nothing'); }).toThrowError("provider 'nothing' doesn't exist");
            });
            it("should call lifetime provider's _assert_usable method if present", function () {
                providers.test = Object.create(providers.base);
                providers.test._assert_usable = jasmine.createSpy();

                _provider.withLifetime('test');

                expect(providers.test._assert_usable).toHaveBeenCalledTimes(1);
                delete providers.test;
            });
            it("should return itself", function () {
                expect(_provider.withLifetime('singleton')).toBe(_provider);
            });
        });

        describe("lifetime method shortcuts", function () {
            beforeEach(function () {
                _provider.withLifetime = jasmine.createSpy('withLifetime', function () { return _provider; }).and.callThrough();
            });

            describe("asTransient method", function () {
                it("should call withLifetime with appropriate lifetime provider name", function () {
                    _provider.asTransient();
                    expect(_provider.withLifetime).toHaveBeenCalledWith('transient');
                });
                it("should return itself", function () {
                    expect(_provider.asTransient()).toBe(_provider);
                });
            });

            describe("asSingleton method", function () {
                it("should call withLifetime with appropriate lifetime provider name", function () {
                    _provider.asSingleton();
                    expect(_provider.withLifetime).toHaveBeenCalledWith('singleton');
                });
                it("should return itself", function () {
                    expect(_provider.asSingleton()).toBe(_provider);
                });
            });

            describe("asState method", function () {
                it("should call withLifetime with appropriate lifetime provider name", function () {
                    _provider.asState();
                    expect(_provider.withLifetime).toHaveBeenCalledWith('state');
                });
                it("should return itself", function () {
                    expect(_provider.asState()).toBe(_provider);
                });
            });

            describe("asRoot method", function () {
                it("should call withLifetime with appropriate lifetime provider name", function () {
                    _provider.asRoot();
                    expect(_provider.withLifetime).toHaveBeenCalledWith('root');
                });
                it("should return itself", function () {
                    expect(_provider.asRoot()).toBe(_provider);
                });
            });

            describe("asParent method", function () {
                it("should call withLifetime with appropriate lifetime provider name", function () {
                    _provider.asParent();
                    expect(_provider.withLifetime).toHaveBeenCalledWith('parent');
                });
                it("should return itself", function () {
                    expect(_provider.asParent()).toBe(_provider);
                });
            });
        });
    });

    describe("dependsOn method", function () {
        it("should set the _inject property with passed array", function () {
            const inject = [
                {
                    name: 'test',
                    provider: null
                }
            ];

            _provider.dependsOn(inject);

            expect(_provider._inject).toBe(inject);
        });
        it("should transform text entries into dependency objects", function () {
            _provider.dependsOn(['test']);
            expect(_provider._inject).toEqual([{name: 'test', provider: undefined}]);
        });
        it("should warn if any static dependencies aren't registered", function () {
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
        it("should assert circular references for static dependencies");
        it("should throw an error if passed argument isn't an array", function () {
            expect(function () { _provider.dependsOn('invalid'); }).toThrowError("array expected. 'invalid' is not an array");
            expect(function () { _provider.dependsOn({}); }).toThrowError("array expected. '[object Object]' is not an array");
        });

        it("should throw an error if dependency in passed array is not an object nor a string", function () {
            expect(function () { _provider.dependsOn([[]]); }).toThrowError("dependency at index 0 is [object Array]. it should be either a string or an object");
        });

        it("should return itself", function () {
            expect(_provider.dependsOn([])).toBe(_provider);
        });
    });

    describe("with method", function () {
        it("should register passed argument on _dependency as a constructor when passed a function", function () {
            const ctor = function () {
            };
            _provider.to(ctor);

            expect(_provider._dependency).toBe(ctor);
            expect(_provider._dependencyType).toEqual('ctor');
        });
        it("should register passed argument on _dependency as a prototype when passed an object", function () {
            const ctor = {};
            _provider.to(ctor);

            expect(_provider._dependency).toBe(ctor);
            expect(_provider._dependencyType).toEqual('proto');
        });
        it("should prepend _dependency to the _inject array of _post_provider if present", function () {
            const ctor = {};
            _provider._post_provider = {_inject: []};
            _provider.to(ctor);

            expect(_provider._post_provider._inject[0]).toBe(ctor);
        });
        it("should throw an error if argument is not a function or an object");
        it("should throw an error if there already is a registered provider");
        it("should return itself");
    });

    describe("withProvider method", function () {
        it("should register passed function as the provider for the dependency");
        it("should throw an error if there already is a registered constructor or prototype");
        it("should throw an error if passed argument is not a function");
        it("should return itself");
    });

    describe("withPostProvider method", function () {
        it("should register passed function as a provider proxy on _post_provider property");
        it("should register passed provider proxy on _post_provider property");
        it("should default _inject to _inject on current provider proxy");
        it("should prepend _dependency to the _inject array if present");
        it("should throw an error if passed argument isn't a function nor a provider proxy");
        it("should return itself");
    });
};