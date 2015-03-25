/**
 * Created by nico on 25/03/2015.
 */
(function () {
    function Person(mouth) {
        this.mouth = mouth;
    }

    Person.prototype.greet = function () {
        throw 'not implemented';
    };

    injector.registerType('person', Person)
}());
