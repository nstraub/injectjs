/**
 * Created by nico on 19/03/2015.
 */
(function () {
    function Bar(mouth) {
        this.mouth = mouth;
    }

    Bar.prototype.greet = function () {
        this.mouth.say('hello mate!');
    };

    injector.registerType('bar', Bar, 'singleton');
}());
