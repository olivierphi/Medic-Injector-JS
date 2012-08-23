(function(context) {

    var myDebug = false;

    // InjectionMapping

    var FORBIDDEN_INJECTIONS_NAMES = [
        'callback',
        'injectionValue'
    ];

    /**
     *
     * @param {Injector} injectorInstance
     * @param {String} injectionName
     * @throws Error
     * @constructor
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
        this.injectionName = injectionName;
    };

    /**
     *
     * @param value
     * @return {InjectionMapping} The <code>InjectionMapping</code> the method is invoked on
     * @throws Error
     */
    InjectionMapping.prototype.toValue = function (value)
    {
        this._sealed && this._throwSealedException();
        this._toValue = value;
        return this;
    };

    /**
     *
     * @param {Function} injectionValueProviderFunction
     * @return {InjectionMapping} The <code>InjectionMapping</code> the method is invoked on
     * @throws Error
     */
    InjectionMapping.prototype.toProvider = function (injectionValueProviderFunction)
    {
        this._sealed && this._throwSealedException();
        this._toProvider = injectionValueProviderFunction;
        return this;
    };

    /**
     *
     * @return {InjectionMapping} The <code>InjectionMapping</code> the method is invoked on
     * @throws Error
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
     * @param {Object/null} [context=null]
     * @param {Boolean/null} [forceAsync=false]
     */
    InjectionMapping.prototype.resolveInjection = function (callback, context, forceAsync)
    {
        if (this._singletonValue) {

            // Simple and immediate callback trigger
            this._triggerFunction(callback, [this._singletonValue], context, forceAsync);

        } else if (this._toValue) {

            // Simple and immediate callback trigger
            this._triggerFunction(callback, [this._toValue], context, forceAsync);

        } else if (this._toProvider) {

            // This InjectionMapping value is retrieved from a Provider function
            // It's gonna be... well... a bit less simple :-)

            if (this._asSingleton) {
                // For "singletons" InjectionMappings, we trigger the Provider value only once,
                // even if other resolutions are asked while it's being resolved
                if (this._resolutionInProgress) {
                    this._queuedResolutions.push({'cb': callback, 'ctx': context, 'async': forceAsync});
                    return;//this Injection resolution is queued (it will be handled in "this._resolveProvider()"); we stop right now
                } else {
                    this._resolutionInProgress = true;
                    this._queuedResolutions = [];//we will queue subsequent requests
                }
            }

            this._resolveProvider(callback, context, forceAsync);

        }
    };

    /**
     * Seal this Injection mapping. Any subsequent call to any of the
     * "toValue()", "toCallbackResult()" or "asSingleton()" methods will throw
     * an Error.
     * @return {Object} returns a "unseal" key ; the only way to unseal this InjectionMapping it to call its "unseal()" method with this key
     * @throws Error
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
     * @throws Error Has to be invoked with the unique key object returned by an earlier call to <code>seal</code>
     * @throws Error Can't unseal a mapping that's not sealed
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
     *
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
     * @param {Object/null} [context=null]
     * @param {Boolean/null} [forceAsync=false]
     * @private
     */
    InjectionMapping.prototype._resolveProvider = function (callback, context, forceAsync)
    {
        var providerFunction = this._toProvider;
        var providerArgsNames = getArgumentNames(providerFunction);
        var callbackArgIndex = providerArgsNames.indexOf('callback');
        var isAnAsyncFunction = (-1 < callbackArgIndex) ? true : false ;

        myDebug && console && console.log('******** _resolveProvider() ; isAnAsyncFunction=', isAnAsyncFunction, ', providerArgsNames=', providerArgsNames);

        var that = this;//we don't bundle Underscore nor jQuery, so let's back to the good old "that = this" scope trick :-)

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
        var onProviderResult = function (providerReturnedValue) {

            myDebug && console && console.log('_resolveFunctionResultInjection()#onFunctionResult ; providerReturnedValue=', providerReturnedValue);
            if (that._asSingleton) {
                // from now on, we will always use this return value for this Injection (it won't have to be resolved again)
                that._singletonValue = providerReturnedValue;
            }

            // Now we can call our Injection callback (it will be itself "injected")
            that._triggerInjectionResolutionCallback(providerReturnedValue, callback, context, forceAsync);

            // In "as singleton" mode we may have pending Injection Resolutions
            // --> let's resolve them if needed
            if (that._queuedResolutions && that._queuedResolutions.length > 0) {
                for (var i = 0; i < that._queuedResolutions.length; i++) {
                    var queuedResolution = that._queuedResolutions[i]
                      , queuedResolutionCallback = queuedResolution['cb']
                      , queuedResolutionContext = queuedResolution['ctx']
                      , queuedResolutionForceAsync = queuedResolution['async'];
                    that._triggerInjectionResolutionCallback(providerReturnedValue, queuedResolutionCallback, queuedResolutionContext, queuedResolutionForceAsync);
                }
                that._queuedResolutions = null;//garbage collection on queued callbacks
            }
            that._resolutionInProgress = false;

        };

        // 1) Okay, let's start with the resolution of the requested injections of this function...
        this._injector.resolveInjections(providerArgsNames, onProviderArgsInjectionsResolution);

    };

    /**
     *
     * @param injectionResolvedValue
     * @param {Function} callback
     * @param {Object/null} [context=null]
     * @param {Boolean/null} [forceAsync=false]
     * @private
     * @throws Error an Error will be thrown if the callback function have more than 1 arg and none of them is called "injectionName"
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
            var that = this;//sorry...
            var onInjectionsResolution = function (resolvedInjectionsValues) {
                resolvedInjectionsValues[injectionValueArgIndex] = injectionResolvedValue;//we insert our injection value in the callback "injectionValue" arg
                that._triggerFunction(callback, resolvedInjectionsValues, context, forceAsync);
            };
            this._injector.resolveInjections(callbackArgsNames, onInjectionsResolution, this);

        }
    };

    /**
     *
     * @param {Function} func
     * @param {Array} argsArray
     * @param {Object/null} [context=null]
     * @param {Boolean/null} [forceAsync=false]
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

    var Injector = function ()
    {
        this._mappings = {};
    };

    /**
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
     *
     * @param {String} injectionName
     * @return {Injector}
     * @throws Error An Error is thrown if the target InjectionMapping has been sealed
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
     * Triggers the target function with the supplied context.
     * The function args are parsed, and for each of these args whose name equals a registered InjectionMapping name
     * the injection will be resolved and its value will fill the matching function arg value.
     *
     * @param {Function} func
     * @param {Object/null} [context=null]
     * @param {Boolean/null} [forceAsync=false]
     */
    Injector.prototype.triggerFunctionWithInjectedParams = function (func, context, forceAsync)
    {
        myDebug && console && console.log('triggerFunctionWithInjectedParams() ; func=', func);
        var functionArgsNames = getArgumentNames(func);
        var onInjectionsResolution = function (resolvedInjectionsValues) {
            if (!forceAsync) {
                func.apply(context, resolvedInjectionsValues);
            } else {
                nextTick(function () { func.call(context, resolvedInjectionsValues); });
            }
        };
        this.resolveInjections(functionArgsNames, onInjectionsResolution, this);
    };


    /**
     *
     * @param {Array} injectionsNamesArray an Array of Strings
     * @param {Function} callback Will be triggered when all injections are resolved ; it will receive an Array of resolved injections (with `null` for each arg whose name is not a registered injection name)
     * @param {Object/null} [context=null]
     */
    Injector.prototype.resolveInjections = function (injectionsNamesArray, callback, context)
    {
        myDebug && console && console.log('resolveInjections() ; injectionsNamesArray=', injectionsNamesArray);
        var resolvedInjectionPoints = [];
        var nbInjectionsPointsToResolve = injectionsNamesArray.length;
        var nbInjectionsPointsResolved = 0;

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

        // Will be triggered when all the function args are resolved
        var triggerCallback = function ()
        {
            myDebug && console && console.log('resolveInjections()#triggerCallback');
            callback.call(context, resolvedInjectionPoints);
        };

        var that = this;//    :-/
        var prepareInjectionResolution = function(injectionName, argIndex)
        {
            var injectionMapping = that._mappings[injectionName];
            injectionMapping.resolveInjection(function (injectionValue) {
                onArgResolution(argIndex, injectionValue);
            });
        };

        if (0 === nbInjectionsPointsToResolve)
        {
            // No arg for this callback ; immediate trigger!
            triggerCallback();
            return;
        }

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
        exports.MedicInjectionMapping = InjectionMapping;
        exports.MedicInjector = Injector;
    } else if (typeof define === "function" && define.amd) {
        define('medic-injector', [], function () { return {'InjectionMapping': InjectionMapping, 'Injector': Injector}; } );
    } else {
        context['MedicInjectionMapping'] = InjectionMapping;
        context['MedicInjector'] = Injector;
    }


    // Utils

    /**
     * "nextTick" function from Q's source code
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
     * @param fun
     * @return {Array}
     */
    var getArgumentNames = function (fun)
    {
        var names = fun.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
            .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
            .replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    };

})(this);