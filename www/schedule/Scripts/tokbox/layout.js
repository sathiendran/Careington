/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../core/snap.core.js" />


; (function ($) {
    snap.namespace("snap.UI").use(["snap.shared.ConsultationMediaInfo"]).define("LayoutManager", function ($mediaInfoBox) {
        var el = null;
        var $scope = this;
        this.initElement = function (_el) {
            el = $(_el);

            $("#pluginPlaceholder").off("click").on("click", '.OT_root', function () {
                $(this).siblings().removeClass("OT_Full").end().addClass("OT_Full");
                $scope.refreshLayout(true);
                $mediaInfoBox.setCurrentClient(this.id);
            });

            
           
        };
        this.refreshLayout = function (switchCall) {
            switchCall = switchCall || true;
            setTimeout(function () {
                var elInfo = el.find(".OT_root");
                if (!switchCall) {
                    elInfo.removeClass("OT_Full");
                }
                if ($(".OT_Full").length === 0) {
                    $(elInfo[0]).addClass("OT_Full");
                }
                var left = 10;
                $.each(elInfo, function () {
                    if ((elInfo).is(":visible")) {
                        $(this).css("left", 0);
                        if (!$(this).hasClass("OT_Full")) {
                            $(this).css("left", left);
                            left = left + 140;
                        }
                    }
                });
               
            }, 500);
        };
    });

}(jQuery));