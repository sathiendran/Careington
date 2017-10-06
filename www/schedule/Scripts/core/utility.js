/// <reference path="../jquery-2.1.3.intellisense.js" />
/// <reference path="../kendo.all.min.js" />
/// <reference path="snap.core.js" />



; (function ($, snap) {
    snap.use("snapNotification").define("Helper", function ($snapNotification) {
       var $scope = this;
       this.UnBlockContainer = function () {
           $(function () {
               setTimeout(function () {
                   $("#divMainWrap").removeClass("blockSnapUI");
                   $("#divFooterWrap").removeClass("blockSnapUI");
                   $("#divLoading").addClass("blockSnapUI");
               }, 0);
           });
          
        };

       this.replaceUndefinedFromJSON = function (obj, replaceWith) {
           var replaceString = replaceWith || snap.shortNoneReportedMessage;
           if (obj) {
               for (var i in obj) {
                   if (!obj[i]) {
                       obj[i] = replaceString;
                   }
                   if (obj[i] && typeof (obj[i]) == "object") {
                       $scope.replaceUndefinedFromJSON(obj[i]);
                   }
               }
           }
       };
       this.checkTokboxBrowserRequirement = function () {
      
           var envName = get_browser();
           var isPluginRequired = (envName === 'Chrome' || envName === "Firefox" || OTPlugin.isInstalled());
           if (!isPluginRequired) {
               OT.upgradeSystemRequirements();
           }

           if (envName === "Chrome" || envName === "Firefox") {
               var chromeExtensionId = "padchhoieclaaocgjbfepahaakajgllb";
               OT.registerScreenSharingExtension('chrome', chromeExtensionId);
               OT.checkScreenSharingCapability(function (response) {
                   if (!response.supported || response.extensionRegistered === false) {
                       snapInfo("This browser does not support screen sharing.")
                   }


                   //resp={"supported":true,"supportedSources":{"screen":true,"application":true,"window":true,"browser":true}}
                   if ((envName === "Chrome") && (response.extensionInstalled === false)) {
                        $snapNotification.confirmationWithCallbacks("Screen sharing extension not installed. Press Yes to install extension", function() {
                          window.open('https://chrome.google.com/webstore/detail/' + chromeExtensionId);
                        });
                   }
                   else if ((envName === "WaitTokboxFirefox") && (response.extensionInstalled === false )) {
                       //If older version of the screen-sharing extension for Firefox check the extensionInstalled property if the extensionRequired property is set to true:
                       $snapNotification.confirmationWithCallbacks("Screen sharing extension not installed. Press Yes to install extension", function() {
                          window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                        });

                   }
               });
           }
           
       };
       this.showBrowserWarningMessage = function () {
           var snapNotification = snap.resolveObject("snap.SnapNotification");
           snapNotification.info("Warning: This browser is not fully supported. You may experience unexpected behavior. If you need further assistance please call our technical support at (844) 585-1182");
       };
       this.showBrowserBlockMessage = function () {
           var snapNotification = snap.resolveObject("snap.SnapNotification");
           snapNotification.info("Video Consultations are not currently available on this platform. If you need further assistance please call our technical support at (844) 585-1182");

       };
       this.initPreLoginBrowserTest = function () {

           var isMobile = kendo.support.mobileOS;
           var isSafari = kendo.support.browser.safari === true;
           var isEdge = kendo.support.browser.edge === true;
           if (isMobile) {
               var isIOS = kendo.support.mobileOS.name === 'ios';
               if (isIOS) {
                   this.showBrowserWarningMessage();
               }
           } else {
               if (isSafari || isEdge) {
                   this.showBrowserWarningMessage();
               }
           }
       }
       this.initPostLoginBrowserTest = function () {

           var isMobile = kendo.support.mobileOS;
           var isSafari = kendo.support.browser.safari === true;
           var isEdge = kendo.support.browser.edge === true;
           if (isMobile) {
               var isIOS = kendo.support.mobileOS.name === 'ios';
               if (isIOS) {
                   this.showBrowserWarningMessage();
               }
           } else {
               if (isSafari || isEdge) {
                   this.showBrowserWarningMessage();
               }
           }
       }
    }).singleton();

    var helper = new snap.Helper();
    //this is nice way to inject universal Helper
    jQuery.extend(snap, helper);
  

}(jQuery, window.snap = window.snap || {}));