/// <reference path="../jquery-2.1.3.js" />
/// <reference path="snap.core.js" />
/// <reference path="../kendo.all.min.intellisense.js" />


; (function (snap, $) {

    //this can not create from DI
    snap.define("SPAManager", function () {
        var views = [];
        this.parse = function () {
            
            $("div[data-snapui='view']").each(function () {
                var el = $(this);
                var controller = el.attr("data-controller");
                var model = el.attr("data-model");
                var url = el.attr("data-viewurl");
                views.push({
                    el: el,
                    model: model,
                    viewurl: url,
                    controller: controller
                });
            });
        };
        this.run = function () {
            var deferred = $.Deferred();
          
            $.each(views, function (ind, _el) {
                (function (el, url, controller, model) {
                    if (el) {
                        el.load(url, function () {
                            var tmpNameCache;
                            if (controller) {
                                tmpNameCache = controller;
                                controller = snap.resolveObject(controller);
                                if (controller['init']) {
                                    controller.init(el);
                                    deferred.notify(tmpNameCache,controller);
                                }
                            } else {
                                if (model) {
                                    tmpNameCache = model;
                                    model = snap.resolveObject(model);
                                    kendo.bind(el, model);
                                    deferred.notify(tmpNameCache,model);
                                }
                            }
                        });
                    }
                }(_el.el, _el.viewurl, _el.controller, _el.model));
            });

            return deferred.promise();
        };

    });
}(window.snap, jQuery));