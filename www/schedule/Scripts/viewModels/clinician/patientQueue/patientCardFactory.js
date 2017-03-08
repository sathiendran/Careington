// @sourceURL=patientCard.viewmodel.js

(function ($, snap, kendo) {
    "use strict";

    snap.namespace("snap.clinician.patientQueue").use([
            "snapNotification" ,
            "snap.admin.schedule.TimeUtils", 
            "snap.EventAggregator", 
            "snap.service.appointmentService", 
            "snap.common.timer",
            "snap.clinician.patientQueue.dismissPatientDialog",
            "snap.common.dialogWindow",
            "snap.clinician.patientQueue.notifyClinicianDialog"])
        .define("patientCardFactory", function ($snapNotification, $timeUtils, $eventAggregator, $appointmentService, $timer, $dismissPatientDialog, $dialogWindow, $notifyClinicianDialog) {
            var genderEnum = {
                male: "M",
                female: "F"
            };

            var flagEnum = {
                gray: 0, // Default Color
                blue: 1,
                green: 2,
                yellow: 3,
                red: 4
            };

            var $scope = this;

            var dismissPatientDialog = null;
            var notifyCinicianDialog = null;

            var encounterTypeCode = snap.enums.EncounterTypeCode;

            function PatientCard(patientCard, viewOpt) {
                var isConnected = true,
                    isActive = false,
                    lockOwnerName = "";
                var that = this;
               

                this.isConnected = function(newValue) {
                    if(typeof(newValue) !== "undefined") {
                        isConnected = newValue;

                        //Active and disconnected state are incompatible.
                        if(newValue) {
                            this.isActive(false);        
                        }
                        
                        
                        this.trigger("change", { field: "vm_isDisconnected" });
                        this._triggerCardFooter();
                    } 

                    return isConnected;
                };

                this.isActive = function(newValue) {
                    if(typeof(newValue) !== "undefined") {
                        // Only if patient connected we can setup it active state, otherwise it always should be false.
                        isActive = isConnected ? newValue : false;

                        this.trigger("change", { field: "vm_isActive" });

                        // if patient card unselected we need to close any open dialogs 
                        if(!isActive) {
                            if(dismissPatientDialog) {
                                dismissPatientDialog.close();
                            }
                        }
                    }

                    return isActive;
                };

                this.state = patientCard.State;
                this.doctorProfile = patientCard.DoctorProfile;
                this.appointmentId = patientCard.AppointmentId;
                this.appointmentType = patientCard.AppointmentType;
                this.patientQueueEntryId = patientCard.PatientQueueEntryId;
                this.meetingId = patientCard.MeetingId;
                this.meetingConversationCount = patientCard.MeetingConversationCount;
                this.consultationId = patientCard.ConsultationId;
                this.flag = patientCard.Flag || flagEnum.gray;
                this.isScheduled = patientCard.IsScheduled === "Y";
                this.vm_isOnDemand = !this.isScheduled;
                this.vm_isDisable = false;
                this.vm_isChatDisabled = false;
                this.vm_isNoAction = viewOpt.noAction;
                this.vm_showOptions = false;
                this.vm_isLocked = false;
                this.vm_isLoading = false;
                this.vm_isActiveFlags = false;
                this.vm_footerTitleLoading = false;

                this.isVideoType = false;
                this.isAudioType = false;
                this.isChatType = false;
                this.isVisitType = false;

                this.setEncounterType = function (typeCode) {
                    if (typeCode == encounterTypeCode.Video) {
                        this.set("isVideoType", true);
                    } else if (typeCode == encounterTypeCode.Phone) {
                        this.set("isAudioType", true);
                        this.disableChat();
                    } else if (typeCode == encounterTypeCode.Text) {
                        this.set("isChatType", true);
                    } else if (typeCode == encounterTypeCode.InPerson) {
                        this.set("isVisitType", true);
                    }
                };

                this.disableChat = function() {
                    this.updateMeetingConversationCount(0);
                    this.set("vm_isChatDisabled", true);
                };

                var notifications = patientCard.Notifications;

                this.showOptions = function(value) {
                    this.set("vm_showOptions", value);
                }

                this.addNotification = function(notifiedPersons) {
                    notifications.push({
                        NotifiedPersons: notifiedPersons
                    });

                    this.trigger("change", { field: "vm_isNotificationSent" });
                    this.trigger("change", { field: "vm_notificationInfo" });
                    this.trigger("change", { field: "vm_isYellow" });
                };

                this.updateMeetingConversationCount = function(count) {
                    this.set("meetingConversationCount", count);
                    this.trigger("change", { field: "vm_isUnread" });
                };

                this.vm_isNotificationSent = function() {
                    return this._isNotificationSent();
                };

                this.vm_notificationInfo = function() {
                    var message = "";

                    if(this._isNotificationSent()) {
                        var emails = [];

                        notifications.forEach(function(notification) {
                            notification.NotifiedPersons.forEach(function(notifiedPerson) {
                                if(emails.indexOf(notifiedPerson) < 0) {
                                    emails.push(notifiedPerson);
                                }
                            });
                        });

                        message = "Notification sent to: " + emails.map(function(email) {
                            return "<span>" + email + "</span>";
                        }).join("");
                    }

                    return message;
                };

                this._isNotificationSent = function() {
                    return Array.isArray(notifications) && notifications.length > 0;
                };

                this.vm_isScheduled = function() {
                    return this.isScheduled;
                };

                this.vm_isActive = function() {
                    return isActive;
                };
                this.vm_isDisconnected = function() {
                    return !isConnected;
                };

                this.vm_cardFoterHeaderText = function() {
                    if(!isConnected) 
                        return "Patient Offline";

                    return this.vm_isLocked ? "IN REVIEW BY" : "Primary Concern";
                };

                this.vm_cardFoterContentText = function() {
                    if(!isConnected){
                        this.set("vm_footerTitleLoading", true);  
                        return "Attempting to reconnect <span class='ellipsis'></span>";
                    }

                    return this.vm_isLocked ? lockOwnerName: this.primaryConsern;
                };

                this.vm_isUnread = function(){
                    return this.meetingConversationCount > 0;
                };
                
                this.patientName = patientCard.PatientName + " " + patientCard.PatientLastName;
                this.primaryConsern = patientCard.PrimaryConsern.replace(/^\d+\?/, "");

                this.profileImagePath = patientCard.ProfileImagePath || getDefaultProfileImageForPatient(patientCard.Gender);
                this.ageInfo = patientCard.AgeInfo;
                this.state = patientCard.State;
                this.country = patientCard.Country;
                
                this.consultationTime = "";
                this.vm_isFailedTime = false;

                this.gender = patientCard.Gender === "F" ? "Female" : "Male";
                this.defautProfileImage = "/images/default-user.jpg";
                if(patientCard.Gender === genderEnum.female) {
                    this.defautProfileImage = "/images/Patient-Female.gif";
                } else if(patientCard.Gender === genderEnum.male) {
                    this.defautProfileImage = "/images/Patient-Male.gif";
                }
                
                if(this.isScheduled) {
                    var consultationTimeInfo = $timeUtils.dateFromSnapDateString(patientCard.ConsultationTimeInfo);
                    this.consultationTime = kendo.toString(consultationTimeInfo, "h:mm tt");
                    

                    this.vm_isFailedTime = patientCard.RemainTimeInfo.indexOf("-") > -1;
                }

                this.waitingTime = "00:00:00";
                this.waitingTimeInSeconds =  patientCard.WaitTimeInfoMinute * 60 + patientCard.WaitTimeInfoSecond;

                this.getPatientCardData = function() {
                    return patientCard;
                };

                this.lock = function(physicianName) {
                    lockOwnerName = physicianName;

                    this.set("vm_isLocked", true);
                    this._triggerCardFooter();
                };

                this.unlock = function() {
                    this.set("vm_isLocked", false);
                    this._triggerCardFooter();
                };

                this.getRemainedTimeInMinutesBeforeStart = function() {
                    var remainedMinutes = patientCard.RemainTimeInfo.split(":")[0];

                    return parseInt(remainedMinutes);
                };

                this.vm_onShowOptionsClick = function(e) {
                    e.stopPropagation();

                    // We select and lock patient card, because otherwise two physicians can change patient card at a same time.
                    $eventAggregator.published("patientCard_select", this, false);

                    this.showOptions(true);
                };

                this.vm_onHideOptionsClick = function(e) {
                   e && e.stopPropagation();
                    
                    if(!this.isActive()){
                        $eventAggregator.published("patientCard_unselect", this);
                    }

                    this.showOptions(false);
                };

                this.vm_showPatientChat = function(e) {
                    e.stopPropagation();
                    $eventAggregator.published("patientCard_showChat", this);
                };

                this.vm_onPatientCardClick = function() {
                    $eventAggregator.published("patientCard_select", this, true);
                };

                this.vm_onViewProfileClick = function() {
                    $eventAggregator.published("patientCard_redirectToAccount", patientCard.PatientId);
                };

                this.vm_onStartConsultationClick = function () {
                    $eventAggregator.published("patientCard_onStartConsultationClick", {
                        patientQueueEntryId: this.patientQueueEntryId,
                        meetingId: this.meetingId,
                        consultationId: this.consultationId
                    });
                };

                this.vm_onSaveAndCloseClick = function(e) {
                    e.stopPropagation();

                    var that = this;

                    $snapNotification.confirmationWithCallbacks("Are you sure want Save and Close this consultation?", 
                        function yesCallback() {
                            that.set("vm_showOptions", false);
                            that.set("vm_isLoading", true);
                            $appointmentService.fullfillappointment(that.consultationId).done(function() {
                                $eventAggregator.published("patientCard_consultationSavedAndClosed", that.appointmentId);
                                $snapNotification.success("Consultation saved.");
                            });
                        }
                    );
                };

                this.vm_onDismissClick = function(e) {
                    e.stopPropagation();

                    if(dismissPatientDialog === null) {
                        dismissPatientDialog = $dialogWindow.createNewDialog({
                            vm: $dismissPatientDialog,
                            container: "#dismissPopUpContainer",
                            contentPath: "/content/clinician/patientQueue/dismissPatient.html?svp=snapversion"
                        });
                    }

                    dismissPatientDialog.open({
                        appointmentId: this.appointmentId,
                        isScheduled: this.isScheduled
                    });
                };
                
                this.vm_onForwardClick = function(e) {
                    e.stopPropagation();

                    if(notifyCinicianDialog === null) {
                        notifyCinicianDialog = $dialogWindow.createNewDialog({
                            vm: $notifyClinicianDialog,
                            container: "#notifyClinicianPopUpContainer",
                            contentPath: "/content/clinician/patientQueue/notifyClinician.html"
                        });
                    }

                    var clinicianProfile = null;
                    if (patientCard.DoctorProfile) {
                        clinicianProfile = {
                            userId: patientCard.DoctorProfile.UserId,
                            fullName: patientCard.DoctorProfile.Name,
                            profileImage: patientCard.DoctorProfile.ProfileImage,
                            medicalSpeciality: patientCard.DoctorProfile.MedicalSpeciality,
                            subSpeciality: patientCard.DoctorProfile.SubSpeciality
                        }
                    }

                    notifyCinicianDialog.open({
                        consultationDetails: {
                            appointmentId: patientCard.AppointmentId,
                            consultationId: patientCard.ConsultationId,
                            consultationTimeInfo: patientCard.ConsultationTimeInfo,
                            primaryConsern: patientCard.PrimaryConsern,
                            secondaryConsern: patientCard.SecondaryConsern,
                            additionNotes: patientCard.AdditionNotes,
                            appointmentType: patientCard.AppointmentType
                        },
                        patientProfile: {
                            fullName: this.patientName,
                            profileImage: patientCard.ProfileImagePath,
                            gender: patientCard.Gender,
                            ageInfo: patientCard.AgeInfo,
                            patientId: patientCard.PatientId,
                            country: patientCard.Country,
                            state: patientCard.State
                        },
                        clinicianProfile: clinicianProfile,
                        userType: $scope.userType
                    });
                };

                this.vm_onDismissClick = function(e) {
                    e.stopPropagation();

                    if(dismissPatientDialog === null) {
                        dismissPatientDialog = $dialogWindow.createNewDialog({
                            vm: $dismissPatientDialog,
                            container: "#dismissPopUpContainer",
                            contentPath: "/content/clinician/patientQueue/dismissPatient.html"
                        });
                    }

                    dismissPatientDialog.open({
                        appointmentId: this.appointmentId,
                        isScheduled: this.isScheduled
                    });
                };

                this.vm_onFlagButtonClick = function(e) {
                    e.stopPropagation();

                    this.set("vm_isActiveFlags", !this.vm_isActiveFlags);
                };

                this.vm_onFlagSelect = function(e) {
                    e.stopPropagation();

                    var flag = $(e.currentTarget).data("flag");

                    if(this.flag !== flagEnum[flag]) {
                        this.setFlag(flagEnum[flag]);
                        this.set("vm_isLoading", true);
                        
                        if(this.appointmentId) {
                            var that = this;
                            $appointmentService.setAppointmentFlag(this.appointmentId, this.flag).done(function () {
                                that.set("vm_isLoading", false);
                                $eventAggregator.published("patientCard_flagChanged");
                            }).fail(function() {
                                $snapNotification.error("API error. Cannot save flag.");
                            });
                        } else {
                            $snapNotification.error("Cannot save flag, appointment Id missed.");
                        }
                    }

                    if(!this.isActive()){
                        $eventAggregator.published("patientCard_unselect", this);
                    }

                    this.set("vm_isActiveFlags", false);

                };

                this.setFlag = function(flagKey) {
                    this.flag = flagKey;

                    this.trigger("change", { field: "vm_isGray" });
                    this.trigger("change", { field: "vm_isBlue" });
                    this.trigger("change", { field: "vm_isGreen" });
                    this.trigger("change", { field: "vm_isYellow" });
                    this.trigger("change", { field: "vm_isRed" });
                    this.trigger("change", { field: "vm_isNotGray" });
                };

                this.vm_isNotGray = function() {
                    return this.flag != flagEnum.gray;
                };

                this.vm_isGray = function() {
                    return this.flag === flagEnum.gray;
                };

                this.vm_isBlue = function() {
                    return this.flag === flagEnum.blue;
                };

                this.vm_isGreen = function() {
                    return this.flag === flagEnum.green;
                };

                this.vm_isYellow = function() {
                    return this.flag === flagEnum.yellow || (this.flag === flagEnum.gray && this.vm_isNotificationSent());
                };

                this.vm_isRed = function() {
                    return this.flag === flagEnum.red;
                };

                this._startTimer = function() {
                    var that = this;
                    var timer = $timer.createTimer({
                        time: patientCard.WaitTimeInfoMinute * 60 + patientCard.WaitTimeInfoSecond,
                        onTimerTickCallback: function(timerTick) {
                            that.set("waitingTime", [timerTick.formatted.hours, timerTick.formatted.minutes, timerTick.formatted.seconds].join(":"));
                            that.waitingTimeInSeconds = timerTick.original.hours * 3600 + timerTick.original.minutes * 60 + timerTick.original.seconds;
                        }
                    });                   

                    timer.start();
                }; 

                this._triggerCardFooter = function() {
                    this.trigger("change", { field: "vm_cardFoterHeaderText" });
                    this.trigger("change", { field: "vm_cardFoterContentText" });
                };
            };

            this.init = function(opt) {
                this.userType = opt.userType;
            };

            this.createPatientCard = function(patientCard, viewOpt) {
                var defaultViewOpt = {
                    noAction: false
                }
                
                viewOpt = $.extend({}, defaultViewOpt, viewOpt);

                var card = kendo.observable(new PatientCard(patientCard, viewOpt));
                $eventAggregator.subscriber($notifyClinicianDialog.successEvent, function (evt) {
                    if (evt.appointmentId === patientCard.AppointmentId) {
                        card.vm_onHideOptionsClick();
                    }
                });
                card.setEncounterType(patientCard.EncounterTypeCode);
                if (patientCard.IsPatientInMobile) {
                    card.disableChat();
                }
                card._startTimer();

                return card;
            };
        }).singleton();
}(jQuery, snap, kendo));