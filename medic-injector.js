/*
 * This file is part of the Medic-Injector library.
 *
 * (c) Olivier Philippon <https://github.com/DrBenton>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Strongly inspired by the SwiftSuspenders (https://github.com/tschneidereit/SwiftSuspenders)
 * ActionScript 3 library.
 */

(function(context) {

    var myDebug = false;

    /**
     * @class InjectionMapping
     */

    var FORBIDDEN_INJECTIONS_NAMES = [
        'callback',
        'injectionValue'
    ];

    /**
     * You cant' use this constructor directly. Use Injector.addMapping to create a new Injection Mapping.
     *
     * @class InjectionMapping
     * @constructor
     * @param {Injector} injectorInstance
     * @param {String} injectionName
     * @return {InjectionMapping}
     */
    var InjectionMapping = function (injectorInstance, injectionName)
    {
        if (! (injectorInstance instanceof Injector)) {
            throw new Error('Don\'t instantiate InjectionMapping directly ; use Injector#addMapping to create InjectionMappings!');
        }
        if (-1 < FORBIDDEN_INJECTIONS_NAMES.indexOf(injectionName)) {
            throw new Error('Injection name "'+injectionName+'" is forbidden');
        }
        this._injector = injectorInstance;
        /**
         *
         * @type {String}
         */
        this.injectionName = injectionName;
    };

    /**
     * The simplest Injection Mapping type : each time a component will request this Injection Mapping injection, the
     * target value will be injected.
     * Since this value is a plain Javascript scalar, Array or Object, it's shared in all the application and calling
     * #asSingleton on such an Injection Mapping is useless.
     *
     * @param value
     * @return {InjectionMapping} The <code>InjectionMapping</code> the method is invoked on
     * @throws {Error}
     */
    InjectionMapping.prototype.toValue = function (value)
    {
        this._sealed && this._throwSealedException();
        this._toValue = value;
        return this;
    };

    /**
     * The Injection Mapping value will be resolved through a Provider function.
     * If this function has a "callback" argument, it will be considered as an asynchronous Provider.
     *
     * @param {Function} injectionValueProviderFunction
     * @return {InjectionMapping} The <code>InjectionMapping</code> the method is invoked on
     * @throws {Error}
     */
    InjectionMapping.prototype.toProvider = function (injectionValueProviderFunction)
    {
        this._sealed && this._throwSealedException();
        this._toProvider = injectionValueProviderFunction;
        return this;
    };

    /**
     * Each time this Injection Mapping value will be requested, a new instance of the target Javascript type will
     * be created.
     * Use it with #asSingleton() to map a lazy-loaded shared instance to this Injection Mapping.
     *
     * @param {Function} javascriptType
     * @return {InjectionMapping} The <code>InjectionMapping</code> the method is invoked on
     * @throws {Error}
     */
    InjectionMapping.prototype.toType = function (javascriptType)
    {
        this._sealed && this._throwSealedException();
        if (!(javascriptType instanceof Function))
        {
            throw new Error('InjectionMapping.toType() argument must be a Javascript type (i.e. a function instantiable with "new")')
        }
        this._toType = javascriptType;
        return this;
    };

    /**
     * Maps an injection value to the result of a module.
     * Use this only in Node.js or AMD environments (needs the presence of a global "require" function).
     * @see https://github.com/amdjs/amdjs-api/wiki/AMD
     *
     * @param {String} modulePathToRequire
     * @param {String} [targetModulePropertyName=null]
     * @return {InjectionMapping} The <code>InjectionMapping</code> the method is invoked on
     * @throws {Error}
     */
    InjectionMapping.prototype.toModule = function (modulePathToRequire, targetModulePropertyName)
    {
        this._sealed && this._throwSealedException();
        this._toModule = {'path': modulePathToRequire, 'prop': targetModulePropertyName || null};
        return this;
    };

    /**
     * When this method is called on an Injection Mapping, its resolution will be triggered the first time it is
     * requested, but any subsequent call will use this first-time resolved value.
     *
     * @return {InjectionMapping} The <code>InjectionMapping</code> the method is invoked on
     * @throws {Error}
     */
    InjectionMapping.prototype.asSingleton = function ()
    {
        this._sealed && this._throwSealedException();
        this._asSingleton = true;
        return this;
    };

    /**
     * Resolves the injection mapping.
     * When it's resolved, the callback function is triggered in the supplied context.
     * The first arg of the triggered callback will be the injection value. If you have anothers
     * args in the callback function, they will be inspected and may be filled with other injections values too,
     * for each of these function arg whose name s the same that an existing InjectionMapping.
     *
     * @param {Function} callback
     * @param {Object} [context=null]
     * @param {Boolean} [forceAsync=false]
     */
    InjectionMapping.prototype.resolveInjection = function (callback, context, forceAsync)
    {
        if (this._singletonValue) {

            // Simple and immediate callback trigger
            this._triggerFunction(callback, [this._singletonValue], context, forceAsync);

        } else if (this._toValue) {

            // Simple and immediate callback trigger
            this._triggerFunction(callback, [this._toValue], context, forceAsync);

        } else if (this._toType) {

            // Simple and immediate callback trigger
            var newTypeInstance = new this._toType();
            if (this._asSingleton) {
                this._singletonValue = newTypeInstance;//we won't create new instances of this JS type again
            }
            this._triggerFunction(callback, [newTypeInstance], context, forceAsync);

        } else if (this._toProvider || this._toModule) {

            // These InjectionMapping value are retrieved from more complex data sources.
            // The Provider function may itself ask for other injections, and it can be asynchronous.
            // The Module resolution can be be asynchronous too, in a AMD context.
            // So,this is gonna be... well... a bit less simple :-)

            if (this._asSingleton) {
                // For "singletons" InjectionMappings, we trigger the Provider/Module value only once,
                // even if other resolutions are asked while it's being resolved
                if (this._resolutionInProgress) {
                    this._queuedResolutions.push({'cb': callback, 'ctx': context, 'async': forceAsync});
                    return;//this Injection resolution is queued (it will be handled in "this._resolveProvider()"); we stop right now
                } else {
                    this._resolutionInProgress = true;
                    this._queuedResolutions = [];//we will queue subsequent requests
                }
            }

            if (this._toProvider) {
                this._resolveProvider(callback, context, forceAsync);
            } else if (this._toModule) {
                this._resolveModule(callback, context, forceAsync);
            }

        } else {

            // No injection mapping value resolution scheme found ; let's trigger an immediate callback with a 'null' value
            this._triggerFunction(callback, [null], context, forceAsync);

        }
    };

    /**
     * Seal this Injection mapping. Any subsequent call to any of the
     * #toValue, "toProvider()", "toModule" or "asSingleton()" methods will throw
     * an Error.
     *
     * @return {Object} returns a "unseal" key ; the only way to unseal this InjectionMapping it to call its "unseal()" method with this key
     * @throws {Error}
     * @see #unseal()
     */
    InjectionMapping.prototype.seal = function ()
    {
        this._sealed && this._throwSealedException();
        this._sealed = true;
        this._sealKey = {};
        return this._sealKey;
    };

    /**
     * Reverts the effect of <code>seal</code>, makes the mapping changeable again.
     *
     * @param {Object} key The key to unseal the mapping. Has to be the instance returned by
     * <code>seal()</code>
     * @return {InjectionMapping} The <code>InjectionMapping</code> the method is invoked on
     * @throws {Error} Has to be invoked with the unique key object returned by an earlier call to <code>seal</code>
     * @throws {Error} Can't unseal a mapping that's not sealed
     * @see #seal()
     */
    InjectionMapping.prototype.unseal = function (key)
    {
        if (!this._sealed) {
            throw new Error('Can\'t unseal a non-sealed mapping.');
        }
        if (key !== this._sealKey)
        {
            throw new InjectorError('Can\'t unseal mapping without the correct key.');
        }
        this._sealed = false;
        this._sealKey = null;
        return this;
    };

    /**
     * If the #seal method has been called on this InjectionMapping, returns `true`
     * @return {Boolean}
     */
    InjectionMapping.prototype.isSealed = function ()
    {
        return this._sealed;
    };

    /**
     * Recursive resolution of a "provider" injection. Any of this provider function's argument whose name equals a registered
     * injection name will itself trigger a recursive injection resolution.
     *
     * @param {Function} callback
     * @param {Object} [context=null]
     * @param {Boolean} [forceAsync=false]
     * @private
     */
    InjectionMapping.prototype._resolveProvider = function (callback, context, forceAsync)
    {
        var providerFunction = this._toProvider;
        var providerArgsNames = getArgumentNames(providerFunction);
        var callbackArgIndex = providerArgsNames.indexOf('callback');
        var isAnAsyncFunction = (-1 < callbackArgIndex) ? true : false ;

        myDebug && console && console.log('******** _resolveProvider() ; isAnAsyncFunction=', isAnAsyncFunction, ', providerArgsNames=', providerArgsNames);

        // 2) This function will be triggered when all the required injections of the function will have been resolved
        var onProviderArgsInjectionsResolution = function (resolvedInjectionsValues)
        {
            myDebug && console && console.log('_resolveFunctionResultInjection()#onProviderArgsInjectionsResolution ; providerArgsNames=', providerArgsNames);

            if (isAnAsyncFunction) {
                // This Provider is async (it has a "callback" argument)
                // --> we trigger it right now and wait for the callback resolution (it will have the injection value as only argument)
                resolvedInjectionsValues[callbackArgIndex] = onProviderResult;//we insert our callback in the Provider "callback" arg
                providerFunction.apply(null, resolvedInjectionsValues);
            } else {
                // This Provider is not aysnc (it doesn't iteslf have a "callback" argument) ; the injection value is the return value of the callback
                // --> we trigger it right now and just retrieve its return value
                var injectionValue = providerFunction.apply(null, resolvedInjectionsValues);
                onProviderResult(injectionValue);
            }
        };

        // 3) We have the Provider result : handle it and trigger the injection callback
        var onProviderResult = bind(function (providerReturnedValue) {

            myDebug && console && console.log('_resolveFunctionResultInjection()#onFunctionResult ; providerReturnedValue=', providerReturnedValue);

            // Now we can call our Injection callback (it will be itself "injected")
            this._triggerInjectionResolutionCallback(providerReturnedValue, callback, context, forceAsync);

            if (this._asSingleton) {
                // from now on, we will always use this return value for this Injection (it won't have to be resolved again)
                this._onAsyncResolutionInSingletonMode(providerReturnedValue);
            }

        }, this);

        // 1) Okay, let's start with the resolution of the requested injections of this function...
        this._injector.resolveInjections(providerArgsNames, onProviderArgsInjectionsResolution);

    };

    /**
     *
     * @param injectionResolvedValue
     * @private
     */
    InjectionMapping.prototype._onAsyncResolutionInSingletonMode = function (injectionResolvedValue)
    {

        this._singletonValue = injectionResolvedValue;

        // In "as singleton" mode we may have pending Injection Resolutions
        // --> let's resolve them if needed
        if (this._queuedResolutions && this._queuedResolutions.length > 0) {
            for (var i = 0; i < this._queuedResolutions.length; i++) {
                var queuedResolution = this._queuedResolutions[i]
                    , queuedResolutionCallback = queuedResolution['cb']
                    , queuedResolutionContext = queuedResolution['ctx']
                    , queuedResolutionForceAsync = queuedResolution['async'];
                this._triggerInjectionResolutionCallback(injectionResolvedValue, queuedResolutionCallback, queuedResolutionContext, queuedResolutionForceAsync);
            }
            this._queuedResolutions = null;//garbage collection on queued callbacks
        }
        this._resolutionInProgress = false;

    };

    /**
     *
     * @param injectionResolvedValue
     * @param {Function} callback
     * @param {Object} [context=null]
     * @param {Boolean} [forceAsync=false]
     * @private
     * @throws {Error} an Error will be thrown if the callback function have more than 1 arg and none of them is called "injectionName"
     */
    InjectionMapping.prototype._triggerInjectionResolutionCallback = function (injectionResolvedValue, callback, context, forceAsync)
    {
        var callbackArgsNames = getArgumentNames(callback);

        if (2 > callbackArgsNames) {

            // The InjectionMapping value callback only have 1 arg.
            // --> this arg is simply filled with the resolved injection value!
            this._triggerFunction(callback, [injectionResolvedValue], context, forceAsync);

        } else {

            // The InjectionMapping value callback have multiple args.
            // --> we launch an injections resolution process on it, then we will trigger it.
            // The injection value will be injected to its "injectionValue" arg
            var injectionValueArgIndex = callbackArgsNames.indexOf('injectionValue');
            if (-1 === injectionValueArgIndex) {
                throw new Error('An injection resolution callback function with more than 1 argument *must* have a "injectionValue" arg!');
            }
            var onInjectionsResolution = bind(function (resolvedInjectionsValues) {
                resolvedInjectionsValues[injectionValueArgIndex] = injectionResolvedValue;//we insert our injection value in the callback "injectionValue" arg
                this._triggerFunction(callback, resolvedInjectionsValues, context, forceAsync);
            }, this);
            this._injector.resolveInjections(callbackArgsNames, onInjectionsResolution, this);

        }
    };

    /**
     *
     * @param {Function} callback
     * @param {Object} [context=null]
     * @param {Boolean} [forceAsync=false]
     * @private
     */
    InjectionMapping.prototype._resolveModule = function (callback, context, forceAsync)
    {
        if (typeof require === "undefined") {
            throw new Error('Module resolution can be used only when a global "require" method exists (i.e. in Node.js or when using AMD');
        }

        if (typeof module !== "undefined" && typeof process !== "undefined") {

            // Node.js
            // --> instant resolution
            var moduleResult = require(this._toModule.path);
            if (null !== this._toModule.prop) {
                moduleResult = moduleResult[this._toModule.prop];
            }
            this._triggerFunction(callback, [moduleResult], context, forceAsync);

        } else {

            // AMD
            // --> asynchronous resolution
            require([moduleResult], bind(function(moduleResult) {
                if (null !== this._toModule.prop) {
                    moduleResult = moduleResult[this._toModule.prop];
                }
                this._triggerFunction(callback, [moduleResult], context, forceAsync);
            }, this));

        }

    };

    /**
     *
     * @param {Function} func
     * @param {Array} argsArray
     * @param {Object} [context=null]
     * @param {Boolean} [forceAsync=false]
     * @private
     */
    InjectionMapping.prototype._triggerFunction = function (func, argsArray, context, forceAsync)
    {
        if (!forceAsync)
            func.apply(context, argsArray);
        else
            nextTick(function () {func.apply(context, argsArray);});
    };

    /**
     *
     * @private
     */
    InjectionMapping.prototype._throwSealedException = function ()
    {
        throw new Error('Modifications on a sealed InjectionMapping is forbidden!');
    };

    // Injector
    /**
     * Creates a new Injector instance.
     *
     * Access this class with
     * <code>var Injector = require('medic-injector').Injector;</code>
     *
     * @class Injector
     * @constructor
     * @return {Injector}
     */
    var Injector = function ()
    {
        this._mappings = {};
        return this;
    };

    /**
     * The name of the function to trigger in a custom JS type instance after the resolution of all its Injections Points.
     * @property {String}
     */
    Injector.prototype.instancePostInjectionsCallbackName = 'postInjections';

    /**
     * Adds a new InjectionMapping to the Injector.
     *
     * @param {String} injectionName
     * @return {InjectionMapping}
     */
    Injector.prototype.addMapping = function (injectionName)
    {
        if (!!this._mappings[injectionName]) {
            throw new Error('Injection name "'+injectionName+'" is already used!');
        }
        var newInjectionMapping = new InjectionMapping(this, injectionName);
        this._mappings[injectionName] = newInjectionMapping;
        return newInjectionMapping;
    };

    /**
     * Removes an existing InjectionMapping.
     *
     * @param {String} injectionName
     * @return {Injector}
     * @throws {Error} An Error is thrown if the target InjectionMapping has been sealed
     */
    Injector.prototype.removeMapping = function (injectionName)
    {
        if (!!this._mappings[injectionName] && this._mappings[injectionName].isSealed()) {
            throw new Error('Injection name "'+injectionName+'" is sealed and cannot be removed!');
        }
        delete this._mappings[injectionName];
        return this;
    };

    /**
     *
     * @param {String} injectionName
     * @return {Boolean}
     */
    Injector.prototype.hasMapping = function (injectionName)
    {
        return !!this._mappings[injectionName];
    };

    /**
     *
     * @param {String} injectionName
     * @return {InjectionMapping}
     */
    Injector.prototype.getMapping = function (injectionName)
    {
        return this._mappings[injectionName] || null;
    };

    /**
     * Triggers the target function with the supplied context.
     * The function args are parsed, and for each of these args whose name equals a registered InjectionMapping name
     * the injection will be resolved and its value will fill the matching function arg value.
     *
     * @param {Function} func
     * @param {Object} [context=null]
     * @param {Boolean} [forceAsync=false]
     * @param {Function} [callback=null]
     * @param {Object} [callbackContext=null]
     */
    Injector.prototype.triggerFunctionWithInjectedParams = function (func, context, forceAsync, callback, callbackContext)
    {
        myDebug && console && console.log('triggerFunctionWithInjectedParams() ; func=', func);
        var functionArgsNames = getArgumentNames(func);
        var injectionsValues;
        var triggerFunction = function () {
            func.apply(context, injectionsValues);
            callback && callback.apply(callbackContext);
        };
        var onInjectionsResolution = function (resolvedInjectionsValues) {
            injectionsValues = resolvedInjectionsValues;
            if (!forceAsync) {
                triggerFunction();
            } else {
                nextTick(triggerFunction);
            }
        };
        this.resolveInjections(functionArgsNames, onInjectionsResolution, this);
    };


    /**
     *
     * @param {Object} jsTypeInstance
     * @param {Function} [callback=null]
     * @param {Object} [callbackContext=null]
     * @param {Boolean} [proceedToInjectionsInPostInjectionsMethodToo=false]
     */
    Injector.prototype.injectInto = function (jsTypeInstance, callback, callbackContext, proceedToInjectionsInPostInjectionsMethodToo)
    {
        // Let's scan this JS object instance for injection points...
        var propsToInject = [];
        for (var propName in jsTypeInstance) {
            if (null === jsTypeInstance[propName] && !!this._mappings[propName]) {
                // This instance property is null and its name matches a registered injection name
                // --> let's handle it as an injection point!
                propsToInject.push(propName);
            }
        }

        // Okay, we have our Injections Points ; let's resolve them, assign their value
        // to the matching injections points, and trigger the callback - if any.
        var onInjectionsResolution = function (resolvedInjectionsValues) {
            for (var i = 0; i < resolvedInjectionsValues.length; i++) {
                var propName = propsToInject[i]
                  , propValue = resolvedInjectionsValues[i];
                jsTypeInstance[propName] = propValue;//property injection!
            }
            // Okay, now we may trigger the JS object instance "postInjection" method if it has one...
            if (!!jsTypeInstance[this.instancePostInjectionsCallbackName] && (jsTypeInstance[this.instancePostInjectionsCallbackName] instanceof Function)) {
                if (!proceedToInjectionsInPostInjectionsMethodToo) {
                    // Simple "postInjection" trigger
                    jsTypeInstance[this.instancePostInjectionsCallbackName].apply(jsTypeInstance);
                    callback && callback.apply(callbackContext);//callback is triggered right after instance post injection hook
                } else {
                    // We will look for injections in the "postInjection" method too!
                    this.triggerFunctionWithInjectedParams(jsTypeInstance[this.instancePostInjectionsCallbackName], jsTypeInstance, false, function () {
                        callback && callback.apply(callbackContext);//callback is triggered right after instance post injection hook
                    });
                }
            } else {
                callback && callback.apply(callbackContext);//no "postInjection" method ; callback is triggered immediately
            }
            // ...and this method callback if one has been provider
        };

        this.resolveInjections(propsToInject, onInjectionsResolution, this);
    };

    /**
     *
     * @param {Function} jsType
     * @param {Function} callback This callback function will receive a new instance of the given JS type after its handling by the Injector
     * @param {Boolean} [proceedToInjectionsInPostInjectionsMethodToo=false]
     */
    Injector.prototype.createInjectedInstance = function (jsType, callback, callbackContext, proceedToInjectionsInPostInjectionsMethodToo)
    {
        var newInstance = new jsType();
        var onInstanceReady = function () {
            callback.apply(callbackContext, [newInstance]);
        };
        this.injectInto(newInstance, onInstanceReady, null, proceedToInjectionsInPostInjectionsMethodToo);
    };

    /**
     * Replaces all "${injectionName}" patterns in the given String with the values of the matching Injections Mappings.
     * For each `null` injection mapping value, an empty string is used instead of 'null'.
     *
     * @param {String} str
     * @param {Function} callback
     * @param {Object} [callbackContext=null]
     */
    Injector.prototype.parseStr = function (str, callback, callbackContext)
    {
        var requestedInjectionsNames = [];
        str.replace(/\$\{([a-z0-9_]+)\}/ig, bind(function (fullStr, injectionName) {
            if (!!this._mappings[injectionName]) {
                requestedInjectionsNames.push(injectionName);
            }
            return fullStr;//don't replace anything for the moment...
        }, this));

        var onInjectionsResolution = function (resolvedInjectionsValues) {
            for (var i = 0; i < requestedInjectionsNames.length; i++) {
                var injectionName = requestedInjectionsNames[i]
                    , injectionValue = (null === resolvedInjectionsValues[i]) ? '' : resolvedInjectionsValues[i] ;
                str = str.replace('${' + injectionName + '}', injectionValue);
            }
            callback && callback.apply(callbackContext, [str]);
        };

        this.resolveInjections(requestedInjectionsNames, onInjectionsResolution, this);
    };

    /**
     * Set the value of all public properties of the target JS object whose name is an injection mapping to "null".
     * This lets you cancel the effect of #injectInto for clean garbage collection.
     *
     * @param {Object} jsTypeInstance
     */
    Injector.prototype.cancelInjectionsInto = function (jsTypeInstance)
    {
        // Let's scan this JS object instance for injection points...
        for (var propName in jsTypeInstance) {
            if (!!this._mappings[propName]) {
                // This instance property's name matches a registered injection name
                // --> let's cancel this injection point
                jsTypeInstance[propName] = null;
            }
        }
    };

    /**
     *
     * @param {Array} injectionsNamesArray an Array of Strings
     * @param {Function} callback Will be triggered when all injections are resolved ; it will receive an Array of resolved injections (with `null` for each arg whose name is not a registered injection name)
     * @param {Object} [context=null]
     */
    Injector.prototype.resolveInjections = function (injectionsNamesArray, callback, context)
    {
        myDebug && console && console.log('resolveInjections() ; injectionsNamesArray=', injectionsNamesArray);
        var resolvedInjectionPoints = [];
        var nbInjectionsPointsToResolve = injectionsNamesArray.length;
        var nbInjectionsPointsResolved = 0;

        // Will be triggered when all the function args are resolved
        var triggerCallback = function ()
        {
            myDebug && console && console.log('resolveInjections()#triggerCallback');
            callback.call(context, resolvedInjectionPoints);
        };

        if (0 === nbInjectionsPointsToResolve) {
            // No arg for this callback ; immediate trigger!
            triggerCallback();
            return;
        }

        // Will be triggered for each resolved function argument
        var onArgResolution = function (argIndex, argValue)
        {
            myDebug && console && console.log('resolveInjections()#onArgResolution ; '+nbInjectionsPointsResolved+'/'+nbInjectionsPointsToResolve);
            resolvedInjectionPoints[argIndex] = argValue;
            nbInjectionsPointsResolved++;
            if (nbInjectionsPointsResolved >= nbInjectionsPointsToResolve) {
                // We have all our injections points ; let's trigger the function!
                triggerCallback();
            }
        };

        var prepareInjectionResolution = bind(function(injectionName, argIndex)
        {
            var injectionMapping = this._mappings[injectionName];
            injectionMapping.resolveInjection(function (injectionValue) {
                onArgResolution(argIndex, injectionValue);
            });
        }, this);

        for (var i = 0; i < nbInjectionsPointsToResolve; i++ ) {

            var currentInjectionName = injectionsNamesArray[i];

            if (!this._mappings[currentInjectionName]) {
                // We have no mapping for this arg : we'll send `null` to the function for this arg
                onArgResolution(i, null);
            } else {
                // We have to resolve the mapping
                prepareInjectionResolution(currentInjectionName, i);
            }

        }
    };


    // Library export

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Injector;
        }
        exports.MedicInjector = Injector;
    } else if (typeof define === "function" && define.amd) {
        define('medic-injector', [], function () { return Injector; } );
    } else {
        context['MedicInjector'] = Injector;
    }


    // Utils

    /**
     * @private
     *
     * "nextTick" function from Q source code
     * @see https://raw.github.com/kriskowal/q/master/q.js
     *
     * Copyright 2009-2012 Kris Kowal under the terms of the MIT
     * license found at http://github.com/kriskowal/q/raw/master/LICENSE
     *
     * With parts by Tyler Close
     * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
     * at http://www.opensource.org/licenses/mit-license.html
     * Forked at ref_send.js version: 2009-05-11
     *
     * With parts by Mark Miller
     * Copyright (C) 2011 Google Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License")
     * See Q source code for license details.
     */
    // use the fastest possible means to execute a task in a future turn
    // of the event loop.
    var nextTick;
    if (typeof process !== "undefined") {
        // node
        nextTick = process.nextTick;
    } else if (typeof msSetImmediate === "function") {
        // IE 10 only, at the moment
        // And yes, ``bind``ing to ``window`` is necessary O_o.
        nextTick = msSetImmediate.bind(window);
    } else if (typeof setImmediate === "function") {
        // https://github.com/NobleJS/setImmediate
        nextTick = setImmediate;
    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // linked list of tasks (single, with head node)
        var head = {}, tail = head;
        channel.port1.onmessage = function () {
            head = head.next;
            var task = head.task;
            delete head.task;
            task();
        };
        nextTick = function (task) {
            tail = tail.next = {task: task};
            channel.port2.postMessage(0);
        };
    } else {
        // old browsers
        nextTick = function (task) {
            setTimeout(task, 0);
        };
    }

    // Function reflection
    /**
     * From Prototype library
     * @see https://github.com/sstephenson/prototype/blob/master/src/prototype/lang/function.js
     *
     * Prototype JavaScript framework
     * (c) 2005-2010 Sam Stephenson
     *
     * Prototype is freely distributable under the terms of an MIT-style license.
     * For details, see the Prototype web site: http://www.prototypejs.org/
     *
     * @param {Function} fun
     * @return {Array}
     * @private
     */
    var getArgumentNames = function (fun)
    {
        var names = fun.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
            .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
            .replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    };

    // Functions scope binding
    /**
     *
     * @param {Function} func
     * @param {Object} context
     * @return {Function}
     * @private
     */
    var bind = function (func, context)
    {
        var args = Array.prototype.slice.call(arguments, 2);
        return function(){
            return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
        };
    };


})(this);