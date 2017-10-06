/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../kendo.all.min.js" />
/// <reference path="snap.core.js" />



; (function ($, snap) {
   

    /*
      .k-loading-mask {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }
    */
    snap.define("SnapLoader", function () {
        var el = $(".k-loading-mask");
        this.showLoader = function () {
            if (el.length === 0) {
                el = $("<div class='k-loading-mask'><span class='k-loading-text'>Loading...</span><div class='k-loading-image'/><div class='k-loading-color'/></div>");
                $("body").append(el);
            } else {
                el.show();
            }
        };
        this.hideLoader = function () {
            $(".k-loading-mask").hide();
        };
    }).singleton();

}(jQuery, window.snap = window.snap || {}));