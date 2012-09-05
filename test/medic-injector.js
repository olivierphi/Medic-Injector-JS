
var assert = require('assert');

var InjectorLib = require('../index')
  , Injector = InjectorLib.Injector;

describe('InjectionMapping', function(){

    describe('#toValue()', function(){
        it('should immediately return the value', function(){
            var injector = new Injector();
            var counter = 0;
            var injectionMapping = injector.addMapping('test').toValue(10);
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(0, counter);//since this a value mapping without the use of the "forceAsync" mode, the callback should be triggered immediately
            });
            counter++;
        });
        it('should asynchronously return the value when forceAsync is used', function(done){
            var injector = new Injector();
            var counter = 0;
            var injectionMapping = injector.addMapping('test').toValue(10);
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);
                done();
            }, null, true);//async mode is forced
            counter++;
        });
    });// end "#toValue()" tests

    describe('no resolution scheme', function(){
        it('should immediately return `null`', function(done){
            var injector = new Injector();
            var injectionMapping = injector.addMapping('test');
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(null, injectionValue);
                done();
            });
        });
    });// end "no resolution scheme" tests

    describe('#toProvider()', function(){
        it('should synchronously return the value when a sync callback result is used', function(done){
            var injector = new Injector();
            var counter = 0;
            var injectionMapping = injector.addMapping('test').toProvider(function() {
                counter++;
                return 10;
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);
                done();
            });
            counter++;
        });
        it('should asynchronously return the value when an async callback result is used', function(done){
            var injector = new Injector();
            var counter = 0;
            var injectionMapping = injector.addMapping('test').toProvider(function(callback) {
                counter++;
                setTimeout(function () {
                    counter++;
                    callback(10);
                }, 20);
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(3, counter);
                done();
            });
            counter++;
        });
        it('should received injected args too', function(done){
            var injector = new Injector();
            var counter = 0;
            injector.addMapping('injection1').toValue(-10);
            injector.addMapping('injection2').toValue(-20);
            var injectionMapping = injector.addMapping('test').toProvider(function(injection1, dummy1, injection2, dummy2) {
                counter++;
                assert.strictEqual(-10, injection1);
                assert.strictEqual(null, dummy1);
                assert.strictEqual(-20, injection2);
                assert.strictEqual(null, dummy2);
                return 10;
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);
                done();
            });
            counter++;
        });
        it('should received injected args, even in aysnc mode, with a randomly ordered "callback" arg', function(done){
            var injector = new Injector();
            var counter = 0;
            injector.addMapping('injection1').toValue(-10);
            injector.addMapping('injection2').toValue(-20);
            var injectionMapping = injector.addMapping('test').toProvider(function(injection1, dummy1, callback, injection2, dummy2) {
                counter++;
                assert.strictEqual(-10, injection1);
                assert.strictEqual(null, dummy1);
                assert.strictEqual(-20, injection2);
                assert.strictEqual(null, dummy2);
                setTimeout(function () {
                    counter++;
                    callback(10);
                }, 20);
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(injectionValue, 10);
                assert.strictEqual(3, counter);
                done();
            });
            counter++;
        });
        it('should trigger the Provider function multiple times for multiple Injections resolutions requests, even in sync mode', function(done){
            var injector = new Injector();
            var counter = 0;
            var nbCallbacksTriggered = 0;
            var injectionMapping = injector.addMapping('test').toProvider(function() {
                counter++;
                return 10;
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);
                (++nbCallbacksTriggered === 2) && done();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(2, counter);
                (++nbCallbacksTriggered === 2) && done();
            });
            counter++;
        });
        it('should trigger the Provider function multiple times for multiple Injections resolutions requests in async mode', function(done){
            var injector = new Injector();
            var counter = 0;
            var nbCallbacksTriggered = 0;
            var injectionMapping = injector.addMapping('test').toProvider(function(callback) {
                counter++;
                setTimeout(function () {
                    counter++;
                    callback(10);
                }, 20);
            });
            var onAllInjectionsResolved = function ()
            {
                assert.strictEqual(5, counter);
                done();
            };
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            counter++;
        });
    });// end "#toProvider()" tests

    describe('#asSingleton()', function(){
        it('should normally immediately return the value when used with #toValue', function(){
            var injector = new Injector();
            var counter = 0;
            var injectionMapping = injector.addMapping('test').toValue(10).asSingleton();
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(0, counter);//since this a value mapping without the use of the "forceAsync" mode, the callback should be triggered immediately
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(0, counter);
            });
            counter++;
        });
        it('should normally asynchronously return the value when forceAsync is used when used with #toValue', function(done){
            var injector = new Injector();
            var counter = 0;
            var nbCallbacksTriggered = 0;
            var injectionMapping = injector.addMapping('test').toValue(10).asSingleton();
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);
                (++nbCallbacksTriggered === 2) && done();
            }, null, true);//async mode is forced
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);
                (++nbCallbacksTriggered === 2) && done();
            }, null, true);//async mode is forced
            counter++;
        });
        it('should synchronously return the *same* value with only one Provider trigger when a sync callback result is used multiple times', function(done){
            var injector = new Injector();
            var counter = 0;
            var nbCallbacksTriggered = 0;
            var injectionMapping = injector.addMapping('test')
                .toProvider(function() {
                    counter++;
                    return 10;
                })
                .asSingleton();
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);
                (++nbCallbacksTriggered === 2) && done();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);//the counter stays at "1", because the Provider is triggered only once
                (++nbCallbacksTriggered === 2) && done();
            });
            counter++;
        });
        it('should asynchronously return the *same* value with only one Provider trigger when an async callback result is used multiple times', function(done){
            var injector = new Injector();
            var counter = 0;
            var nbCallbacksTriggered = 0;
            var injectionMapping = injector.addMapping('test')
                .toProvider(function(callback) {
                    counter++;
                    setTimeout(function () {
                        counter++;
                        callback(10);
                    }, 20);
                })
                .asSingleton();
            var onAllInjectionsResolved = function ()
            {
                assert.strictEqual(3, counter);
                done();
            };
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(3, counter);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(3, counter);//the counter stays at "3", because the Provider is triggered only once
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            counter++;
        });
        it('should received injected args, even in aysnc mode, with a randomly ordered "callback" arg, with only one Provider trigger', function(done){
            var injector = new Injector();
            var counter = 0;
            var nbCallbacksTriggered = 0;
            injector.addMapping('injection1').toValue(-10);
            injector.addMapping('injection2').toValue(-20);
            var injectionMapping = injector.addMapping('test')
                .toProvider(function(injection1, dummy1, callback, injection2, dummy2) {
                    counter++;
                    assert.strictEqual(-10, injection1);
                    assert.strictEqual(null, dummy1);
                    assert.strictEqual(-20, injection2);
                    assert.strictEqual(null, dummy2);
                    setTimeout(function () {
                        counter++;
                        callback(10);
                    }, 20);
                })
                .asSingleton();
            var onAllInjectionsResolved = function ()
            {
                assert.strictEqual(3, counter);
                done();
            };
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(injectionValue, 10);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(injectionValue, 10);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            counter++;
        });
    })// end "#asSingleton()" tests

    describe('#toType()', function(){

        var JsType = function()
        {
            this.counter = ++JsType._instanceCounter;
        };
        JsType._instanceCounter = 0;

        it('should immediately return a new instance of the given JS type', function(){
            var injector = new Injector();
            var counter = 0;
            JsType._instanceCounter = 0;
            var injectionMapping = injector.addMapping('test').toType(JsType);
            injectionMapping.resolveInjection(function (injectionValue) {
                assert(injectionValue instanceof JsType);
                assert.strictEqual(1, injectionValue.counter);
                assert.strictEqual(0, counter);//since this a value mapping without the use of the "forceAsync" mode, the callback should be triggered immediately
            });
            counter++;
            injectionMapping.resolveInjection(function (injectionValue) {
                assert(injectionValue instanceof JsType);
                assert.strictEqual(2, injectionValue.counter);
                assert.strictEqual(1, counter);
            });
        });
        it('should asynchronously return the value when forceAsync is used', function(done){
            var injector = new Injector();
            var nbCallbacksTriggered = 0;
            JsType._instanceCounter = 0;
            var injectionMapping = injector.addMapping('test').toType(JsType);
            var onAllInjectionsResolved = function ()
            {
                assert.strictEqual(2, JsType._instanceCounter);
                done();
            };
            injectionMapping.resolveInjection(function (injectionValue) {
                assert(injectionValue instanceof JsType);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            }, null, true);//async mode is forced
            injectionMapping.resolveInjection(function (injectionValue) {
                assert(injectionValue instanceof JsType);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            }, null, true);//async mode is forced
        });
        it('should immediately return a shared lazy-loaded singleton instance of the given JS type when used with #asSingleton()', function(done){
            var injector = new Injector();
            JsType._instanceCounter = 0;
            var injectionMapping = injector.addMapping('test').toType(JsType).asSingleton();
            injectionMapping.resolveInjection(function (injectionValue) {
                assert(injectionValue instanceof JsType);
                assert.strictEqual(1, injectionValue.counter);
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert(injectionValue instanceof JsType);
                assert.strictEqual(1, injectionValue.counter);
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                assert(injectionValue instanceof JsType);
                assert.strictEqual(1, injectionValue.counter);
                done();
            }, null, true);//async mode is forced
        });
    });// end "#toType()" tests

    describe('#toModule()', function(){
        it('should immediately return a module result in Node.js', function(){
            var injector = new Injector();
            var counter = 0;
            var injectionMapping = injector.addMapping('test').toModule('util');
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(require('util'), injectionValue);
                assert.strictEqual(0, counter);
            });
            counter++;
        });
        it('should immediately return a module sub-property result in Node.js when the "targetModulePropertyName" arg is used.', function(){
            var injector = new Injector();
            var counter = 0;
            var injectionMapping = injector.addMapping('test').toModule('util', 'format');
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(require('util').format, injectionValue);
                assert.strictEqual(0, counter);
            });
            counter++;
        });
    });// end "#toModule()" tests

    describe('#seal()/#unseal()', function(){
        it('should seal', function(){
            var injector = new Injector();
            var injectionMapping = injector.addMapping('test').toValue(10);
            injectionMapping.seal();
            assert(injectionMapping.isSealed());
            assert.throws(
                function () {
                    injector.asSingleton();
                },
                Error
            );
            assert.throws(
                function () {
                    injector.toValue(20);
                },
                Error
            );
            assert.throws(
                function () {
                    injector.toProvider(function() {return 30;});
                },
                Error
            );
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(injectionValue, 10);
            });
        });
        it('should not unseal with an invalid key', function(){
            var injector = new Injector();
            var injectionMapping = injector.addMapping('test').toValue(10);
            injectionMapping.seal();
            assert(injectionMapping.isSealed());
            assert.throws(
                function () {
                    injector.unseal(null);
                },
                Error
            );
            assert.throws(
                function () {
                    injector.unseal({});
                },
                Error
            );
        });
        it('should successfully unseal with the seal key', function(){
            var injector = new Injector();
            var injectionMapping = injector.addMapping('test').toValue(10);
            var sealKey = injectionMapping.seal();
            assert(injectionMapping.isSealed());
            injectionMapping.unseal(sealKey);
            assert(!injectionMapping.isSealed());
        });

    });// end "#seal()/#unseal()" tests

});//end "InjectionMapping" tests

describe('Injector', function(){

    describe('#triggerFunctionWithInjectedParams()', function(){
        it('should handle a given context successfully', function(){
            var injector = new Injector();
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function () {return 20;});
            var targetFunctionContext = {
                'contextProp': -1
            };
            var targetFunction = function (injection1, injection2)
            {
                assert.strictEqual(10, injection1);
                assert.strictEqual(20, injection2);
                assert.strictEqual(-1, this.contextProp);
            };
            injector.triggerFunctionWithInjectedParams(targetFunction, targetFunctionContext);
        });
        it('should be able to resolve misc injected params', function(done){
            // We already tested each of these InjectionsMappings, we can mix them from now on
            var injector = new Injector();

            var JsType = function()
            {
                this.counter = ++JsType._instanceCounter;
            };
            JsType._instanceCounter = 0;

            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function () {return 20;});
            injector.addMapping('injection3').toProvider(function (callback) {
                setTimeout(function () { callback(30); }, 20);
            });
            injector.addMapping('injection4').toProvider(function (callback, injection8) {
                assert.strictEqual(1, injection8.counter);
                setTimeout(function () { callback(40); }, 20);
            });
            injector.addMapping('injection5').toProvider(function (callback, injection4, injection8) {//this provider is itself "injected"
                assert.strictEqual(2, injection8.counter);
                setTimeout(function () { callback(injection4+10); }, 20);
            });
            injector.addMapping('injection6').toProvider(function (callback, injection5, injection9) {//this provider is itself "injected" with the "injected" previous one
                assert.strictEqual(3, injection9.counter);//injection 9 is singleton
                setTimeout(function () { callback(injection5+10); }, 20);
            }).asSingleton();
            injector.addMapping('injection7').toProvider(function (injection9) {//this provider is itself "injected" with the "injected" previous one
                assert.strictEqual(3, injection9.counter);//injection 9 is singleton
                return 70;
            });
            injector.addMapping('injection8').toType(JsType);
            injector.addMapping('injection9').toType(JsType).asSingleton();

            var targetFunction = function (injection2, injection1, unmatchedInjection, injection6, injection3, injection7)
            {
                assert.strictEqual(10, injection1);
                assert.strictEqual(20, injection2);
                assert.strictEqual(30, injection3);
                assert.strictEqual(60, injection6);
                assert.strictEqual(70, injection7);
                assert.strictEqual(null, unmatchedInjection);
                done();
            };

            injector.triggerFunctionWithInjectedParams(targetFunction);
        });
    });// end "#triggerFunctionWithInjectedParams()" tests

    describe('#removeMapping()', function(){
        it('should remove a given mapping', function(){
            var injector = new Injector();
            assert(!injector.hasMapping('injection1'));
            injector.addMapping('injection1').toValue(10);
            assert(injector.hasMapping('injection1'));
            injector.removeMapping('injection1');
            assert(!injector.hasMapping('injection1'));
        });
        it('should not remove a sealed mapping', function(){
            var injector = new Injector();
            injector.addMapping('injection1').toValue(10).seal();
            assert(injector.hasMapping('injection1'));
            assert.throws(
                function () {
                    injector.removeMapping('injection1');
                },
                Error
            );
            assert(injector.hasMapping('injection1'));
        });
        it('should remove an unsealed mapping', function(){
            var injector = new Injector();
            var sealKey = injector.addMapping('injection1').toValue(10).seal();
            assert(injector.hasMapping('injection1'));
            injector.getMapping('injection1').unseal(sealKey);
            injector.removeMapping('injection1');
            assert(!injector.hasMapping('injection1'));
        });
    });// end "#removeMapping()" tests

    describe('#injectInto()', function(){
        it('should inject a simple "null" injection point, and ignore other properties', function(){
            var injector = new Injector();
            var JsType = function()
            {
                this.injection1 = null;
                this.injection2 = 'not null';
                this.injection3 = null;
            };
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toValue(20);
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance);
            assert.strictEqual(10, jsTypeInstance.injection1);
            assert.strictEqual('not null', jsTypeInstance.injection2);
            assert.strictEqual(null, jsTypeInstance.injection3);
        });
        it('should trigger the given callback after injection', function(){
            var injector = new Injector();
            var JsType = function()
            {
                this.injection1 = null;
                this.injection2 = null;
            };
            // in sync mode
            var counter = 0;
            injector.addMapping('injection1').toValue(10);
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance, function() {
                assert.strictEqual(10, jsTypeInstance.injection1);
                assert.strictEqual(null, jsTypeInstance.injection2);
                assert.strictEqual(0, counter);
            });
            // in async mode
            counter++;
            injector.addMapping('injection2').toProvider(function(callback) {
                setTimeout(function () {
                    counter++;
                    callback(20);
                }, 20);
            });
            var jsTypeInstance2 = new JsType();
            injector.injectInto(jsTypeInstance, function() {
                assert.strictEqual(10, jsTypeInstance.injection1);
                assert.strictEqual(20, jsTypeInstance.injection2);
                assert.strictEqual(2, counter);
            });
        });
        it('should properly handle the given callback context', function(){
            var injector = new Injector();
            var JsType = function()
            {
                this.injection1 = null;
            };
            var callbackContext = {
                contextProp: 20
            }
            injector.addMapping('injection1').toValue(10);
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance, function() {
                assert.strictEqual(10, jsTypeInstance.injection1);
                assert.strictEqual(20, this.contextProp);
            }, callbackContext);
        });
        it('should trigger the JS object "postInjections()" method after injection', function(done){
            var injector = new Injector();
            var nbPostInjectionsTriggered = 0;
            var JsType = function()
            {
                this.injection1 = null;
                this.injection2 = null;
                this.postInjections = function() {
                    nbPostInjectionsTriggered++;
                };
                this.customPostInjectionsMethod = function() {
                    nbPostInjectionsTriggered++;
                };
            };
            // in sync mode
            injector.addMapping('injection1').toValue(10);
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance, function() {
                assert.strictEqual(10, jsTypeInstance.injection1);
                assert.strictEqual(1, nbPostInjectionsTriggered);
            });
            // in async mode
            injector.addMapping('injection2').toProvider(function(callback) {
                setTimeout(function () {
                    callback(20);
                }, 20);
            });
            var jsTypeInstance2 = new JsType();
            injector.injectInto(jsTypeInstance, function() {
                assert.strictEqual(10, jsTypeInstance.injection1);
                assert.strictEqual(20, jsTypeInstance.injection2);
                assert.strictEqual(2, nbPostInjectionsTriggered);
                done();
            });
        });
        it('should trigger the JS object custom "postInjections()" method after injection', function(done){
            var injector = new Injector();
            injector.instancePostInjectionsCallbackName = 'customPostInjectionsMethod';
            var nbPostInjectionsTriggered = 0;
            var JsType = function()
            {
                this.injection1 = null;
                this.injection2 = null;
                this.customPostInjectionsMethod = function() {
                    (++nbPostInjectionsTriggered === 2) && done();
                };
            };
            // in sync mode
            injector.addMapping('injection1').toValue(10);
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance, function() {
                assert.strictEqual(10, jsTypeInstance.injection1);
                assert.strictEqual(1, nbPostInjectionsTriggered);
            });
            // in async mode
            injector.addMapping('injection2').toProvider(function(callback) {
                setTimeout(function () {
                    callback(20);
                }, 20);
            });
            var jsTypeInstance2 = new JsType();
            injector.injectInto(jsTypeInstance, function() {
                assert.strictEqual(10, jsTypeInstance.injection1);
                assert.strictEqual(20, jsTypeInstance.injection2);
            });
        });
        it('should proceed to injections in the "postInjections()" method after injection, if asked', function(done){
            var injector = new Injector();
            var JsType = function()
            {
                this.injection1 = null;
                this.postInjections = function(injection1, injection2) {
                    assert.strictEqual(10, this.injection1);
                    assert.strictEqual(10, injection1);
                    assert.strictEqual(20, injection2);
                    done();
                };
            };
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function(callback) {
                setTimeout(function () {
                    callback(20);
                }, 20);
            });
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance, null, null, true);//we enable the "proceedToInjectionsInPostInjectionsMethodToo" flag
        });
    });// end "#injectInto()" tests

    describe('#createInjectedInstance()', function(){
        it('should give a fully "injected" object instance', function(done){
            var injector = new Injector();
            var JsType = function()
            {
                this.injection1 = null;
                this.customValueFromPostInjectionsMethod = null;
                this.postInjections = function(injection2) {
                    this.customValueFromPostInjectionsMethod = injection2;
                };
            };
            var callbackContext = {
                contextProp: 30
            }
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function(callback) {
                setTimeout(function () {
                    callback(20);
                }, 20);
            });
            injector.createInjectedInstance(JsType, function (jsTypeInstance) {
                assert(jsTypeInstance instanceof JsType);
                assert.strictEqual(10, jsTypeInstance.injection1);
                assert.strictEqual(20, jsTypeInstance.customValueFromPostInjectionsMethod);
                assert.strictEqual(30, this.contextProp);
                done();
            }, callbackContext, true);//we enable the "proceedToInjectionsInPostInjectionsMethodToo" flag
        });
    });// end "#createInjectedInstance()" tests

    describe('#parseStr()', function(){
        it('should successfully replace ${injectionName} patterns', function(done){
            var injector = new Injector();
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function(callback) {
                setTimeout(function () {
                    callback(20);
                }, 20);
            });
            injector.addMapping('injection3').toValue(null);
            var sourceStr = '${injection1}::${injection2}::${injection3}';
            injector.parseStr(sourceStr, function (injectedStr) {
                assert.strictEqual('10::20::', injectedStr);
                done();
            });
        });
    });// end "#parseStr()" tests

});//end "Injector" tests
