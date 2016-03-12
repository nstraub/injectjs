/* globals Injector: false */
/* globals injector: false */
/* globals old_injector: false */
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
    if (parent_type) {
        child.prototype = this.get(parent);
    } else {
        throw 'No type "' + parent + '" found.';
    }
};

function listener() {
    injector.clearState();
}

Injector.prototype.noConflict = function () {
    window.injector = old_injector;
};

Injector.prototype.removeDefaultListener = function () {
    window.removeEventListener('hashchange', listener);
};

/*-------------------
 -- State Lifetime --
 -------------------*/

Injector.prototype.clearState = function () {
    this.state = {};
    _.each(this.types, function (descriptor, key) {
        if (descriptor.lifetime === 'state') {
            delete this.cache[key];
        }
    }, this);
};

//Todo implement so this is de-registered if another form of state change is bound
window.addEventListener('hashchange', listener);
