"use strict";
snap.namespace("snap.clinician")
     .use(["eventaggregator", "snapNotification",
        "snap.hub.snapWaitingRoomConsultationsHub",
        "snap.hub.mainHub"])
    .extend(kendo.observable).define("ClinicianHeaderViewModel", function ($eventaggregator, $snapNotification, $snapWaitingRoomConsultationsHub, $mainHub) {
        var $scope = this;
        this.brandName = snap.hospitalSession.brandName;
        this.subBrandName = snap.hospitalSession.subBrandName;
        this.clientName = snap.hospitalSession.clientName;
        this.clientImage = snap.hospitalSession.hospitalLogo;
        this.altImage = "";
        this.isChatVisible = false;
        this.isActiveHeaderDD = false;
        this.isConsultHeader = false;
        this.vm_patienQueueCount = 0;
        this.patienQueueFlag = false;
        this.hasNewMsg = false;
        this.countNewDlg = 0;
        this.hasIncomingCall = false;
        this.activeBadgeVisible = false;

        this.initHubs = function () {
            $mainHub.register($snapWaitingRoomConsultationsHub);

            this._subscribeToWaitingRoomHub();

            $mainHub.on("start", function () {
                $snapWaitingRoomConsultationsHub.refresh();
            });

            return $mainHub.start();
        };

        this.toggleHeaderDD = function (e) {
            e.preventDefault();
            this.set("isActiveHeaderDD", !this.isActiveHeaderDD);
        }
        this.menuSelect = function (e) {
            this.set("isActiveHeaderDD", !this.isActiveHeaderDD);
        }

        this.user = snap.profileSession;
        $.extend(this.user, {
            age: 0
        });
        this.gender = function () {
            if (this.user.gender == "M") {
                return "Male";
            } else {
                return "Female";
            }
        };
        this.speciality = function () {
            if (this.user.subSpeciality == "") {
                return this.user.medicalSpeciality;
            } else {
                return this.user.medicalSpeciality + " | " + this.user.subSpeciality;
            }
        };
        var defaulWaitMessage = function () {
            $snapNotification.info("This function is not available during your consultation.");
            $scope.closeNav();
        }

        var viewStaffProfile = function (staffUserID) {
            sessionStorage.setItem('snap_staffViewEditProfile', staffUserID);
            location.href = "/Physician/EditPhysicianProfile";
        }

        // Sub header
        this.isMenuToggleVisible = false;
        this.addButtonAction = function () { };
        this.subHeaderTitle = "";
        this.subHeaderModuleTitle = "";
        this.isSessionBtnVisible = false;
        this.isAddButtonVisible = "";
        this.panelToggleAction = function () { };
        this.isPanelToggleVisible = "";
        this.islinkOneVisible = "";
        this.linkOnePath = "";
        this.linkOneTitle = "";
        this.isLinkOneActive = "";
        this.isLinkTwoActive = "";
        this.linkTwoPath = "";
        this.linkTwoTitle = "";
        this.isLinkThreeActive = "";
        this.linkThreePath = "";
        this.linkThreeTitle = "";
        this.isHideSearchBtn = true;
        this.toggleSearch = function () { };
        this.isHideAvatarBtn = false;
        this.isHideSubHeader = false;

        this.getProfileImg = function () {
            return snap.profileSession.profileImage;
        };
        this.errorShake = function () {
            $('.box').addClass('shake');
            setTimeout(function () {
                $('.box').removeClass('shake');
            }, 700);
        };
        this.onNavClick = function (e) {
            e.preventDefault();
            $('body').toggleClass('is-main-nav');
            return false;
        };

        this.checkRxNTCredentials = function () {
            var flag = snap.hasAnyPermission(snap.security.e_prescription_authorization) &&
                snap.hospitalSettings.ePrescriptions;

            if (flag) {
                var profile = JSON.parse(sessionStorage.getItem("snap_staffprofile_session"));
                snap.service.staffAccountService().getAccountInfo(profile.userId).done(function (data) {
                    if (data.data[0].rxntUserName == null || data.data[0].rxntUserName === "" || data.data[0].rxntPassword == null || data.data[0].rxntPassword === "") {
                        $snapNotification.info("The ePrescription credentials have not been set. Please add the correct credentials on your Account Settings.");
                    }
                });
            }

        }

        this.closeNav = function () {
            if ($('body').hasClass('is-main-nav')) {
                setTimeout(function () {
                    $('body').toggleClass('is-main-nav');
                }, 200);
            } else {
                this.set("isActiveHeaderDD", false);
            }
        };

        this.preventDefault = function () {
            return false;
        };
        this.onSessionStarted = function () {
            this.set("isStarted", true);
        };
        this.goToHome = function (e) {
            if (this.isStarted) {
                defaulWaitMessage();
                return false;
            }
            location.href = snap.getClinicianHome();

            this.closeNav(e);
            return false;
        };
        this.goToAccount = function () {
            if (this.isStarted) {
                defaulWaitMessage();
                return false;
            }
            try {
                if (snap.hasAllPermission(snap.security.view_staff_accounts)) {
                    viewStaffProfile(snap.profileSession.userId);
                }
                else {
                    snapInfo("You don't have permission to view Staff User details.");
                }
            }
            catch (err) {
                logError("goToAccount - ClinicianMain.html", "Error", err, "While getting Hospital Staff Account");
            }
            this.closeNav();
            return false;
        };


        this.providerChatEnabled = snap.isProviderChatEnabled();

        //Enable/Disable Patient Queue access
        //this.patientQueueEnabled = snap.isPatientQueueEnabled();

        this.isChatLoading = false;
        this.providerChat = function (e) {
            if (e) {
                e.preventDefault();
            }
            
            var $messengerViewModel = snap.resolveObject("snap.Shared.MessengerViewModel");
            if ($messengerViewModel) {
                this.set("isChatLoading", true);

                setTimeout(function () {
                    $.when($messengerViewModel.toggleChat()).then(function () {
                        $scope.set("isChatLoading", false);
                    });
                }, 10);

                this.set("isChatVisible", !this.isChatVisible);
            }
        }

        this.goToPatientRecords = function () {
            if (this.isStarted) {
                defaulWaitMessage();
                return false;
            }
            var href = "/Physician/PatientsList";
            location.href = href;

            this.closeNav();
            return false;

        };


        this.goToScheduler = function () {
            if (this.isStarted) {
                defaulWaitMessage();
                return false;
            }
            location.href = "#/scheduler";

            this.closeNav();
            return false;

        };

        this.recordConsultationEnabled = snap.canRecordConsultation();

        this.openConsultationEnabled = !snap.hospitalSettings.hideOpenConsultation && snap.hasAnyPermission(snap.security.open_consultation);
        this.goToOpenConsultation = function () {
            if (snap.hasAnyPermission(snap.security.open_consultation)) {
            var $messengerViewModel = snap.resolveObject("snap.Shared.MessengerViewModel");
            if ($messengerViewModel) {
                if ($messengerViewModel.isCallStarted()) {
                    this.closeNav();
                    $messengerViewModel.openConsulation();
                    return false;
                } else if ($messengerViewModel.isCalling()) {
                    $messengerViewModel.endCallInternal();
                }
            }
                if (this.isStarted) {
                    defaulWaitMessage();
                    return false;
                }
                location.href = "#/openconsultation";


                this.closeNav();
            } else {
                $snapNotification.error("You cannot initiate open consultation");
            }
            return false;
        }

        this.newAppointment = function () {
            if (this.isStarted) {
                defaulWaitMessage();
                return false;
            }

            snap.admin.schedule.eventDialog().openNewAppointmentDialog({
                clinicianId: snap.profileSession.userId,
                patientId: null,
                userType: snap.common.schedule.ScheduleCommon().userType.clinician
            });

            this.closeNav();
            return false;

        };

        this.recordConsultation = function() {
            if (this.isStarted) {
                defaulWaitMessage();
                return false;
            }

            snap.admin.schedule.eventDialog().openNewRecordDialog({
                clinicianId: snap.profileSession.userId,
                patientId: null,
                userType: snap.common.schedule.ScheduleCommon().userType.clinician
            });

            this.closeNav();
            return false;
        };

        this.goToConsultHistory = function () {
            if (this.isStarted) {
                defaulWaitMessage();
                return false;
            }
            var href = "/Physician/PhysicianConsultations";
            location.href = href;

            this.closeNav();
            return false;

        };

        this.goToFiles = function () {
            if (this.isStarted) {
                defaulWaitMessage();
                return false;
            }
            var href = "/Physician/MyFiles";
            location.href = href;

            this.closeNav();
            return false;

        };

        this.goToePrescrib = function (e) {
            e.preventDefault();
            e.stopPropagation();

            window.open(snap.string.formatURIComponents('/ePrescription/RxNT.aspx?token={0}&from=physician', snap.userSession.token));

            this.closeNav();
            return false;
        };

        this.goToHelpCenter = function (e) {
            e.preventDefault();
            e.stopPropagation();

            snap.openHelp('clinician');

            this.closeNav();
            return false;
        };

        this.goToTestConnect = function (e) {
            e.preventDefault();
            e.stopPropagation();

            window.open('http://tokbox.com/tools/connectivity/');

            this.closeNav();
            return false;
        };

        this.terms = function (e) {
            e.preventDefault();
            e.stopPropagation();

            window.open('/public/#/userTermsProvider', '_blank');
            return false;
        };
        this.changeClinicianStatus = function (userId, statusId, statusInformation) {
            var url = "/api/v2.1/physicians/" + userId + "/online-status";
            return $.ajax({
                url: url,
                type: 'PUT',
                dataType: 'json',
                data: JSON.stringify({
                    doctorStatus: statusId,
                    statusInformation: statusInformation
                }),
                contentType: "application/json; charset=utf-8"
            });

        };
        this.signOut = function () {
            if (this.isStarted) {
                defaulWaitMessage();
                return false;
            }
            this.changeClinicianStatus(snap.profileSession.userId, 74, "User Signout").always(function () {
                var href = snap.clinicianLogin();
                location.href = href;
            });
            this.closeNav();
            return false;
        }


        this.isStarted = false;
        this.startSession = function (e) {
            var $clinicianPage = new snap.physician.PhysicianAppointmentViewModel();
            $clinicianPage.startSession();
            e.preventDefault();
        };
        this.endSession = function (e) {
            if (e) e.preventDefault();
            var $encounterPage
            if (snap.encounterPageType && snap.encounterPageType.toLowerCase() == "phone") {
                $encounterPage = snap.resolveObject("snap.shared.encounterRoomViewModel");
            } else {
                $encounterPage = snap.resolveObject("snap.physician.PhysicianAppointmentViewModel");
            }
            $encounterPage.endSession();
        };
        this.setSubHeader = function (detailsObj) {
            var _detailsObj = detailsObj;
            if (!isEmpty(_detailsObj.subHeaderTitle))
                this.set("subHeaderTitle", _detailsObj.subHeaderTitle);

            this.set("isMenuToggleVisible", _detailsObj.isMenuToggleVisible);
            this.set("isHideSearchBtn", _detailsObj.hideSearchBtn);
            this.set("toggleSearch", _detailsObj.toggleSearch);
            this.set("isHideAvatarBtn", _detailsObj.hideAvatarBtn);

            if (_detailsObj.addButton.visible) {
                this.set("isAddButtonVisible", _detailsObj.addButton.visible);
                this.set("addButtonAction", _detailsObj.addButton.action);
            } else {
                this.set("isAddButtonVisible", false);
            };

            if (_detailsObj.panelToggle.visible) {
                this.set("isPanelToggleVisible", _detailsObj.panelToggle.visible);
                this.set("panelToggleAction", _detailsObj.panelToggle.action);
            } else {
                this.set("isPanelToggleVisible", false);
            };

            if (_detailsObj.linkOne.visible) {
                this.set("islinkOneVisible", _detailsObj.linkOne.visible);
                this.set("linkOnePath", _detailsObj.linkOne.path);
                this.set("linkOneTitle", _detailsObj.linkOne.title);
                this.set("isLinkOneActive", _detailsObj.linkOne.active);
            } else {
                this.set("islinkOneVisible", false);
            };

            if (_detailsObj.subHeaderModuleTitle) {
                this.set("isSubHeaderModuleTitleVisible", true);
                this.set("subHeaderModuleTitle", _detailsObj.subHeaderModuleTitle);
            } else {
                this.set("isSubHeaderModuleTitleVisible", false);
                this.set("subHeaderModuleTitle", "");
            }


            this.set("linkTwoPath", _detailsObj.linkTwo.path);
            this.set("linkTwoTitle", _detailsObj.linkTwo.title);
            this.set("isLinkTwoActive", _detailsObj.linkTwo.active);

            this.set("linkThreePath", _detailsObj.linkThree.path);
            this.set("linkThreeTitle", _detailsObj.linkThree.title);
            this.set("isLinkThreeActive", _detailsObj.linkThree.active);
        };

        //*********************** Provider Chat MVVM ************************/
        this.isListVisible = true;
        this.isChatPanelVisible = false;
        this.isProviderListActive = true;
        this.providerListBtn = function () {
            this.set("isListVisible", !this.isListVisible);
            this.set("isChatPanelVisible", !this.isChatPanelVisible);
            this.set("isProviderListActive", !this.isProviderListActive);
        }

        this.isChatroomVisible = false;
        this.isScreenVisible = true;
        this.isIncomingCall = false;


        //********************** PRIVATE METHODS ***************************
        this._subscribeToWaitingRoomHub = function () {
            var that = this;

            $snapWaitingRoomConsultationsHub.on("dispatchPatientQueuePatientCount", function (count) {
                that.set("vm_patienQueueCount", count);

                if (count > 0) {
                    that.set("patienQueueFlag", true);
                } else {
                    that.set("patienQueueFlag", false)
                }
            });
        };

    }).singleton();