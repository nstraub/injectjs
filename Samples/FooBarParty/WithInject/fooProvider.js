/**
 * Created by nico on 25/03/2015.
 */
(function () {
    injector.registerProvider('fooProvider', function (foo, bar) {
        if (this.id === 'start-party') {
            foo.greet = _.bind(bar.greet, foo);
        } else {
            foo.greet = _.bind(injector.getType('foo').prototype.greet, foo);
        }

        return foo;
    });
}());
