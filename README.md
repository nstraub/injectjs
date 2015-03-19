#injectjs

a lightweight, small, high level dependency injector with support for object lifetime management

> This software is still not fully baked, at version 0.1, and missing a wealth of functionalities for what constitutes a fully fledged dependency injector

With that said, I expect to have a fully functional, fully tested, fully decoupled and fully documented version in the next couple of Months. I will greatly appreciate help from early adopters and will gladly embrace feature requests and bug reports uploaded to the issue tracker.

### Table of contents

1. [Why InjectJS](#intro)
2. [Installation](#install)
3. [Usage](#use)
4. [Roadmap](#road)
5. [API reference](#api)
	1. [Registration Methods](#registration)
		- [injector.registerType](#registration-type)
		- [injector.registerProvider](#registration-provider)
		- [injector.registerMain](#registration-main)
	2. [Injection Methods](#injection)
		- [injector.instantiate](#injection-instantiate)
		- [injector.inject](#injection-inject)
		- [injector.run](#injection-run)
	3. [Utility Methods](#utility)
		- [injector.getType](#utility-gettype)
	4. [Test Helpers](#testing)
		- [injector.registerFake](#testing-fakes)
		- [injector.harness](#testing-harness)

## <a name="intro"></a> Why InjectJS?

Until now, the only way to inject dependencies into JavaScript objects has been by manually instantiating them and passing them into the object's constructor, property or method. This creates a load of overhead and boilerplate "new keyword" code. Add to that the fact JavaScript is dynamically typed and you have no real way of knowing whether changing the signature of an object's constructor, property or method will cause an error in the rest of your code (unless, of course, you keep track of every place your recently changed object is used and how). You (usually) won't even get a runtime error since JavaScript doesn't complain at all when you pass a function more (or less) arguments than it has parameters. InjectJS aims to get rid of all this. It allows you to wire up your dependencies beforehand and handle instantiation of all your JS objects.

### What about RequireJS?

RequireJS is a wonderful modularization framework, but it is not a dependency injection framework. From my (admittedly limited) experience with RequireJS, what I understand it does is load javascript files as modules which can then be required from other modules. It does a wonderful job at solving the "everything must be global" problem that haunts JavaScript from it's beginnings. What RequireJS doesn't (and shouldn't!) do, is provide high level dependency injection and object lifetime management, and that's where InjectJS comes in


> Note: InjectJS includes a shim to integrate into RequireJS, and in the near future I expect to use requireJS (along with Grunt) to modularize InjectJS's code into smaller, less complex packages (as opposed to the one large file it is now).

# <a name="install"></a>Installation

simply download inject.js from the source tree and include it into your html page(s)

## Tests

InjectJS comes with a test suite that fully unit-tests the code. to run it, do the following:

1. clone the repository (or download and extract the auto-generated zip)
2. run npm install
3. run bower install
4. the karma config file is located in Tests/karma.conf.js

# <a name="use"></a>Usage 

The main idea behind InjectJS is getting rid of the new keyword in your code. This may seem a controversial statement and impossible to achieve, but it's quite possible and will make your code leaner and more maintainable, or at the very least, less frustrating.
Let's start with a Mouth World app. Normally you would make a new function called mouth, instantiate somewhere it and then call it:
 
    function Mouth() {
        this.say = function (what) {
            alert(what);
        }
    }
    
    var mouth = new Mouth();
    mouth.say('hello world!');
    
There are a few problems with this approach:

1. Mouth is global
2. mouth is global
3. you need to manually instantiate it to use it

Ok, so one global function and one global variable aren't much to worry about, but this is just the hello world example. With InjectJS you start by registering Mouth as a type:

> DISCLAIMER: the following is all napkin code, which means it hasn't been run anywhere, is likely to contain syntax errors (like missing ;, {} or ()), and is here for the sole purpose of illustrating the basic functionalities of the framework
     
    injector.registerType('mouth', function () {
        this.say = function (what) {
            alert(what);
        }
    });
    
Marvellous... (if only markdown had a descriptor for sarcasm). One good thing happened here though. You now have a mouth type that is no longer global! Next step is to use this newly created type somewhere in your code... how about a main method? you know... the one that runs when the app starts, inside `$(function() {})` or somewhere similar:
 
    injector.registerMain(function (mouth) {
        mouth.say('hello world!');
    });
    
    $(function () {
        injector.run(); // runs the function registered with registerMain
    });
    

> Following is a contrived and rather long example... to see a more "real world" use case scenario, check out the code at [https://github.com/nstraub/snake](https://github.com/nstraub/snake) (still unpolished, but makes use of all functionalities currently available in this framework)`
 

As of now, we've gotten rid of the globals, which isn't much of a feat in and of itself, but still noteworthy. More importantly, we no longer have to manually instantiate `Mouth` to use it! Again, a hello world app is probably top on the list of contrived examples and I agree with you if you're thinking this library hasn't really provided much so far... but please bear with me for a while.
 
So now, what if you want to hide the original `Mouth` so it is no longer global? Easy, right?

    (function () {
        function Mouth() {
	        this.say = function (what) {
	            alert(what);
	        }
        }
        
        var mouth = new Mouth();
        mouth.say('hello world!');
    }());
    
Ok, great, now we've just solved two of the three initial problems there were with this code (remember you're still manually instantiating). No need for InjectJS then.
So let's complicate things a bit: introducing `Foo` and `Bar`
    
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
    
Finally, run your main function within your apps entry point

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

Now let's do the same with InjectJS:

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

The LSP violation is left there intentionally and will be covered when providers are properly implemented... which brings us to the roadmap...

> **Note:** there is one small snag with this example... it cannot be minified. Minification changes parameter names to shorter ones. Personally, I think this is a mistake, and would prefer minifiers to leave parameter names alone. Until that happens, though, if you're going to minify your code, you'll have to use an array in place of a function, as described in the API reference below.
 
# <a name="road"></a>Roadmap

The current version, 0.1, has the following features:

- registering types
- registering providers
- instantiating types
- injecting types into methods
- singleton and transient lifetimes
- registering fakes and test harnesses

To sum it up, it provides basic dependency injection capabilities and the ability to use these dependencies in a test environment.

So here are the next planned releases:

- 0.2 Finish implementing providers (currently they don't do much). Also implement auxiliary functions for working with fakes (flushFakes and removeFake)
- 0.3 root and parent lifetimes.
- 0.4 Preprocessor for dealing with minifiers
- 0.5 RequireJS and Grunt build process. Code decoupling and file restructuring
- 0.6 Property injection.
- 0.7 Method injection (currying).


# <a name="api"></a>API reference

The syntax for this framework takes from and expands the syntax used by AngularJS's injector. you register a function with a name as first argument, and then an array of dependencies with the last element being the actual function you want to register as the dependency. 

## <a name="registration"></a> Registration Methods 

### <a name="registration-type"></a>injector.registerType

>Allows you to register a dependency which can be instantiated by the injector and injected into other registered dependencies and the main function.

**signatures**

*registerType(string name, function type, [string lifetime = transient]) : void*  
*registerType(string name, array [dependencies...]type, [string lifetime = transient]) : void*

**Parameters**
    
- name (string): mandatory. The name of the type being registered.
- type (function|array): mandatory. 
  When type is a function, its dependencies are inferred from its parameter names. 
  When type is an array, all items except the last are dependency names for the type, and the last is the actual type, which will receive all the aforementioned dependencies on instantiation.

> **Note**: type MUST be an array if you plan to minify your code 

- lifetime (string): optional, default is transient. the types lifetime, currently supported are singleton (only one instance of the type will exist throughout the applications lifecycle), and transient (every time the type is referred, a new instance is created).
  
**example**
  
    injector.registerType('my-test-type', function () { 
        this.hello = 'world' 
    }, 'singleton'); // only one instance will ever be created.

    injector.registerType('message-logger', function (message) { 
        this.print = function () { 
          console.log('hello, ' + message.hello) 
        }
    }); will always create a new instance on injection
    
### <a name="registration-provider"></a>injector.registerProvider

Allows you to register a provider which can be instantiated by the injector and injected into other registered dependencies and the main function. Currently the only difference between this function and registerType is providers are run directly, and aren't newed. in the future, they'll receive info on the context under which they're being executed, as well as any extra parameters passed when they're called.

**signatures**

*registerProvider(string name, function provider) : void*  
*registerProvider(string name, array [dependencies...]provider) : void*

**Parameters**
    
- name (string): mandatory. The name of the type being registered.
- provider (function|array): mandatory. 
  When provider is a function, its dependencies are inferred from its parameter names.
  When provider is an array, all items except the last are dependency names for the provider, and the last is the actual provider, which will receive all the aforementioned dependencies on instantiation.
  
> **Note**: type MUST be an array if you plan to minify your code 


    
### <a name="registration-main"></a>injector.registerMain

Allows you to register the provider that gets invoked when `injector.run()` is called. shorthand for `injector.registerProvider('main', [dependencies... function () {}]);`

**signatures**

*registerMain(function provider) : void*  
*registerMain(array [dependencies...]provider) : void*

**Parameters**
    
- provider (function|array): mandatory. 
  When provider is a function, its dependencies are inferred from its parameter names.
  When provider is an array, all items except the last are dependency names for the provider, and the last is the actual provider, which will receive all the aforementioned dependencies on instantiation.
  
> **Note**: type MUST be an array if you plan to minify your code 


## <a name="injection"></a>Injection Methods

### <a name="injection-instantiate"></a>injector.instantiate

instantiates a registered type. Not recommended for use other than to replace the new keyword while refactoring legacy code

**signatures**
*instantiate(string|array|function name) : object*

**parameters**
- name(string|array|function): mandatory. 
	- If string, the name of the type you want to instantiate. 
	- If function, the function you wish to instantiate. its dependencies are inferred from its parameter names.
	- If array, an array of dependencies followed by the function you wish to instantiate. If you supply a name or a function, it will be instantiated as a provider, calling it directly, without the new keyword.
  
> **Note**: type MUST be an array if you plan to minify your code 


**example**

    var logger = injector.instantiate('message-logger');
    logger.print(); // logs 'hello, world' to the console
    
### <a name="injection-inject"></a>injector.inject

injects all dependencies into the requested type and returns a provider for said type. Useful when instantiating the same object multiple times, for currying event callbacks, and for testing.

**signatures**
*inject(string|array|function name) : object*

**parameters**
- name(string|array|function): mandatory. 
	- If string, the name of the type you want to instantiate. 
	- If function, the function you wish to instantiate. its dependencies are inferred from its parameter names.
	- If array, an array of dependencies followed by the function you wish to instantiate. If you supply a name or a function, it will be instantiated as a provider, calling it directly, without the new keyword.
  
> **Note**: type MUST be an array if you plan to minify your code 


**examples**

    var logger_provider = injector.inject('message-logger'),
        first_logger = logger_provider(),
        second_logger = logger_provider(); // much faster to instantiate, since the provider has already been built and is ready to use
        
    first_logger.print(); // logs 'hello, world' to the console
    second_logger.print(); // also logs 'hello, world' to the console
    
    $('#some-element').click(injector.inject(function (logger) {
        // this code will be run when the event is called, and logger will be available to log anything that has something to do with the event
        // for now, the event object won't be available, so its use is limited in this context. This functionality will be introduced in 0.2
    }));
    
Jasmine test:

    injector.registerType('logger', function () {
        this.log = function (message) {
            if (dump) {
                dump(message);
            } else {
                console.log(message);
            }
        }
    }, 'singleton');
    
    describe 'you can inject dependencies here and not worry about setup and teardown', () ->
        beforeEach(injector.inject(function (logger) {
            logger.log('starting test')
        }));
        
        afterEach(injector.inject(function (logger) {
            logger.log('ending test')
        }));
        

### <a name="injection-run"></a>injector.run

runs the main function.

**signatures**

*run() : void*

**throws error when no main function is registered**

## <a name="utility"></a>utility methods

### <a name="utility-gettype"></a>injector.getType

gets the type for the requested dependency. Useful for checking instanceof and testing constructors for singleton lifetime types (other uses should be avoided).

**signature**

*getType(string name) : Type|null*

**parameters**

- name (string): mandatory. name of the dependency for which you wish to get the type.

**returns**

the type or null if no type is found.

## <a name="testing"></a>Test Helpers

InjectJS currently provides two features to aid in unit testing (tested with jasmine only)

### <a name="testing-fakes"></a>injector.registerFake

registers a type as a fake. For now, after using the fake, you need to remove it with `delete injector.fakes.fakeName` (functions for dealing with fakes will come with version 0.2) 

**signatures**
signatures are identical to registerType

### <a name="testing-harness"></a>injector.harness

identical to inject, but injects dependencies lazily (inject is eager)
 
**example**

    injector.registerType('logger', function () {
        this.log = function (message) {
            if (dump) {
                dump(message);
            } else {
                console.log(message);
            }
        }
    }, 'singleton');

    describe('running tests with a harness', function () {
        beforeAll(function () {
            injector.registerFake('logger', function () {
                this.log = sinon.spy();
            });
        });    
        
        afterAll(function () {
            delete injector.fakes.logger;
            
        describe('using inject'), injector.inject(function (logger) {
            it('passes the actual logger type', function () {
                expect(logger instanceof injector.getType('logger')).toBe true //fails because getType returns the fake
            });
        });
        
        describe('using harness'), injector.harness(function (logger) {
            it('passes the fake logger type', function () {
                expect(logger instanceof injector.getType('logger')).toBe true //passes because logger is the fake type
            });
        });
    });
