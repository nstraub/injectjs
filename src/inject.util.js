Injector.prototype.getType = function (name) {
    var type = this.fakes[name] || this.types[name];

    if (type) {
        return type.type;
    }
    return null
};

Injector.prototype.extend = function (parent, child) {
    var parent_type = this.types[parent];
    if (parent_type) {
        child.prototype = this.get(parent);
    } else {
        throw 'No type "' + parent + '" found.'
    }
};

function listener() {
    injector.clearState();
};

Injector.prototype.noConflict = function () {
    window.injector = old_injector;
};

Injector.prototype.removeDefaultListener = function () {
    window.removeEventListener('hashchange', listener)
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
