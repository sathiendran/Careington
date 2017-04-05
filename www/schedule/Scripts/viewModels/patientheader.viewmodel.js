"use strict";
snap.namespace("snap.patient")
     .use(["eventaggregator", "snapNotification", "snapHttp"])
    .extend(kendo.observable).define("PatientHeaderViewModel", function ($eventaggregator, $snapNotification, $snapHttp) {
        var $scope = this;

        this.brandName = snap.hospitalSession.brandName;
        this.clientName = snap.hospitalSession.clientName;
        this.clientImage = snap.hospitalSession.hospitalLogo;
        this.altImage = "";
        this.profileName = "";
        this.isChatVisible = false;
        this.isActiveHeaderDD = false;
        this.isFavoriteCliniciansMode = false;
        this.isAllCliniciansMode = false;
        this.moduleTitle = "";
        this.subModuleTitle = "";
        this.isHideSubHeader = false;
        this.isConsultHeader = false;
        this.getCliniciansCards = function () {
            var filters = {};

            filters.take = 0;
            filters.skip = 0;
            filters.onlyMyProviders = false;
            filters.date = new Date();
            filters.date.setHours(-24, 0, 0, 0);
            filters.date.setHours(0, 0, 0, 0);
            filters.date = SnapDateTimeShort(filters.date);
            filters.applyVisibilityRules = true;
            return $snapHttp.get("/api/v2.1/patients/appointments/self-scheduling/clinicians", filters);
        };
        this.isSelfScheduleAvailable = false;
        this.isProviderAvailable = function () {
            var $def = $.Deferred();
            if (snap.hospitalSettings.providerSearch) {
                $scope.getCliniciansCards().done(function (response) {
                    if (response.total > 0) {
                        $scope.set("isSelfScheduleAvailable", true);
                    } else {
                        $scope.set("isSelfScheduleAvailable", false);
                    }
                    $def.resolve($scope.isSelfScheduleAvailable);
                }).fail(function () {
                    if (!snap.isUnloading) { // workaround for FF specific issue (request is terminated with error when leaving the page)
                        snapError("Self Scheduling not available.")
                        $def.resolve();
                    }
                });
            } else {
                $scope.set("isSelfScheduleAvailable", false);
                $def.resolve($scope.isSelfScheduleAvailable);
            }
            return $def.promise();
        };
        this.toggleHeaderDD = function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            this.set("isActiveHeaderDD", !this.isActiveHeaderDD);
        }
        this.menuSelect = function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            this.set("isActiveHeaderDD", !this.isActiveHeaderDD);
        }

        this.closeNav = function () {
            setTimeout(function () {
                $('body').toggleClass('is-main-nav');
            }, 300);
        };

        if (snap.profileSession.profileImage) {
            var profileUrl = snap.profileSession.profileImage;
            if (profileUrl.indexOf("../") >= 0) {
                profileUrl = profileUrl.replace("../", "/");
                snap.profileSession.profileImage = profileUrl;
            }
        }
        var defaulWaitMessage = function () {
            $snapNotification.info("This function is not available during your consultation.");
            $scope.closeNav();
        };

        this.setSubHeader = function (options) {
            this.set("moduleTitle", options.module);
            this.set("subModuleTitle", options.subModule);
            this.set("isFavoriteCliniciansMode", options.viewMode === "favorite");
            this.set("isAllCliniciansMode", options.viewMode === "all");
        };

        this.user = snap.profileSession;
        $.extend(this.user, {
            age: snap.getAgeString(this.user.dob)
        });
        this.fullName = function () {
            return snap.profileSession.fullName;
        };
        this.gender = function () {
            if (this.user.gender == "M") {
                return "Male";
            } else {
                return "Female";
            }
        }
        this.onNavClick = function (e) {
            e.preventDefault();
            $('body').toggleClass('is-main-nav');
        };
        this.closeNav = function (e) {
            if (e) {
                e.preventDefault();
            }
            if ($('body').hasClass('is-main-nav')) {
                setTimeout(function () {
                    $('body').toggleClass('is-main-nav');
                }, 200);
            } else {
                this.set("isActiveHeaderDD", false);
            }
        };
        var isWaitingRoom = function () {

            if (location.hash.toLowerCase().indexOf("#/waiting") > -1) {
                return true;
            }
            return false;
        };
        var isConsultationRoom = function () {
            if (location.hash.toLowerCase().indexOf("#/consultation") > -1) {
                return true;
            }
            return false;
        };
        this.goToHome = function (e) {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }

            location.href = snap.getPatientHome();

            this.closeNav(e);
            return false;
        };
        this.goToConsultHistory = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "/Customer/PatientConsultations";
            this.closeNav();
            return false;
        };

        this.goToMyAccount = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "/Customer/Users";

            this.closeNav();
            return false;
        };
        this.goToRelatedAccounts = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "/Customer/Dependents";

            this.closeNav();
            return false;
        };
        this.goToselfScheduling = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "#/selfScheduling";

            this.closeNav();
            return false;
        };
        this.goToPastConsult = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "/Customer/PatientConsultations";

            this.closeNav();
            return false;
        };

        this.goToFiles = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "/Customer/MyFiles";

            this.closeNav();
            return false;
        };

        this.gotoProvider = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();

                return false;
            }
            location.href = "#/selfScheduling";

            this.closeNav();
            return false;
        };
        this.gotoAccountSettings = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "/Customer/AccountSettings";

            this.closeNav();
            return false;
        };
        this.gotToTC = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "#/t&C";
            return false;
        };
        this.gotoPaymentInfo = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "/Customer/AddPaymentInformation";

            this.closeNav();
            return false;
        };
        this.isPaymentRequired = function () {
            if (snap.hospitalSettings.eCommerce) {
                return true;
            }
            else {
                return false;
            }
        };
        this.gotoInsurance = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = "/Customer/HealthPlan";

            this.closeNav();
            return false;
        };
        this.isInsuranceRequired = function () {
            if (snap.hospitalSettings.insuranceVerification) {
                return true;
            } else {
                return false;
            }
        };
        this.goToHelp = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            snap.openHelp('patient');
            return false;
        };
        this.openConnectivity = function () {
            window.open('http://tokbox.com/tools/connectivity/');
            return false;
        };
        this.logout = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }
            location.href = snap.patientLogin();

            this.closeNav();
            return false;

        };
        this.preventDefaultAction = function () {
            if (isWaitingRoom() || isConsultationRoom()) {
                defaulWaitMessage();
                return false;
            }

            return false;
        };

        this.terms = function (e) {
            e.preventDefault();
            e.stopPropagation();

            window.open('/public/#/userTerms', '_blank');
            return false;
        };


        this.vm_toggleSearchAndFilter = function () {
            $eventaggregator.published("vm_toggleSearchAndFilter");
        };
    }).singleton();