Ext.data.JsonP.sync_InjectionMapping({"parentMixins":[],"inheritable":null,"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/medic-injector.sync.html#sync-InjectionMapping' target='_blank'>medic-injector.sync.js</a></div></pre><div class='doc-contents'><p>You cant' use this constructor directly. Use <a href=\"#!/api/Injector-method-addMapping\" rel=\"Injector-method-addMapping\" class=\"docClass\">Injector.addMapping</a> to create a new \"synchronous operations only\"\nInjection Mapping.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-injectionName' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-property-injectionName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-property-injectionName' class='name not-expandable'>injectionName</a><span> : String</span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/sync.InjectionMapping-method-constructor' class='name expandable'>sync.InjectionMapping</a>( <span class='pre'><a href=\"#!/api/sync.Injector\" rel=\"sync.Injector\" class=\"docClass\">sync.Injector</a> injectorInstance, String injectionName</span> ) : <a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>injectorInstance</span> : <a href=\"#!/api/sync.Injector\" rel=\"sync.Injector\" class=\"docClass\">sync.Injector</a><div class='sub-desc'>\n</div></li><li><span class='pre'>injectionName</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_throwSealedException' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-_throwSealedException' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-method-_throwSealedException' class='name expandable'>_throwSealedException</a>( <span class='pre'></span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-asSingleton' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-asSingleton' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-method-asSingleton' class='name expandable'>asSingleton</a>( <span class='pre'></span> ) : <a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></div><div class='description'><div class='short'>When this method is called on an Injection Mapping, its resolution will be triggered the first time it is\nrequested, ...</div><div class='long'><p>When this method is called on an Injection Mapping, its resolution will be triggered the first time it is\nrequested, but any subsequent call will use this first-time resolved value.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isSealed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-isSealed' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-method-isSealed' class='name expandable'>isSealed</a>( <span class='pre'></span> ) : Boolean</div><div class='description'><div class='short'>If the seal method has been called on this InjectionMapping, returns true ...</div><div class='long'><p>If the <a href=\"#!/api/sync.InjectionMapping-method-seal\" rel=\"sync.InjectionMapping-method-seal\" class=\"docClass\">seal</a> method has been called on this InjectionMapping, returns <code>true</code></p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-resolveInjection' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-resolveInjection' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-method-resolveInjection' class='name expandable'>resolveInjection</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Resolves the injection mapping. ...</div><div class='long'><p>Resolves the injection mapping.</p>\n</div></div></div><div id='method-seal' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-seal' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-method-seal' class='name expandable'>seal</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>Seal this Injection mapping. ...</div><div class='long'><p>Seal this Injection mapping. Any subsequent call to any of the</p>\n\n<h1>toValue, \"toProvider()\" or \"asSingleton()\" methods will throw</h1>\n\n<p>an Error. @see <a href=\"#!/api/sync.InjectionMapping-method-unseal\" rel=\"sync.InjectionMapping-method-unseal\" class=\"docClass\">unseal</a>()</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>returns a \"unseal\" key ; the only way to unseal this InjectionMapping it to call its \"unseal()\" method with this key</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'><p>@see <a href=\"#!/api/sync.InjectionMapping-method-unseal\" rel=\"sync.InjectionMapping-method-unseal\" class=\"docClass\">unseal</a>()</p>\n</div></li></ul></div></div></div><div id='method-toProvider' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-toProvider' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-method-toProvider' class='name expandable'>toProvider</a>( <span class='pre'>Function injectionValueProviderFunction</span> ) : <a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></div><div class='description'><div class='short'>The Injection Mapping value will be resolved through a Provider function. ...</div><div class='long'><p>The Injection Mapping value will be resolved through a Provider function.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>injectionValueProviderFunction</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-toType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-method-toType' class='name expandable'>toType</a>( <span class='pre'>Function javascriptType</span> ) : <a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></div><div class='description'><div class='short'>Each time this Injection Mapping value will be requested, a new instance of the target Javascript type will\nbe created. ...</div><div class='long'><p>Each time this Injection Mapping value will be requested, a new instance of the target Javascript type will\nbe created.\nUse it with <a href=\"#!/api/sync.InjectionMapping-method-asSingleton\" rel=\"sync.InjectionMapping-method-asSingleton\" class=\"docClass\">asSingleton</a>() to map a lazy-loaded shared instance to this Injection Mapping.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>javascriptType</span> : Function<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-toValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-method-toValue' class='name expandable'>toValue</a>( <span class='pre'>Object value</span> ) : <a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></div><div class='description'><div class='short'>The simplest Injection Mapping type : each time a component will request this Injection Mapping injection, the\ntarget...</div><div class='long'><p>The simplest Injection Mapping type : each time a component will request this Injection Mapping injection, the\ntarget value will be injected.\nSince this value is a plain Javascript scalar, Array or Object, it's shared in all the application and calling</p>\n\n<h1>asSingleton on such an Injection Mapping is useless.</h1>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-unseal' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='sync.InjectionMapping'>sync.InjectionMapping</span><br/><a href='source/medic-injector.sync.html#sync-InjectionMapping-method-unseal' target='_blank' class='view-source'>view source</a></div><a href='#!/api/sync.InjectionMapping-method-unseal' class='name expandable'>unseal</a>( <span class='pre'>Object key</span> ) : <a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></div><div class='description'><div class='short'>Reverts the effect of seal, makes the mapping changeable again. ...</div><div class='long'><p>Reverts the effect of <code>seal</code>, makes the mapping changeable again. Has to be invoked with the unique key object returned by an earlier call to <code>seal</code> Can't unseal a mapping that's not sealed\n@see <a href=\"#!/api/sync.InjectionMapping-method-seal\" rel=\"sync.InjectionMapping-method-seal\" class=\"docClass\">seal</a>()</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : Object<div class='sub-desc'><p>The key to unseal the mapping. Has to be the instance returned by\n<code>seal()</code></p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/sync.InjectionMapping\" rel=\"sync.InjectionMapping\" class=\"docClass\">sync.InjectionMapping</a></span><div class='sub-desc'><p>The <code>InjectionMapping</code> the method is invoked on</p>\n</div></li></ul><h3 class='pa'>Throws</h3><ul><li><span class='pre'>Error</span><div class='sub-desc'><p>Has to be invoked with the unique key object returned by an earlier call to <code>seal</code></p>\n</div></li><li><span class='pre'>Error</span><div class='sub-desc'><p>Can't unseal a mapping that's not sealed\n@see <a href=\"#!/api/sync.InjectionMapping-method-seal\" rel=\"sync.InjectionMapping-method-seal\" class=\"docClass\">seal</a>()</p>\n</div></li></ul></div></div></div></div></div></div></div>","override":null,"extends":null,"html_meta":{},"uses":[],"alternateClassNames":[],"members":{"method":[{"tagname":"method","meta":{},"owner":"sync.InjectionMapping","name":"constructor","id":"method-constructor"},{"tagname":"method","meta":{"private":true},"owner":"sync.InjectionMapping","name":"_throwSealedException","id":"method-_throwSealedException"},{"tagname":"method","meta":{},"owner":"sync.InjectionMapping","name":"asSingleton","id":"method-asSingleton"},{"tagname":"method","meta":{},"owner":"sync.InjectionMapping","name":"isSealed","id":"method-isSealed"},{"tagname":"method","meta":{},"owner":"sync.InjectionMapping","name":"resolveInjection","id":"method-resolveInjection"},{"tagname":"method","meta":{},"owner":"sync.InjectionMapping","name":"seal","id":"method-seal"},{"tagname":"method","meta":{},"owner":"sync.InjectionMapping","name":"toProvider","id":"method-toProvider"},{"tagname":"method","meta":{},"owner":"sync.InjectionMapping","name":"toType","id":"method-toType"},{"tagname":"method","meta":{},"owner":"sync.InjectionMapping","name":"toValue","id":"method-toValue"},{"tagname":"method","meta":{},"owner":"sync.InjectionMapping","name":"unseal","id":"method-unseal"}],"cfg":[],"property":[{"tagname":"property","meta":{},"owner":"sync.InjectionMapping","name":"injectionName","id":"property-injectionName"}],"css_var":[],"event":[],"css_mixin":[]},"subclasses":[],"superclasses":[],"singleton":false,"tagname":"class","statics":{"method":[],"cfg":[],"property":[],"css_var":[],"event":[],"css_mixin":[]},"requires":[],"mixins":[],"private":null,"component":false,"meta":{},"name":"sync.InjectionMapping","linenr":25,"files":[{"href":"medic-injector.sync.html#sync-InjectionMapping","filename":"medic-injector.sync.js"}],"inheritdoc":null,"enum":null,"id":"class-sync.InjectionMapping","mixedInto":[],"aliases":{}});