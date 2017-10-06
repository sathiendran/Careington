/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../kendo.all.min.js" />

/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/loadingcoremodule.js" />

; (function ($) {


    snap.namespace("snap.common").use(["snap.common.Session"])
         .extend(kendo.observable).define("ClassicHeaderViewModel", function ($session) {
             this.brandName= "";
             this.subBrandName= "";
             this.userName = "";
             this.userImage = "";
             this.altImage= "";
             this.brandColor= "";
             this.hospitalId = null;
             var hospitalInfo = $session.getHospitalInformation();
             if (hospitalInfo) {
                 this.set("brandName", hospitalInfo.brandName);
                 this.set("subBrandName", hospitalInfo.subBrandName);
                 this.set("brandColor", hospitalInfo.brandColor);
             }
             var userInfo = $session.getUserInformation();
             if (userInfo) {
                 this.set("userName", userInfo.fullName);
                 this.set("userImage", userInfo.profileImage);
             }
             
    }).singleton();



}(jQuery));









