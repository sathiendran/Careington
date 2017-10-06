/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../kendo.all.min.js" />



; (function (snap, $, global) {
    "use strict";
    var isString = function (obj) {
        return $.type(obj) === 'string';
    };
    var moduleCollection = {}, singleModuleCollection = {};
    var extend = function (child, parent) {
        if ($.isFunction(parent)) {
            var _childProto = child.prototype;
            child.prototype = new parent();
            $.extend(child.prototype, _childProto);
            child.prototype.constructor = parent;
            return child;
        } else {
            var objCons = new child();
            $.extend(objCons, parent);
            return objCons;
        }
    },
    setextendObject = function (object) {
        this.baseObject = object;
        return this;
    },
    define = function (name, ctor) {
        var namespace = this.namespaceInfo || "snap";
        var moduleName = [namespace, name].join(".");


        if (moduleCollection[moduleName]) {
            return;
        }
        if (this.baseObject) {
            ctor = extend(ctor, this.baseObject);
        }


        this.ctor = ctor;
        this.name = name;
        moduleName = moduleName.toLowerCase();
        this.moduleName = moduleName;
        var lastNameSpace = global;
        $.each(namespace.split("."), function (index, value) {
            var oldName = lastNameSpace[value];
            if (!oldName) {
                lastNameSpace[value] = {};
            }
            lastNameSpace = lastNameSpace[value];
        });


        var that = this;
        lastNameSpace[this.name] = function () {
            return that.getConstructor.apply(that, arguments);
        };

        moduleCollection[moduleName] = this;
        return this;

    },
    proxy = function (ctor, injectedObject, giveMeCons) {
        var actualArgs = Array.prototype.slice.call(arguments);
        var extraArgs = actualArgs.slice(3, arguments.length);
        var args = [];
        $.each(injectedObject, function (index, value) {
            var resolvedObject = snap.resolveObject(value.toLowerCase());
            if (resolvedObject == null) {
                console.error(value + " not found.");
            }
            args.push(snap.resolveObject(value.toLowerCase()));
        });
        var len;
        if (extraArgs.length > 0) {

            len = extraArgs.length > this.optionalParm.length ? extraArgs.length : this.optionalParm.length;
            for (var i = 0; i <= len; i++) {
                var optArg = this.optionalParm[i];
                var ext = extraArgs[i];
                if (optArg && ext && $.isPlainObject(optArg) && $.isPlainObject(ext)) {
                    $.extend(optArg, ext);
                } else if (ext) {
                    optArg = ext;
                }
                args.push(optArg);
            }

        } else {
            len = this.optionalParm.length;
            if (len > 0) {
                for (var j = 0; j <= len; j++) {
                    var optArgj = this.optionalParm[j];
                    args.push(optArgj);
                }

            }
        }
        var innerCtor = (function (args) {
            return function () {
                var snapProxy = function () {
                    // Empty is intentional
                }, _tempProxyObj, _tempReturnObject; // other vars
                snapProxy.prototype = ctor.prototype;
                _tempProxyObj = new snapProxy();

                _tempReturnObject = ctor.apply(_tempProxyObj, args);
                return Object(_tempReturnObject) === _tempReturnObject ? _tempReturnObject : _tempProxyObj;

            };
        }(args));

        if (this._singleton) {

            if (!singleModuleCollection[this.moduleName]) {
                singleModuleCollection[this.moduleName] = new innerCtor();
            }
            return singleModuleCollection[this.moduleName];
        } else {
            if (!giveMeCons) {
                return new innerCtor();
            }
            return innerCtor();
        }
    },
    //Core Engine 
    snapModule = function (injectedModule) {

        this.injectedModule = injectedModule || [];
        this.baseObject = null;
        this.activate = function () {

            var args = [this.ctor, this.injectedModule, false];
            var actualArgs = Array.prototype.slice.call(arguments);
            if (actualArgs.length > 0) {
                $.each(actualArgs, function () {
                    args.push(this);
                });
            }
            return proxy.apply(this, args);
        };
        this.getConstructor = function () {
            var args = [this.ctor, this.injectedModule, true];
            var actualArgs = Array.prototype.slice.call(arguments);
            if (actualArgs.length > 0) {
                $.each(actualArgs, function () {
                    args.push(this);
                });
            }
            return proxy.apply(this, args);
        };
        this.extend = setextendObject;
        this.define = define;
        this.namespaceInfo = "";
        this.namespace = function (namespace) {
            this.namespaceInfo = namespace;
            return this;
        };
        this.using = function (injectedModule) {
            injectedModule = injectedModule || [];

            if ($.isFunction(injectedModule)) {
                injectedModule = injectedModule();
            }
            if (isString(injectedModule)) {
                injectedModule = [injectedModule];
            }
            if (!$.isArray(injectedModule)) {
                throw "modules must be string/array/function (for function its must return either string or array of string )";
            }
            this.injectedModule = injectedModule;

            return this;
        };
        this.use = this.using;
        this.optionalParm = [];
        this.withDefaultParam = function () {
            this.optionalParm = Array.prototype.slice.call(arguments);
            return this;
        };
        this._singleton = false;
        this.singleton = function () {
            this._singleton = true;
            return this;
        };
    };


    //Core Cache function 
    snap.createCacheObject = function (requestFunction) {
        var cache = {};
        return function (key, callback) {
            if (!cache[key]) {
                cache[key] = $.Deferred(function (defer) {
                    requestFunction(defer, key);
                }).promise();
            }
            return cache[key].done(callback);
        };
    };
    snap.loadCacheScript = snap.createCacheObject(function (defer, url) {
        $.getScript(url).then(defer.resolve, defer.reject);
    });



    $.extend(snap, {
        namespace: function (namespace) {
            var obj = new snapModule([]);
            obj.namespace(namespace);
            return obj;

        },
        using: function (modules) {

            modules = modules || [];
            if ($.isFunction(modules)) {
                modules = modules();
            }
            if (isString(modules)) {
                modules = [modules];
            }
            if (!$.isArray(modules)) {
                throw "modules must be string/array/function (for function its must return either string or array of string )";
            }
            return new snapModule(modules);

        },
        use: function (modules) {

            modules = modules || [];
            if ($.isFunction(modules)) {
                modules = modules();
            }
            if (isString(modules)) {
                modules = [modules];
            }
            if (!$.isArray(modules)) {
                throw "modules must be string/array/function (for function its must return either string or array of string )";
            }
            return new snapModule(modules);

        },
        inherit: function (baseClass) {
            var internalConstructor = new snapModule([]);
            return internalConstructor.extend(baseClass);
        },
        define: function (name, ctor) {
            name = name || "";
            var internalConstructor = new snapModule([]);
            return internalConstructor.define(name, ctor);
        },
        resolveObject: function (name) {
            var actulaName = name;
            if (name.indexOf('.') < 0) {
                name = ["snap", name].join(".");
            }

            name = name.toLowerCase();
            var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);

            var module = moduleCollection[name];
            if (module) {
                return module.activate.apply(module, args);
            }
            var isFound = false;
            var obj = window;
            var splitName = actulaName.split(".");
            $.each(splitName, function (index, _name) {
                if (obj[_name]) {
                    obj = obj[_name];
                    isFound = true;
                } else {
                    isFound = false;
                }
            });
            if (isFound) {
                return obj;
            }
            return null;
        },
        extend: function (baseClass) {
            var internalConstructor = new snapModule([]);
            return internalConstructor.extend(baseClass);
        }
    });

    snap.define("EventAggregator", function () {
        var subscriberCollection = {};
        this.subscribe = function (eventName, callBack, handlerId) {
            callBack = callBack || $.noop;
            if (typeof subscriberCollection[eventName] === "undefined") {
                subscriberCollection[eventName] = [];
            }
            subscriberCollection[eventName].push({
                callBack: callBack,
                handlerId: handlerId
            });
        };
        // Just to make sure the code is not broken
        this.subscriber = this.subscribe;

        this.updateSubscription = function (eventName, callBack) {
            callBack = callBack || $.noop;
            subscriberCollection[eventName] = [{ callBack: callBack }];
        };

        this.hasSubscriptions = function (eventName) {
            return typeof subscriberCollection[eventName] === "undefined" ? false : !!subscriberCollection[eventName].length;
        };

        this.publish = function () {
            var eventName = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            if (typeof subscriberCollection[eventName] !== "undefined") {
                var eventList = subscriberCollection[eventName];
                if ($.isArray(eventList)) {
                    $.each(eventList, function () {
                        this.callBack.apply(this, args);
                    });
                }
            }
        };
        this.published = this.publish;

        this.unSubscribe = function (eventName) {
            delete subscriberCollection[eventName];
        }
        this.unSubscribeByHandlerId = function (eventName, handlerId) {
            if (typeof subscriberCollection[eventName] !== "undefined") {
                subscriberCollection[eventName] = subscriberCollection[eventName].filter(function (handlerObj) {
                    return handlerObj.handlerId !== handlerId;
                });
            }
        }
    }).singleton();


    snap.eventAggregator = new snap.EventAggregator();

    var executeViewModel = function () {
        var viewModel;
        if ($.isFunction(this.viewModel)) {
            this.viewModel();
        }
        viewModel = snap.resolveObject(this.viewModel);
        this.callBack.resolve(this.container, viewModel);
    };


    snap.define('Application', function () {
        var viewModelCollection = [];
        var pendingViewMode = 0;
        this.run = function () {
            var $def = $.Deferred();
            $.each(viewModelCollection, function () {
                if (!this.IsExecute) {
                    this.IsExecute = true;
                    var that = this;
                    if (this.templateUrl) {
                        $(this.container).load(this.templateUrl, function () {
                            pendingViewMode--;
                            executeViewModel.apply(that);
                            if (pendingViewMode == 0) {
                                $def.resolve();
                            }
                        });
                    } else {
                        executeViewModel.apply(that);
                    }

                }
            });
            return $def.promise();


        };
        this.registerView = function (config) {
            var $def = $.Deferred();
            var
            container = config.container || "",
            templateUrl = config.templateUrl || "",
            viewModel = config.viewModel || "";
            viewModelCollection.push({
                container: container,
                viewModel: viewModel,
                templateUrl: templateUrl,
                callBack: $def

            });
            pendingViewMode++;
            return $def.promise();

        };

    }).singleton();


}(window.snap = window.snap || {}, jQuery, window));

