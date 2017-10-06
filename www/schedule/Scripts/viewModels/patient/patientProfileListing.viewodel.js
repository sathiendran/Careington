
var snapPopUp = (function (global, $) {
    var kendoWindow,
        $popUpContent,
        callbacks = {};

    $(document).ready(function () {
        var $popUp = $(".popup.snap-confirmation");
        $popUpContent = $popUp.find("#snapPopUpContent");

        /* initialize kendo window for pop up */
        $popUp.kendoWindow({
            modal: true,
            maxWidth: 800,
            pinned: false,
            resizable: false,
            visible: false,
            position: {
                top: 50
            },
            draggable: true,
            actions: [
                "Close"
            ]
        });

        $popUp.find('.btn-ok').on("click", function (event) {
            event.preventDefault();
            if (callbacks.onOk) {
                callbacks.onOk();
            }
            kendoWindow.close();
        });

        $popUp.find('.cancel').on("click", function (event) {
            event.preventDefault();
            if (callbacks.onCancel) {
                callbacks.onCancel();
            }
            kendoWindow.close();
        });

        $('.k-i-close').parent().on("click", function (event) {
            event.preventDefault();
            if (callbacks.onCancel) {
                callbacks.onCancel();
            }
            kendoWindow.close();
        });


        kendoWindow = $popUp.data("kendoWindow");
        if(kendoWindow){
            kendoWindow.center();
        }
    });

    return {
        Show: function (title, description, okCallback, cancelCallback) {
            if (kendoWindow) {
                kendoWindow.title(title);
                $popUpContent.text(description);

                callbacks.onOk = okCallback;
                callbacks.onCancel = cancelCallback;

                kendoWindow.open();
            }
        }
    };
})(window, jQuery);

(function (global, $, snap, snapPopUp) {
    var patientProfileListingViewModel,
        util = snap.util,
        app = global.app = global.app || {};

    var PatientProfile = kendo.data.Model.define({
        fields: {
            "patientId": {
                type: "number"
            },
            "patientName": {
                type: "string"
            },
            "profileImage": {
                type: "string"
            },
            "profileImagePath": {
                type: "string"
            },
            "relationCode": {
                type: "number"
            },
            "isAuthorized": {
                type: "boolean"
            },
            "birthdate": {
                type: "string",
            },
            "age": {
                type: "string",
            }
        },
        viewProfile: function () {
            var that = this;

            if (!that.isAuthorized) {
                return false;
            }
            sessionStorage.setItem("snap_patientId_ref", that.patientId);
            global.location.href = "Dependent";
        },
        selectDependency: function () {
            if (typeof this.InitialRelationcode == "undefined") {
                this.InitialRelationcode = this.relationCode;
            }
        },
        changeDependency: function () { //define the calculated field
            //ToDo: I did not change initial disign. But it will be nice to have confirmation message which will block UI till then user will chose one option (see updateAuthorization below). In such case we will be able to remove addition variable 'InitialRelationcode' and simplify code.
            snapConfirm("Are you sure that you want change the Relationship with this dependent?");
            var that = this;
            $("#btnConfirmYes").click(function () {
                $(".k-notification-confirmation").parent().remove();
              

                if (that.relationCode == "94" || that.relationCode == "") {
                    snapError("Please choose a relationship.");
                    return;
                }

                var data = {
                    relationCodeId: that.relationCode,
                    isAuthorized: that.isAuthorized ? "Y" : "N"
                }
               
                snap.DataService.customerDataService().editRelationAndAuthorization(that.patientId, data).done(function () {
                    that.InitialRelationcode = that.relationCode;
                }).fail(function (xhr) {
                    if (xhr && xhr.status && xhr.statusText) {
                        if (xhr.status == 401) {
                            snapError("You are not authorized to change relationship with this dependent.");
                        } else{
                            snapError([xhr.status, xhr.statusText].join(" "));
                        }
                    } else {
                        snapError("Unexpected error");
                    }
                    that.set("relationCode", that.InitialRelationcode);
                });
               
            });
            $("#btnConfirmNo").click(function () {
                $(".k-notification-confirmation").parent().remove();
                that.set("relationCode", that.InitialRelationcode);
            });
        },
        updateAuthorization: function () {
            var that = this;

            if (that.isAuthorized) {
                // deauthorization
                var $patientDeactivationHelper = snap.resolveObject("snap.helper.patientDeactivationHelper");
                var opt = {
                    patientId: this.patientId,
                    guardianId: snap.profileSession.userId,
                    patientName: this.patientName
                };
                
                $patientDeactivationHelper.needToCancelFutureConsultationsForDeauthorize(opt).then(function(needToCancelFutureConsultations) {
                    var title = 'De-Authorize Dependent';
                    var description = 'You will no longer be able to view profile or perform consultations until you authorize again.';
                    if (needToCancelFutureConsultations) {
                        description += "\n" + that.patientName + " currently has one or more scheduled appointments. Because you are " + that.patientName + "'s only Guardian, de-authorizing them will cancel all future appointments. Do you still want to proceed?";
                    }
                    that.processAuthorizationChange(title, description);
                });

            } else {
                var title = 'Authorize Dependent';
                var description = 'By adding this new user to my account, I declare that either he or she is my child or an individual '+
                'to which I have the obligation of care. I further state that I have all relevant legal authority to act '+
                'for and on behalf of this user regarding all medical related decisions regarding their personal health '+
                'by way of Natural Guardian status or through the granting of Medical Power-of-Attorney. My legal status '+
                'regarding this user meets all requirements defined within the Health Insurance Portability and Accountability Act of 1996 (HIPPA).';
                that.processAuthorizationChange(title, description);
            }
        },
        processAuthorizationChange: function(title, description) {
            var that = this;
            snapPopUp.Show(
                title,
                description,
                function () {
                    var newStatus = !that.isAuthorized;

                    if (that.relationCode == "94" || that.relationCode == "") {
                        snapError("Please choose a relationship.");
                        return;
                    }
                    var data = {
                        relationCodeId: that.relationCode,
                        isAuthorized: newStatus ? 'Y' : 'N'
                    }
                    snap.DataService.customerDataService().editRelationAndAuthorization(that.patientId, data).done(function () {
                        that.set('isAuthorized', newStatus);
                    }).fail(function (xhr) {
                        if (xhr.status == 401) {
                            snapError("You are not authorized to change authorization status of this dependent.");
                        } else{
                            snapError([xhr.status, xhr.statusText].join(" "));
                    }
                    });
                    
                });
        }
    });

    patientProfileListingViewModel = new kendo.data.ObservableObject({
        dependentProfiles: [],
        patientDependentRelation: [],
        isPatientProfileListingEmpty: function () {
            return this.dependentProfiles.length == 0;
        },

        addDependentProfile: function (e) {
            e.preventDefault();
            window.location.href = "/patient/AddDependent";
        },
        noData: function(){
            return this.get("dependentProfiles").length === 0;
        },
        LoadViewModel: function () {
            var that = this;

            util.apiAjaxRequest('/api/dependentPatients', 'GET').done(function (data) {
                data.forEach(function (element) {
                    var profile = new PatientProfile(element);

                    profile.set("age", snap.getAgeString(formatJSONDate1(profile.birthdate)));

                    profile.set("profileImage", element.profileImagePath
                        || getDefaultProfileImageForPatient(element.gender));

                    profile.bind("change", function () {
                        that.trigger("change", { field: "dependentProfiles" });
                        that.reloadTooltips();
                    });
                    that.dependentProfiles.push(profile);
                });
                that.trigger("change", { field: "isPatientProfileListingEmpty" });
                that.trigger("change", { field: "dependentProfiles" });
                that.reloadTooltips();
            });


            util.apiAjaxRequest('/api/patientDependentRelation', 'GET').done(function (data) {
                that.set("patientDependentRelation", data);
            });
        },

        reloadTooltips: function () {
            var reloadTooltip = function (tooltipSelector, templateSelector) {
                $(tooltipSelector).kendoTooltip({
                    content: kendo.template($(templateSelector).html()),
                    position: "top",
                    width: "300px"
                });
            }

            var reloadAuthTooltip = function (tooltipSelector, templateSelector) {
                $(tooltipSelector).kendoTooltip({
                    content: kendo.template($(templateSelector).html()),
                    position: "top",
                    width: "350px",
                });
            }

            reloadTooltip(".authorized", "#authorizedTemplate");
            reloadAuthTooltip(".nonauthorized", "#nonAuthorizedTemplate");
            reloadTooltip(".nonauthorizedquestion", "#nonAuthorizedQuestion");
        },

        imageLoadError: function (element) {
            element.onerror = "";
            element.src = getDefaultProfileImageForPatient();
        }
    });

    app.patientProfileListingService = {
        viewModel: patientProfileListingViewModel
    };
}(window, jQuery, snap, snapPopUp));

