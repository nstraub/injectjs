/**
 * Created by nico on 19/03/2015.
 */
(function () {
    function Bar() { }

    injector.extend('person', Bar);

    Bar.prototype.greet = function () {
        this.mouth.say('hello mate!');
    };


    injector.registerType('bar', Bar, 'singleton');
}());
