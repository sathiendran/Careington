; (function ($) {
    snap.namespace("Snap.Patient").use(["snapNotification",
        "snapHttp",
        "snap.DataService.customerDataService",
        "Snap.Common.PatientProfileEditViewModel",
        "Snap.Common.PatientProfileViewModelMode",
        "snap.shared.webcamImageUploader"
        ])
        .define("PatientEditingService", function ($snapNotification, $snapHttp, $service, $viewmodel, $modeEnum, $webcamUpload) {
            var vm = $viewmodel;

            this.LoadViewmodelForDisplay = function (containerId, hospitalId, patientId, isDependent, cancelCallback) {
                $.get("/content/patient/viewPatientProfile.html" + snap.addVersion).then(function (html) {
                    var view = $(html);
                    vm.hospitalId = hospitalId;
                    vm.set("modeData", $modeEnum.Customer.ViewProfile);
                    vm.cancelCallback = cancelCallback;
                    if (!isDependent) {
                        $service.getPatientProfileDetails(patientId, "all").then(function (resp) {
                            vm.set("isDependent", "N");
                            vm.setPatientData(resp.data[0]);

                        }, function () {
                            snapInfo("Unable to access profile");
                        });
                    } else {
                        $service.getPatientProfileDetails(snap.profileSession.profileId, "addresses").done(function (guardianResp) {
                            $service.getPatientProfileDetails(patientId, "all").then(function (resp) {
                                vm.set("isDependent", "Y");
                                vm.setPatientData(resp.data[0]);
                                vm.set("guardianAddress", guardianResp.data[0].addresses[0].addressText);
                            }, function () {
                                snapInfo("Unable to access profile");
                            });
                        });
                    }
                    $(containerId).html(view[0].innerHTML);
                    snap.localize();
                    kendo.bind($(containerId), vm);
                });
            }

            this.LoadViewModel = function (containerId, hospitalId, isEditMode, isDefaultPatient, patientId, changesSavedCallback, cancelCallback, isAdmin, guardianProfileId) {
                vm.isAdmin = isAdmin;
                vm.guardianId = guardianProfileId;
                vm.isEditMode = isEditMode;
                vm.hospitalId = hospitalId;
                vm.changesSavedCallback = changesSavedCallback;
                vm.cancelCallback = cancelCallback;
                vm.isViewOnly = false;
                vm.saveChangesInternal = function () {
                    var savePromise = $.Deferred();
                    var viewmodel = vm;
                    viewmodel.sendData().then(function (resp) {

                        if (viewmodel.isDependentVisible) {
                            var rdata = resp;
                            if (resp.data)
                                rdata = resp.data[0];
                            var securityToken = rdata.securityToken;
                            var patientId = isEmpty(rdata.patientId) ? rdata.patientID : rdata.patientId;
                            var saveAllPromise;
                            if (viewmodel.doSendInvitation && securityToken) {
                                saveAllPromise = $.when($service.editRelationAndAuthorization(patientId,
                                {
                                    relationCodeId: viewmodel.oldRelation,
                                    isAuthorized: viewmodel.isAuthorized
                                }).fail(function () {
                                    $snapNotification.error("Relation did not update");
                                }),
                                viewmodel.SendEmailInvitationToDependentUser(securityToken).done(function() {
                                    viewmodel.invitationIsSent = true;
                                }).fail(function (xhr) {
                                    $snapNotification.error("Email invitation error <br />" + xhr.responseText);
                                }));
                            } else {
                                saveAllPromise = $.when($service.editRelationAndAuthorization(patientId,
                                {
                                    relationCodeId: viewmodel.oldRelation,
                                    isAuthorized: viewmodel.isAuthorized
                                }).fail(function () {
                                    $snapNotification.error("Relation did not update");
                                }));
                            }
                            saveAllPromise.done(function (res1, res2) {
                                var successMessage = "Changes are saved successfully"
                                if (res2 && res2[0] == "Success") {
                                    successMessage += "\nProfile has been " + (vm.isEditMode ? "updated" : "created") + " successfully.\nEmail invitation has been sent successfully.";
                                }
                                $snapNotification.success(successMessage);
                                snap.clearUserTimeZone();
                                viewmodel.profileImageUploader.uploadAsync(patientId).then(function () {
                                    viewmodel.reloadProfileInfo().done(function () {
                                        savePromise.resolve();
                                        window.setTimeout(changesSavedCallback, 2000);
                                    });
                                });
                            }).fail(function () {
                                savePromise.reject();
                            });
                        } else {
                            var successMessage2 = "Changes are saved successfully";
                            $snapNotification.success(successMessage2);

                            //load profile
                            snap.clearUserTimeZone();
                            viewmodel.reloadProfileInfo().done(function () {
                                savePromise.resolve();
                                window.setTimeout(changesSavedCallback, 2000);
                            });
                        }

                    }, function (error) {
                        var errorMsg = vm.formatErrorMessage(error, "Error saving profile")

                        snapError(errorMsg);
                        savePromise.reject();
                    });

                    return savePromise.promise();
                };
                vm.doSendData = function (viewmodel, service, data) {
                    if (viewmodel.isEditMode) {
                        return service.editPatientProfile(data);
                    } else {
                        return service.addPatientProfile(data);
                    }
                }

                var loadedPatientId = null;                
                vm.webcamUpload = function () {
                    if (!loadedPatientId) {
                        return;
                    }

                    if (isEditMode) {

                        
                        var callback = function (http) {
                            if (http.response && http.response.data) {
                                var imageUrl = http.response.data[0].uri;

                                vm.set("profileImage", imageUrl);
                                if (loadedPatientId === snap.profileSession.profileId) {
                                    snap.updateSnapJsSession("snap_patientprofile_session", "profileImage", imageUrl);
                                    snap.eventAggregator.published("profileImage:changed", imageUrl);
                                }

                                $webcamUpload.close();
                            } 
                        };

                        $webcamUpload.open({
                            callback: callback,
                            userId: loadedPatientId,
                            //TODO: share urls form snap.images
                            uploadUrl: snap.baseUrl + "/api/v2.1/patients/profile-images?patientId=" + loadedPatientId
                        });

                    } else {
                        
                    }
                };

                $.get("/content/patient/editPatientProfile.html" + snap.addVersion).then(function (html) {
                    var formView = $(html);

                    // In both case when we edit profile or add new one we need to load list of possible identifiers.
                    $service.getPatientIdentifiers().then(function (resp) {
                        vm.set("identiferTypes", resp.data);
                    });

                    if (isEditMode) {
                        vm.set("modeData", $modeEnum.Customer.EditProfile);

                        var dataLoaded;
 
                        if (isDefaultPatient) {
                            dataLoaded = $service.getDefaultPatientProfileDetails("all").then(function (resp) {
                                vm.set("isDependent", "N");
                                vm.setPatientData(resp.data[0]);
                                vm.setChangedListener(false);
                                return resp;
                            }, function () {
                                snapInfo("Unable to access profile");
                                setTimeout(function () { window.location.href = snap.getPatientHome(); }, 5000);
                                
                            });
                        } else {
                            dataLoaded = $.Deferred();
                            $service.getPatientProfileDetails(snap.profileSession.profileId, "addresses").done(function (guardianResp) {
                                $service.getPatientProfileDetails(patientId, "all").then(function (resp) {
                                    vm.set("isDependent", "Y");
                                    vm.setPatientData(resp.data[0]);
                                    vm.set("guardianAddress", guardianResp.data[0].addresses[0].addressText);
                                    vm.setChangedListener(false);
                                    dataLoaded.resolve(resp)
                                    return resp;
                                }, function () {
                                    snapInfo("Unable to access profile");
                                    dataLoaded.reject();
                                });
                            });
                           
                        }

                        dataLoaded.then(function (response) {
                            var data = response.data[0];

                            loadedPatientId = data.account.patientId;

                            var $uploadButton = $("#UploadButton");
                            var $uploadButtonSelector = "#UploadButton";
                            $uploadButton.show();
                            vm.profileImageUploader = new ProfileImageUploader(
                                $uploadButtonSelector,
                                "patient",
                                true,
                                data.account.patientId,
                                null,
                                function (imageUrl) {
                                    vm.set("profileImage", imageUrl);
                                    if (data.account.patientId === snap.profileSession.profileId) {
                                        snap.updateSnapJsSession("snap_patientprofile_session", "profileImage", imageUrl);
                                        snap.eventAggregator.published("profileImage:changed", imageUrl);
                                    }
                                });
                        });
                    }
                    else {
                        vm.set("modeData", $modeEnum.Customer.AddDependent);
                        if (!isDefaultPatient) {
                            vm.isDependent = "Y";
                            $service.getDefaultPatientProfileDetails("addresses").then(function (resp) {
                                vm.setDefaultPatientData(resp.data[0]);
                                vm.setChangedListener(false);
                                loadedPatientId = null;

                                var $uploadButton = $("#UploadButton");
                                var $uploadButtonSelector = "#UploadButton";
                                $uploadButton.show();
                                vm.profileImageUploader = new ProfileImageUploader(
                                    $uploadButtonSelector,
                                    "patient",
                                    false,
                                    null,
                                    function (dataUrl) {
                                        vm.set("profileImage", dataUrl);
                                    },
                                    function () {
                                        // Empty is intentional
                                    });

                            }, function () {
                                snapInfo("Unable to access profile");
                                setTimeout(function () { window.location.href = snap.getPatientHome(); }, 5000);
                        
                            });
                        }
                    }

                    $(containerId).html(formView[0].innerHTML);
                    snap.localize();
                    kendo.bind($(containerId), vm);

                    snap.datepickers.initializeDatePickerPlaceholders();
                });

                return vm;
            }
        });
}(jQuery));