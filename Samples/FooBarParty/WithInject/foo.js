/**
 * Created by nico on 19/03/2015.
 */
(function () {

    function Foo() {
    }
    injector.extend('person', Foo);

    Foo.prototype.greet = function () {
        this.mouth.say('hello sir');
    };

    injector.registerType('foo', Foo, 'singleton', 'fooProvider');
}());
