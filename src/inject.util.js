/* globals Injector: false */
/* globals old_injector: false */
/* globals angular: false */
/* globals window: false */
/* exported get_dependency_names*/

var get_dependency_names = (function () {
    var dependency_pattern = /^function ?\w* ?\(((?:\w+|(?:, ?))+)\)/;
    var separatorPattern = /, ?/;

    return function get_dependency_names(type) {
        var serialized_type = type.toString();
        var serialized_dependencies;

        if (serialized_dependencies = dependency_pattern.exec(serialized_type)) {
            return serialized_dependencies[1].split(separatorPattern);
        } else {
            return null;
        }
    };
}());

Injector.prototype.getType = function (name) {
    var type = this.fakes[name] || this.types[name];

    if (type) {
        return type.type;
    }
    return null;
};

Injector.prototype.extend = function (parent, child) {
    var parent_type = this.types[parent];
    if (!parent_type) {
        throw 'No type "' + parent + '" found.';
    } else if (parent_type.lifetime !== 'transient') {
        throw 'Only transient lifetime types are allowed for now';
    } else {
        child.prototype = this.get(parent);
    }
};

Injector.prototype.noConflict = function () {
    window.injector = old_injector;
};

/*-------------------
 -- State Lifetime --
 -------------------*/

Injector.prototype.clearState = function () {
    var _this = this;

    _.each(this.state, function (provider, key) {
        if (_this.cache[key]) {
            delete _this.cache[key];
        }
    });
    this.state = {};
};

var injector = new Injector();

if (window.angular && angular.module) {
    angular.module('injectJS', []).factory('$injectJS', [function () { return injector; }]).run(['$rootScope', '$injectJS', function ($rootScope, $injectJS) {
        $rootScope.$on('$locationChangeStart', function () {
            $injectJS.clearState();
        });
        $injectJS.removeDefaultListener();
    }]);
}

var listener = function () {
    injector.clearState();
};

window.addEventListener('hashchange', listener);

Injector.prototype.removeDefaultListener = function () {
    window.removeEventListener('hashchange', listener);
};
