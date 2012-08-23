
var assert = require('assert');

var InjectorLib = require('../medic-injector')
  , Injector = InjectorLib.MedicInjector
  , InjectionMapping = InjectorLib.MedicInjectionMapping;

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
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function () {return 20;});
            injector.addMapping('injection3').toProvider(function (callback) {
                setTimeout(function () { callback(30); }, 20);
            });
            injector.addMapping('injection4').toProvider(function (callback) {
                setTimeout(function () { callback(40); }, 20);
            });
            injector.addMapping('injection5').toProvider(function (callback, injection4) {
                setTimeout(function () { callback(injection4+10); }, 20);
            });
            injector.addMapping('injection6').toProvider(function (callback, injection5) {//this provider is itself "injected"
                setTimeout(function () { callback(injection5+10); }, 20);
            }).asSingleton();
            var targetFunctionContext = {
                'contextProp': -1
            };
            var targetFunction = function (injection2, injection1, injection7, injection6, injection3)
            {
                assert.strictEqual(10, injection1);
                assert.strictEqual(20, injection2);
                assert.strictEqual(30, injection3);
                assert.strictEqual(60, injection6);
                assert.strictEqual(null, injection7);
                assert.strictEqual(-1, this.contextProp);
                done();
            };
            injector.triggerFunctionWithInjectedParams(targetFunction, targetFunctionContext);
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
            var injectionMapping = injector.addMapping('injection1').toValue(10);
            var sealKey = injectionMapping.seal();
            assert(injector.hasMapping('injection1'));
            injectionMapping.unseal(sealKey);
            injector.removeMapping('injection1');
            assert(!injector.hasMapping('injection1'));
        });
    });// end "#removeMapping()" tests

});//end "Injector" tests
