
/// <reference path="../../jquery-2.1.3.js" />

/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../snap.platformHelper.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/loadingcoremodule.js" />
/// <reference path="../../core/snapNotification.js" />
/// <reference path="../../core/snapHttp.js" />
/// <reference path="../../core/utility.js" />
/// <reference path="../../viewModels/header.viewmodel.js" />
/// <reference path="../../snap.enums.js" />
/// <reference path="tookBoxViewModel.js" />



; (function ($) {


    //snap.physician namespace
    // define the PhysicianLandingViewModel

    var getEmptyConsultationSoap = function () {
        return {
            subjective: "",
            objective: "",
            medicalAllergies: "",
            currentMedications: "",
            assessment: "",
            plan: "",
            consultationId: snap.consultationSession ? snap.consultationSession.consultationId : null,
            cptCode: "", //cptCode Obsolet
            userId: "",
            patientId: ""
        };
    },
    getEmptyConsultation = function () {
        return {
            consultationId: snap.consultationSession ? snap.consultationSession.consultationId : null,
            consultantUserId: 0,
            consultationDate: "",
            assignedDateTime: "",
            conferenceKey: "",
            assignedDoctorId: "",
            primaryConcern: "",
            secondaryConcern: "",
            isScheduled: false,
            note: "",
            patientId: 0
        };
    }, getNoneIfEmptyOrNull = function (info) {
        if (info == null || info == undefined || info == "") {
            return "None"
        }
        return info;
    },
    getMedicalCodeId = function (medicalCode) {
        if (medicalCode) {
            return medicalCode.hasOwnProperty("medicalCodeID") ? medicalCode.medicalCodeID : null;
        }

        return null;
    };

    snap.namespace("snap.physician").use(["Helper", "snapNotification", "snapHttp", "snapLoader", "eventaggregator", "snap.service.appointmentService",
        "snap.hub.MeetingHub", "snap.Service.MessengerService"])
         .extend(kendo.observable)
        .define("PatientViewModel", function ($helper,$snapNotification, $snapHttp, $snapLoader, $eventaggregator, $service, $meetingHub, $messengerService) {
            var currentViewModel = this;

            var encounterTypeCode = snap.enums.EncounterTypeCode;

            var fixedProfileMissingData = function (profileData) {

                
                if (!profileData["address"]) {
                    profileData["address"] = "N/A";
                }
                if (!profileData["age"]) {
                    profileData["age"] = "N/A";
                }
                if (!profileData["ageGender"]) {
                    profileData["ageGender"] = "N/A";
                }
                if (!profileData["gender"]) {
                    profileData["gender"] = "N/A";
                }
                if (!profileData["bloodType"]) {
                    profileData["bloodType"] = "N/A";
                }
                if (!profileData["ethnicity"]) {
                    profileData["ethnicity"] = "N/A";
                }

                if (!profileData["dob"]) {
                    profileData["dob"] = "N/A";
                }
                if (!profileData["eyeColor"]) {
                    profileData["eyeColor"] = "N/A";
                }
                if (!profileData["dobInfo"]) {
                    profileData["dobInfo"] = "N/A";
                }


                if (!profileData["fullName"]) {
                    profileData["fullName"] = "N/A";
                }
                if (!profileData["guardianName"]) {
                    profileData["guardianName"] = "N/A";
                }

              
                if (!profileData["hairColor"]) {
                    profileData["hairColor"] = "N/A";
                }
                if (!profileData["height"]) {
                    profileData["height"] = "N/A";
                }
                if (!profileData["homePhone"]) {
                    profileData["homePhone"] = "N/A";
                }
                //To check undefined for patient's home phone
                if (typeof profileData["homePhone"] === "undefined" || profileData["homePhone"] === "undefined") {
                    profileData["homePhone"] = "N/A";
                }
                if (!profileData["isActive"]) {
                    profileData["isActive"] = false;
                }
                if (!profileData["isChild"]) {
                    profileData["isChild"] = false;
                }

                if (!profileData["lastName"]) {
                    profileData["lastName"] = "";
                }
                if (!profileData["isDependent"]) {
                    profileData["isDependent"] = false;
                }
                if (!profileData["mobilePhone"]) {
                    profileData["mobilePhone"] = "N/A";
                }
                //To check undefined for patient's cell phone
                if (typeof profileData["mobilePhone"] === "undefined" || profileData["mobilePhone"] === "undefined") {
                    profileData["mobilePhone"] = "N/A";
                }
                if (!profileData["patientName"]) {
                    profileData["patientName"] = "";
                }
                if (!profileData["pharmacyContact"]) {
                    profileData["pharmacyContact"] = "N/A";
                }

                if (!profileData["weight"]) {
                    profileData["weight"] = "N/A";
                }
                if (!profileData['primaryPhysician']) {
                    profileData["primaryPhysician"] = "N/A";
                }

                if (!profileData['primaryPhysicianContact']) {
                    profileData["primaryPhysicianContact"] = "N/A";
                }

                if (!profileData['preferedPharmacy']) {
                    profileData["preferedPharmacy"] = "N/A";
                }
                if (!profileData['pharmacyContact']) {
                    profileData["pharmacyContact"] = "N/A";
                }
                if (!profileData['physicianSpecialist']) {
                    profileData["physicianSpecialist"] = "N/A";
                }
                if (!profileData['physicianSpecialistContact']) {
                    profileData["physicianSpecialistContact"] = "N/A";
                }
              
                if (!profileData['profileImagePath']) {
                    profileData["profileImagePath"] = getDefaultProfileImageForPatient(profileData["gender"]);
                }

                
            };
            this.hasNewMsg = false;
            this.countNewMsg = 0;

            this.vm_noNewMessages = function() {
                return !this.hasNewMsg;
            };
            this.vm_openChat = function() {
                this.set("hasNewMsg", false);
                this.set("countNewMsg", 0);
                this.trigger("change", { field: "vm_noNewMessages"});
                $meetingHub.updateParticipantLastRead(snap.consultationSession.meetingId, snap.consultationSession.personId);
                $eventaggregator.publish("onOpenConsultationChat");

            };
            this.init = function(participantType) {
                initChatEvents(participantType);
                if (participantType == snap.ParticipantType.Physician) {
                    initProviderUI();
                } else if (participantType == snap.ParticipantType.Patient){
                    initPatientUI();
                } else {
                    initGuestUI();
                }
            };
            this.updateUnreadMessagesCount = function() {
                if (snap.consultationSession.meetingId && snap.consultationSession.personId) {
                    $messengerService.getUnreadConversationsCount(snap.consultationSession.meetingId, snap.consultationSession.personId).done(function(data) {
                        if(data.data[0] > 0) {
                            currentViewModel.set("countNewMsg", data.data[0]);
                            currentViewModel.set("hasNewMsg", true);
                        } else {
                            currentViewModel.set("countNewMsg", 0);
                            currentViewModel.set("hasNewMsg", false);
                        }
                        currentViewModel.trigger("change", {field: "vm_noNewMessages"});
                    });
                }
            };
            var initChatEvents = function(participantType) {
                if (participantType == snap.ParticipantType.Physician || participantType == snap.ParticipantType.Patient) { 
                    $meetingHub.on("onConsultationMessageReceived", function() {
                        if (!$(".chattab").hasClass("k-state-active")) {
                            currentViewModel.set("hasNewMsg", true);
                            currentViewModel.set("countNewMsg", currentViewModel.countNewMsg + 1);
                            playSound();
                            currentViewModel.trigger("change", {field: "vm_noNewMessages"});
                        } else {
                            $meetingHub.updateParticipantLastRead(snap.consultationSession.meetingId, snap.consultationSession.personId);
                        }
                    });
                } else {
                    if ($meetingHub.isHubStarted()) {
                        $meetingHub.updateParticipantLastRead(snap.consultationSession.meetingId, snap.consultationSession.personId);
                    } else {
                        $meetingHub.on("start", function() {
                            $meetingHub.updateParticipantLastRead(snap.consultationSession.meetingId, snap.consultationSession.personId);
                        })
                    }
                }
            };

            var playSound = function() {
                var sound = $messengerService.getRingtone("incommingMessage");
                soundPlayer = new Audio(sound);
                soundPlayer.play();
            };

            this.profileFirstName = function () {
                if (this.screenType == 3) {
                    return sessionStorage.getItem("participantName");
                }
                return this.patientInfomation.patientName;
            }
            this.profileImage = function () {
                if (this.screenType == 3) {
                    return "/images/default-user.jpg";
                }
                return this.patientInfomation.profileImagePath;
            },
            this.profileLastName = function () {
                if (this.screenType == 3) {
                    return "";
                }
                return this.patientInfomation.lastName;
            }
            this.mobileInfoPanel = false;
            this.toggleMobileInfoPanel = function (e) {
                e.preventDefault();

                var consultOptionsScope = snap.shared.TokboxViewModel();
                consultOptionsScope.set('infoPanel', !consultOptionsScope.infoPanel);
                this.set('mobileInfoPanel', !this.mobileInfoPanel);
            }
            this.isGuestUser = function () {
                return this.screenType == 3;
            };
            this.showIntakeForm = true;
            this.showSoap = true;
            this.showFiles = true;
            this.showRx = snap.hospitalSettings.ePrescriptions || snap.hospitalSettings.rxNTPM || snap.hospitalSettings.rxNTEHR;
            this.screenType = 1;
            var initGuestUI = function () {
                this.screenType = 3;
            };
            var initPatientUI = function () {
                this.screenType = 2;
                this.showIntakeForm = true;
                this.showSoap = false;
                this.showFiles = false;
                this.showRx = false;
            };
            this.setAppointmentData = function (_data) {
                this.isVideoType = false;
                this.isAudioType = false;
                this.isChatType = false;
                this.isVisitType = false;
                _data = _data[0];
              
              
               if (_data.clinicianInformation) {
                   _data.clinicianInformation.medicalSpeciality = _data.clinicianInformation.medicalSpeciality || "";
                   _data.clinicianInformation.email = _data.clinicianInformation.email || "";

               }
                var data = _data.consultationInfo;
                if (_data.soapNote) {
                    currentViewModel.set("soapNote", _data.soapNote);
                }
                if (_data.dependentInformation) {
                    $.each(_data.dependentInformation, function () {
                        fixedProfileMissingData(this);

                    });
                    currentViewModel.set("caregivers", {
                        data: _data.patientInformation.guardians
                    });
                }
               
                
                if (_data.patientInformation) {
                    if ($helper) {
                        $helper.replaceUndefinedFromJSON(_data.patientInformation);
                        fixedProfileMissingData(_data.patientInformation);

                        
                    }
                }

                if(typeof data.note  === "undefined") {
                    data.note = null;
                }

                currentViewModel.set("patientInfomation", _data.patientInformation);

                 var genderFullName =  currentViewModel.patientInfomation.gender;
                if(currentViewModel.patientInfomation.gender === "M") {
                    genderFullName = "Male";
                } else if(currentViewModel.patientInfomation.gender === "F") {
                    genderFullName = "Female";
                }
                currentViewModel.set("patientInfomation.genderFullName", genderFullName);

                currentViewModel.trigger("change", { field: "profileFirstName" });
                currentViewModel.trigger("change", { field: "profileLastName" });
                currentViewModel.trigger("change", { field: "isGuestUser" });
                currentViewModel.trigger("change", { field: "profileImage" });

                

               
                if (_data.intakeForm) {
                    //Once Just add the Birth Histry info if not available in order to work binding properly
                    if (!_data.intakeForm['isOneYearBelowChild']) {
                        _data.intakeForm['isOneYearBelowChild'] = false;
                    }
                    if (!_data.intakeForm['isChildBornVaginally']) {
                        _data.intakeForm['isChildBornVaginally'] = "";
                    }
                    if (!_data.intakeForm['isChildBornFullTerm']) {
                        _data.intakeForm['isChildBornFullTerm'] = "";
                    }
                    if (!_data.intakeForm['isChildDischargeMother']) {
                        _data.intakeForm['isChildDischargeMother'] = "";
                    }
                    if (!_data.intakeForm['isVaccinationUpToDate']) {
                        _data.intakeForm['isVaccinationUpToDate'] = "";
                    }
                    if (!_data.intakeForm['patientFirstName']) {
                        _data.intakeForm['patientFirstName'] = "";
                    }
                    if (!_data.intakeForm['patientLastName']) {
                        _data.intakeForm['patientLastName'] = "";
                    }
                    if (!_data.intakeForm['medicationAllergiesInfo']) {
                        _data.intakeForm['medicationAllergiesInfo'] = "None";
                    }
                    if (!_data.intakeForm['medicalConditionInfo']) {
                        _data.intakeForm['medicalConditionInfo'] = "None";
                    }
                    if (!_data.intakeForm['takingMedicationsInfo']) {
                        _data.intakeForm['takingMedicationsInfo'] = "None";
                    }
                    currentViewModel.set("intakeForm", _data.intakeForm);
                }
            
             
                if (data) {
                    if ($helper) {
                        $helper.replaceUndefinedFromJSON(data);
                    }
                }

                if (_data.consultationInfo.encounterTypeCode) {
                    var typeCode = _data.consultationInfo.encounterTypeCode;
                    if (typeCode == encounterTypeCode.Video) {
                        currentViewModel.set("isVideoType", true);
                    } else if (typeCode == encounterTypeCode.Phone) {
                        currentViewModel.set("isAudioType", true);
                    } else if (typeCode == encounterTypeCode.Text) {
                        currentViewModel.set("isChatType", true);
                    } else if (typeCode == encounterTypeCode.InPerson) {
                        currentViewModel.set("isVisitType", true);
                    }
                }

                currentViewModel.set("consultationInfomation", data);
                currentViewModel.set("consultationInfomation.primaryConcern", getNoneIfEmptyOrNull(data.primaryConcern));
                currentViewModel.set("consultationInfomation.secondaryConsern", getNoneIfEmptyOrNull(data.secondaryConsern));
                currentViewModel.set("consultationInfomation.consultantUserId", data.consultantUserId);
                currentViewModel.set("consultationInfomation.patientId", data.patientId);

                if (!isMobile.any()) {
                    jQuery('body').on('click', 'a[href^="tel:"]', function (e) {
                        e.preventDefault();
                    });
                }
            };

            this.fromPatient = false;

            this.soapNote = getEmptyConsultationSoap();
            this.secondaryMedicalCode = null;
            this.ctpMedicalCode = null;
            this.IsChatEnabled = false;
            this.chatValue = "";
            this.chatContainerWidth = "300px";
            this.consultationInfomation = getEmptyConsultation();
            this.isMedicationAllergiesAvailable = function () {
                return this.get("intakeForm").medicationAllergies.length > 0;
            };
            this.isTakingMedicationsAvailable = function () {
                return this.get("intakeForm").takingMedications.length > 0;
            };
            this.isMedicalConditionAvailable = function () {
                return this.get("intakeForm").medicalCondition.length > 0;
            };
            this.isPrimaryPhysicianAvailable = function () {
                var physician = this.get("patientInfomation").primaryPhysician;
                return physician != null && physician != undefined && physician != "";
            },
            this.isPreferedPharmacyAvailable = function () {
                var preferedPharmacy = this.get("patientInfomation").preferedPharmacy;
                return preferedPharmacy != null && preferedPharmacy != undefined && preferedPharmacy != "";
            };
            this.isDepedentInformationAvailable = function () {
                var patient = this.get("depedentInformation");

                if (patient && patient.data && $.isArray(patient.data)) {
                    return patient.data.length > 0;
                }

                return false;
            };
            this.isParent = function () {
                var paatInfo = this.get("patientInfomation")
                if (paatInfo.isDependent == "N") {
                    return false;
                } else {
                    return true;
                }
            };
            this.isPriorSurgeoriesAvailable = function () {
                return this.get("intakeForm").priorSurgeories.length > 0;
            };
            this.intakeForm = {
                subjective: "",
                objective: "",
                assessment: "",
                plan: "",
                patientId: 0,
                consultantUserId: 0,
                timeDifference: "",
                patientFirstName: "",
                patientLastName: "",
                patientName: "",
                guardianFirstName: "",
                guardianLastName: "",
                guardianName: "",
                dateOfBirth: "",
                medicalCondition1: "",
                medicalCondition2: "",
                medicalCondition3: "",
                medicalCondition4: "",
                medicalConditionId1: "",
                medicalConditionId2: 0,
                medicalConditionId3: 0,
                medicalConditionId4: 0,
                allergicMedication1: "",
                allergicMedication2: "",
                allergicMedication3: "",
                allergicMedication4: "",
                allergicMedicationId1: 0,
                allergicMedicationId2: 0,
                allergicMedicationId3: 0,
                allergicMedicationId4: 0,
                takingMedication1: "",
                takingMedication2: "",
                takingMedication3: "",
                takingMedication4: "",
                priorSurgery1: "",
                priorSurgery2: "",
                priorSurgery3: "",
                isVaccinationUpToDate: "",
                isOneYearBelowChild: false,
                isChildBornVaginally: "",
                isChildBornFullTerm: "",
                isChildDischargeMother: "",

                hospitalId: 0,
                medicationAllergiesInfo: "",
                medicationAllergies: [],

                takingMedications: [],

                medicalCondition: [],
                priorSurgeories: [],


            };
            this.patientHomePhoneLink = function () {
                if (this.get("patientInfomation").homePhone)
                    return ["tel:", this.get("patientInfomation").homePhone].join("");
                else
                    return "javascript:void(0);";
            };
            this.patientEmailLink = function () {
                return ["mailto:", this.get("patientInfomation").email].join("");
            };
            this.patientMobilePhoneLink = function () {
                if (this.get("patientInfomation").mobilePhone)
                    return ["tel:", this.get("patientInfomation").mobilePhone].join("");
                else
                    return "javascript:void(0);";
            };
            this.formatWeight = function () {
                var unit = this.get("patientInfomation").weightUnit,
                    weightValue = this.get("patientInfomation").weight;

                return (weightValue == "N/A") ? "N/A" : (weightValue + unit);

            };
            this.formatHeight = function () {
                var unit = this.get("patientInfomation").heightUnit,
                    hMajor = this.get("patientInfomation").heightMajor == "N/A" ? 0 : this.get("patientInfomation").heightMajor,
                    hMinor = this.get("patientInfomation").heightMinor == "N/A" ? 0 : this.get("patientInfomation").heightMinor,
                    imperialFormat = hMajor + "ft " + hMinor + "in",
                    metricFormat = hMajor + "m " + hMinor + "cm",
                    height = this.get("patientInfomation").height;

                if (height == "N/A") {
                    return "N/A"
                } else {
                    return unit == "ft/in" ? imperialFormat : metricFormat;
                }
            };
            this.patientInfomation = {
                patientId: 0,
                age: 0,
                familyGroup: {
                    familyGroupId: 188,
                    primaryPhysician: null,
                    primaryPhysicianContact: null,
                    physicianSpecialist: null,
                    physicianSpecialistContact: null,
                    preferedPharmacy: null,
                    pharmacyContact: null,
                    familyPediatrician: null,
                    familyPediatricianContact: null,
                    address: null
                },
                patientName: "",
                dob: "",
                ethnicity: "",
                bloodType: "",
                hairColor: "",
                eyeColor: "",
                gender: "",
                schoolName: "",
                schoolContact: "",
                isDependent: "",
                isChild: "",
                isActive: "",
                profileImagePath: "",
                homePhone: "",
                mobilePhone: "",
                primaryPhysician: null,
                primaryPhysicianContact: null,
                physicianSpecialist: null,
                physicianSpecialistContact: null,
                preferedPharmacy: null,
                pharmacyContact: null,
                familyPediatrician: null,
                familyPediatricianContact: null,
                address: "",
                lastName: "",
                city: "",
                state: "",
                zipCode: "",
                stateId: "",
                rxNtPatientId: null,
                hospitalId: "",
                height: "",
                heightMajor: "",
                heightMinor: "",
                weight: "",
                country: null,
                heightUnit: null,
                weightUnit: null,
                fullName: "",
                ageGender: ""
            };
            this.depedentInformation = {
                data: []
            };

            this.updatePatientNumber = function (number) {
                if (number) {
                    currentViewModel.set("patientInfomation.mobilePhone", number);
                }
            };

            this.onSaveClick = function (ee) {
                ee.preventDefault();

                var soapNote = this.get("soapNote");

                var medCodes = [];
                var primaryCodes = $("#primaryMedCodesSelect").val();
                var secondaryCodes = $("#secondaryMedCodesSelect").val();

                if (primaryCodes)
                {
                    medCodes = medCodes.concat(primaryCodes);
                }

                if (secondaryCodes)
                {
                    medCodes = medCodes.concat(secondaryCodes);
                }

                var consultationCodes = {
                    consultationId: soapNote.consultationID,
                    medicalCodesIds: medCodes
                };

                $service.saveMedicalCodeForConsultation(consultationCodes).fail(function () {
                    $snapNotification.error("Failed to save medical code");
                });

                var _data = this.get("soapNote").toJSON();

                $service.saveSoapData(_data).then(function () {
                    $snapNotification.success("Saved Successfully.")
                }).fail(function () {
                    $snapNotification.error("Save Fail.")
                });

                return false;
            };

            var loadSelect2 =function($select2, options) {
                
                if (options && options.medicalCodes) {
                    options.medicalCodes.forEach(function (medCode) {
                        var option = $('<option selected="selected"/>').text(medCode.text).val(medCode.id);
                        $select2.append(option);
                    })

                    $select2.select2({
                        minimumInputLength: 1,
                        ajax: {
                            url: [snap.baseUrl, "/api/v2/physicians/medicalcodes"].join(""),
                            dataType: 'json',
                            delay: 250,
                            data: function (params) {
                                var descriptionFilter = "";
                                if (params.term) {
                                    descriptionFilter = params.term.split('.').join("");
                                }

                                var queryParameters = {
                                    medicalSystem: options.medicalSystem,
                                    descriptionFilter: descriptionFilter
                                }

                                return queryParameters;
                            },
                            processResults: function (responce) {
                                var selectedCodes = $select2.val() || [];
                                var result = responce.data.filter(function(code) {
                                    return !selectedCodes.find(function(el) {
                                        return +el === code.id;
                                    });
                                });
                                return {
                                    results: result
                                };
                            }
                        }
                    });
                }
            };

            var initProviderUI = function () {
            
                $service.getHospitalMedicaCodingConfiguration(snap.consultationSession.consultationId).then(function (response) {
                    if (response.success) {
                        var consultationDetails = response.data;

                        currentViewModel.set("hospitalMedicaCodingConfiguration", consultationDetails);
                        currentViewModel.trigger("change", { field: "hospitalMedicaCodingConfiguration" });

                        loadSelect2($("#primaryMedCodesSelect"), { medicalSystem: consultationDetails.primaryCodingSystemName, medicalCodes: consultationDetails.primaryMedicaCodes })
                        loadSelect2($("#secondaryMedCodesSelect"), { medicalSystem: consultationDetails.secondaryCodingSystemName, medicalCodes: consultationDetails.secondaryMedicaCodes })
                    } else {
                        $snapNotification.error(response.message);
                    }
                });
            };
            this.fullscreen = false;


            $eventaggregator.subscriber("fullscreen", function (data) {
                currentViewModel.set("fullscreen", data);
            });
            
            $eventaggregator.subscriber("clientconnected", function (flag) {
                currentViewModel.set("clientConnected", flag);
            });
            this.clientConnected = false;

        }).singleton();


}(jQuery));