Ext.data.JsonP.InjectionMapping({"parentMixins":[],"inheritable":null,"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/medic-injector.html#InjectionMapping' target='_blank'>medic-injector.js</a></div><div class='dependency'><a href='source/medic-injector.html#InjectionMapping' target='_blank'>medic-injector.js</a></div><div class='dependency'><a href='source/medic-injector.sync.html#InjectionMapping' target='_blank'>medic-injector.sync.js</a></div></pre><div class='doc-contents'><p>You cant' use this constructor directly. Use <a href=\"#!/api/Injector-method-addMapping\" rel=\"Injector-method-addMapping\" class=\"docClass\">Injector.addMapping</a> to create a new Injection Mapping.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-injectionName' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-property-injectionName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-property-injectionName' class='name not-expandable'>injectionName</a><span> : String</span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/InjectionMapping-method-constructor' class='name expandable'>InjectionMapping</a>( <span class='pre'><a href=\"#!/api/Injector\" rel=\"Injector\" class=\"docClass\">Injector</a> injectorInstance, String injectionName</span> ) : <a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>injectorInstance</span> : <a href=\"#!/api/Injector\" rel=\"Injector\" class=\"docClass\">Injector</a><div class='sub-desc'>\n</div></li><li><span class='pre'>injectionName</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_onAsyncResolutionInSingletonMode' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-_onAsyncResolutionInSingletonMode' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-_onAsyncResolutionInSingletonMode' class='name expandable'>_onAsyncResolutionInSingletonMode</a>( <span class='pre'>Object injectionResolvedValue</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>injectionResolvedValue</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_resolveModule' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-_resolveModule' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-_resolveModule' class='name expandable'>_resolveModule</a>( <span class='pre'>Function callback, [Object context], [Boolean forceAsync]</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>context</span> : Object (optional)<div class='sub-desc'>\n<p>Defaults to: <code>null</code></p></div></li><li><span class='pre'>forceAsync</span> : Boolean (optional)<div class='sub-desc'>\n<p>Defaults to: <code>false</code></p></div></li></ul></div></div></div><div id='method-_resolveProvider' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-_resolveProvider' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-_resolveProvider' class='name expandable'>_resolveProvider</a>( <span class='pre'>Function callback, [Object context], [Boolean forceAsync]</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'>Recursive resolution of a \"provider\" injection. ...</div><div class='long'><p>Recursive resolution of a \"provider\" injection. Any of this provider function's argument whose name equals a registered\ninjection name will itself trigger a recursive injection resolution.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>context</span> : Object (optional)<div class='sub-desc'>\n<p>Defaults to: <code>null</code></p></div></li><li><span class='pre'>forceAsync</span> : Boolean (optional)<div class='sub-desc'>\n<p>Defaults to: <code>false</code></p></div></li></ul></div></div></div><div id='method-_throwSealedException' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-_throwSealedException' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-_throwSealedException' class='name expandable'>_throwSealedException</a>( <span class='pre'></span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-_triggerFunction' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-_triggerFunction' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-_triggerFunction' class='name expandable'>_triggerFunction</a>( <span class='pre'>Function func, Array argsArray, [Object context], [Boolean forceAsync]</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>func</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>argsArray</span> : Array<div class='sub-desc'>\n</div></li><li><span class='pre'>context</span> : Object (optional)<div class='sub-desc'>\n<p>Defaults to: <code>null</code></p></div></li><li><span class='pre'>forceAsync</span> : Boolean (optional)<div class='sub-desc'>\n<p>Defaults to: <code>false</code></p></div></li></ul></div></div></div><div id='method-_triggerInjectionResolutionCallback' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-_triggerInjectionResolutionCallback' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-_triggerInjectionResolutionCallback' class='name expandable'>_triggerInjectionResolutionCallback</a>( <span class='pre'>Object injectionResolvedValue, Function callback, [Object context], [Boolean forceAsync]</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'>an Error will be thrown if the callback function have more than 1 arg and none of them is called \"injectionName\" ...</div><div class='long'><p>an Error will be thrown if the callback function have more than 1 arg and none of them is called \"injectionName\"</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>injectionResolvedValue</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>context</span> : Object (optional)<div class='sub-desc'>\n<p>Defaults to: <code>null</code></p></div></li><li><span class='pre'>forceAsync</span> : Boolean (optional)<div class='sub-desc'>\n<p>Defaults to: <code>false</code></p></div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'><p>an Error will be thrown if the callback function have more than 1 arg and none of them is called \"injectionName\"</p>\n</div></li></ul></div></div></div><div id='method-asSingleton' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-asSingleton' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-asSingleton' class='name expandable'>asSingleton</a>( <span class='pre'></span> ) : <a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></div><div class='description'><div class='short'>When this method is called on an Injection Mapping, its resolution will be triggered the first time it is\nrequested, ...</div><div class='long'><p>When this method is called on an Injection Mapping, its resolution will be triggered the first time it is\nrequested, but any subsequent call will use this first-time resolved value.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isSealed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-isSealed' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-isSealed' class='name expandable'>isSealed</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>If the seal method has been called on this InjectionMapping, returns true ...</div><div class='long'><p>If the <a href=\"#!/api/InjectionMapping-method-seal\" rel=\"InjectionMapping-method-seal\" class=\"docClass\">seal</a> method has been called on this InjectionMapping, returns <code>true</code></p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-resolveInjection' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-resolveInjection' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-resolveInjection' class='name expandable'>resolveInjection</a>( <span class='pre'>Function callback, [Object context], [Boolean forceAsync]</span> )</div><div class='description'><div class='short'>Resolves the injection mapping. ...</div><div class='long'><p>Resolves the injection mapping.\nWhen it's resolved, the callback function is triggered in the supplied context.\nThe first arg of the triggered callback will be the injection value. If you have anothers\nargs in the callback function, they will be inspected and may be filled with other injections values too,\nfor each of these function arg whose name s the same that an existing InjectionMapping.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>context</span> : Object (optional)<div class='sub-desc'>\n<p>Defaults to: <code>null</code></p></div></li><li><span class='pre'>forceAsync</span> : Boolean (optional)<div class='sub-desc'>\n<p>Defaults to: <code>false</code></p></div></li></ul></div></div></div><div id='method-seal' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-seal' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-seal' class='name expandable'>seal</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Seal this Injection mapping. ...</div><div class='long'><p>Seal this Injection mapping. Any subsequent call to any of the</p>\n\n<h1>toValue, \"toProvider()\", \"toModule\" or \"asSingleton()\" methods will throw</h1>\n\n<p>an Error. @see <a href=\"#!/api/InjectionMapping-method-unseal\" rel=\"InjectionMapping-method-unseal\" class=\"docClass\">unseal</a>()</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>returns a \"unseal\" key ; the only way to unseal this InjectionMapping it to call its \"unseal()\" method with this key</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'><p>@see <a href=\"#!/api/InjectionMapping-method-unseal\" rel=\"InjectionMapping-method-unseal\" class=\"docClass\">unseal</a>()</p>\n</div></li></ul></div></div></div><div id='method-toModule' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-toModule' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-toModule' class='name expandable'>toModule</a>( <span class='pre'>String modulePathToRequire, [String targetModulePropertyName]</span> ) : <a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></div><div class='description'><div class='short'>Maps an injection value to the result of a module. ...</div><div class='long'><p>Maps an injection value to the result of a module.\nUse this only in Node.js or AMD environments (needs the presence of a global \"require\" function).\n@see https://github.com/amdjs/amdjs-api/wiki/AMD</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>modulePathToRequire</span> : String<div class='sub-desc'>\n</div></li><li><span class='pre'>targetModulePropertyName</span> : String (optional)<div class='sub-desc'>\n<p>Defaults to: <code>null</code></p></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toProvider' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-toProvider' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-toProvider' class='name expandable'>toProvider</a>( <span class='pre'>Function injectionValueProviderFunction</span> ) : <a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></div><div class='description'><div class='short'>The Injection Mapping value will be resolved through a Provider function. ...</div><div class='long'><p>The Injection Mapping value will be resolved through a Provider function.\nIf this function has a \"callback\" argument, it will be considered as an asynchronous Provider.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>injectionValueProviderFunction</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-toType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-toType' class='name expandable'>toType</a>( <span class='pre'>Function javascriptType</span> ) : <a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></div><div class='description'><div class='short'>Each time this Injection Mapping value will be requested, a new instance of the target Javascript type will\nbe created. ...</div><div class='long'><p>Each time this Injection Mapping value will be requested, a new instance of the target Javascript type will\nbe created.\nUse it with <a href=\"#!/api/InjectionMapping-method-asSingleton\" rel=\"InjectionMapping-method-asSingleton\" class=\"docClass\">asSingleton</a>() to map a lazy-loaded shared instance to this Injection Mapping.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>javascriptType</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-toValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-toValue' class='name expandable'>toValue</a>( <span class='pre'>Object value</span> ) : <a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></div><div class='description'><div class='short'>The simplest Injection Mapping type : each time a component will request this Injection Mapping injection, the\ntarget...</div><div class='long'><p>The simplest Injection Mapping type : each time a component will request this Injection Mapping injection, the\ntarget value will be injected.\nSince this value is a plain Javascript scalar, Array or Object, it's shared in all the application and calling</p>\n\n<h1>asSingleton on such an Injection Mapping is useless.</h1>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-unseal' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='InjectionMapping'>InjectionMapping</span><br/><a href='source/medic-injector.html#InjectionMapping-method-unseal' target='_blank' class='view-source'>view source</a></div><a href='#!/api/InjectionMapping-method-unseal' class='name expandable'>unseal</a>( <span class='pre'>Object key</span> ) : <a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></div><div class='description'><div class='short'>Reverts the effect of seal, makes the mapping changeable again. ...</div><div class='long'><p>Reverts the effect of <code>seal</code>, makes the mapping changeable again. Has to be invoked with the unique key object returned by an earlier call to <code>seal</code> Can't unseal a mapping that's not sealed\n@see <a href=\"#!/api/InjectionMapping-method-seal\" rel=\"InjectionMapping-method-seal\" class=\"docClass\">seal</a>()</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : Object<div class='sub-desc'><p>The key to unseal the mapping. Has to be the instance returned by\n<code>seal()</code></p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/InjectionMapping\" rel=\"InjectionMapping\" class=\"docClass\">InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'><p>Has to be invoked with the unique key object returned by an earlier call to <code>seal</code></p>\n</div></li><li><span class='pre'>Error</span><div class='sub-desc'><p>Can't unseal a mapping that's not sealed\n@see <a href=\"#!/api/InjectionMapping-method-seal\" rel=\"InjectionMapping-method-seal\" class=\"docClass\">seal</a>()</p>\n</div></li></ul></div></div></div></div></div></div></div>","override":null,"extends":null,"html_meta":{},"uses":[],"alternateClassNames":[],"members":{"method":[{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"constructor","id":"method-constructor"},{"tagname":"method","meta":{"private":true},"owner":"InjectionMapping","name":"_onAsyncResolutionInSingletonMode","id":"method-_onAsyncResolutionInSingletonMode"},{"tagname":"method","meta":{"private":true},"owner":"InjectionMapping","name":"_resolveModule","id":"method-_resolveModule"},{"tagname":"method","meta":{"private":true},"owner":"InjectionMapping","name":"_resolveProvider","id":"method-_resolveProvider"},{"tagname":"method","meta":{"private":true},"owner":"InjectionMapping","name":"_throwSealedException","id":"method-_throwSealedException"},{"tagname":"method","meta":{"private":true},"owner":"InjectionMapping","name":"_triggerFunction","id":"method-_triggerFunction"},{"tagname":"method","meta":{"private":true},"owner":"InjectionMapping","name":"_triggerInjectionResolutionCallback","id":"method-_triggerInjectionResolutionCallback"},{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"asSingleton","id":"method-asSingleton"},{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"isSealed","id":"method-isSealed"},{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"resolveInjection","id":"method-resolveInjection"},{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"seal","id":"method-seal"},{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"toModule","id":"method-toModule"},{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"toProvider","id":"method-toProvider"},{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"toType","id":"method-toType"},{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"toValue","id":"method-toValue"},{"tagname":"method","meta":{},"owner":"InjectionMapping","name":"unseal","id":"method-unseal"}],"cfg":[],"property":[{"tagname":"property","meta":{},"owner":"InjectionMapping","name":"injectionName","id":"property-injectionName"}],"css_var":[],"event":[],"css_mixin":[]},"subclasses":[],"superclasses":[],"singleton":false,"tagname":"class","statics":{"method":[],"cfg":[],"property":[],"css_var":[],"event":[],"css_mixin":[]},"requires":[],"mixins":[],"private":null,"component":false,"meta":{},"name":"InjectionMapping","linenr":17,"files":[{"href":"medic-injector.html#InjectionMapping","filename":"medic-injector.js"},{"href":"medic-injector.html#InjectionMapping","filename":"medic-injector.js"},{"href":"medic-injector.sync.html#InjectionMapping","filename":"medic-injector.sync.js"}],"inheritdoc":null,"enum":null,"id":"class-InjectionMapping","mixedInto":[],"aliases":{}});