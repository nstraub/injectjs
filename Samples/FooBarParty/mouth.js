/**
 * Created by nico on 19/03/2015.
 */
(function () {
    function Mouth () {}

    Mouth.prototype.say = function (what) {
        alert(what);
    };

    injector.registerType('mouth', Mouth);
}());
