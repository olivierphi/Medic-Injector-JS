
//var assert = require(process.env._ + "/../../lib/node_modules/should");//TODO: shouldn't have to do this :-)
var assert = require("assert");

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
        })
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
        })
    })

    describe('#toFunctionResult()', function(){
        it('should synchronously return the value when a sync callback result is used', function(done){
            var injector = new Injector();
            var counter = 0;
            var injectionMapping = injector.addMapping('test').toFunctionResult(function() {
                counter++;
                return 10;
            })
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);
                done();
            });
            counter++;
        })
        it('should asynchronously return the value when an async callback result is used', function(done){
            var injector = new Injector();
            var counter = 0;
            var injectionMapping = injector.addMapping('test').toFunctionResult(function(callback) {
                counter++;
                setTimeout(function () {
                    counter++;
                    callback(10);
                }, 200);
            })
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(3, counter);
                done();
            });
            counter++;
        })
        it('should received injected args too', function(done){
            var injector = new Injector();
            var counter = 0;
            injector.addMapping('injection1').toValue(-10);
            injector.addMapping('injection2').toValue(-20);
            var injectionMapping = injector.addMapping('test').toFunctionResult(function(injection1, dummy1, injection2, dummy2) {
                counter++;
                assert.strictEqual(-10, injection1);
                assert.strictEqual(null, dummy1);
                assert.strictEqual(-20, injection2);
                assert.strictEqual(null, dummy2);
                return 10;
            })
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(10, injectionValue);
                assert.strictEqual(1, counter);
                done();
            });
            counter++;
        })
        it('should received injected args, even in aysnc mode, with a randomly ordered "callback" arg', function(done){
            var injector = new Injector();
            var counter = 0;
            injector.addMapping('injection1').toValue(-10);
            injector.addMapping('injection2').toValue(-20);
            var injectionMapping = injector.addMapping('test').toFunctionResult(function(injection1, dummy1, callback, injection2, dummy2) {
                counter++;
                assert.strictEqual(-10, injection1);
                assert.strictEqual(null, dummy1);
                assert.strictEqual(-20, injection2);
                assert.strictEqual(null, dummy2);
                setTimeout(function () {
                    counter++;
                    callback(10);
                }, 200);
            })
            injectionMapping.resolveInjection(function (injectionValue) {
                assert.strictEqual(injectionValue, 10);
                assert.strictEqual(3, counter);
                done();
            });
            counter++;
        })
    })

})