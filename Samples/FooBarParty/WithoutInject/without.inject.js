var people = (function () {
    function Mouth() {

    }

    Mouth.prototype.say = function (what) {
        alert(what);
    };

    function Foo(mouth, bar) {
        this.mouth = mouth;
        this.bar = bar;
    }

    Foo.prototype.greet = function () {
        this.mouth.say('hello sir');
    };

    Foo.prototype.startParty = function () {
        this.greet = this.bar.greet;
    };

    Foo.prototype.endParty = function () {
        this.greet = Foo.prototype.greet.bind(this);
    };

    function Bar(mouth) {
        this.mouth = mouth;
    }

    Bar.prototype.greet = function () {
        this.mouth.say('hello mate!');
    };

    var bar = new Bar(new Mouth());
    var foo = new Foo(new Mouth(), bar);

    return [foo, bar];
}());

$(function () {
    people[0].greet(); //probably foo, but not enforceable (people[0] = null is quite easy to code, right?)
    people[1].greet(); //again, probably bar
});
