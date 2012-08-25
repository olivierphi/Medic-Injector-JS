# Medic Injector

One of my greatest pleasure as a web developer has been to work with the great [RobotLegs](http://www.robotlegs.org/)
ActionScript framework and its [SwiftSuspenders](https://github.com/tschneidereit/SwiftSuspenders) light-weight IoC container.
These days I do not use Flash ActionScript anymore, but I was missing RobotLegs and SwiftSuspenders so much that I had
to rebuild this minimalist IoC management library in Javascript , strongly inspired by these 2 tools,
in order to find this pleasure again. I hope you wil enjoy it too ! :-)

It allows to wire you application components in an easy, intuitive and efficient way. It can be used in Node.js and in
the browser. If you use [Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD) in your client-side
Javascript app, it will be particulary easy to add Medic Injector. It is a very agnostic tool, which can be used in
Express server-side applications, Backbone browser-side applications, etc.

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

## Documentation

Coming soon...


## Running Tests

To run the test suite just invoke the following command within the repo:

    $ npm test


## License
(The MIT License)

Copyright (c) 2012 Olivier Philippon <https://github.com/DrBenton>

Contains snippets of code from [Q](https://github.com/kriskowal/q) and [Prototype](https://github.com/sstephenson/prototype) libraries. See their specific licenses for details.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.