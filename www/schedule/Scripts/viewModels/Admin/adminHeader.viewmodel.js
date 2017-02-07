"use strict";

snap.namespace("snap.admin")
     .use(["eventaggregator", "snapNotification", "snap.admin.schedule.eventDialog", "snap.common.schedule.ScheduleCommon", "snap.hub.mainHub", 
        "snap.hub.snapWaitingRoomConsultationsHub"])
    .extend(kendo.observable).define("AdminHeaderViewModel", function ($eventaggregator, $snapNotification, $eventDialog, $scheduleCommon, $mainHub, 
        $snapWaitingRoomConsultationsHub) {
        var $scope = this;
        this.brandName = snap.hospitalSession.brandName;
        this.subBrandName = snap.hospitalSession.subBrandName;
        this.clientName = snap.hospitalSession.clientName;
        this.clientImage = snap.hospitalSession.hospitalLogo;
        this.altImage = "";
        this.isChatVisible = true;
        this.isActiveHeaderDD = false;
        this.user = snap.profileSession;
        this.hasNewMsg = false;
        this.countNewDlg = 0;
        this.hasIncomingCall = false;
        this.activeBadgeVisible = false;
        this.vm_patienQueueCount = 0;
        this.patienQueueFlag = false;
        this.isPatientQueueEnabled = snap.isAdminPatientQueueEnabled();

        $.extend(this.user, {
            age: 0
        });
        this.initHubs = function() {
            if (this.isPatientQueueEnabled) {
                $mainHub.register($snapWaitingRoomConsultationsHub);
            
                this._subscribeToWaitingRoomHub();

                $mainHub.on("start", function() {
                    $snapWaitingRoomConsultationsHub.refreshAdminPatientQueue();
                });
            }
            return $mainHub.start();
        };
        this.gender = function () {
            if (this.user.gender == "M") {
                return "Male";
            } else {
                return "Female";
            }
        }
        this.toggleHeaderDD = function (e) {
            e.preventDefault();
            this.set("isActiveHeaderDD", !this.isActiveHeaderDD);
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

        this.goToHome = function (e) {
            e.preventDefault();
            var href = "/Admin/Main/#/analytics";
            location.href = href;

            this.closeNav();
            if (!this.isPatientQueueVisible) {
                $('#tabTwo').hide();
            }
            return false;
        };

        this.goToAccount = function (e) {
            e.preventDefault();
            try {
                if (snap.hasAllPermission(snap.security.view_staff_accounts)) {
                    ViewStaffProfile(snap.profileSession.userId);
                }
                else {
                    snapInfo("You don't have permission to view Staff User details.");
                }
            }
            catch (err) {
                logError("goToAccount - AdminMain.html", "Error", err, "While getting Hospital Staff Account");
            }

            var href = "/Admin/StaffAccount";
            location.href = href;

            this.closeNav();
            return false;
        };

        this.providerChatEnabled = false;
        this.isPatientQueueVisible = snap.isPatientQueueEnabled();

        this.providerChat = function (e) {
            if (e) {
                e.preventDefault();
            }
            var vm = new snap.Shared.MessengerViewModel();
            vm.toggleChat();
            this.set("isChatVisible", !this.isChatVisible);
            return false;
        };

       

        this.goToStaffAccount = function (e) {
            e.preventDefault();
            var href = "/Admin/StaffAccounts";
            location.href = href;

            this.closeNav();
            return false;
        };

        this.goToPatientRecords = function (e) {
            e.preventDefault();
            var href = "/Admin/Patients";
            location.href = href;

            this.closeNav();
            return false;
        };

        this.goToPatientQueue = function (e) {
            e.preventDefault();
            if (this.isPatientQueueEnabled) {
                var href = "/Admin/Main/#/patientQueue";
                location.href = href;
            } else {
                $snapNotification.info("You don't have permission to view patient queue.");
            }
            this.closeNav();
            return false;
        };

        this.goToScheduler = function (e) {
            e.preventDefault();
            location.href = "#/scheduler";

            this.closeNav();
            if (!this.isPatientQueueVisible) {
                $('#tabTwo').show();
            }
            return false;
        };

        this.goToNewAppt = function (e) {
            e.preventDefault();
            $eventDialog.openNewAppointmentDialog({
                clinicianId: snap.profileSession.userId,
                patientId: null,
                userType: snap.adminPage ? $scheduleCommon.userType.admin : $scheduleCommon.userType.clinician
            });

            this.closeNav();
            return false;
        };

        this.goToPastConsult = function (e) {
            e.preventDefault();
            var href = "/Admin/Consultations";
            location.href = href;

            this.closeNav();
            return false;
        };

        this.goToFiles = function (e) {
            e.preventDefault();
            var href = "/Admin/HospitalAdminFiles";
            location.href = href;
            return false;
        };

        this.preventDefault = function () {
            return false;
        };

        this.goToRoleManagement = function (e) {
            e.preventDefault();
            var href = "/Admin/CreateRoles";
            location.href = href;

            this.closeNav();
            return false;
        };

        this.goToSettings = function(e) {
            e.preventDefault();
            if (snap.hasAllPermission(snap.security.view_workflows)) {
                var href = "#/Settings";
                location.href = href;

                this.closeNav();
            }
            else {
                snapInfo("You don't have permission to view the Staff Settings.");
            }
            return false;
        };

        this.goToCustomReports = function (e) {
            e.preventDefault();
            var href = "/Admin/Reports";
            location.href = href;

            this.closeNav();
            return false;
        };

        this.goToePrescrib = function (e) {
            e.preventDefault();
            window.open(snap.string.formatURIComponents('/ePrescription/RxNT.aspx?token={0}&from=admin', snap.userSession.token));

            this.closeNav();
            return false;
        };

        this.gotToHelpCenter = function (e) {
            e.preventDefault();
            e.stopPropagation();

            snap.openHelp('admin');
            this.closeNav();
            return false;
        };

        this.gotToTestConnect = function (e) {
            e.preventDefault();
            e.stopPropagation();

            window.open('http://tokbox.com/tools/connectivity/');

            this.closeNav();
            return false;
        };

        this.signOut = function (e) {
            e.preventDefault();
            var href = "/Admin/Login";
            location.href = href;

            this.closeNav();
            return false;
        };

        this.terms = function(e){

            e.preventDefault();
            e.stopPropagation();

            window.open('/public/#/userTermsProvider', '_blank');
            return false;
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


        // Sub header
        this.isMenuToggleVisible = false;
        this.isMenuToggleActive = false;
        this.subHeaderTitle = "";
        this.addButtonAction = function () { };
        this.isAddButtonVisible = "";
        this.panelToggleAction = function () { };
        this.isPanelToggleMobileVisible = false;
        this.isPanelToggleVisible = "";
        this.isListIcon = true;
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
        this.isSubHeaderModuleTitleVisible = false;
        this.subHeaderModuleTitle = "";

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
        };
        this.setSubHeader = function (detailsObj) {
            var _detailsObj = detailsObj;
            if (!isEmpty(_detailsObj.subHeaderTitle))
                this.set("subHeaderTitle", _detailsObj.subHeaderTitle);
            this.set("isMenuToggleVisible", _detailsObj.isMenuToggleVisible);
            this.set("isHideSearchBtn", _detailsObj.hideSearchBtn);
            this.set("toggleSearch", _detailsObj.toggleSearch);
            this.set("isHideAvatarBtn", _detailsObj.hideAvatarBtn);
            this.set("isPanelToggleMobileVisible", _detailsObj.panelToggle.mobile);

            if (_detailsObj.addButton.visible) {
                this.set("isAddButtonVisible", _detailsObj.addButton.visible);
                this.set("addButtonAction", _detailsObj.addButton.action);
            } else {
                this.set("isAddButtonVisible", false);
            };

            if (_detailsObj.panelToggle.visible) {
                this.set("isPanelToggleVisible", _detailsObj.panelToggle.visible);
                this.set("panelToggleAction", _detailsObj.panelToggle.action);
                this.set("isListIcon", _detailsObj.panelToggle.listIcon);
                this.set("isMenuToggleActive", _detailsObj.panelToggle.isToggleActive);
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

            if (_detailsObj.linkTwo.visible) {
                this.set("islinkTwoVisible", _detailsObj.linkTwo.visible);
            } else {
                if (_detailsObj.linkTwo.path === "#/scheduler/availabilities") {
                    this.set("islinkTwoVisible", true);
                }
            };

            if(_detailsObj.subHeaderModuleTitle) {
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

        this._subscribeToWaitingRoomHub = function () {
            $snapWaitingRoomConsultationsHub.on("dispatchAdminPatientQueuePatientCount", function (count) {
                $scope.set("vm_patienQueueCount", count);
                $scope.set("patienQueueFlag", count > 0);
            });
        }

        var appointmentDismissCallback = function () {
            // decrement vm_patienQueueCount 
            var vm_patienQueueCount = --$scope.vm_patienQueueCount;
            // WTF?! ↓
            $scope.set("vm_patienQueueCount", "");
            // does not work without this ↑
            $scope.set("vm_patienQueueCount", vm_patienQueueCount);
            $scope.set("patienQueueFlag", vm_patienQueueCount > 0);
        }

        $eventaggregator.updateSubscription("patientCard_dismissed", appointmentDismissCallback);

    }).singleton();