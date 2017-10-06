;
(function(global, $, snap) {
    "use strict";

    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("fileSharingHub", function($hubModel) {
            var fileSharingHub = $.connection.fileSharingHub,
                scope = this;

            this._isCustomer = false;

            this._name = "fileSharingHub";

            $hubModel._initModel(fileSharingHub, this);

            this._initConnection = function(opt) {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }

                scope._isCustomer = opt.isCustomer;
            };

            this._initClient = function() {
                fileSharingHub.client = {};
                var app = snap.resolveObject("app");

                fileSharingHub.client.onFileuploadSuccess = function(data) {
                    if (data) {
                        if (data.message.is_folder == "True" && data.message.operation == "delete") {
                            app.snapFileService.deletedFolder.push(data.message.rowID);
                        } else if (data.message.operation == "delete") {
                            app.snapFileService.deletedFile.push(data.message.rowID);
                        }

                        app.snapFileService.snapFilesCURDNotification(data);
                        if (app.snapFileService.gTagText.toString().trim().length > 0 || data.message.load_view_name == "None") // No need to call load method from own side when tag search is applied.
                        {
                            return false;
                        }

                        if (scope._isCustomer) {
                            app.snapFileService.viewModel.drill();
                        } else {
                            app.snapFileService.bottomViewModel.drill();
                        }
                    }
                };
            };

        }).singleton();
})(window, jQuery, snap);
