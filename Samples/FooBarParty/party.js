/**
 * Created by nico on 19/03/2015.
 */
$(function () {
    $('#start-party').click(injector.inject(function (foo, bar) {
        foo.startParty();
        foo.greet();
        bar.greet();
        foo.endParty();
    }));
});
