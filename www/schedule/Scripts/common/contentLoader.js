//@ sourceURL=contentLoader.js

"use strict";
(function($, snap, kendo) {

    snap.namespace("snap.common").use([])
        .define("contentLoader", function() {
            

            this.bindViewModel = function(vm, containerId, path) {
                return snap.cachedGetHtml(path)
                    .then(function (content) {
                        var $container = $(containerId);
                        $container.html(content);
                        kendo.bind($container, vm);
                        return vm;
                    });
            };

            this.loadModule = function (module, containerId) {
                var _this = this;
                return snap.getCachedScript(module.vmPath)
                    .then(function() {
                        //get ViewModel instance.
                        var vm = snap.resolveObject(module.vmName);
                        return _this.bindViewModel(vm, containerId, module.contentPath);
                    });
            };
        }).singleton();
}(jQuery, snap, kendo));