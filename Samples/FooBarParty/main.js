/**
 * Created by nico on 19/03/2015.
 */
(function () {
    injector.registerMain(function(foo, bar) {
        foo.greet(); // alerts "Hello sir"
        bar.greet(); // alerts "Hello mate!"
    });

    $(function () {
        injector.run();
    });
}());
