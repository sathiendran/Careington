;
(function(global, $) {
    if (snap.hub && snap.hub.hubModel) {
        return;
    }
    snap.namespace("snap.hub")
        .define("hubModel", function() {
            var scope = this,
                eventList = {},
                $hub = null;

            this.triggerEvent = function(name) {
                var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
                var eventCbList = eventList[name];
                if (eventCbList) {
                    $.each(eventCbList, function() {
                        return this.apply(scope, args);
                    });
                }
            };
            this.off = function (eventName) {
                eventList[eventName] = [];
                return this;
            };
            this.on = function(eventName, cb) {
                var eventCbList = eventList[eventName];
                if (!eventCbList) {
                    eventCbList = [];
                }
                eventCbList.push(cb);
                eventList[eventName] = eventCbList;
                return this;
            };
            
            this.invoke = function (eventName) {
                if ($hub && $hub.invoke) {
                    return $hub.invoke.apply($hub, arguments);
                } else {
                    return $.Deferred().reject();
                }
            };
            
            this._initModel = function(hub, scope) {
                $hub = hub;
                $.extend(scope, this);
            };
        });
})(window, jQuery);
