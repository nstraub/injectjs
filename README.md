injectjs
========
a lightweight, small, high level dependency injector with support for object lifetime management

This software is still a proof of concept, and is by no means usable in production, reliable, or properly documented
--------------------------------------------------------------------------------------------------------------------
with that said, I expect to have a fully functional, fully tested, fully decoupled and fully documented version in the next couple of weeks

# API reference
## injector.registerType

**signatures**

Allows you to register a type which can be instantiated by the injector and injected into other registered types.

*registerType(string name, function type, [string lifetime = transient]) : void*  
*registerType(string name, array [dependencies...]type, [string lifetime = transient]) : void*

**Parameters**
    
- name (string): mandatory. The name of the type being registered.
- type (function|array): mandatory. 
  When type is a function, its the actual type being registered and is said not to have any dependencies of its own. 
  When type is an array, all items except the last are dependencies for the type, and the last is the actual type, which will receive all the aforementioned dependencies on instantiation.
- lifetime (string): optional, default is transient. the types lifetime, currently supported are singleton (only one instance of the type will exist throughout the applications lifecycle), and transient (every time the type is referred, a new instance is created).
  
**example**
  
    injector.registerType(
      'my-test-type', 
      function () { 
        this.hello = 'world' 
      }, 
      'singleton'); // only one instance will ever be created.
    injector.registerType(
      'message-logger', 
      ['my-test-type', function (message) { 
        this.print = function () { 
          console.log('hello, ' + message.hello) 
        }
      }]); will always create a new instance on injection
    
## injector.instantiate

instantiates a registered type.

**signatures**
*instantiate(string name) : object*

**parameters**
- name(string): mandatory. the name of the type you want to instantiate.

**example**

    var logger = injector.instantiate('message-logger');
    logger.print(); // logs 'hello, world' to the console
    
## injector.inject

injects all dependencies into the requested type and returns a provider for said type. Useful when instantiating the same object multiple times.

**signatures**
*inject(string name) : object*

**parameters**
- name(string): mandatory. the name of the type you want to get a provider for.

**example**

    var logger_provider = injector.instantiate('message-logger'),
        first_logger = logger_provider(),
        second_logger = logger_provider(); // much faster to instantiate, since the provider has already been built and is ready to use
        
    first_logger.print(); // logs 'hello, world' to the console
    second_logger.print(); // also logs 'hello, world' to the console
    
