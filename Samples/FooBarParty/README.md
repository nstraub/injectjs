### <a name="use-foo-bar-party"></a>Foo and Bar went off to a party

----------

1. [Foo and Bar at a Party](#use-foo-bar-party)
2. [Foo and Bar at a Party (using InjectJS)](#use-foo-bar-inject)
3. [Introducing Baz (Providers)](#use-providers)
4. [Passive Providers (Fixing the LSP Violation Issue)](#use-passive)


----------


    
    function Foo(mouth) {
        this.greet = function () {
            mouth.say('hello sir');
        }
    }
    
    function Bar(mouth) {
        this.greet = function () {
            mouth.say('hello mate!');
        }
    }
    
`Foo` is a military trained, well mannered object, so he treats everyone courteously. `Bar` on the other hand... well, you're probably more likely to run into him in a pub, but he's a good friend. More importantly, they both depend on having a mouth. Oh! and by the way, they're globals too! 

Now you have three choices: make Mouth global again, instantiate `Foo` and `Bar` within `Mouth`'s scope, or register these guys with InjectJS:

    injector.registerType('foo', function (mouth) {
        this.greet = function () {
            mouth.greet('sir');
        }
    });

    injector.registerType('bar', function (mouth) {
        this.greet = function () {
            mouth.greet('mate!');
        }
    });
    
    injector.registerMain(function(foo, bar) {
        foo.greet(); // alerts "Hello sir"
        bar.greet(); // alerts "Hello mate!"
    });
    
Finally, run your main function within your app's entry point

    $(function () {
        injector.run();
    });
    
Easy, right? but not of much value... let's try to fix that --- within the bounds of this silly example --- by adding a few rules: first, `Foo` and `Bar` must be singletons (after all, there can only be one `Foo` and only one `Bar`, just like there are only one you and me). Second `Foo` is aggregated by `Bar`, in an attempt to stop being so formal. Third, they must show up while the app is loading and at a subsequent party, which is nowhere near the start of the app (it's in party.js, of course!). Oh! and let's try to keep globals to a minimum:

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

    
Then on a separate file:

    $(function () {
        $('#start-party').on('click', function () {
            var foo = people[0]; // at this point anything could've happened
            var bar = people[1];
    
            foo.startParty();
            foo.greet();
            bar.greet();
        });
    });

Let's ignore the Liskov Substitution Principle violations in `Foo` for a while... what's wrong with this code?

1. It's tightly coupled (`Foo`, `Bar` and `Mouth` must live together if we don't want them to be global, and since `Foo` and `Bar` must be singletons, there's no way we can make them global anyway.
2. `Foo` and `Bar` aren't truly singletons (once they're added to people, there's no one who can assure us they won't be copied).
3. There's no reliability `people` will reach the party intact.
4. How do we add a `Baz` object with a `Mouth` outside of that already large and tightly coupled immediate function?

<a name="use-foo-bar-inject"></a>Now let's do the same with InjectJS:

First file (mouth.js):

    (function () {
        function Mouth () {}
    
        Mouth.prototype.say = function (what) {
            alert(what);
        };
    
        injector.registerType('mouth', Mouth);
    }());


Second file (foo.js):

    (function () {
    
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
    
        injector.registerType('foo', Foo, 'singleton');
    }());

Third file (bar.js):

    (function () {
        function Bar(mouth) {
            this.mouth = mouth;
        }
    
        Bar.prototype.greet = function () {
            this.mouth.say('hello mate!');
        };
    
        injector.registerType('bar', Bar, 'singleton');
    }());
    

Fourth file (main.js):

    (function () {
        injector.registerMain(function(foo, bar) {
            foo.greet(); // alerts "Hello sir"
            bar.greet(); // alerts "Hello mate!"
        });
    
        $(function () {
            injector.run();
        });
    }());


Fifth file (party.js):

    $(function () {
        $('#start-party').click(injector.inject(function (foo, bar) {
            foo.startParty();
            foo.greet();
            bar.greet();
            foo.endParty();
        }));
    });

Now, we have five decoupled units of logic, that work fine together without really even knowing about each other, because it's now the injector's responsibility to manage availability of the resources. So let's see:

1. It's loosely coupled.
2. Foo and Bar are singletons (bonus points if you noticed on your own). When registering a type, it's default lifetime is `transient`, which means a new instance of the type is created for every place it is injected into. by specifying `'singleton'` as the third argument, we change the object's behaviour to one instance per application, as simple as that (of course you can make a global variable and clone the singleton and muck everything up by adding an explode method that brings the party to shambles, but that would be kind of defeating the purpose, and can be done with the injector anyways :P)
3. Both foo and bar will be the same when injected into the main function and into the party function.
4. If Baz wants to join the party, he just needs to tell the injector he wants a mouth and be done with it, regardless of where he is declared.

### <a name="use-providers"></a>Introducing Baz (providers)

So along comes Baz, a new guy in town. He's rather shy and has nothing to say... you know, the kind of guy that sits in a corner all night while the rest of the party rages on... but still, he gets invited. So let's invite him!

First, we're going to refactor our code a bit, to introduce a `Person` object that `Foo`, `Bar` and `Baz` will extend:

	(function () {
	    function Person(mouth) {
	        this.mouth = mouth;
	    }
	
	    Person.prototype.greet = function () {
	        throw 'not implemented';
	    };
	
	    injector.registerType('person', Person)
	}());

Person is abstract, which means some (or in this case, all) of its methods are unimplemented, which means it's the child `Object's` task to implement them. For `Foo` and `Bar`, that's easy (since they're already implemented anyhow):

foo.js:

	(function () {
	
	    function Foo(bar) {
	        this.bar = bar;
	    }
	    injector.extend('person', Foo);
	
	    Foo.prototype.greet = function () {
	        this.mouth.say('hello sir');
	    };
	
	    Foo.prototype.startParty = function () {
	        this.greet = this.bar.greet;
	    };
	
	    Foo.prototype.endParty = function () {
	        this.greet = Foo.prototype.greet.bind(this);
	    };
	
	
	    injector.registerType('foo', Foo, 'singleton');
	}());

bar.js:

	(function () {
	    function Bar() { }
	
	    injector.extend('person', Bar);
	
	    Bar.prototype.greet = function () {
	        this.mouth.say('hello mate!');
	    };
	
	
	    injector.registerType('bar', Bar, 'singleton');
	}());

Note how `Foo` and `Bar` no longer need to refer to mouth as a dependency, that's handled by `Person`. Also note the use of the `extend` utility method, which basically does `child.prototype = new parent()` but ensures all the dependencies for `parent` are met. Now for `Baz`:

	(function () {
	    function Baz() { }
	
	    injector.extend('person', Baz);
	
	    Baz.prototype.greet = function () {
	        this.mouth.say('.');
	    };
	
	
	    injector.registerType('baz', Baz, 'singleton');
	}());

Not a very expressive one, is he? but he's invited to the app's start and the party anyway:

main.js:

	(function () {
	    injector.registerMain(function(foo, bar, baz) {
	        foo.greet(); // alerts "Hello sir"
	        bar.greet(); // alerts "Hello mate!"
			baz.greet();
	    });
	
	    $(function () {
	        injector.run();
	    });
	}());

party.js

	$(function () {
	    $('#start-party').click(injector.inject(function (foo, bar, baz) {
	        foo.startParty();
	        foo.greet();
	        bar.greet();
			baz.greet();
	        foo.endParty();
	    }));
	});

OK... this is getting a bit tedious. What if there are three parties instead of one? we'd have to add `baz` to four different files. What if `blargh`, `bret`, `briff` and `blot` suddenly decide to join all three parties? Managing dependencies in all those places suddenly starts getting a bit more complicated than expected... what if we could just inject an `array` of all these `people` and manage them from a centralized location?

	(function () {
	    injector.registerProvider('people', function (foo, bar, baz) {
	        var people = [];
	        people.push(foo);
	        people.push(bar);
	        people.push(baz);
	
	        return people;
	    });
	}());

This is a people provider. As you can see, it's registered differently from types (via `registerProvider`), and behaves a little differently. A type is instantiated before getting injected, whereas a provider is just run and its return value is injected wherever the dependency is needed. So now we can modify our main and party functions to use this provider and forget about adding new `people` to new `parties` everywhere:

main.js:

	(function () {
	    injector.registerMain(function(people) {
	        _.each(people, function (person) {
				person.greet();
			}
	    });
	... (rest of code omitted

party.js

	$(function () {
	    $('#start-party').click(injector.inject(function (people) {
	        _.each(people, function (person) {
				person.greet();
			});
	    }));
	});

Neat, right? Only one problem... our LSP violation is coming to bite us... hard.

> For those who don't know it, the Liskov Substitution Principle is one of the pillars of SOLID development and basically states that a class must be replaceable by it's parent class and any types that inherit from it. In this case `Foo` has to be replaceable by `Person`, `Bar` and `Baz`. It can't though, because none of those objects implement `startParty` nor `endParty`, and this issue is clear as day as we move towards an array full of people. (to learn more about this principle visit [this Wikipedia entry](https://en.wikipedia.org/wiki/Liskov_substitution_principle) 

### <a name="use-passive"></a>Passive Providers (Fixing the LSP Violation Issue)

How do we fix this? the first thing that comes to mind, since JavaScript is a dynamic language, is just checking to see if our guests have the `startParty` method or not:

party.js

	$(function () {
	    $('#start-party').click(injector.inject(function (people) {
	        _.each(people, function (person) {
				if (person.startParty) {
					person.startParty();
				}
				person.greet();
				if (person.endParty) {
					person.endParty();
				}
			});
	    }));
	});

That works, and allows us to adhere to the domain rules set at the beginning of this example while using a people provider. But it's clumsy, really clumsy... I mean, what if our party suddenly has 200 people? Do we really want to run 400 `if` statements just to help one `Foo` be more sociable?? I for one would rather have another solution... introducing passive providers:

fooProvider.js

	(function () {
	    injector.registerProvider('fooProvider', function (foo, bar) {
	        if (this.id === 'start-party') {
	            foo.greet = _.bind(bar.greet, foo);
	        } else {
	            foo.greet = _.bind(injector.getType('foo').prototype.greet, foo);
	        }
	
	        return foo;
	    });
	}());

This guy makes use of another functionality reserved for providers: they get called using the callers `context`. When run is invoked, the context is `window`, so the value of this.id is undefined, and the greet method remains `Foo`'s usual dreary military salute. When called within a jQuery event, however, the `context` is the button on which the event is being called, and the value of `this.id` is `start-party`. This nifty functionality allows us to check the environment under which a type is being instantiated, and act accordingly. It also gets rid of the LSP violation problem, since `Foo` no longer has (or needs!) `startParty` nor `endParty` to help him be more sociable. How do we use this? We just add one parameter to `Foo`'s registration function:

foo.js ():

	injector.registerType('foo', Foo, 'singleton', 'fooProvider');

Now, every time foo is injected, it will pass through our newly created provider, which will determine what kind of greeting it needs to give. This is why the provider is called passive, because it is anchored to the type and isn't injected directly into wherever the type is needed (very useful for cases when you inject the type into multiple locations, want to add some instantiation functionality, and don't want to change the type for your new provider everywhere).

as an added bonus, since main is identical to the function getting injected into our `#start-party` `click` event, we can do away with the anonymous function and simply inject `main` into our party!

party.js

	$(function () {
	    $('#start-party').click(injector.inject('main'));
	});


> **Note:** there is one small snag with this example... it cannot be minified. Minification changes parameter names to shorter ones. Personally, I think this is a mistake, and would prefer minifiers to leave parameter names alone. Until that happens, though, if you're going to minify your code, you'll have to use an array in place of a function, as described in the API reference below.
 4/22/2015 12:50:49 PM 