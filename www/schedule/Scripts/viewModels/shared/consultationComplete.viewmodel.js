//@ sourceURL=consultationComplete.viewmodel.js
;
(function($, snap, kendo, global) {
    "use strict";

    snap.namespace("snap.shared")
        .use([
            "snapNotification",
            "snap.enums.consultationStatus",
            "snap.common.timeUtils",
            "snap.helper.encounterMethodHelper",
            "snap.hub.mainHub",
            "snap.service.appointmentService",
            "Snap.Reports.consultationReportService"
        ])
        .extend(kendo.observable)
        .define("consultationCompleteDialog", function(
            $snapNotification,
            $consultationStatus,
            $timeUtils,
            $encounterMethodHelper,
            $mainHub,
            $appointmentService,
            $consultationReportService
        ) {

            var $scope = this,
                $encounterTypeCode = snap.resolveObject("snap.enums.EncounterTypeCode"),
                billingStatusEnum = {
                    estimated: "Estimated",
                    paid: "Paid",
                    failed: "Failed"
                },
                consultationCompleteCodes = [$consultationStatus.endedConsultation, $consultationStatus.droppedConsultation, $consultationStatus.dismissed];

            this._consultationInfo = {};

            this.vm_contactNumber = "";
            this.vm_isContactNumberVisible = false;
            this.vm_isCardVisible = false;
            this.vm_isLoading = false;
            this.vm_errorText = "";
            this.vm_paymentStatus = "";
            this.vm_paymentMessage = "";
            this.vm_isNotified = false;
            this.vm_isPer = false;
            this.vm_moneySymbol = snap.getMoneySymbol();
            this.vm_feeValue = "00.00";

            this.patientCard = createPatientCard();
            this.encounterCard = createEncounterCard();

            //=========================================Private methods=================================================
            function Card(opt) {
                var that = this;

                this.vm_isActive = false;
                this.vm_isPopup = false;

                this._popupEl = opt && opt.popupEl ? opt.popupEl : null;

                this.vm_onOpenCardClick = function(e) {
                    e.preventDefault();
                    var card = $(e.target).closest('.js-target-card').clone();
                    card.appendTo('.consultation-complete');
                    this.trigger("card_openPopup", card);
                };

                this.open = function() {
                    that = this;
                    this.set("vm_isPopup", true);
                    window.setTimeout(function() {
                        that.set("vm_isActive", true);
                    }, 300);
                };

                this.vm_onCloseCardClick = function(e) {
                    e.preventDefault();
                    this.set("vm_isActive", false);

                    window.setTimeout(function() {
                        that.set("vm_isPopup", false);
                        if (that._popupEl) {
                            that._popupEl.remove();
                        }
                        that.trigger("card_closePopup");
                    }, 300);
                };
            }

            function PatientCard(opt) {
                Card.call(this, opt);

                this._consultationInfo = opt && opt.consultationInfo ? opt.consultationInfo : {};
                this._patientId = this._consultationInfo.patientId;
                this.vm_primaryConcern = formatConcern(this._consultationInfo.primaryConcern);
                this.vm_secondaryConcern = formatConcern(this._consultationInfo.secondaryConcern);
                this.vm_privateNote = this._consultationInfo.note || "";
                this.vm_patientProfileImage = this._consultationInfo.profileImagePath || global.getDefaultProfileImageForPatient();
                this.vm_patientFullName = [this._consultationInfo.patientName, this._consultationInfo.lastName].join(" ");

                this.vm_displayAdditionalNotes = function() {
                    return this.vm_privateNote.length;
                };

                this.vm_patientInfo = function() {
                    return this._consultationInfo.guardianName ? ("Guardian: " + this._consultationInfo.guardianName) : "Patient";
                };

                this.vm_onViewProfileClick = function(e) {
                    e.preventDefault();
                    sessionStorage.setItem("snap_patientId_ref", this._patientId);
                    window.location.href = this._patientId === snap.profileSession.profileId ? "/patient/User" : "/patient/Dependent";
                };
            }

            function EncounterCard(opt) {
                var that = this;
                Card.call(this, opt);

                this._consultationInfo = opt && opt.consultationInfo ? opt.consultationInfo : {};
                this._participants = opt && opt.participants ? opt.participants : [];

                this._consultationDuration = this._consultationInfo.consultationDuration || 0;
                this._consultationStatus = this._consultationInfo.consultationStatus || $consultationStatus.unknown;
                this._consultationDate = this._consultationInfo.consultationDate ? $timeUtils.dateFromSnapDateString(this._consultationInfo.consultationDate) : "";
                this._guestNames = [];
                this._participants.forEach(function(participant) {
                    if (participant.person && participant.person.name) {
                        var name = [participant.person.name.given, participant.person.name.family].join(" ");
                        that._guestNames.push(name);
                    }
                });

                this.vm_providerProfileImage = this._consultationInfo.providerProfilePath || global.getDefaultProfileImageForClinician();
                this.vm_providerFullName = [this._consultationInfo.doctorFirstName, this._consultationInfo.doctorLastName].join(" ");
                this.vm_serviceType = this._consultationInfo.serviceTypeName || snap.noneReportedMessage;
                this.vm_encounterTypeName = $encounterMethodHelper.getEncounterTypeName(this._consultationInfo.encounterTypeCode);

                this.vm_getStartTime = function() {
                    var ampm = kendo.toString(this._consultationDate, "tt");
                    var tz = this._consultationInfo.timezone; // todo: add timezone
                    return [kendo.toString(this._consultationDate, "h:mm"), " ", ampm, " ", tz].join("");
                };
                this.vm_getStartDate = function() {
                    return kendo.toString(this._consultationDate, "MMMM dd, yyyy");
                };
                this.vm_consultationDuration = function() {
                    if (consultationCompleteCodes.indexOf(this._consultationStatus) === -1) {
                        // if consultation is still running
                        return "Pending";
                    }

                    var minutes = Math.trunc(this._consultationDuration / 60);
                    var seconds = this._consultationDuration % 60;
                    return [minutes, "minutes ", seconds, "seconds"].join(" ");
                };

                this.vm_guestsList = function() {
                    return this._guestNames.length ? this._guestNames.join(" <br>") : "None";
                };
            }

            function formatConcern(concern) {
                var text = snap.noneReportedMessage;
                if (concern) {
                    var arrConsern = concern.split("?");
                    if (arrConsern.length > 1)
                        text = arrConsern[1];
                    else
                        text = arrConsern[0];
                }

                return text;
            }

            function createPatientCard(opt) {
                var card = kendo.observable(new PatientCard(opt));
                return card;
            }

            function createEncounterCard(opt) {
                var card = kendo.observable(new EncounterCard(opt));
                return card;
            }

            var openPopup = function(cardEl, cardVm) {
                $scope.set("vm_isCardVisible", true);
                kendo.bind(cardEl, cardVm);
                cardVm.open();
                cardVm.bind("card_closePopup", function() {
                    $scope.set("vm_isCardVisible", false);
                });
            };


            var redirectHome = function() {
                sessionStorage.removeItem("snap_consultationId_ref");
                window.setTimeout(function() {
                    window.location.href = snap.getPatientHome();
                }, 300);
            };

            var setPaymentStatus = function(paymentStatus) {
                $scope.set("vm_paymentStatus", paymentStatus);
                $scope.trigger("change", {field: "vm_isPaymentFailed"});
                $scope.trigger("change", {field: "vm_isPaymentSuccessful"});
            };

            var setPaymentDetails = function() {
                setPaymentStatus(billingStatusEnum.paid);
                $scope.set("vm_paymentMessage", "");
                var feeValue = $scope._consultationInfo.isHealthPlanApply ? $scope._consultationInfo.copayAmount : 
                    $scope._consultationInfo.consultationAmount;
                $scope.set("vm_feeValue", feeValue || "00.00");
            };
            //=========================================================================================================



            //==========================================MVVM Properties================================================
            this.vm_isPaymentFailed = function() {
                return this.vm_paymentStatus === billingStatusEnum.failed;
            };
            this.vm_isPaymentSuccessful = function() {
                return this.vm_paymentStatus === billingStatusEnum.paid;
            };
            //=========================================================================================================



            //===========================================MVVM Events===================================================
            this.vm_onSubmitClick = function(e) {
                e.preventDefault();
                redirectHome();
            };

            this.vm_onHelpCenterClick = function(e) {
                e.preventDefault();
                snap.openHelp("patient");
            };

            this.vm_onViewReportClick = function(e) {
                e.preventDefault();
                $consultationReportService.show(this._consultationId, "standard");
            };

            this.vm_onDownloadReportClick = function(e) {
                e.preventDefault();
                $consultationReportService.download(this._consultationId, "standard");
            };
            //=========================================================================================================





            //=======================================Public Methods====================================================

            this.load = function(consultationId) {
                if (!consultationId) {
                    redirectHome();
                    return;
                }

                this._consultationId = consultationId;
                this.set("vm_isCardVisible", false);
                this.set("vm_contactNumber", snap.hospitalSession.contactNumber || snap.hospitalSession.itDepartmentContactNumber );
                this.set("vm_isContactNumberVisible", !!this.vm_contactNumber);

                if (!$mainHub.isHubStarted()) {
                    $mainHub.start();
                }

                $appointmentService.getConsultationDetails(consultationId).then(function(response) {
                    var consultDetails = response.data[0];
                    var participants = consultDetails.participants;
                    $scope._consultationInfo = consultDetails.details[0];


                    $scope.set("patientCard", createPatientCard({
                        consultationInfo: $scope._consultationInfo
                    }));
                    $scope.set("encounterCard", createEncounterCard({
                        consultationInfo: $scope._consultationInfo, 
                        participants: participants
                    }));

                    $scope.patientCard.bind("card_openPopup", function(cardEl) {
                        var vm = createPatientCard({
                            consultationInfo: $scope._consultationInfo,
                            popupEl: cardEl
                        });
                        openPopup(cardEl, vm);
                    });
                    $scope.encounterCard.bind("card_openPopup", function(cardEl) {
                        var vm = createEncounterCard({
                            consultationInfo: $scope._consultationInfo, 
                            participants: participants,
                            popupEl: cardEl
                        });
                        openPopup(cardEl, vm);
                    });


                    $scope.set("vm_isNotified", consultationCompleteCodes.indexOf($scope._consultationInfo.consultationStatus) === -1);
                    $scope.set("vm_isPer", !$scope.vm_isNotified);

                    setPaymentDetails();
                }, function() {
                    $snapNotification.error("Failed to load consultation details.");
                    redirectHome();
                });
            };
            //=========================================================================================================


        }).singleton();
}(jQuery, snap, kendo, window));