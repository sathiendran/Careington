/// <reference path="../jquery-2.1.3.intellisense.js" />
/// <reference path="../kendo.all.min.js" />
/// <reference path="snap.core.js" />



; (function ($, snap) {

    snap.using(["snapNotification"]).define("SnapHttp", function ($notification) {
        var _handleError = function (response) {
            var errorMsg = "";
            var status = response.status;
            if (status == 404) {
                errorMsg = "Resource not found";
            }
            if (status == 500) {
                errorMsg = "Internal Server error";
            }
           // $notification.error(errorMsg);
           // this.reject(response);
        };

        this.post = function () {
            var $def = $.Deferred();
            $.post.apply($, arguments).then(function () {
                $def.resolve.apply($, arguments);
            }).fail(function () {
                _handleError.apply($def, arguments);
            });
            return $def.promise();
        };
        this.get = function () {
            var $def = $.Deferred();
            $.getJSON.apply($, arguments).then(function () {
                $def.resolve.apply($, arguments);
            }).fail(function () {
                _handleError.apply($def, arguments);
            });
            return $def.promise();
        };
        this.ajax = function () {
            var $def = $.Deferred();
            $.ajax.apply($, arguments).then(function () {
                $def.resolve.apply($, arguments);
            }).fail(function () {
                _handleError.apply($def, arguments);
            });
            return $def.promise();
        };

        this.makeRequest = function () {
            var $def = $.Deferred();
            $.ajax.apply($, arguments).then(function () {
                $def.resolve.apply($, arguments);
            }).fail(function () {
                _handleError.apply($def, arguments);
            });
            return $def.promise();
        };
    }).singleton();

}(jQuery, window.snap = window.snap || {}));
