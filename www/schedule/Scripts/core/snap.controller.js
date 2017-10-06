/* global kendo */
/* global  jQuery*/
/* global snap */
/// <reference path="../lib/jquery2.1.4.js" />
/// <reference path="../core/snap.core.js" />


;
(function ($, snap) {



    snap.getScript = snap.getScript || function (url, options) {
        options = options || {};
        var cache = true;
        if (options.cache) {
            cache = options.cache;
        }
        if ((cache) && (url.indexOf("svp=snapversion") < 0)) {
            if (url.indexOf("?") >= 0) {
                url = url + "&svp=snapversion";
            } else {
                url = url + "?svp=snapversion";
            }
        }
        options = $.extend(options, {
            dataType: "script",
            cache: cache,
            url: url
        });
        return jQuery.ajax(options);
    }

    snap.define("RouterPromise", function () {
        var thenCallBack = $.noop();
        var backCallback = $.noop();
        var beforeLoadCallback = $.noop();
        this.then = function (callBack) {
            thenCallBack = callBack;
            return this;
        };
        this.back = function (callBack) {
            backCallback = callBack;
            return this;

        };
        this.beforeLoad = function (callBack) {
            beforeLoadCallback = callBack;
            return this;
        };
        this.onNavigateBack = function () {
            if (backCallback) {
                backCallback.apply(arguments);
            }
        };
        this.onNavigateTo = function () {
            var args = [];
            var actualArgs = Array.prototype.slice.call(arguments);
            if (actualArgs.length > 0) {
                $.each(actualArgs, function () {
                    args.push(this);
                });
            }
            if (thenCallBack) {

                thenCallBack.apply(this, args);
            }
        };
        this.onBeforeLoad = function () {
            if (beforeLoadCallback) {
                beforeLoadCallback.apply(arguments);
            }
        };
    });


    snap.createCache = function (requestFunction) {
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


    snap.cachedGetScript = snap.createCache(function (defer, url) {
        snap.getScript(url).then(defer.resolve, defer.reject);
    });

    snap.getCachedScript = snap.cachedGetScript;
    
    snap.cachedGetHtml = snap.createCache(function (defer, url) {
        if (url.indexOf("svp=snapversion") < 0) {
            if (url.indexOf("?") >= 0) {
                url = url + "&svp=snapversion";
            } else {
                url = url + "?svp=snapversion";
            }
        }
        $.get(url).then(defer.resolve, defer.reject);
    });

    snap.getCachedHtml = snap.cachedGetHtml;

    snap.getTemplateURlwVersion = function (urlin) {
        if (typeof urlin == 'undefined' || urlin === null || urlin === '')
            return "";
        if (urlin.indexOf("svp=snapversion") < 0) {
            if (urlin.indexOf("?") >= 0) {
                urlin = urlin + "&svp=snapversion";
            } else {
                urlin = urlin + "?svp=snapversion";
            }
        }
        return urlin;
    }

    snap.define("Controller", function (config) {
        var currentAction;
        var $scope = this;
        $.extend(this, config);
        if (!this.routerConfig) {
            this.routerConfig = {

            };
        }
        if (!this.layout) {
            this.layout = {
                url: "",
                container: "",
                header: {
                    templateUrl: "",
                    name: "",
                    viewModel: {
                        vm: "",
                        url: ""
                    }
                }
            };
        }


        var views = {

        };
        var viewModels = {

        };
        var routerCollection = {

        };
        var layout = null;
        var router = new kendo.Router(this.routerconfig);
        $.extend(this.routerconfig, {
            routeMissing: function () {
                router.navigate('/');
            }
        });

      

        //OnEvent

        var eventCollection = {

        };


        this.on = function (eventName, callBack) {
            eventCollection[eventName] = callBack;
        }

        //addRoute

        this.addAction = function (routerConfig) {
            if (!routerConfig) {
                console.error("You must have valid config setting for routing");
                return;
            }
            if (!routerConfig['routeUrl']) {
                console.error("You must have routeUrl");
                return;
            }
            if (!routerConfig['name']) {
                routerConfig['name'] = routerConfig['routeUrl'];
            }
            var routerCallBack = new snap.RouterPromise();
            routerConfig['promise'] = routerCallBack;
            routerCollection[routerConfig['name']] = routerConfig;
            return routerCallBack;

        };
        var getCacheViewModel = function (_routerConfig) {
            var $def = $.Deferred();
            var cacheVM = viewModels[_routerConfig.name];
            if (!cacheVM) {
                var viewModel = _routerConfig.viewModel;
                if (viewModel) {
                    var viewModelObj = viewModel.vm;
                    if (viewModelObj) {
                        viewModelObj = snap.resolveObject(viewModelObj);
                        if (!viewModelObj) {
                            var scriptUrl = viewModel.url;
                            if (scriptUrl) {
                                snap.cachedGetScript(scriptUrl).always(function () {
                                    viewModelObj = viewModel.vm;
                                    if (viewModelObj) {
                                        viewModelObj = snap.resolveObject(viewModelObj);
                                        viewModels[_routerConfig.name] = viewModelObj;
                                    }
                                    setTimeout(function () {
                                        $def.resolve.apply($, [viewModelObj]);
                                    }, 5);

                                });
                            }
                        } else {
                            setTimeout(function () {
                                $def.resolve.apply($, [viewModelObj]);
                            }, 5);
                        }
                    } else {
                        setTimeout(function () {
                            $def.resolve.apply($, [null]);
                        }, 5);
                    }

                } else {
                    setTimeout(function () {
                        $def.resolve.apply($, [null]);
                    }, 5);
                }

            } else {
                setTimeout(function () {
                    $def.resolve.apply($, [cacheVM]);
                }, 5);
            }
            return $def.promise();

        };
        var getCacheHtmlView = function (_routerConfig, _vm) {
            var $def = $.Deferred();
            var viewUrl = _routerConfig.templateUrl;
            if (viewUrl) {
                var tmpView = views[_routerConfig.name];
                if (!tmpView) {
                    snap.cachedGetHtml(viewUrl).done(function (data) {
                        if (_vm) {
                            tmpView = new kendo.View(data, { model: _vm, wrap: false });
                        } else {
                            tmpView = new kendo.View(data, { wrap: false });
                        }
                        if (tmpView) {
                            views[_routerConfig.name] = tmpView;
                        }
                        $def.resolve.apply($, [tmpView]);
                    });
                } else {
                    $def.resolve.apply($, [tmpView]);
                }
            } else {
                tmpView = new kendo.View('<div></div>', { wrap: false });
                $def.resolve.apply($, [tmpView]);
            }
            return $def.promise();
        }

        var initRouter = function () {

            $.each(routerCollection, function (name, routerConfig) {
                if (routerConfig) {
                    (function (_routerConfig) {
                        router.route(_routerConfig.routeUrl, function (params) {
                            var _args = arguments;
                            var require = _routerConfig.require;
                            var promise = _routerConfig.promise;
                            
                            promise.onBeforeLoad(_args);
                            
                            var promiseArrary = [];
                            if ($.isArray(require)) {
                                $.each(require, function (inde, url) {
                                    if (url) {
                                        promiseArrary.push(snap.cachedGetScript(url));
                                    }
                                });
                            }

                            $.when.apply(this, promiseArrary).always(function () {
                                var scriptProm = getCacheViewModel(_routerConfig);
                                scriptProm.then(function (_vm) {
                                    getCacheHtmlView(_routerConfig, _vm).always(function (_view) {
                                        kendo.ui.Scheduler.fn.options.footer = {}; //set kendo scheduler footer default bug fix

                                        
                                        if (promise) {
                                            if (layout) {
                                                var region = "#" + _routerConfig.region;
                                                layout.showIn(region, _view);
                                            }
                                            var hash = window.location.hash.substring(1);
                                            var oldAction = currentAction || {
                                                name: _routerConfig.name,
                                                url: hash
                                            }
                                            currentAction = {
                                                name: _routerConfig.name,
                                                url: hash
                                            };
                                            var onBeforePageChange = eventCollection['onBeforePageChange'];
                                            if (onBeforePageChange) {
                                                onBeforePageChange.apply($scope, [oldAction, currentAction]);
                                            }
                                            promise.onNavigateTo(_args, {
                                                viewmodel: _vm,
                                                view: _view
                                            });
                                      
                                            var onPageChange = eventCollection['onPageChange'];
                                            if (onPageChange) {
                                                onPageChange.apply($scope, [oldAction, currentAction]);
                                            }
                                        }
                                    });


                                });
                            });

                        });
                    }(routerConfig));

                }
            });
        }
        this.getPageViewModel = function (actionName) {
            var cacheVM = viewModels[actionName];
            return cacheVM;
        };
        this.start = function () {

            var $def = $.Deferred();
            var layoutUrl = this.layout.url;
            var header = this.layout.header;
            if (header) {
                header.templateUrl = header.templateUrl || "";
                header.name = "";
                header.container = header.container || ".wrapper";
            }
            if (header && header.viewModel != null && header.viewModel.vm != null) {
                header.name = header.viewModel.vm;
            }
            var footer = this.layout.footer;
            if (footer) {
                footer.templateUrl = footer.templateUrl || "";
                footer.name = "";
            }
            if (footer && footer.viewModel != null && footer.viewModel.vm != null) {
                footer.name = footer.viewModel.vm;
            }

            var sideBar = this.layout.sideBar;
            if (sideBar) {
                sideBar.templateUrl = sideBar.templateUrl || "";
                sideBar.name = "";
                sideBar.container = sideBar.container || "#sidebarcontainer";
            }
            if (sideBar && sideBar.viewModel != null && sideBar.viewModel.vm != null) {
                sideBar.name = sideBar.viewModel.vm;
            }
            var require = this.layout.require;

            var promiseArrary = [];
            if ($.isArray(require)) {
                $.each(require, function (inde, url) {
                    if (url) {
                        promiseArrary.push(snap.cachedGetScript(url));
                    }
                });
            }
            var container = this.layout.container || "app";
            container = "#" + container;
            $.when.apply(this, promiseArrary).always(function () {
                if (layoutUrl) {
                    snap.cachedGetHtml(layoutUrl).done(function (layoutData) {

                        layout = new kendo.Layout(layoutData, {
                            wrap: false
                        });

                        layout.render($(container));
                        $(container).children().first().addClass("viewlayout");
                        if (header) {
                            var headerVM = getCacheViewModel(header);
                            var headerView = snap.cachedGetHtml(header.templateUrl);

                            $.when(headerView, headerVM).then(function (_headerView, _headerVM) {
                                var _el = $(_headerView[0]);

                                if (header.isAppend) {
                                    $(header.container).append(_el);
                                } else {
                                    $(header.container).prepend(_el);
                                }
                                kendo.bind(_el, _headerVM);


                                var onheaderready = eventCollection['onheaderready'];
                                if (onheaderready) {
                                    onheaderready(_headerVM);
                                }
                            });
                        }
                        if (footer) {
                            var footerVM = getCacheViewModel(footer);
                            var footerView = snap.cachedGetHtml(footer.templateUrl);
                            $.when(footerView, footerVM).then(function (_footerView, _footerVM) {
                                var footerEl = $(_footerView[0]);
                                $('body').append(footerEl);
                                kendo.bind(footerEl, _footerVM);
                                var onfooterready = eventCollection['onfooterready'];
                                if (onfooterready) {
                                    onfooterready(_footerVM);
                                }
                            });
                        }
                        if (sideBar) {
                            var sideBarVm = getCacheViewModel(sideBar);
                            var sideBarView = snap.cachedGetHtml(sideBar.templateUrl);

                            $.when(sideBarView, sideBarVm).then(function (_sideBarView, _sideBarVM) {
                                var sideBarEl = $(_sideBarView[0]);

                                if (sideBar.isAppend) {
                                    $(sideBar.container).append(sideBarEl);
                                } else {
                                    $(sideBar.container).prepend(sideBarEl);
                                }

                                kendo.bind(sideBarEl, _sideBarVM);
                                var onsidebarready = eventCollection['onsidebarready'];
                                if (onsidebarready) {
                                    onsidebarready(_sideBarVM);
                                }
                            });
                        }
                        initRouter();
                        router.start();
                    });
                } else {
                    initRouter();
                    router.start();
                }
            });
            return $def.promise();


        };

       
        this.navigate = function (url) {
            router.navigate(url);
        }

    }).withDefaultParam({
        viewContainer: "main"
    });

}(jQuery, snap));
