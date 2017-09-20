/// <reference path="../jquery-2.1.3.intellisense.js" />
/// <reference path="../kendo.all.min.js" />
/// <reference path="snap.core.js" />

;(function ($, snap) {


    snap.define("SnapNotification", function () {

        var onSnapNotification = function (e) {
            e.element.parent().css({
                zIndex: 20004
            });
        }

        var snapErrorNonHideNotification = (function () {
            var errorGlobal = $("<span>").kendoNotification({
                pinned: true,
                position: {
                    top: 30,
                    right: 30
                },
                autoHideAfter: 0,
                templates: [
                {
                    type: "error",
                    template: "<div class='snapError' style='width:73%' ><span class='icon_warning'></span><h3>Error:</h3><p> #= content # </p></div>"
                }

                ],
                show: onSnapNotification
            }
                  ).data("kendoNotification");

            return function (msg, type) {
                errorGlobal.show(msg, type);
            };
        })();

        var confirmationGlobal = $("<span>").kendoNotification({
            pinned: true,
            position: {
                top: 30,
                right: 30
            },
            stacking: "down",
            autoHideAfter: 100000,
            hideOnClick: false,
            button: true,
          
            templates: [{
                type: "confirmation",
                template: "<div class='snapInfo'><span class='icon_new'></span><h3>Confirmation:</h3><p> #= content # </p></div>" +
                    "<div><span id='btnConfirmNo'  class='confirm-btnNo' style='float:right'>No</span>" +
                    "<span id='btnConfirmYes'  class='confirm-btnYes' style='float:left'>Yes</span></div>"
            }],
            show: onSnapNotification,
        }).data("kendoNotification");

        var confirmationThreeBtnGlobal = $("<span>").kendoNotification({
            pinned: true,
            position: {
                top: 30,
                right: 30
            },
            stacking: "down",
            autoHideAfter: 100000,
            hideOnClick: false,
            button: true,

            templates: [{
                type: "confirmation",
                template: "<div class='snapInfo'><span class='icon_new'></span><h3>Confirmation:</h3><p> #= content # </p></div>" +
                    "<div><span id='btnCancel'  class='snapInfo__btn snapInfo__btn--cancel' style='float:left'>Cancel</span>" +
                    "<span id='btnOptionOne'  class='snapInfo__btn snapInfo__btn--option' style='float:left'>Option 1</span>" +
                    "<span id='btnOptionTwo'  class='snapInfo__btn snapInfo__btn--option' style='float:left'>Option 2</span></div>"
            }],
            show: onSnapNotification,
        }).data("kendoNotification");

        var showSnapNotification = (function () {
            //var notification = $("<span>").kendoNotification({
            var notificationGlobal = $("<span>").kendoNotification({
                pinned: true,
                //        height: "100px",
                position: {
                    top: 30,
                    right: 30
                },
                stacking: "down",
                autoHideAfter: 10000,
                show: onSnapNotification,
                templates: [{
                    type: "info",
                    template: "<div class='snapInfo' style='width:71%'><span class='icon_warning'></span><p> #: content # </p></div>"
                },
                    {
                        type: "announcement",
                        template: "<div class='snapAnnouncement'><span class='icon_new'></span><p> #: content # </p></div>"
                    },
                    {
                        type: "email",
                        template: "<div class='snapEmail'><span class='icon_mail'></span><h3>Email:</h3><p> #: content # </p></div>"
                    },
                    {
                        type: "success",
                        template: "<div class='snapSuccess' style='width:71%'><span class='icon_checkmark'></span><h3>Success:</h3><p> #: content # </p></div>"
                    },
                    {
                    type: "success Html",
                        template: "<div class='snapSuccess' style='width:71%'><span class='icon_checkmark'></span><h3>Success:</h3><p> #= content # </p></div>"
                    }
                ]
            }).data("kendoNotification");

            return function (msg, type) {
                notificationGlobal.show(msg, type);
            };
        })();
	
        var notificationWithCheckBox = $("<span>").kendoNotification({
            pinned: true,
            position: {
                top: 30,
                right: 30
            },
            stacking: "down",
            autoHideAfter: 100000,
            hideOnClick: false,
            button: true,
            show: onSnapNotification,
            templates: [{
                type: "confirmation",
                template: "<div class='snapInfo'><span class='icon_new'></span><h3>Notification:</h3><p> #= content # </p></div>" +
                    "<div class='snapInfo-checkbox'><input type='checkbox'></input> <span>Do not show this again</span></div>" +
                    "<div><span id='btnConfirmYes'  class='confirm-btnYes'>Ok</span></div>"
            }]
        }).data("kendoNotification");


        var that = this;


        this.info = function (message) {
            showSnapNotification(message, "info");
            $(".snapInfo .icon_circle-with-cross").remove();
            $(".snapInfo").prepend("<span class='icon_circle-with-cross></span>");
          
        };
        this.announcement = function (message) {
            showSnapNotification(message, "announcement");
        };
        this.email = function (message) {
            showSnapNotification(message, "email");
        };
        this.error = function (message) {
            snapErrorNonHideNotification(message, "error");
            $(".snapError .icon_circle-with-cross").remove();
            $(".snapError").prepend("<span class='icon_circle-with-cross'></span>");
        };
        this.success = function (message) {
            showSnapNotification(message, "success");
            $(".snapSuccess .icon_circle-with-cross").remove();
            $(".snapSuccess").prepend("<span class='icon_circle-with-cross' ></span>");
        };

        this.successHtml = function (message) {
            showSnapNotification(message, "success Html");
            $(".snapSuccess .icon_circle-with-cross").remove();
            $(".snapSuccess").prepend("<span class='icon_circle-with-cross' ></span>");
        };
       
        that["confirmationWithCallbacks"] = function(msg, yesCallback, noCallback, yesText, noText) {
            confirmationGlobal.show(msg, "confirmation");

            var $yesBth = $(".k-notification-confirmation .confirm-btnYes"),
                $noBth = $(".k-notification-confirmation .confirm-btnNo");

            $yesBth.on("click", function () {
                if (yesCallback) {
                    yesCallback();
                }

                confirmationGlobal.hide();
            });

            $noBth.on("click", function () {
                if (noCallback) {
                    noCallback();
                }

                confirmationGlobal.hide();
            });

            $yesBth.text(yesText ? yesText : "Yes");
            $noBth.text(noText ? noText : "No");
        }

        that["confirmationWithThreeBtns"] = function (msg, optionOneCallback, optionTwoCallback, optionOneText, optionTwoText) {
            confirmationThreeBtnGlobal.show(msg, "confirmation");

            var $optionOneText = $(".k-notification-confirmation #btnOptionOne"),
                $optionTwoText = $(".k-notification-confirmation #btnOptionTwo");

            $optionOneText.on("click", function () {
                if (optionOneCallback) {
                    optionOneCallback();
                }

                confirmationThreeBtnGlobal.hide();
            });

            $optionTwoText.on("click", function () {
                if (optionTwoCallback) {
                    optionTwoCallback();
                }

                confirmationThreeBtnGlobal.hide();
            });

            $('.k-notification-confirmation #btnCancel').on("click", function () {
                confirmationThreeBtnGlobal.hide();
            });

            $optionOneText.text(optionOneText ? optionOneText : "Option 1");
            $optionTwoText.text(optionTwoText ? optionTwoText : "Option 2");
        }

        that["notificationWithCheckBox"] = function (msg, okCallback) {
            notificationWithCheckBox.show(msg, "confirmation");

            $(".k-notification-confirmation .confirm-btnYes").on("click", function (event) {
                if (okCallback) {
                    var isCheckboxChecked = $(".k-notification-confirmation input[type='checkbox']").is(':checked');
                    okCallback(isCheckboxChecked);
                }

                notificationWithCheckBox.hide();
            });
        }

        that["hideAllConfirmations"] = function() {
            var elements = confirmationGlobal.getNotifications();

            elements.each(function(){
                $(this).parent().remove();
            });
        }

    }).singleton();

}(jQuery, window.snap = window.snap || {}));