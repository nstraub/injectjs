/**
 * Created by nico on 19/03/2015.
 */
(function () {

    function Foo(mouth, bar) {
        this.mouth = mouth;
        this.bar = bar;
    }

    Foo.prototype.greet = function () {
        this.mouth.say('hello sir');
    };

    Foo.prototype.startParty = function () {
        this.greet = this.bar.greet;
    };

    Foo.prototype.endParty = function () {
        this.greet = Foo.prototype.greet.bind(this);
    };

    injector.registerType('foo', Foo, 'singleton');
}());
