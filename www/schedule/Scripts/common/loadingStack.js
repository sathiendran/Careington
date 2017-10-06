(function ($, snap) {
"use strict";

 snap.namespace("snap.common").define("loadingStack", function () {
        function Stack(onPush, onPop) {
            var waitStack = [],
                pushCallback = onPush, 
                popCallback = onPop;

            function callIfStackIsEmpty(callback) {
                if (waitStack.length === 0 && callback && typeof (callback.call) !== "undefined") {
                    callback.call();
                }
            }

            this.init = function (onPush, onPop) {
                pushCallback = onPush;
                popCallback = onPop;
            };

            this.push = function () {
                callIfStackIsEmpty(pushCallback);
                waitStack.push({});
            };

            this.pop = function () {
                if (waitStack.length === 0) {
                    return;
                }
                waitStack.pop();
                callIfStackIsEmpty(popCallback);
            };    
        }

        this.newStack = function(onPush, onPop) {
            return new Stack(onPush, onPop);
        };
    }).singleton();
}(jQuery, window.snap = window.snap || {}));