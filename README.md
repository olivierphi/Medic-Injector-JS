# Medic Injector

[![build status](https://secure.travis-ci.org/DrBenton/Medic-Injector-JS.png)](http://travis-ci.org/DrBenton/Medic-Injector-JS)

Medic Injector is a Javascript transcription of the great [SwiftSuspenders](https://github.com/tschneidereit/SwiftSuspenders)
light-weight ActionScript IoC container - coupled with the [RobotLegs](http://www.robotlegs.org/) framework, this is one of
the technologies with which I most enjoyed working, and I hope you will enjoy using this Javascript version too!

It lets you wire your application components in a very simple and intuitive way.

You setup your Injection Mappings once, and then use them everywhere you want in your application, without any overhead -
Injections Points are recognized only from functions arguments names and Javascript objects instances properties names.

It can be used in Node.js and in the browser. If you use
[Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD)
in your client-side Javascript app, it will be particulary easy to add Medic Injector.
It is a very agnostic tool, which can be used in vanilla JS, Express server-side applications,
Backbone browser-side applications, etc.

It is bundled with Unit Tests and [API documentation](http://drbenton.github.com/Medic-Injector-JS/api/).

#### Medic Injector Sync

A lighter implementation is available too, with synchronous Injections values resolutions only. It is less powerful but
it is much more simple to use, since every operation immediately return its result instead of triggering a callback.

It's only 4kb when minified with UglifyJS.

You can look at the
[medic-injector.sync.js](https://github.com/DrBenton/Medic-Injector-JS/blob/master/medic-injector.sync.js) file
and [its unit tests](https://github.com/DrBenton/Medic-Injector-JS/blob/master/test/medic-injector.sync.js) for details,
but it is just a "_immediate returned values instead of callbacks_" version of the Medic Injector full asynchronous library
(without the ```toModule()``` mapping, since it couldn't be synchronous in a browser AMD context).

The following Tutorial and Synopis use the full asynchronous version of Medic Injector.


## Tutorial

There are two main phases to properly use this library : a "injection mappings" setup, then a "injections points" use in your
whole application.

During the first phase, you create "injection mappings". Each injection mapping has a unique ID, and is linked to a value.
This value can be a Javascript scalar or object, but it can be bound to a more complex data source, like an asynchronous
resource or a Node.js / AMD module. But we will see that later, for now let's look at the simplest dependency injection
scheme:

```javascript
// Injector instance creation
var Injector = require('medic-injector').Injector;//with AMD you would use "require(['medic-injector'], function() { /*your code*/ })" instead
var injector = new Injector();

injector.addMapping('debug').toValue(true);//a first simple Injection Mapping

// Later in you application code
function displayHomepage (debug) {
    render debug ? 'home.debug.html' : 'home.html';
}

// And later again
injector.triggerFunctionWithInjectedParams(displayHomepage);
```

What did we do? We just created an instance of a Medic Injector, and added a single Injection Mapping to , with a 'debug'
unique ID and a simple boolean value.
Later in the code, we asked the Injector to trigger a previously defined function. When it does this, it quickly parses
the arguments of the requested function, and for each argument it looks if an injection mapping has been registered with
an ID matching the argument name. When an argument name matches an injection mapping ID, the value of the injection mapping
will be automatically injected in this argument.

We can also use injections points in a OOP code. With the same setup than the previous example, we can do this :

```javascript
var Logger = function ()
{
    this.debug = null;
};
var logger = new Logger();
injector.injectInto(logger);
```

After this "injectInto()" call, our Logger instance will have its "debug" property set to 'true'. The Logger can even
 call the injector itself:

```javascript
var Logger = function ()
{
 this.debug = null;
 this.postInjections = function () {
    // If an "injected" object instance has a "postInjections" method, it will be automatically triggered
    // after the injections resolution (injections mapping can be asynchronous).
    // It can be considered as a "second constructor", called when you object instance is really ready, with all its
    // injected dependencies resolved.
    this.dispatchEvent('ready');
 };

 injector.injectInto(this);
};
```

Ok, this 'debug' property was not a very interesting injection. Let's see something more advanced:

```javascript
// a new "value" Injection Mapping...
injector.addMapping('appConfig').toValue({
    mode: 'development',
    db: {host: 'localhost', db: 'test'},
    mail: {host: 'smtp.gmail.com', user: 'webmaster@test.com', password: ''},
});

// ...and a new type of Injection Mapping, used with the "toProvider" method
injector.addMapping('csrf').toProvider(function () {
    return CsrfGenerator.getNewToken();
});
```
The 'csrf' injection mapping is not linked to a simple value, but to a "Provider" return value. A Provider is simply
a function that returns a value, immediatly like the 'csrf' one or asynchronously.
Each time a function used with the Injector will have a 'csrf' argument or a custom Javascript type will have a 'csrf'
property initially set to 'null', the injector will set this argument/property value to a new
[CSRF token](http://en.wikipedia.org/wiki/Cross-site_request_forgery).

What if our 'CsrfGenerator' has an asynchronous flow ? Well, it's simple, you just have to add a 'callback' argument
to your Provider function, and the Medic Injector will consider the Provider as an asynchronous one. In such a cas,
instead of getting the return value of your Provider it will wait for a 'callback' call. When this function will be
triggered by your Provider, it will have to call it with a single argument, which will be considered as the Injection Mapping
value:

```javascript
injector.addMapping('csrf').toProvider(function (callback) {
    CsrfGenerator.getNewToken(function (err, result) {
        err && throw err;
        callback(result);//the 'result' value will be our 'csrf' Injection Mapping value.
    });
});
```
Note that this Provider will be triggered each time this Injection Mapping is requested by one of your functions or one
of your JS custome types. For some mappings you will probably want to trigger the Provider only once. Well, that's simple,
you just have to add a "asSingleton()" call to your Injection Mapping:

```javascript
// DB connection : it will be "lazy-triggered", only when the injection mapping is requested for the first time
injector.addMapping('db')
    .toProvider(function (appConfig) {//the previously defined "app config" will be automatically injected in this provider
        var mongoose = require('mongoose');
        var db = mongoose.createConnection(appConfig.db.host, appConfig.db.db);
        return db;
    })
    .asSingleton();//shared singleton instance
```
As you can see, we have define a 'db' Injection Mapping, which will return a new MongoDB connection. Because we used the
"asSingleton()" method, it will be created only when it is first requested, and then the same shared instance will always be
injected.

You may have noticed on the last example that the Provider has a "appConfig" argument, used in the Provider.
That's a key feature of the Medic Injector : all Injections Mappings can themselves  recursively request others
Injections Mapping, just by using Injections Mappings IDS in their Provider function argument. This system can handle as many
Injections Mappings nested levels as you need, and handle asynchonous ones automatically.

For asynchronous Providers you can mix the "callback" argument with others injections depencies arguments.

You can also use injection on simple Strings, with the "${injectionName}" pattern:

```javascript
var sourceStr = '::${username}::${csrf}::';
injector.parseStr(sourceStr, function (injectedStr) {
    // injectedStr = '::john::eklm4p12::'
});
```

Now that you've seen these simple examples, you may take a look at the following synopsis, which use all this and introduce
a new Injection Mapping type, used with the "toModule()" method.


## Synopsis

In a "app/bootstrap.js" file, the injection mappings initialization:

```javascript

// Injector instance creation
var Injector = require('medic-injector');//with AMD you would use "require(['medic-injector'], function() { ... })" instead
var injector = new Injector();

// Simplest injections : just simple values
// Every time an entity declares an injection point whose name matches this injection name, this injection point value will
// be automatically set to this injection mapping value.
injector.addMapping('debug').toValue(true);
injector.addMapping('appConfig').toValue({
    mode: 'development',
    db: {host: 'localhost', db: 'test'},
    mail: {host: 'smtp.gmail.com', user: 'webmaster@test.com', password: ''},
});

// Types injections : an instance of the given JS type will be created on demand when an entity declares an injection point
// whose name matches this injection name
injector.addMapping('logger').toValue(Logger).asSingleton();//when "asSingleton()" is used, the first created instance will always be be injected
injector.addMapping('swig').toValue(Swig).asSingleton();

// Module injections : can be used in Node.Js or in an AMD environment
injector.addMapping('subscribeFormTemplate').toModule('./view/subscribe-form-template.html');
injector.addMapping('inherits').toModule('util' 'inherits');

// Providers injections : the given function is triggered on demand when an entity declares an injection point
// whose name matches this injection name
injector.addMapping('csrf')
    .toProvider(function () {
        return CsrfGenerator.getNewToken();
    });
injector.addMapping('db')
    .toProvider(function (appConfig) {//the previously defined "app config" will be automatically injected in this provider
        var mongoose = require('mongoose');
        var db = mongoose.createConnection(appConfig.db.host, appConfig.db.db);
        return db;
    })
    .asSingleton();//shared singleton instance
injector.addMapping('mailer')
    .toProvider(function (appConfig) {
        var mailer = new Mailer();
        mailer.host = appConfig.mail.host;
        mailer.user = appConfig.mail.user;
        mailer.password = appConfig.mail.password;
        return mailer;
    })
    .asSingleton();//shared singleton instance
injector.addMapping('subscribeFormHtml')
    .toProvider(function (csrf, subscribeFormTemplate, swig) { //these previously defined injections mappings will be automatically injected in this provider
        var tmpl = swig.compileFile(subscribeFormTemplate);
        tmpl.render({
            csrf: csrf
        });
    });
injector.addMapping('currentUser')
    .toProvider(function (db, callback) { //Providers can be asynchronous too (if they have a "callback" arg, they are considered as async Providers)
        var UserModel = db.model('User');
        MyModel.findOne({id: req.session.userId}, function (err, user) {
            err && throw err;
            callback(user);
        });
    });
    .asSingleton();//shared singleton instance
```

In a "app/subscribe-form.js" file, injection mappings use:

```javascript
var SubscribeForm = function () {

    // This prop value will be automatically set to the shared "mailer" instance
    this.mailer = null;
    // This prop value will be automatically set to a new rendered "subscribe form", with a new CSRF token
    this.subscribeFormHtml = null;
    // This prop value will be automatically set to the shared "UserModel" instance
    this.currentUser = null;

    // This JS type will be "auto-injected"
    injector.injectInto(this);

};
SubscribeForm.prototype.postInjections = function() {
    // This method will be automatically triggered when all this instance injection points will have been resolved
    // It's a sort of "post injections" constructor
};
SubscribeForm.prototype.display = function(req, res) {
    res.render(this.subscribeFormHtml);
};

module.exports = SubscribeForm;

```

## API

See the API here : http://drbenton.github.com/Medic-Injector-JS/api/

The API is generated with [JSDuck](https://github.com/senchalabs/jsduck) with the following command:

    $ jsduck --output docs/api/ medic-injector.js medic-injector.sync.js


## Running Tests

To run the test suite you will need to have the [Mocha](http://visionmedia.github.com/mocha/) library globally installed.
If you don't already have it, just invoke the following command:

    $ npm install -g mocha

Then invoke this command within the Medic Injector folder:

    $ npm test


## License
(The MIT License)

Copyright (c) 2012 Olivier Philippon <https://github.com/DrBenton>

Contains snippets of code from [Q](https://github.com/kriskowal/q) and [Prototype](https://github.com/sstephenson/prototype) libraries. See their specific licenses for details.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.