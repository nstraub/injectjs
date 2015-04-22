/**
 * Created by nico on 25/03/2015.
 */
(function () {
    function Baz() { }

    injector.extend('person', Baz);

    Baz.prototype.greet = function () {
        this.mouth.say('.');
    };


    injector.registerType('baz', Baz, 'singleton');
}());
