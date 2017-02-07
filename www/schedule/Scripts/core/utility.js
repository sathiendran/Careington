/// <reference path="../jquery-2.1.3.intellisense.js" />
/// <reference path="../kendo.all.min.js" />
/// <reference path="snap.core.js" />



; (function ($, snap) {
    snap.define("Helper", function () {
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

       this.replaceUndefinedFromJSON = function (obj) {
           if (obj) {
               for (var i in obj) {
                   if (!obj[i]) {
                       obj[i] = "N/A";
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

                   console.log('extensionInstalled:' + response.extensionInstalled);
                   console.log('extensionRequired:' + response.extensionRequired);

                   //resp={"supported":true,"supportedSources":{"screen":true,"application":true,"window":true,"browser":true}}
                   if ((envName === "Chrome") && (response.extensionInstalled === false)) {
                       snapConfirm("Screen sharing extension not installed. Press Yes to install extension");
                       $("#btnConfirmYes").click(function () {
                           window.open('https://chrome.google.com/webstore/detail/' + chromeExtensionId);
                       });
                   }
                   else if ((envName === "WaitTokboxFirefox") && (response.extensionInstalled === false )) {
                       //If older version of the screen-sharing extension for Firefox check the extensionInstalled property if the extensionRequired property is set to true:
                       snapConfirm("Screen sharing extension not installed. Press Yes to install extension");
                       $("#btnConfirmYes").click(function () {
                           window.open('https://addons.mozilla.org/en-US/firefox/addon/screen-sharing-extension-for-s/');
                       });

                   }
               });
           }
       };
    }).singleton();

    var helper = new snap.Helper();
    //this is nice way to inject universal Helper
    jQuery.extend(snap, helper);
  

}(jQuery, window.snap = window.snap || {}));