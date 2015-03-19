/**
 * Created by nico on 19/03/2015.
 */
$(function () {
    $('#start-party').on('click', function () {
        var foo = people[0]; // at this point anything could've happened
        var bar = people[1];

        foo.startParty();
        foo.greet();
        bar.greet();
    });
});
