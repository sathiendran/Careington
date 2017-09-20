;
(function(global, $) {
    if (snap.hub && snap.hub.hubModel) {
        return;
    }
    snap.namespace("snap.hub")
        .define("hubModel", function() {
            var scope = this,
                eventList = {},
                $hub = null,
                hubNotEstablishedStates = [
                    $.signalR.connectionState.disconnected,
                    $.signalR.connectionState.connecting,
                    $.signalR.connectionState.reconnecting
                ];

            this._isStarted = false,
            this._isInitialized = false;

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

            this._invokeServerFunction = function (eventName) {
                if (!($hub && $hub.server && $hub.server[eventName])) {
                    return $.Deferred().reject();
                }
                try {
                    var args = Array.prototype.slice.call(arguments).slice(1, arguments.length);
                    return $hub.server[eventName].apply($hub, args);
                } catch (error) {
                    var errorMessage = "SignalR: Failed to invoke " + this._name + " server function \"" + eventName + "\".";
                    errorMessage += "\nHub state: " + $.connection.hub.state;
                    if (hubNotEstablishedStates.indexOf($.connection.hub.state) !== -1) {
                        snapInfo("Connection to the system is not established yet. Please wait a moment to proceed");
                    }
                    window.console.error(errorMessage);
                    window.console.log(error);
                    return $.Deferred().reject();
                }
            };
            
            this._initModel = function(hub, scope) {
                $hub = hub;
                $.extend(scope, this);
                this._name = scope._name || "hub";
            };


            this.init = function(opt) {
                if (this._initConnection) {
                    this._initConnection(opt);
                }

                if (this._isInitialized) {
                    window.console.log(this._name + " was initialized before");
                    return;
                }
                this._isInitialized = true;

                if (this._initClient) {
                    this._initClient();
                }

                this.on("start", function() {
                    this._isStarted = true;
                    window.console.log(this._name + " started");
                });

                if (this._initDetails) {
                    this._initDetails();
                }
            };

            this.isHubStarted = function() {
                return this._isStarted;
            };

            this.isHubInitialized = function() {
                return this._isInitialized;
            };

            this.markAsStarted = function(value) {
                this._isStarted = !!value;
            };
        });
})(window, jQuery);
