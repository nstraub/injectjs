(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InjectJS = exports.ProviderProxy = exports.ProviderBuilder = exports.providers = exports.stores = exports.local_teardown = exports.global_setup = undefined;

var _provider = __webpack_require__(2);

var _provider2 = _interopRequireDefault(_provider);

var _provider3 = __webpack_require__(1);

var _provider4 = _interopRequireDefault(_provider3);

var _InjectJS = __webpack_require__(7);

var _InjectJS2 = _interopRequireDefault(_InjectJS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stores = Object.create(null),
    providers = {},
    ProviderBuilder = (0, _provider2.default)(stores, providers),
    ProviderProxy = (0, _provider4.default)(stores, providers),
    InjectJS = (0, _InjectJS2.default)(stores),
    global_setup = function global_setup() {

    jasmine.addMatchers({
        toBeInstanceOf: function toBeInstanceOf() {
            return {
                compare: function compare(actual, expected) {
                    return {
                        message: function message() {
                            return 'Expected ' + actual.constructor.name + ' is instance of ' + expected.name;
                        },
                        pass: expected.isPrototypeOf(actual)
                    };
                }
            };
        }
    });
},
    local_teardown = function local_teardown() {
    for (var key in stores) {
        stores[key] = {};
    }
};

exports.global_setup = global_setup;
exports.local_teardown = local_teardown;
exports.stores = stores;
exports.providers = providers;
exports.ProviderBuilder = ProviderBuilder;
exports.ProviderProxy = ProviderProxy;
exports.InjectJS = InjectJS;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (stores, providers) {
    if (!ProviderProxy) {
        ProviderProxy = createProviderProxyPrototype(stores, providers);
    }

    return ProviderProxy;
};

function createProviderProxyPrototype(stores, providers) {
    if (!stores) {
        throw new TypeError('no stores object passed.');
    }

    if (!providers) {
        throw new TypeError('no providers object passed.');
    }

    providers.base = {
        $get: function $get() {
            throw 'not implemented';
        },
        _instantiate: function _instantiate() {
            throw 'not implemented';
        }
    };

    providers.transient = Object.create(providers.base);
    providers.singleton = Object.create(providers.base);
    providers.state = Object.create(providers.base);
    providers.root = Object.create(providers.base);
    providers.parent = Object.create(providers.base);

    return {
        $get: function $get() {
            throw 'not implemented';
        }
    };
}

var ProviderProxy = null;

exports.createProviderProxyPrototype = createProviderProxyPrototype;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (stores, providers) {
    if (!ProviderBuilder) {
        ProviderBuilder = createProviderBuilderPrototype(stores, providers);
    }

    return ProviderBuilder;
};

var _lodash = __webpack_require__(4);

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = __webpack_require__(5);

var _lodash4 = _interopRequireDefault(_lodash3);

var _invalidOperationError = __webpack_require__(6);

var _invalidOperationError2 = _interopRequireDefault(_invalidOperationError);

var _provider = __webpack_require__(1);

var _provider2 = _interopRequireDefault(_provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createProviderBuilderPrototype(stores, providers) {
    return {
        to: function to(dependency) {
            if (this._dependency) {
                throw new _invalidOperationError2.default('This interface is already bound to a type');
            }
            if (!((0, _lodash2.default)(dependency) || (0, _lodash4.default)(dependency))) {
                throw new TypeError('Object or Function expected. \'' + dependency + '\' is neither');
            }
            this._dependency = dependency;
            this._dependencyType = (0, _lodash2.default)(dependency) ? 'ctor' : 'proto';
            if (this._post_provider) {
                this._post_provider._inject.unshift(dependency);
            }
            return this;
        },

        withLifetime: function withLifetime(lifetime_name) {
            if (!providers[lifetime_name]) {
                throw new ReferenceError('provider \'' + lifetime_name + '\' doesn\'t exist');
            }

            this._lifetime_provider = Object.create(providers[lifetime_name]);
            if (this._lifetime_provider._assert_usable) {
                this._lifetime_provider._assert_usable();
            }

            return this;
        },
        asTransient: function asTransient() {
            return this.withLifetime('transient');
        },
        asSingleton: function asSingleton() {
            return this.withLifetime('singleton');
        },
        asState: function asState() {
            return this.withLifetime('state');
        },
        asRoot: function asRoot() {
            return this.withLifetime('root');
        },
        asParent: function asParent() {
            return this.withLifetime('parent');
        },

        toProvider: function toProvider(provider) {
            var ProviderProxy = (0, _provider2.default)();
            if (this._dependency) {
                throw new _invalidOperationError2.default('This interface is already bound to a type');
            }
            if (!(0, _lodash2.default)(provider)) {
                throw new TypeError('function expected. \'' + provider + '\' is not a function');
            }
            this._dependency = Object.create(ProviderProxy);
            this._dependency.$get = provider;
            this._dependencyType = 'provider';
            return this;
        },

        withPostProvider: function withPostProvider(provider) {
            var ProviderProxy = (0, _provider2.default)();

            if (!(ProviderProxy.isPrototypeOf(provider) || (0, _lodash2.default)(provider))) {
                throw new TypeError('ProviderProxy instance or Function expected. \'' + provider + '\' is neither');
            }
            if (ProviderProxy.isPrototypeOf(provider)) {
                this._post_provider = provider;
            } else {
                this._post_provider = Object.create(ProviderProxy);
                this._post_provider.$get = provider;
            }
            this._post_provider._inject = this._inject;
            return this;
        },

        dependsOn: function dependsOn(dependencies) {
            if (!(dependencies instanceof Array)) {
                throw new TypeError('array expected. \'' + dependencies + '\' is not an array');
            }

            dependencies.forEach(function (dependency, index) {
                if (typeof dependency === 'string') {
                    dependencies[index] = {
                        name: dependency,
                        provider: stores.providers[dependency]
                    };
                } else if (!(0, _lodash4.default)(dependency)) {
                    throw new TypeError('dependency at index ' + index + ' is ' + Object.prototype.toString.call(dependency) + '. it should be either a string or an object');
                }
                if (dependency.static) {
                    dependency.provider = stores.providers[dependency.name];
                    if (!dependency.provider) {
                        console.warn('static dependency ' + dependency.name + ' is not registered');
                    }
                }
            });
            this._inject = dependencies;
            return this;
        }
    };
}

var ProviderBuilder = null;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _setup = __webpack_require__(0);

var _InjectJS = __webpack_require__(8);

var _InjectJS2 = _interopRequireDefault(_InjectJS);

var _providers = __webpack_require__(10);

var _providers2 = _interopRequireDefault(_providers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('InjectJS', function () {
    beforeAll(_setup.global_setup);
    afterEach(_setup.local_teardown);

    describe('Main Module', _InjectJS2.default);
    describe('Providers', _providers2.default);
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash 3.0.8 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isFunction;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InvalidOperationError = function (_Error) {
    _inherits(InvalidOperationError, _Error);

    function InvalidOperationError(message) {
        _classCallCheck(this, InvalidOperationError);

        var _this = _possibleConstructorReturn(this, (InvalidOperationError.__proto__ || Object.getPrototypeOf(InvalidOperationError)).call(this, message || 'no message provided, see stack trace'));

        _this.name = 'InvalidOperationError';
        return _this;
    }

    return InvalidOperationError;
}(Error);

exports.default = InvalidOperationError;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (stores) {
    stores = stores || {};
    stores.providers = stores.providers || {};
    return {
        bind: function bind(dependency_name) {
            if (typeof dependency_name !== 'string') {
                throw new TypeError('you must supply a name for your dependency');
            }
            return stores.providers[dependency_name] = Object.create((0, _provider2.default)());
        }
    };
};

var _provider = __webpack_require__(2);

var _provider2 = _interopRequireDefault(_provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    describe('bind method', _bindMethod2.default);
};

var _bindMethod = __webpack_require__(9);

var _bindMethod2 = _interopRequireDefault(_bindMethod);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    it('should register a new provider proxy in the providers store', function () {
        _setup.InjectJS.bind('test');

        expect(_setup.stores.providers.test).toBeInstanceOf(_setup.ProviderBuilder);
    });
    it('should return registered provider proxy', function () {
        var provider = _setup.InjectJS.bind('test');

        expect(_setup.stores.providers.test).toBe(provider);
    });
    it('should throw an error if no dependency name is passed', function () {
        expect(function () {
            _setup.InjectJS.bind();
        }).toThrowError('you must supply a name for your dependency');
    });
    it('should replace an existing dependency provider with a new one if the same name is passed', function () {
        var provider = _setup.InjectJS.bind('test');

        expect(_setup.InjectJS.bind('test')).not.toBe(provider);
    });
};

var _setup = __webpack_require__(0);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    describe('provider proxy prototype factory', function () {
        it('should throw an error when no stores object is passed', function () {
            expect(function () {
                (0, _provider.createProviderProxyPrototype)();
            }).toThrowError('no stores object passed.');
        });
        it('should throw an error when no providers object is passed', function () {
            expect(function () {
                (0, _provider.createProviderProxyPrototype)({});
            }).toThrowError('no providers object passed.');
        });
    });

    describe('provider proxy', _proxyProvider2.default);

    describe('provider builder', _providerBuilder2.default);

    describe('base provider', _baseProvider2.default);

    describe('transient provider', _transientProvider2.default);

    describe('singleton provider', _singletonProvider2.default);

    describe('state provider', _stateProvider2.default);

    describe('root provider', _rootProvider2.default);

    describe('parent provider', _parentProvider2.default);
};

var _provider = __webpack_require__(1);

var _proxyProvider = __webpack_require__(11);

var _proxyProvider2 = _interopRequireDefault(_proxyProvider);

var _providerBuilder = __webpack_require__(12);

var _providerBuilder2 = _interopRequireDefault(_providerBuilder);

var _baseProvider = __webpack_require__(13);

var _baseProvider2 = _interopRequireDefault(_baseProvider);

var _transientProvider = __webpack_require__(14);

var _transientProvider2 = _interopRequireDefault(_transientProvider);

var _singletonProvider = __webpack_require__(15);

var _singletonProvider2 = _interopRequireDefault(_singletonProvider);

var _stateProvider = __webpack_require__(16);

var _stateProvider2 = _interopRequireDefault(_stateProvider);

var _rootProvider = __webpack_require__(17);

var _rootProvider2 = _interopRequireDefault(_rootProvider);

var _parentProvider = __webpack_require__(18);

var _parentProvider2 = _interopRequireDefault(_parentProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    describe('$get method', function () {
        it('should defer to dependency provider\'s $get method');
    });
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var _provider = void 0;
    beforeEach(function () {
        return _provider = Object.create(_setup.ProviderBuilder);
    });

    describe('lifetime methods', function () {

        describe('withLifetime method', function () {

            it('should set the appropriate lifetime provider', function () {
                _provider.withLifetime('singleton');
                expect(_provider._lifetime_provider).toBeInstanceOf(_setup.providers.singleton);
            });

            it('should throw an error if lifetime provider doesn\'t exist', function () {
                expect(function () {
                    _provider.withLifetime('nothing');
                }).toThrowError('provider \'nothing\' doesn\'t exist');
            });

            it('should call lifetime provider\'s _assert_usable method if present', function () {
                _setup.providers.test = Object.create(_setup.providers.base);
                _setup.providers.test._assert_usable = jasmine.createSpy();

                _provider.withLifetime('test');

                expect(_setup.providers.test._assert_usable).toHaveBeenCalledTimes(1);
                delete _setup.providers.test;
            });

            it('should return itself', function () {
                expect(_provider.withLifetime('singleton')).toBe(_provider);
            });
        });

        describe('lifetime method shortcuts', function () {
            beforeEach(function () {
                _provider.withLifetime = jasmine.createSpy('withLifetime', function () {
                    return _provider;
                }).and.callThrough();
            });

            ['asTransient', 'asSingleton', 'asState', 'asRoot', 'asParent'].forEach(function (lifetimeMethod) {
                describe(lifetimeMethod + ' method', function () {
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
            var inject = [{
                name: 'test',
                provider: null
            }];

            _provider.dependsOn(inject);

            expect(_provider._inject).toBe(inject);
        });
        it('should transform text entries into dependency objects', function () {
            _provider.dependsOn(['test']);
            expect(_provider._inject).toEqual([{ name: 'test', provider: undefined }]);
        });
        it('should warn if any static dependencies aren\'t registered', function () {
            var inject = [{
                name: 'test',
                static: true,
                provider: null
            }];

            spyOn(console, 'warn');
            _provider.dependsOn(inject);

            expect(console.warn).toHaveBeenCalledWith('static dependency test is not registered');
        });
        it('should assert circular references for static dependencies');
        it('should throw an error if passed argument isn\'t an array', function () {
            expect(function () {
                _provider.dependsOn('invalid');
            }).toThrowError('array expected. \'invalid\' is not an array');
            expect(function () {
                _provider.dependsOn({});
            }).toThrowError('array expected. \'[object Object]\' is not an array');
        });

        it('should throw an error if dependency in passed array is not an object nor a string', function () {
            expect(function () {
                _provider.dependsOn([[]]);
            }).toThrowError('dependency at index 0 is [object Array]. it should be either a string or an object');
        });

        it('should return itself', function () {
            expect(_provider.dependsOn([])).toBe(_provider);
        });
    });

    describe('to method', function () {
        it('should register passed argument on _dependency as a constructor when passed a function', function () {
            var ctor = function ctor() {};
            _provider.to(ctor);

            expect(_provider._dependency).toBe(ctor);
            expect(_provider._dependencyType).toEqual('ctor');
        });
        it('should register passed argument on _dependency as a prototype when passed an object', function () {
            var ctor = {};
            _provider.to(ctor);

            expect(_provider._dependency).toBe(ctor);
            expect(_provider._dependencyType).toEqual('proto');
        });
        it('should prepend _dependency to the _inject array of _post_provider if present', function () {
            var ctor = {};
            _provider._post_provider = { _inject: [] };
            _provider.to(ctor);

            expect(_provider._post_provider._inject[0]).toBe(ctor);
        });
        it('should throw an error if argument is not a function or an object', function () {
            expect(function () {
                return _provider.to('invalid');
            }).toThrowError('Object or Function expected. \'invalid\' is neither');
        });
        it('should throw an error if there already is a registered provider', function () {
            _provider.to({});
            expect(function () {
                return _provider.to({});
            }).toThrowError('This interface is already bound to a type');
        });
        it('should return itself', function () {
            expect(_provider.to({})).toBe(_provider);
        });
    });

    describe('toProvider method', function () {
        it('should register passed function as the provider for the dependency', function () {
            var provider = function provider() {};
            _provider.toProvider(provider);
            expect(_provider._dependency).toBeInstanceOf(_setup.ProviderProxy);
            expect(_provider._dependency.$get).toBe(provider);
            expect(_provider._dependencyType).toEqual('provider');
        });
        it('should throw an error if there already is a registered constructor or prototype', function () {
            var provider = function provider() {};
            _provider.to({});
            expect(function () {
                return _provider.toProvider(provider);
            }).toThrowError('This interface is already bound to a type');
        });
        it('should throw an error if passed argument is not a function', function () {
            expect(function () {
                _provider.toProvider('invalid');
            }).toThrowError('function expected. \'invalid\' is not a function');
        });
        it('should return itself', function () {
            expect(_provider.toProvider(function () {})).toBe(_provider);
        });
    });

    describe('withPostProvider method', function () {
        it('should register passed function as a provider proxy on _post_provider property', function () {
            var provider = function provider() {};
            _provider.withPostProvider(provider);

            expect(_provider._post_provider).toBeInstanceOf(_setup.ProviderProxy);
            expect(_provider._post_provider.$get).toBe(provider);
        });
        it('should register passed provider proxy on _post_provider property', function () {
            var provider = Object.create(_setup.ProviderProxy);

            _provider.withPostProvider(provider);
            expect(_provider._post_provider).toBe(provider);
        });
        it('should default _inject to _inject on current provider proxy', function () {
            _provider._inject = ['test', 'test2'];
            _provider.withPostProvider(function () {});

            expect(_provider._post_provider._inject).toBe(_provider._inject);
        });
        it('should throw an error if passed argument isn\'t a function nor a provider proxy', function () {
            expect(function () {
                return _provider.withPostProvider('invalid');
            }).toThrowError('ProviderProxy instance or Function expected. \'invalid\' is neither');
        });
        it('should return itself', function () {
            expect(_provider.withPostProvider(function () {})).toBe(_provider);
        });
    });
};

var _setup = __webpack_require__(0);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    describe('_instantiate method', function () {
        it('should create a new instance of the dependency when constructor or prototype registered', function () {
            _setup.providers.base;
        });
        it('should throw an error if provider registered');
        it('should run _post_provider if registered');
        it('should assert all static dependencies exist');
        it('should assert circular references for non-checked static dependencies');
        it('should assert all ad-hoc dependencies were passed in the adhoc_dependencies argument');
        it('should $get all required dependencies for graph');
        it('should pass in adhoc parameter when building graph');
    });
};

var _setup = __webpack_require__(0);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    describe('$get method', function () {
        it('should always _instantiate dependency');
    });
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    describe('$get method', function () {
        it('should _instantiate dependency only once');
        it('should return the same instance if invoked twice');
    });
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    describe('$get method', function () {
        it('should _instantiate dependency if not present in state store');
        it('should return a proxy for dependency that points to the current dependency in state store');
        it('should create proxy for dependency if not present in state proxies store');
        it('should throw an error if _assert_usable fails and there is no _proxy specified');
    });

    describe('_create_proxy method', function () {
        it('should define proxy functions for methods on the dependency');
        it('should define proxy getter and setter for read/write properties');
        it('should define proxy getter for read-only properties');
        it('should correctly configure descriptor flags');
    });

    describe('_assert_usable method', function () {
        it('should throw an error if `Object.defineProperty` isn\'t supported');
        it('should throw an error if `Object.getOwnPropertyDescriptor` isn\'t supported');
        it('should cache its response');
    });
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    describe('$get method', function () {});
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {

    describe('$get method', function () {});
};

/***/ })
/******/ ]);
});