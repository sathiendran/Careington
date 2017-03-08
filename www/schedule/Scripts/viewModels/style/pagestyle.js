/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../kendo.all.min.js" />

/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/loadingcoremodule.js" />

; (function ($) {


    snap.namespace("snap.utility").define("PageStyle", function () {
        this.applyStyle = function () {
            var $def = $.Deferred();
            var path = snap.string.formatURIComponents("/less/styles.less.dynamic?brandColor={0}&svp=snapversion", snap.hospitalSession.brandColor);
            try {
                var dynamicCss = jQuery("<link>").prop({
                    type: 'text/css',
                    rel: 'stylesheet',
                    href: path,
                    media: 'screen',
                    title: 'dynamicLoadedSheet'
                }).on("load", function () {

                    $def.resolve(true);
                });
                document.head.appendChild(dynamicCss[0]);
            }
            catch (err) {
                $("head").append($("<link rel='stylesheet' href='" + path + "' type='text/css' media='screen' />"));

                $def.resolve(true);
            }
            return $def.promise();
        };
        this.applyAdminStyle = function () {
            var path = snap.string.formatURIComponents("/less/admin.less.dynamic?brandColor={0}&svp=snapversion", snap.hospitalSession.brandColor);
            try {
                var dynamicCss = jQuery("<link>").prop({
                    type: 'text/css',
                    rel: 'stylesheet',
                    href: path,
                    media: 'screen',
                    title: 'dynamicLoadedSheet'
                }).on("load", function () {


                });
                document.head.appendChild(dynamicCss[0]);
            }
            catch (err) {
                $("head").append($("<link rel='stylesheet' href='" + path + "' type='text/css' media='screen' />"));


            }

        };
        this.applyStyleV3 = function () {
            var $def = $.Deferred();
            var path = snap.string.formatURIComponents("/less/v3/styles.v3.less.dynamic?brandColor={0}&svp=snapversion", snap.hospitalSession.brandColor);
            try {
              var dynamicCss = jQuery("<link>").prop({
                    type: 'text/css',
                    rel: 'stylesheet',
                    async: false,
                    href: path,
                    media: 'screen',
                    title: 'dynamicLoadedSheet'
                }).on("load", function () {
                    $def.resolve(true);
                });
                document.head.appendChild(dynamicCss[0]);
            }
            catch (err) {
                $("head").append($("<link rel='stylesheet' href='" + path + "' type='text/css' media='screen' />"));
                $def.resolve(true);

            }
            return $def.promise();
        };

    }).singleton();
    


}(jQuery));









