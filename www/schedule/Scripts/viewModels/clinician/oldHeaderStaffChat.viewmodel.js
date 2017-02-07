"use strict";
snap.namespace("snap.clinician")
    .extend(kendo.observable).define("oldHeaderStaffChatViewmodel", function() {
        this.hasNewMsg = false;
        this.countNewDlg = 0;
        this.hasIncomingCall = false;
        this.activeBadgeVisible = false;
        this.providerChatEnabled = snap.isProviderChatEnabled();

        this.providerChat = function(e) {
            if (e) {
                e.preventDefault();
            }
            var vm = new snap.Shared.MessengerViewModel();
            vm.toggleChat();
            this.set("isChatVisible", !this.isChatVisible);
            return false;
        };

    }).singleton();