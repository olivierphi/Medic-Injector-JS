(function(context) {


    // InjectionMapping

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
        this._injector = injectorInstance;
        this.injectionName = injectionName;
    };

    /**
     *
     * @param value
     * @return {InjectionMapping}
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
     * @param {Function} callback
     * @return {InjectionMapping}
     * @throws Error
     */
    InjectionMapping.prototype.toCallbackResult = function (callback)
    {
        this._sealed && this._throwSealedException();
        this._toCallback = callback;
        return this;
    };

    /**
     *
     * @return {InjectionMapping}
     * @throws Error
     */
    InjectionMapping.prototype.asSingleton = function ()
    {
        this._sealed && this._throwSealedException();
        this._asSingleton = true;
        return this;
    };

    /**
     * Seal this Injection mapping. Any subsequent call to any of the
     * "toValue()", "toCallbackResult()" or "asSingleton()" methods will throw
     * an Error.
     * @return {InjectionMapping}
     * @throws Error
     */
    InjectionMapping.prototype.seal = function ()
    {
        this._sealed && this._throwSealedException();
        this._sealed = true;
        return this;
    };

    /**
     * Resolves the injection mapping.
     *
     * @param {Function} callback
     * @param {Object/null} [context=null]
     * @param {Boolean/null} [forceAsync=false]
     */
    InjectionMapping.prototype.resolveInjection = function (callback, context, forceAsync)
    {
        var triggerCallback = function(injectionValue) {
            if (!forceAsync)
                callback.call(context, injectionValue);
            else
                nextTick(function () {callback.call(context, injectionValue);});
        };

        if (this._singletonValue) {
            return triggerCallback(this._singletonValue);
        } else if (this._toValue) {
            return triggerCallback(this._toValue);
        }

        if (this._toCallback) {
            this._resolveCallbackInjection(callback, context, forceAsync);
        }

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
     * Recursive resolution of a "callback" injection. Any of the callback's argument whose name is a registered
     * injection name will trigger a recursive injection resolution.
     *
     * @param {Function} callback
     * @param {Object/null} [context=null]
     * @param {Boolean/null} [forceAsync=false]
     * @private
     */
    InjectionMapping.prototype._resolveCallbackInjection = function (callback, context, forceAsync)
    {
        var callbackArgsNames = getArgumentNames(callback);

        var that = this;//we don't bundle Underscore nor jQuery, so let's back to the good old "that = this" scope trick :-)

        var onCallbackArgsInjectionsResolution = function (resolvedInjectionsValues)
        {
            if (that._asSingleton) {
                // now we will always use this return value for this Injection
                that._singletonValue = callbackReturnedInjectionValue;
            }

            callback.apply(context, resolvedInjectionsValues);
        };

        this._injector.resolveInjections(callbackArgsNames, onCallbackArgsInjectionsResolution, context, forceAsync);
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
        if (!!this._mappings[injectionName] && this._mappings[injectionName].isSealed()) {
            throw new Error('Injection name "'+injectionName+'" is already used by a sealed InjectionMapping!');
        }
        var newInjectionMapping = new InjectionMapping(this, injectionName);
        this._mappings[injectionName] = newInjectionMapping;
        return newInjectionMapping;
    };

    /**
     *
     * @param {Function} func
     * @param {Object/null} [context=null]
     * @param {Boolean/null} [forceAsync=false]
     */
    Injector.prototype.triggerFunctionWithInjectedParams = function (func, context, forceAsync)
    {
        var callbackArgsNames = getArgumentNames(func);
        var onInjectionsResolution = function (resolvedInjectionsValues) {
            func.apply(context, resolvedInjectionsValues);
        };
        this.resolveInjections(callbackArgsNames, onInjectionsResolution, context, forceAsync);
    };


    /**
     *
     * @param {Array} injectionsNamesArray an Array of Strings
     * @param {Function} callback Will be triggered when all injections are resolved ; it will receive an Array of resolved injections (with `null` for each arg whose name is not a registered injection name)
     * @param {Object/null} [context=null]
     * @param {Boolean/null} [forceAsync=false]
     */
    Injector.prototype.resolveInjections = function (injectionsNamesArray, callback, context, forceAsync)
    {
        var resolvedInjectionPoints = [];
        var nbInjectionsPointsToResolve = injectionsNamesArray.length;
        var nbInjectionsPointsResolved = 0;

        // Will be triggered for each resolved function argument
        var onArgResolution = function (argIndex, argValue)
        {
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
            if (!forceAsync)
                callback.call(context, resolvedInjectionPoints);
            else
                nextTick(function () { callback.call(context, resolvedInjectionPoints); });
        };

        var prepareInjectionResolution = function(injectionName, argIndex)
        {
            var injectionMapping = this._mappings[injectionName];
            injectionMapping.resolveInjection(function (injectionValue) {
                onArgResolution(argIndex, injectionValue);
            });
        };

        if (0 === nbInjectionsPointsToResolve)
        {
            // No arg for this callback ; immediate triggering!
            triggerCallback();
            return;
        }

        for (i = 0; i < nbInjectionsPointsToResolve; i++ ) {

            var currentInjectionName = injectionsNamesArray[i];

            if (!this._mappings[currentInjectionName]) {
                // We have no mapping for this arg : we'll send `null` to the function for this arg
                resolvedInjectionPoints[i] = null;
                nbInjectionsPointsResolved++;
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