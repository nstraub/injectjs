/* exported Injector */
function Injector() {
    this.types = {};
    this.providers = {};
    this.fakes = {};
    this.state = {};
}

Injector.prototype.DEFAULT_LIFETIME = 'transient';

Injector.prototype.cache = {};

Injector.prototype.roots = {};

Injector.prototype.currentHashCode = 1;
