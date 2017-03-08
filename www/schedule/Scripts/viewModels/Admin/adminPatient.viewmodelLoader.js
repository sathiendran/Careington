snap.namespace("Snap.Admin").use(["snapNotification", "snapHttp", "snap.DataService.customerDataService", "snap.invitationService", "Snap.Common.PatientProfileEditViewModel", "Snap.Common.PatientProfileViewModelMode", "Snap.Common.PatientProfileDataSources", "snap.service.availabilityBlockService", "snap.admin.schedule.TimeUtils", "snap.common.schedule.ScheduleCommon"])
       .define("PatientEditingService", function ($snapNotification, $snapHttp, $service, $invitationService, $viewmodel, $modeEnum, $ds, $availabilityBlockService, $timeUtils, $scheduleCommon) {
           var vm = $viewmodel;
           this.LoadViewmodelForDisplay = function (containerId, hospitalId, patientId, isDependent, isPhysician) {
               var loadedPromise = $.Deferred();
               $.get("/content/admin/viewPatientProfileAdmin.html" + snap.addVersion).then(function (html) {
                   var patientProfilePromise = $.Deferred();
                   vm.hospitalId = hospitalId;
                   vm.set("modeData", $modeEnum.Admin.ViewProfile);
                   if (!isDependent) {
                       $service.getPatientProfileDetails(patientId, "all").then(function (resp) {
                           vm.set("isDependent", "N");
                           vm.setPatientData(resp.data[0]);
                           patientProfilePromise.resolve(html);
                       }, function () {
                           patientProfilePromise.reject();
                           snapInfo("Unable to access profile");
                       });
                   } else {
                       $service.getPatientProfileDetails(patientId, "all").then(function (resp) {
                           vm.set("isDependent", "Y");
                           vm.setPatientData(resp.data[0]);
                           patientProfilePromise.resolve(html);
                       }, function () {
                           patientProfilePromise.reject();
                           snapInfo("Unable to access profile");
                       });
                   }
                   return patientProfilePromise.promise();
               }, function () {
                   loadedPromise.reject();
               }).then(function (html) {
                   var view = $(html);
                   var consultationPromise = $.Deferred();
                   var $vm = kendo.observable($.extend(vm, {
                       adultPatients: [],
                       dependentPatients: [],
                       isPhysician: isPhysician,
                       userType: isPhysician ? $scheduleCommon.userType.clinician : $scheduleCommon.userType.admin,
                       noAdults: function () {
                           return this.get("adultPatients").length == 0;
                       },
                       noDependents: function () {
                           return this.get("dependentPatients").length == 0;
                       },
                       canHaveConsultation: function () {
                           return this.get("isActive") == "A" && (!(this.EmailIsSet() && this.get("isPending") || this.get("isDependent") === "Y") || (this.get("isDependent") == "Y" && this.get("isAuthorized") == "Y"));
                       },
                       canRecordConsultation: function () {
                           return isPhysician && vm.canHaveConsultation() && snap.canRecordConsultation();
                       },
                       canScheduleConsultation: function () {
                           return vm.canHaveConsultation() && snap.canScheduleConsultation();
                       },
                       canAddDependent: function () {
                           return !this.get("isPhysician") && this.get("isLoginUser");
                       },
                       scheduleConsultation: function (e) {
                           e.preventDefault();
                           if (vm.canScheduleConsultation) {
                               snap.admin.schedule.eventDialog().openNewAppointmentDialog({
                                   clinicianId: snap.profileSession.userId,
                                   patientId: patientId,
                                   userType: vm.userType
                               });
                           } else {
                               snapInfo("You can't schedule consultation for this user");
                           }
                       },
                       recordConsultation: function (e) {
                           e.preventDefault();
                           if (vm.canRecordConsultation) {
                               snap.admin.schedule.eventDialog().openNewRecordDialog({
                                   clinicianId: snap.profileSession.userId,
                                   patientId: patientId,
                                   userType: vm.userType
                               });
                           } else {
                               snapInfo("You can't document an encounter for this user");
                           }
                       },
                       resetPassword: function (e) {
                           var path = snap.string.formatString('/api/v2/mail/resetPassword');
                           var Email = this.get("email");
                           if (Email !== "") {
                               var validEmail = (snap.regExMail).test(Email);
                               if (!validEmail) {
                                   $snapNotification.error("Invalid Email ID Format<br> Please enter Valid Email ID");
                               }
                               else {
                                   var data = { email: Email, hospitalId: snap.hospitalSession.hospitalId, userTypeId: "1" };
                                   $.ajax({
                                       type: "POST",
                                       async: false,
                                       url: path,
                                       data: JSON.stringify(data),
                                       contentType: "application/json; charset=utf-8",
                                       dataType: "json",
                                       success: function (result) {
                                           var strReturn;
                                           strReturn = result;
                                           if (strReturn == "Success") {
                                               $snapNotification.success("An email has been sent to the patient with a link to reset their Password");
                                           }
                                           else if (strReturn == "Invalid Email ID") {
                                               $snapNotification.error("This Email ID is not registered.<br> Please enter Valid Email ID");
                                           }
                                           e.preventDefault();
                                       }
                                   });
                               }

                           }
                           else {
                               $snapNotification.error("Email address should not be empty,<br> please enter valid email");
                           }
                       },
                       canResetPassword: function () {
                           return !this.get("isPhysician") && this.get("isLoginUser");
                       },
                       canSendIvnitation: function () {
                           return this.IsPatientPending() && this.EmailIsSet();
                       },
                       sendInvitation: function (e) {
                           e.preventDefault();
                           var loader = snap.SnapLoader();
                           loader.showLoader();
                           $.post("/api/v2/admin/patients/send-onboarding-email?email=" + encodeURIComponent(this.get("email"))).done(function () {
                               snapSuccess("Invitation Email was sent successfully");
                           }).always(function () {
                               loader.hideLoader();
                           });
                       },
                       goBack: function (e) {
                           e.preventDefault();
                           if (this.isPhysician) {
                               location.href = "/Physician/PatientsList";
                           }
                       },
                       mailToUser: function () {
                           return "mailto://" + this.get("email");
                       },
                       isFileSharingEnabled: snap.hospitalSettings.fileSharing
                   }));


                   var relationshipSource = $ds.GetRelationshipSrc(hospitalId)
                   $.when($service.getAccountUserProfiles(patientId, true), $service.getAccountDependentProfiles(patientId), relationshipSource.read()).done(function (adultResponse, dependentResponse) {
                       adultResponse[0].data.forEach(function (item) {

                           item.profileImagePath = item.profileImagePath
                               || getDefaultProfileImageForPatient(item.gender);

                           item.openEditPage = function (e) {
                               sessionStorage.setItem("snap_patientId_ref", e.data.patientId);
                               sessionStorage.setItem("snap_patientId_isDependent", "N");
                               sessionStorage.setItem("snap_guardianId", $vm.patientId);
                               if (isPhysician) {
                                   window.location.href = '/Physician/PatientFile';
                               } else {
                                   window.location.href = "/Admin/PatientProfileDetails.aspx"
                               }
                           }
                       });
                       vm.set("adultPatients", adultResponse[0].data);
                       dependentResponse[0].data.forEach(function (item) {

                           item.profileImagePath = item.profileImagePath
                               || getDefaultProfileImageForPatient(item.gender);

                           var relationItem = relationshipSource.get(item.relationCode);
                           if (relationItem) {
                               item.relation = relationItem.name;
                           } else {
                               item.relation = "";
                           }
                           item.isNotAuthorized = !item.isAuthorized;
                           item.openEditPage = function (e) {
                               sessionStorage.setItem("snap_patientId_ref", e.data.patientId);
                               sessionStorage.setItem("snap_patientId_isDependent", "Y");
                               sessionStorage.setItem("snap_guardianId", $vm.patientId);
                               sessionStorage.setItem("snap_guardianFullName", [$vm.patientName, $vm.lastName].join(' '));
                               if (isPhysician) {
                                   window.location.href = '/Physician/PatientFile';
                               } else {
                                   window.location.href = "/Admin/PatientProfileDetails.aspx"
                               }
                           }
                       });
                       vm.set("dependentPatients", dependentResponse[0].data);
                   }).fail(function () {
                       consultationPromise.reject();
                       window.history.back();
                   });

                   $(containerId).html(view[0].innerHTML);
                   snap.localize();
                   if (snap.hospitalSettings.fileSharing) {
                       $(containerId).find("#tab8").load("../Content/fileSharing.html" + snap.addVersion, function () {

                           var $bf = $("#bottomFiles");
                           var $tf = $("#topFiles");

                           $bf.replaceWith($tf.clone());
                           $tf.replaceWith($bf.clone());

                           initPhysicianPatientFileSharing(snap.userId, patientId);
                           app.snapFileService.viewModel.set('dropMessageVisible', true);
                           app.snapFileService.bottomViewModel.set('dropMessageVisible', true);
                           window.app.snapFileService.initSpinnerLoadOption();
                           $("#splitter").kendoSplitter({
                               orientation: "horizontal",
                               panes: [
                                   { collapsible: true, resizable: false, size: "50%" },
                                   { collapsible: true, resizable: false, size: "50%" }
                               ]
                           });
                       });
                                      
                   }

                   kendo.bind($(containerId), $vm);


                   $(containerId).find(".liquid-slider").kendoTabStrip({
                       animation: {
                           open: {
                               effects: "fadeIn"
                           }
                       }
                   });

                   var $consultationsListingControl = snap.shared.consultationsListingControl();
                   var $mainHub = snap.hub.mainHub();
                   $consultationsListingControl.initHub();
                   $mainHub.on("start", function () {
                       $consultationsListingControl.init().done(function () {
                           var checkedPromise = $.Deferred();
                           $vm.checkActiveConsultations = function () {
                               $consultationsListingControl.hub.getConsultationsInfo({
                                   ConsultationStatus: snap.consultationsListingDataSource().consultationStutuses.Active,
                                   PatientId: $vm.patientId,
                                   IncludeDependents: true
                               }).done(function (resp) {
                                   checkedPromise.resolve(resp.Data.length > 0);
                               }).fail(function () {
                                   checkedPromise.reject();
                               })

                               return checkedPromise.promise();
                           },
                           $vm.checkFutureConsultations = function () {
                               var checkedConsultationPromise = $.Deferred();
                               var vm = this;
                               $availabilityBlockService.getUserCurrentTime().done(function (userCurrentTimeResponse) {
                                   var obj = {
                                       patientIds: [vm.patientId],
                                       startDate: userCurrentTimeResponse.data[0]
                                   };
                                   $availabilityBlockService.getAppointmentsForClinician(obj).done(function (resp) {
                                       checkedConsultationPromise.resolve(resp.data && resp.data.length);
                                   }).fail(function () {
                                       checkedConsultationPromise.reject();
                                   });
                               }).fail(function () {
                                   checkedConsultationPromise.reject();
                               });
                               return checkedConsultationPromise.promise();
                           }
                           $consultationsListingControl.loadConsultationsToTab(
                               $(containerId).find("#pastConsultationsListing"),
                               {
                                   status: "Past",
                                   patientId: patientId
                               }, {
                                   userType: isPhysician ? $scheduleCommon.userType.clinician : $scheduleCommon.userType.admin,
                                   showDownloadCCRButton: !isPhysician
                               });

                           $consultationsListingControl.loadConsultationsToTab(
                                $(containerId).find("#scheduledConsultationsListing"),
                               {
                                   status: "Scheduled",
                                   patientId: patientId,
                                   isProfileActive: $vm.isActive === "A"
                               }, {
                                   userType: isPhysician ? $scheduleCommon.userType.clinician : $scheduleCommon.userType.admin
                               });

                           $consultationsListingControl.loadConsultationsToTab(
                                $(containerId).find("#dnaConsultationsListing"),
                               {
                                   status: "DNA",
                                   patientId: patientId,
                                   isProfileActive: $vm.isActive === "A"
                               }, {
                                   userType: isPhysician ? $scheduleCommon.userType.clinician : $scheduleCommon.userType.admin
                               });

                           $consultationsListingControl.loadConsultationsToTab(
                                $(containerId).find("#droppedConsultationsListing"),
                               {
                                   status: "Dropped",
                                   patientId: patientId
                               }, {
                                   userType: isPhysician ? $scheduleCommon.userType.clinician : $scheduleCommon.userType.admin
                               });
                           consultationPromise.resolve($vm);
                       });

                       $mainHub.off("start");
                   });
                   $mainHub.start();
                   return consultationPromise.promise();
               }, function () {
                   loadedPromise.reject();
               }).then(function ($vm) {
                   loadedPromise.resolve($vm);
               }, function () {
                   loadedPromise.reject();
               });


               return loadedPromise;
           };

           this.LoadViewModel = function (containerId, hospitalId, isEditMode, isDependent, patientId, changesSavedCallback, isAdmin, guardianProfileId) {
               var vm = $viewmodel;
               vm.isAdmin = isAdmin;
               vm.guardianId = guardianProfileId;
               vm.isEditMode = isEditMode;
               vm.changesSavedCallback = changesSavedCallback;
               vm.cancelCallback = changesSavedCallback;

               vm.saveChangesInternal = function (options) {
                   var savePromise = $.Deferred();
                   var viewmodel = vm;
                   viewmodel.sendData().then(function (resp) {
                       var invitationWasSent = options && options.invitationWasSent;
                       if (viewmodel.isDependentBool()) {
                           var rdata = resp;
                           if (resp.data)
                               rdata = resp.data[0];
                           var securityToken = rdata.securityToken;
                           var patientId = isEmpty(rdata.patientId) ? rdata.patientID : rdata.patientId;
                           var saveAllPromise;
                           if (viewmodel.DoSendInvitation) {
                               saveAllPromise = $.when($service.editRelationAndAuthorizationAsAdmin(viewmodel.guardianId, patientId,
                               {
                                   relationCodeId: viewmodel.oldRelation,
                                   isAuthorized: viewmodel.isAuthorizedBool ? "Y" : "N"
                               }).fail(function () {
                                   $snapNotification.error("Relation did not update");
                               }),
                               viewmodel.SendEmailInvitationToDependentUser(securityToken).fail(function () {
                                   $snapNotification.error("Email invitation error <br />");
                               }));
                           } else {
                               saveAllPromise = $service.editRelationAndAuthorizationAsAdmin(viewmodel.guardianId, patientId,
                               {
                                   relationCodeId: viewmodel.oldRelation,
                                   isAuthorized: viewmodel.isAuthorizedBool ? "Y" : "N"
                               }).fail(function () {
                                   $snapNotification.error("Relation did not update");
                               });
                           }
                           saveAllPromise.then(function () {
                               $snapNotification.success("Changes are saved " + (invitationWasSent || viewmodel.DoSendInvitation ? "and invitation email is sucessfully sent" : "successfully"));
                               snap.clearUserTimeZone();
                               savePromise.resolve();
                               viewmodel.hideLoader();
                               setInterval(function () { viewmodel.changesSavedCallback(); }, 1000);
                           }, function () {
                               viewmodel.hideLoader();
                               savePromise.reject();
                           });
                       } else {
                           $snapNotification.success("Changes are saved " + (invitationWasSent || viewmodel.DoSendInvitation ? "and invitation email is sucessfully sent" : "successfully"));
                           snap.clearUserTimeZone();
                           savePromise.resolve();
                           viewmodel.hideLoader();
                           setInterval(function () { viewmodel.changesSavedCallback(); }, 1000);
                       }
                   }, function (error) {
                       var errorMsg = vm.formatErrorMessage(error, "Error saving profile");
                       snapError(errorMsg);
                       savePromise.reject();

                   });
                   return savePromise.promise();
               }
               vm.doSendData = function (viewmodel, service, data) {
                   try {
                       if (viewmodel.isDependentBool() && viewmodel.modeData.isNew) {
                           return service.addDependentAsAdmin(viewmodel.guardianId, data);
                       } else {
                           return service.editPatientProfile(data);
                       }
                   }
                   catch (ex) {
                       $snapNotification.error("Error Saving Profile");

                   }
               }
               vm.sendPrimaryData = function (preventSendingInvitation) {
                   if (!this.patientId) {
                       var data = {
                           firstName: this.patientName,
                           lastName: this.lastName,
                           email: this.email,

                           countryId: this.extractCountryId(this.country),
                           dob: formatJSONDateShort(this.dob),
                           address: this.address,
                           mobileNumberWithCountryCode: this.country + this.mobilePhone,
                           timeZoneId: this.timeZoneId,
                           gender: this.gender,
                           status: this.OnBoardStatus.Inactive,
                           preventSendingInvitation: preventSendingInvitation

                       };

                       return $invitationService.saveDataAndSendEmail(data);
                   } else {
                       def = $.Deferred();
                       def.resolve({ data: [this.patientId] });
                       return def.promise();
                   }
               }
               $.get("/content/admin/adminPatientProfileDetails.html" + snap.addVersion).then(function (html) {
                   var showUploadPhoto = true;
                   var view = $(html);
                   vm.hospitalId = hospitalId;
                   vm.set("isDependent", isDependent ? "Y" : "N");
                   vm.set("changesSavedCallback", changesSavedCallback);
                   if (isEditMode) {
                       vm.set("modeData", $modeEnum.Admin.EditProfile);
                       $service.getPatientProfileDetails(patientId, "all").then(function (resp) {
                           vm.setPatientData(resp.data[0]);
                           vm.setChangedListener(true);
                       }, function () {
                           window.location.href = '/Admin/Login';
                       });

                   } else {
                       vm.set("modeData", $modeEnum.Admin.AddProfile);
                       if (isDependent) {
                           vm.set("guardianId", patientId);
                           $service.getPatientProfileDetails(patientId, "addresses").then(function (resp) {
                               vm.setDefaultPatientData(resp.data[0]);
                               vm.setChangedListener(true);
                           }, function () {
                               snapInfo("Unable to access profile");
                           });
                           showUploadPhoto = false;
                       } else {
                           vm.setChangedListener(true);
                           vm.setUpDataSources(snap.hospitalSession.hospitalId);
                           vm.setUpUnits();
                       }
                   }


                   $(containerId).html(view[0].innerHTML);
                   snap.localize();
                   kendo.bind($(containerId), vm);
                   snap.datepickers.initializeDatePickerPlaceholders();

                   if (patientId && showUploadPhoto) {
                       $("#profileImage").show();
                       ProfileImageUploader(
                           $("#uploadPhoto"),
                           "patient",
                           true,
                           patientId,
                           null,
                           function (imageUrl) {
                               vm.set("profileImage", imageUrl);
                           });
                   }
               });
               return vm;
           }
       });