;
(function(global, $) {
    snap.namespace("snap.hub").use(["snap.hub.hubModel"])
        .define("fileSharingHub", function($hubModel) {
            var fileSharingHub = $.connection.fileSharingHub,
                scope = this,
                isStarted = false,
                isInitialized = false;

            $hubModel._initModel(fileSharingHub, this);

            var initConnection = function() {
                $.connection.hub.qs = $.connection.hub.qs || {};
                if (snap.userSession && snap.userSession.token) {
                    $.connection.hub.qs["Bearer"] = snap.userSession.token;
                }
            };

            this.init = function(isCustomer) {
                initConnection();

                if (isInitialized) {
                    window.console.log("fileSharingHub was initialized before");
                    return;
                }
                isInitialized = true;

                scope.on("start", function() {
                    isStarted = true;
                    window.console.log("fileSharingHub started");
                });

                fileSharingHub.client = {};

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

                        if (isCustomer) {
                            app.snapFileService.viewModel.drill();
                        } else {
                            app.snapFileService.bottomViewModel.drill();
                        }
                    }
                };
            };

            this.isHubStarted = function() {
                return isStarted;
            };

            this.isHubInitialized = function() {
                return isInitialized;
            };

            this.markAsStarted = function(value) {
                isStarted = !!value;
            };

        }).singleton();
})(window, jQuery);
