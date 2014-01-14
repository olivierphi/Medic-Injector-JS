
var expect = require('chai').expect;

var InjectorLib = require('../index')
  , Injector = InjectorLib.InjectorSync;

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
            expect(function() { injector.addMapping('injectionValue', 0); }).to.throw(Error, 'forbidden');
        });
    });
    
    describe('#toValue()', function(){
        it('should return the value', function(){
            var injectionMapping = injector.addMapping('test').toValue(10);
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
        });
    });// end "#toValue()" tests

    describe('no resolution scheme', function(){
        it('should return `null`', function(){
            var injectionMapping = injector.addMapping('test');
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.be.null;
        });
    });// end "no resolution scheme" tests

    describe('#toProvider()', function(){
        it('should return the Provider returned value', function(){
            var injectionMapping = injector.addMapping('test').toProvider(function() {
                counter++;
                return 10;
            });
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
            expect(counter).to.equal(1);
        });
        it('should received injected args too', function(){
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
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
            expect(counter).to.equal(1);
        });
        it('should trigger the Provider function multiple times for multiple Injections resolutions requests', function(){
            var injectionMapping = injector.addMapping('test').toProvider(function() {
                counter++;
                return 10;
            });
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
            expect(counter).to.equal(1);
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
            expect(counter).to.equal(2);
        });
    });// end "#toProvider()" tests

    describe('#asSingleton()', function(){
        it('should normally return the value when used with #toValue', function(){
            var injectionMapping = injector.addMapping('test').toValue(10).asSingleton();
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
        });
        it('should return the *same* value with only one Provider trigger when a Provider result is used multiple times', function(){
            var injectionMapping = injector.addMapping('test')
                .toProvider(function() {
                    counter++;
                    return 10;
                })
                .asSingleton();
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
            expect(counter).to.equal(1);
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
            expect(counter).to.equal(1);//the counter stays at "1", because the Provider is triggered only once
        });
    })// end "#asSingleton()" tests

    describe('#toType()', function(){

        var JsType = function()
        {
            this.counter = ++JsType._instanceCounter;
        };
        JsType._instanceCounter = 0;

        it('should return a new instance of the given JS type', function(){
            JsType._instanceCounter = 0;
            var injectionMapping = injector.addMapping('test').toType(JsType);
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.be.an.instanceof(JsType);
            expect(injectionValue).to.have.property('counter', 1);
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.be.an.instanceof(JsType);
            expect(injectionValue).to.have.property('counter', 2);
        });
        it('should return a shared lazy-loaded singleton instance of the given JS type when used with #asSingleton()', function(){
            JsType._instanceCounter = 0;
            var injectionMapping = injector.addMapping('test').toType(JsType).asSingleton();
            var injectionValue;
            injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.be.an.instanceof(JsType);
            expect(injectionValue).to.have.property('counter', 1);
            injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.be.an.instanceof(JsType);
            expect(injectionValue).to.have.property('counter', 1);
        });
    });// end "#toType()" tests

    describe('#seal()/#unseal()', function(){
        it('should seal', function(){
            var injectionMapping = injector.addMapping('test').toValue(10);
            injectionMapping.seal();
            expect(injectionMapping.isSealed()).to.be.true;
            expect(function() { injectionMapping.asSingleton(); } ).to.throw(Error, 'sealed');
            expect(function() { injectionMapping.toValue(20); } ).to.throw(Error, 'sealed');
            expect(function() { injectionMapping.toProvider(function() {return 30;}); } ).to.throw(Error, 'sealed');
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(10);
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
            var injectionValue = injectionMapping.resolveInjection();
            expect(injectionValue).to.equal(20);
        });

    });// end "#seal()/#unseal()" tests

});//end "InjectionMapping" tests

describe('Injector', function(){

    describe('#triggerFunctionWithInjectedParams()', function(){
        it('should handle a given context successfully', function(done){
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
                done();
            };
            injector.triggerFunctionWithInjectedParams(targetFunction, targetFunctionContext);
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
            injector.addMapping('injection3').toProvider(function () {
                return 30;
            });
            injector.addMapping('injection4').toProvider(function (injection8) {//this provider is itself "injected"
                expect(injection8).to.have.property('counter', 1);
                return 40;
            });
            injector.addMapping('injection5').toProvider(function (injection4, injection8) {//this provider is itself "injected" with the "injected" previous one
                expect(injection8).to.have.property('counter', 2);
                return injection4+10;
            });
            injector.addMapping('injection6').toProvider(function (injection5, injection9) {//this provider is itself "injected" with the "injected" previous one
                expect(injection9).to.have.property('counter', 3);//injection 9 is singleton
                return injection5+10;
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

            injector.triggerFunctionWithInjectedParams(targetFunction);
        });
    });// end "#triggerFunctionWithInjectedParams()" tests

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
            injector.addMapping('injection1').toValue(10);
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance);
            expect(jsTypeInstance).to.have.property('injection1', 10);
            expect(jsTypeInstance).to.have.property('injection2', null);
            expect(counter).to.equal(0);
        });
        it('should trigger the JS object "postInjections()" method after injection', function(){
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
            injector.addMapping('injection1').toValue(10);
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance);
            expect(jsTypeInstance).to.have.property('injection1', 10);
            expect(jsTypeInstance).to.have.property('injection2', null);
            expect(nbPostInjectionsTriggered).to.equal(1);
        });
        it('should trigger the JS object custom "postInjections()" method after injection', function(){
            injector.instancePostInjectionsCallbackName = 'customPostInjectionsMethod';
            var nbPostInjectionsTriggered = 0;
            var JsType = function()
            {
                this.injection1 = null;
                this.injection2 = null;
                this.customPostInjectionsMethod = function() {
                    expect(++nbPostInjectionsTriggered).to.equal(1);
                };
            };
            injector.addMapping('injection1').toValue(10);
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance);
            expect(jsTypeInstance).to.have.property('injection1', 10);
            expect(++nbPostInjectionsTriggered).to.equal(2);
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
            injector.addMapping('injection3').toProvider(function() {
                return 30;
            });
            var jsTypeInstance = new JsType();
            injector.injectInto(jsTypeInstance, true);//we enable the "proceedToInjectionsInPostInjectionsMethodToo" flag
        });
    });// end "#injectInto()" tests

    describe('#createInjectedInstance()', function(){
        it('should give a fully "injected" object instance', function(){
            var JsType = function()
            {
                this.injection1 = null;
                this.customValueFromPostInjectionsMethod = null;
                this.postInjections = function(injection2) {
                    this.customValueFromPostInjectionsMethod = injection2;
                };
            };
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function() {
                return 20;
            });
            var jsTypeInstance = injector.createInjectedInstance(JsType, true);//we enable the "proceedToInjectionsInPostInjectionsMethodToo" flag
            expect(jsTypeInstance).to.be.instanceof(JsType);
            expect(jsTypeInstance).to.have.property('injection1', 10);
            expect(jsTypeInstance).to.have.property('customValueFromPostInjectionsMethod', 20);
        });
    });// end "#createInjectedInstance()" tests

    describe('#parseStr()', function(){
        it('should successfully replace ${injectionName} patterns', function(){
            injector.addMapping('injection1').toValue(10);
            injector.addMapping('injection2').toProvider(function() {
                return 20;
            });
            injector.addMapping('injection3').toValue(null);
            var sourceStr = '${injection1}::${injection2}::${injection3}';
            var injectedStr = injector.parseStr(sourceStr);
            expect(injectedStr).to.equal('10::20::');
        });
    });// end "#parseStr()" tests

});//end "Injector" tests
