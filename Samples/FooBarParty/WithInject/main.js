/**
 * Created by nico on 19/03/2015.
 */
(function () {
    injector.registerMain(function(people) {
        _.each(people, function (person) {
            person.greet();
        });
    });

    $(function () {
        injector.run();
    });
}());
