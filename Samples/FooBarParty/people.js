/**
 * Created by nico on 25/03/2015.
 */
(function () {
    injector.registerProvider('people', function (foo, bar, baz) {
        var people = [];
        people.push(foo);
        people.push(bar);
        people.push(baz);

        return people;
    });
}());
