
var expect = require('chai').expect;

var InjectorLib = require('../index')
  , Injector = InjectorLib.Injector;

var injector;
var counter;

beforeEach(function() {
    injector = new Injector();
    counter = 0;
});

describe('InjectionMapping', function(){

    
    describe('creation', function(){
        it('should be instantiable via "injector.addMapping()"', function(){
            expect(injector.addMapping('test', 0)).to.have.property('_injector', injector);
        });
        it('should not use a forbidden injection name', function(){
            expect(function() { injector.addMapping('callback', 0); }).to.throw(Error, 'forbidden');
            expect(function() { injector.addMapping('injectionValue', 0); }).to.throw(Error, 'forbidden');
        });
    });
    
    describe('#toValue()', function(){
        it('should immediately return the value', function(){
            var injectionMapping = injector.addMapping('test').toValue(10);
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(0);//since this a value mapping without the use of the "forceAsync" mode, the callback should be triggered immediately
            });
            counter++;
        });
        it('should asynchronously return the value when forceAsync is used', function(done){
            var injectionMapping = injector.addMapping('test').toValue(10);
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(1);
                done();
            }, null, true);//async mode is forced
            counter++;
        });
    });// end "#toValue()" tests

    describe('no resolution scheme', function(){
        it('should immediately return `null`', function(done){
            var injectionMapping = injector.addMapping('test');
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.be.null;
                done();
            });
        });
    });// end "no resolution scheme" tests

    describe('#toProvider()', function(){
        it('should synchronously return the value when a sync callback result is used', function(done){
            var injectionMapping = injector.addMapping('test').toProvider(function() {
                counter++;
                return 10;
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(1);
                done();
            });
            counter++;
        });
        it('should asynchronously return the value when an async callback result is used', function(done){
            var injectionMapping = injector.addMapping('test').toProvider(function(callback) {
                counter++;
                setTimeout(function () {
                    counter++;
                    callback(10);
                }, 20);
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(3);
                done();
            });
            counter++;
        });
        it('should received injected args too', function(done){
            injector.addMapping('injection1').toValue(-10);
            injector.addMapping('injection2').toValue(-20);
            var injectionMapping = injector.addMapping('test').toProvider(function(injection1, dummy1, injection2, dummy2) {
                counter++;
                expect(injection1).to.equal(-10);
                expect(dummy1).to.be.null;
                expect(injection2).to.equal(-20);
                expect(dummy2).to.be.null;
                return 10;
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(1);
                done();
            });
            counter++;
        });
        it('should received injected args, even in aysnc mode, with a randomly ordered "callback" arg', function(done){
            injector.addMapping('injection1').toValue(-10);
            injector.addMapping('injection2').toValue(-20);
            var injectionMapping = injector.addMapping('test').toProvider(function(injection1, dummy1, callback, injection2, dummy2) {
                counter++;
                expect(injection1).to.equal(-10);
                expect(dummy1).to.be.null;
                expect(injection2).to.equal(-20);
                expect(dummy2).to.be.null;
                setTimeout(function () {
                    counter++;
                    callback(10);
                }, 20);
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(3);
                done();
            });
            counter++;
        });
        it('should trigger the Provider function multiple times for multiple Injections resolutions requests, even in sync mode', function(done){
            var nbCallbacksTriggered = 0;
            var injectionMapping = injector.addMapping('test').toProvider(function() {
                counter++;
                return 10;
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(1);
                (++nbCallbacksTriggered === 2) && done();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(2);
                (++nbCallbacksTriggered === 2) && done();
            });
            counter++;
        });
        it('should trigger the Provider function multiple times for multiple Injections resolutions requests in async mode', function(done){
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
                expect(counter).to.equal(5);
                done();
            };
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            counter++;
        });
    });// end "#toProvider()" tests

    describe('#asSingleton()', function(){
        it('should normally immediately return the value when used with #toValue', function(){
            var injectionMapping = injector.addMapping('test').toValue(10).asSingleton();
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(0);//since this a value mapping without the use of the "forceAsync" mode, the callback should be triggered immediately
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(0);
            });
            counter++;
        });
        it('should normally asynchronously return the value when forceAsync is used when used with #toValue', function(done){
            var nbCallbacksTriggered = 0;
            var injectionMapping = injector.addMapping('test').toValue(10).asSingleton();
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(1);
                (++nbCallbacksTriggered === 2) && done();
            }, null, true);//async mode is forced
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(1);
                (++nbCallbacksTriggered === 2) && done();
            }, null, true);//async mode is forced
            counter++;
        });
        it('should synchronously return the *same* value with only one Provider trigger when a sync callback result is used multiple times', function(done){
            var nbCallbacksTriggered = 0;
            var injectionMapping = injector.addMapping('test')
                .toProvider(function() {
                    counter++;
                    return 10;
                })
                .asSingleton();
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(1);
                (++nbCallbacksTriggered === 2) && done();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(1);//the counter stays at "1", because the Provider is triggered only once
                (++nbCallbacksTriggered === 2) && done();
            });
            counter++;
        });
        it('should asynchronously return the *same* value with only one Provider trigger when an async callback result is used multiple times', function(done){
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
                expect(counter).to.equal(3);
                done();
            };
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(3);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                expect(counter).to.equal(3);//the counter stays at "3", because the Provider is triggered only once
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            counter++;
        });
        it('should received injected args, even in aysnc mode, with a randomly ordered "callback" arg, with only one Provider trigger', function(done){
            var nbCallbacksTriggered = 0;
            injector.addMapping('injection1').toValue(-10);
            injector.addMapping('injection2').toValue(-20);
            var injectionMapping = injector.addMapping('test')
                .toProvider(function(injection1, dummy1, callback, injection2, dummy2) {
                    counter++;
                    expect(injection1).to.equal(-10);
                    expect(dummy1).to.be.null;
                    expect(injection2).to.equal(-20);
                    expect(dummy2).to.be.null;
                    setTimeout(function () {
                        counter++;
                        callback(10);
                    }, 20);
                })
                .asSingleton();
            var onAllInjectionsResolved = function ()
            {
                expect(counter).to.equal(3);
                done();
            };
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
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
        
        beforeEach(function () {
            JsType._instanceCounter = 0 
        });

        it('should immediately return a new instance of the given JS type', function(){
            var injectionMapping = injector.addMapping('test').toType(JsType);
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.be.an.instanceof(JsType);
                expect(injectionValue).to.have.property('counter', 1);
                expect(counter).to.equal(0);//since this a value mapping without the use of the "forceAsync" mode, the callback should be triggered immediately
            });
            counter++;
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.be.an.instanceof(JsType);
                expect(injectionValue).to.have.property('counter', 2);
                expect(counter).to.equal(1);
            });
        });
        it('should asynchronously return the value when forceAsync is used', function(done){
            var nbCallbacksTriggered = 0;
            var injectionMapping = injector.addMapping('test').toType(JsType);
            var onAllInjectionsResolved = function ()
            {
                expect(JsType).itself.to.have.property('_instanceCounter', 2);
                done();
            };
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.be.an.instanceof(JsType);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            }, null, true);//async mode is forced
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.be.an.instanceof(JsType);
                (++nbCallbacksTriggered === 2) && onAllInjectionsResolved();
            }, null, true);//async mode is forced
        });
        it('should immediately return a shared lazy-loaded singleton instance of the given JS type when used with #asSingleton()', function(done){
            var injectionMapping = injector.addMapping('test').toType(JsType).asSingleton();
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.be.an.instanceof(JsType);
                expect(injectionValue).to.have.property('counter', 1);
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.be.an.instanceof(JsType);
                expect(injectionValue).to.have.property('counter', 1);
            });
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.be.an.instanceof(JsType);
                expect(injectionValue).to.have.property('counter', 1);
                done();
            }, null, true);//async mode is forced
        });
    });// end "#toType()" tests

    describe('#toModule()', function(){
        it('should immediately return a module result in Node.js', function(){
            var injectionMapping = injector.addMapping('test').toModule('util');
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(require('util'));
                expect(counter).to.equal(0);
            });
            counter++;
        });
        it('should immediately return a module sub-property result in Node.js when the "targetModulePropertyName" arg is used.', function(){
            var injectionMapping = injector.addMapping('test').toModule('util', 'format');
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(counter).to.equal(0);
                expect(injectionValue).to.equal(require('util').format);
                expect(counter).to.equal(0);
            });
            counter++;
        });
    });// end "#toModule()" tests

    describe('#seal()/#unseal()', function(){
        it('should prevent any modification on a sealed injection mapping', function(){
            var injectionMapping = injector.addMapping('test').toValue(10);
            injectionMapping.seal();
            expect(injectionMapping.isSealed()).to.be.true;
            expect(function() { injectionMapping.asSingleton(); } ).to.throw(Error, 'sealed');
            expect(function() { injectionMapping.toValue(20); } ).to.throw(Error, 'sealed');
            expect(function() { injectionMapping.toProvider(function() {return 30;}); } ).to.throw(Error, 'sealed');
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(10);
            });
        });
        it('should not unseal with an invalid key', function(){
            var injectionMapping = injector.addMapping('test').toValue(10);
            injectionMapping.seal();
            expect(function() { injectionMapping.unseal(null); }).to.throw(Error, 'correct key');
            expect(function() { injectionMapping.unseal({}); }).to.throw(Error, 'correct key');
        });
        it('should successfully unseal with the seal key', function(){
            var injectionMapping = injector.addMapping('test').toValue(10);
            var sealKey = injectionMapping.seal();
            expect(function() { injectionMapping.unseal(sealKey); }).to.not.throw(Error, 'sealed');
            expect(injectionMapping.isSealed()).to.not.be.true;
            expect(function() { injectionMapping.toValue(20); } ).to.not.throw(Error);
            injectionMapping.resolveInjection(function (injectionValue) {
                expect(injectionValue).to.equal(20);
            });
        });

    });// end "#seal()/#unseal()" tests

});//end "InjectionMapping" tests

describe('Injector', function(){

    describe('#trigger()', function(){
        it('should handle a given context successfully', function(){
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function () {return 20;});
            var targetFunctionContext = {
                'contextProp': -1
            };
            var targetFunction = function (injection1, injection2)
            {
                expect(injection1).to.equal(10);
                expect(injection2).to.equal(20);
                expect(this).to.have.property('contextProp', -1);
            };
            injector.trigger(targetFunction, targetFunctionContext);
        });
        it('should be able to resolve misc injected params', function(done){
            // We already tested each of these InjectionsMappings, we can mix them from now on

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
                expect(injection8).to.have.property('counter', 1);
                setTimeout(function () { callback(40); }, 20);
            });
            injector.addMapping('injection5').toProvider(function (callback, injection4, injection8) {//this provider is itself "injected"
                expect(injection8).to.have.property('counter', 2);
                setTimeout(function () { callback(injection4+10); }, 20);
            });
            injector.addMapping('injection6').toProvider(function (callback, injection5, injection9) {//this provider is itself "injected" with the "injected" previous one
                expect(injection9).to.have.property('counter', 3);//injection 9 is singleton
                setTimeout(function () { callback(injection5+10); }, 20);
            }).asSingleton();
            injector.addMapping('injection7').toProvider(function (injection9) {//this provider is itself "injected" with the "injected" previous one
                expect(injection9).to.have.property('counter', 3);//injection 9 is singleton
                return 70;
            });
            injector.addMapping('injection8').toType(JsType);
            injector.addMapping('injection9').toType(JsType).asSingleton();

            var targetFunction = function (injection2, injection1, unmatchedInjection, injection6, injection3, injection7)
            {
                expect(injection1).to.equal(10);
                expect(injection2).to.equal(20);
                expect(injection3).to.equal(30);
                expect(injection6).to.equal(60);
                expect(injection7).to.equal(70);
                expect(unmatchedInjection).to.be.null;
                done();
            };

            injector.trigger(targetFunction);
        });
    });// end "#trigger()" tests

    describe('#removeMapping()', function(){
        it('should remove a given mapping', function(){
            expect(injector.hasMapping('injection1')).to.be.false;
            injector.addMapping('injection1').toValue(10);
            expect(injector.hasMapping('injection1')).to.be.true;
            injector.removeMapping('injection1');
            expect(injector.hasMapping('injection1')).to.be.false;
        });
        it('should not remove a sealed mapping', function(){
            injector.addMapping('injection1').toValue(10).seal();
            expect(function() { injector.removeMapping('injection1'); }).to.throw(Error, 'sealed');
            expect(injector.hasMapping('injection1')).to.be.true;
        });
        it('should remove an unsealed mapping', function(){
            var sealKey = injector.addMapping('injection1').toValue(10).seal();
            expect(injector.hasMapping('injection1')).to.be.true;
            injector.getMapping('injection1').unseal(sealKey);
            injector.removeMapping('injection1');
            expect(injector.hasMapping('injection1')).to.be.false;
        });
    });// end "#removeMapping()" tests

    describe('#injectInto()', function(){
        it('should inject a simple "null" injection point, and ignore other properties', function(){
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
            expect(jsTypeInstance).to.have.property('injection1', 10);
            expect(jsTypeInstance).to.have.property('injection2', 'not null');
            expect(jsTypeInstance).to.have.property('injection3', null);
        });
        it('should trigger the given callback after injection', function(){
            var JsType = function()
            {
                this.injection1 = null;
                this.injection2 = null;
            };
            // in sync mode
            injector.addMapping('injection1').toValue(10);
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance, function() {
                expect(jsTypeInstance).to.have.property('injection1', 10);
                expect(jsTypeInstance).to.have.property('injection2', null);
                expect(counter).to.equal(0);
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
            injector.injectInto(jsTypeInstance2, function() {
                expect(jsTypeInstance2).to.have.property('injection1', 10);
                expect(jsTypeInstance2).to.have.property('injection2', 20);
                expect(counter).to.equal(1);
            });
        });
        it('should properly handle the given callback context', function(){
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
                expect(jsTypeInstance).to.have.property('injection1', 10);
                expect(this).to.have.property('contextProp', 20);
            }, callbackContext);
        });
        it('should trigger the JS object "postInjections()" method after injection', function(done){
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
                expect(jsTypeInstance).to.have.property('injection1', 10);
                expect(jsTypeInstance).to.have.property('injection2', null);
                expect(nbPostInjectionsTriggered).to.equal(1);
            });
            // in async mode
            injector.addMapping('injection2').toProvider(function(callback) {
                setTimeout(function () {
                    callback(20);
                }, 20);
            });
            var jsTypeInstance2 = new JsType();
            injector.injectInto(jsTypeInstance2, function() {
                expect(jsTypeInstance2).to.have.property('injection1', 10);
                expect(jsTypeInstance2).to.have.property('injection2', 20);
                expect(nbPostInjectionsTriggered).to.equal(2);
                done();
            });
        });
        it('should trigger the JS object custom "postInjections()" method after injection', function(done){
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
                expect(jsTypeInstance).to.have.property('injection1', 10);
                expect(nbPostInjectionsTriggered).to.equal(1);
            });
            // in async mode
            injector.addMapping('injection2').toProvider(function(callback) {
                setTimeout(function () {
                    callback(20);
                }, 20);
            });
            var jsTypeInstance2 = new JsType();
            injector.injectInto(jsTypeInstance2, function() {
                expect(jsTypeInstance2).to.have.property('injection1', 10);
                expect(jsTypeInstance2).to.have.property('injection2', 20);
            });
        });
        it('should proceed to injections in the "postInjections()" method after injection, if asked', function(done){
            var JsType = function()
            {
                this.injection1 = null;
                this.postInjections = function(injection2, injection3) {
                    expect(this).to.have.property('injection1', 10);
                    expect(injection2).to.equal(20);
                    expect(injection3).to.equal(30);
                    done();
                };
            };
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toValue(20);
            injector.addMapping('injection3').toProvider(function(callback) {
                setTimeout(function () {
                    callback(30);
                }, 20);
            });
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance, null, null, true);//we enable the "proceedToInjectionsInPostInjectionsMethodToo" flag
        });
    });// end "#injectInto()" tests

    describe('#createInjectedInstance()', function(){
        it('should give a fully "injected" object instance', function(done){
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
                expect(jsTypeInstance).to.be.instanceof(JsType);
                expect(jsTypeInstance).to.have.property('injection1', 10);
                expect(jsTypeInstance).to.have.property('customValueFromPostInjectionsMethod', 20);
                expect(this).to.have.property('contextProp', 30);
                done();
            }, callbackContext, true);//we enable the "proceedToInjectionsInPostInjectionsMethodToo" flag
        });
    });// end "#createInjectedInstance()" tests

    describe('#parseStr()', function(){
        it('should successfully replace ${injectionName} patterns', function(done){
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function(callback) {
                setTimeout(function () {
                    callback(20);
                }, 20);
            });
            injector.addMapping('injection3').toValue(null);
            var sourceStr = '${injection1}::${injection2}::${injection3}';
            injector.parseStr(sourceStr, function (injectedStr) {
                expect(injectedStr).to.equal('10::20::');
                done();
            });
        });
    });// end "#parseStr()" tests

});//end "Injector" tests
