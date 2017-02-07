(function ($, snap) {

    snap.namespace("snap.Patient")
        .use(["snapHttp", "snap.enums.ErrorTypeEnum"])
           .extend(kendo.observable)
           .define("AccountActivationViewModel", function ($snapHttp, $errorTypeEnum) {
               var vm = this;
               this.loadErrorPage = function () {

               };
               this.activateAccount = function (token) {
                   var def = $.Deferred();
                   var path = snap.string.formatString('/api/v2/patients/account-activation');
                   $snapHttp.ajax({
                       type: "PUT",
                       url: path,
                       data: "{token:'" + token + "'}",
                       contentType: "application/json; charset=utf-8",
                       dataType: "json"
                   }).done(function (response) {
                       
                       if (response.data) {
                           def.resolve(response.data[0]);
                       }
                       else {
                           def.reject();
                       }
                   }).fail(function () {
                       vm.loadErrorPage($errorTypeEnum.TokenExpired_Customer);
                   });

                   return def.promise();
               }
               this.verifyToken = function (token) {
                   var def = $.Deferred();
                   var tokenCodeSetId = '1';
                   var path = snap.string.formatString('/api/v2/account/user/tokens/{0}/{1}', token, tokenCodeSetId);
                   $snapHttp.ajax({
                       type: "GET",
                       url: path,
                       contentType: "application/json; charset=utf-8",
                       dataType: "json"
                   }).done(function (response) {
                       ValidResult = response;

                       if (ValidResult == "Success") {
                           def.resolve();
                       }
                       else {
                           def.reject();
                       }
                   }).fail(function () {
                       vm.loadErrorPage($errorTypeEnum.TokenExpired_Customer)
                   });

                   return def.promise();
               }
              
               this.initViewModel = function (token, loadedCallback, loadErrorPage) {
                  
                   this.loadErrorPage = loadErrorPage;
                   this.verifyToken(token).done(function () {
                       vm.activateAccount(token).done(function (data) {
                           localStorage.setItem("snapEmailPatient", data.email);
                       }).fail(function () {
                           loadErrorPage($errorTypeEnum.TokenExpired_Customer);
                       });

                   }).fail(function () {
                        loadErrorPage($errorTypeEnum.TokenExpired_Customer);
                       //if (err) {
                         //  $snapNotification.error(err);
                       //} else {
                         //  loadErrorPage($errorTypeEnum.TokenExpired_Customer);
                      // }
                   }).always(loadedCallback);
               }
           });
}(jQuery, snap || {}));