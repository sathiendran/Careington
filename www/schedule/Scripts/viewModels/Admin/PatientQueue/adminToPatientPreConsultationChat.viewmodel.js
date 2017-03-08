//@ sourceURL=adminToPatientPreConsultationChat.viewmodel.js
(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.admin.patientQueue")
        .use(["snap.EventAggregator", "snap.common.patientQueue.preConsultationChat"])
        .extend(kendo.observable)
        .define("adminToPatientPreConsultationChat", function ($eventAggregator, $preConsultationChat) {
            var messages = [];
            var ds = new snap.dataSource.codeSetDataSourceWrapper(["adminpatientqueuemessage"]).getCodeSetDataSource("adminpatientqueue message", snap.hospitalSession.hospitalId);

            //****************** Call BASE constructor ********************
            $preConsultationChat.ctor.call(this);

            var $scope = this;

            this.vm_showCannedMessages = false;
            this.vm_onToogleCannedMessages = function(e) {
                if(this.vm_showCannedMessages) {
                    this.vm_onCloseCannedMessages(e);
                } else {
                    this.vm_onOpenCannedMessages(e);
                }
            };

            this.vm_onOpenCannedMessages = function(e) {
                if(!this.vm_showCannedMessages) {
                    this.set("vm_showCannedMessages", true);
                    this.trigger("change", {field: "vm_cannedMessagesList"});
                }

                e.stopPropagation();
            };

            this.vm_onCloseCannedMessages = function(e) {
                if(this.vm_showCannedMessages) {
                    this.set("vm_showCannedMessages", false);
                    this.set("vm_showToogleMessagesSearch", false);
                    this.vm_clearNameFilter();

                    this.trigger("change", {field: "vm_cannedMessagesList"});
                }

                e.stopPropagation();
            };

            this.vm_showToogleMessagesSearch = false;
            this.vm_onToogleMessagesSearch = function(e) {
                e.stopPropagation();
                this.set("vm_showToogleMessagesSearch", !this.vm_showToogleMessagesSearch);
            };

            this.vm_nameFilter = "";
            this.vm_onNameFilterChange = function() {
                this.trigger("change", {field: "vm_cannedMessagesList"});
                this.trigger("change", {field: "vm_isNameFilterNotEmpty"});
            };
            this.vm_clearNameFilter = function() {
                this.set("vm_nameFilter", "");
                this.vm_onNameFilterChange();
            };

            this.vm_messagelistEmpty = false;
            this.vm_isNameFilterNotEmpty = function() {
                return !!this.vm_nameFilter.length;
            };
            this.vm_cannedMessagesList = function() {
                var arr = messages;

                // Instead of checking the entire string to see if there's only whitespace, just check to see if there's at least one character of non whitespace:
                if(this.vm_nameFilter && /\S/.test(this.vm_nameFilter)) {
                    var nameFilter = this.vm_nameFilter.toLowerCase();

                    arr = arr.filter(function(m) {
                        return m.message.toLowerCase().indexOf(nameFilter) !== -1; 
                    });
                }

                this.set("vm_messagelistEmpty", arr.length === 0);

                return arr;
            };

            this._loadDetails = function() {
                this.set("vm_showCannedMessages", false);
                this.set("vm_showToogleMessagesSearch", false);
                this.vm_clearNameFilter();

                this.trigger("change", {field: "vm_cannedMessagesList"});
            };

            ds.read().done(function() {
                messages = ds.data().map(function(data) {
                    return kendo.observable(new CannedMessage(data.text));
                }); 

                $scope.trigger("change", {field: "vm_cannedMessagesList"});
            }); 

            function CannedMessage(message) {
                this.message = message;
                this.vm_isAnimate = false;

                this.vm_onSendMessageClick = function() {
                    $scope._sendMessage(this.message);

                    $eventAggregator.publish("preConsultationChat_sendMessage");

                    this.set("vm_isAnimate", true);

                    var that = this;
                    setTimeout(function () { 
                        that.set("vm_isAnimate", false);
                    }, 1000);
                
                };
            }
        }).singleton();
}(jQuery, snap, kendo, window));