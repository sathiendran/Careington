/// <reference path="../../../Customer/PaymentSuccess.aspx" />
; (function ($) {
    var currentIntakeStep = 1;
    var intakeHeader1 = "Select Patient";
    var cancelPaymentNote = "#btnProceedCancel";

    var specialCodes = {
        OtherPrimary: -1,
        OtherSecondary: -2,
        Choose: -3
    };

    var response = [];
    var wrapValue = function (value) {
        return typeof (value) === "undefined" ? "" : value;
    };
    var isNumeric = function (input) {
        return (/^-{0,1}\d*\.{0,1}\d+$/.test(input));
    };
    var goToWaitingRoom = function () {
        sessionStorage.setItem("consultationinitaction", "1");
        snap.submitForm({
            url: "/Customer/Main/#/Waiting",
            method: "POST"
        }, {
            consultationId: snap.consultationSession.consultationId,
            token: snap.userSession.token
        });

    };

    var getSurgeryValidation = function (surgeryVal, monthVal, yearVal, dobYear, dobMonth, validationResult) {
        var date = new Date();
        if (!(surgeryVal == "")) {
            if (!isNumeric(yearVal)) {
                validationResult.valid = false;
                validationResult.message += "Please select valid Year of your surgery.</br>";
                return validationResult;
            }
            if (!isNumeric(monthVal)) {
                validationResult.valid = false;
                validationResult.message += "Please select valid Month of your surgery.</br>";
                return validationResult;
            } else {
                if (parseInt(monthVal) <= 0 || parseInt(monthVal) > 12) {
                    validationResult.valid = false;
                    validationResult.message += "Please select valid Month of your surgery.</br>";
                    return validationResult;
                }
            }
            if (parseInt(monthVal) == 0 && yearVal == "") {
                validationResult.valid = false;
                validationResult.message += "Please select valid Month and Year of your surgery.</br>";
                return validationResult;
            }
            if (parseInt(monthVal) == 0) {
                validationResult.valid = false;
                validationResult.message += "Please select the Month of your surgery.</br>";
                return validationResult;
            } else if (yearVal == "") {
                validationResult.valid = false;
                validationResult.message += "Please select the Year of your surgery.</br>";
                return validationResult;
            } else if (parseInt(yearVal) < parseInt(dobYear)) {
                validationResult.valid = false;
                validationResult.message += "Please correct the year of your surgery, it cannot be before your Date of Birth.</br>";
                return validationResult;
            } else if (parseInt(yearVal) == parseInt(dobYear)) {
                if (parseInt(monthVal) < parseInt(dobMonth)) {
                    validationResult.valid = false;
                    validationResult.message += "Please correct the month of your surgery, it cannot be before your Date of Birth.</br>";
                    return validationResult;
                } else if (parseInt(dobYear) == date.getFullYear()) {
                    if (parseInt(monthVal) > (date.getMonth() + 1)) {
                        validationResult.valid = false;
                        validationResult.message += "Please correct the month of your surgery, you have selected a date that is in the future.</br>";
                        return validationResult;
                    }
                }
            } else if ((parseInt(yearVal) > date.getFullYear())) {
                validationResult.valid = false;
                validationResult.message += "Please correct the year of your surgery, you have selected a date that is in the future.</br>";
                return validationResult;
            } else if (parseInt(yearVal) == date.getFullYear()) {
                if (parseInt(monthVal) > (date.getMonth() + 1)) {
                    validationResult.valid = false;
                    validationResult.message += "Please correct the month of your surgery, you have selected a date that is in the future.</br>";
                    return validationResult;
                }
            }
        }
        return validationResult;
    };

    var intakeDataSources = {
        medicalConditionsSrc: "MedicalConditionsSrc",
        medicalAllergiesSrc: "MedicalAllergiesSrc",
        patientMedicationSrc: "PatientMedicationSrc",
        primaryConcernSrc: "PrimaryConcernSrc",
        secondaryConcernSrc: "SecondaryConcernSrc"
    };

    var getNewDataSource = function (dataSources) {
        var DataSrc = null;
        var hospitalId = snap.hospitalSession.hospitalId;
        var intakeDS = Snap.Patient.PatientIntakeDataSources();

        switch (dataSources) {
            case intakeDataSources.medicalConditionsSrc:
                DataSrc = intakeDS.GetMedicalConditionsSrc(hospitalId);
                break;
            case intakeDataSources.medicalAllergiesSrc:
                DataSrc = intakeDS.GetMedicalAllergiesSrc(hospitalId);
                break;
            case intakeDataSources.patientMedicationSrc:
                DataSrc = intakeDS.GetPatientMedicationSrc(hospitalId);
                break;
            case intakeDataSources.primaryConcernSrc:
                DataSrc = intakeDS.GetPrimaryConcernSrc(hospitalId);
                break;
            case intakeDataSources.secondaryConcernSrc:
                DataSrc = intakeDS.GetSecondaryConcernSrc(hospitalId);
                break;
        }

        return DataSrc;
    };

    var createViewModelForCombobox = function (defaultValue, dsName, listSourceVm) {
        return kendo.observable({
            CodeId: defaultValue,
            DataSrc: getNewDataSource(dsName),

            GetSelectedItem: function () {
                if (this.CodeId === specialCodes.Choose) {
                    return null;
                }

                var description = "";
                var data = this.DataSrc.data();

                for (var i = 0; i < data.length; i++) {
                    if (data[i].CodeId == this.CodeId) {
                        description = data[i].Description;
                        break;
                    }
                }

                return {
                    code: this.CodeId,
                    description: description
                };
            },

            onChange: function () {
                listSourceVm.tiggerNoneCheckbox();
            }
        });
    };

    var wrapListSource = function (sourceItems, dsName) {
        var result = kendo.observable({
            None: true,
            items: new Array(),

            tiggerNoneCheckbox: function () {
                var setToNone = true;
                for (var i = 0; i < this.items.length; i++) {
                    var selectedItem = this.items[i].GetSelectedItem();
                    if (!(isEmpty(selectedItem) || isEmpty(selectedItem.code))) {
                        var si = this.items[i].GetSelectedItem();
                        setToNone = false;
                        break;
                    }
                }

                this.set("None", setToNone);
            }
        });


        var i;
        if (!sourceItems || sourceItems.length === 0) {
            result.None = true;
            for (i = 0; i < 4; i++) {
                result.items.push(createViewModelForCombobox(specialCodes.Choose, dsName, result));
            }

        } else {

            for (i = 0; i < sourceItems.length; i++) {
                if (sourceItems[i]["code"] != specialCodes.Choose) {
                    result.None = false;
                }
                result.items.push(createViewModelForCombobox(sourceItems[i].code, dsName, result));
            }
            for (i = sourceItems.length; i < 4; i++) {
                result.items.push(createViewModelForCombobox(specialCodes.Choose, dsName, result));
            }
        }

        return result;
    };

    var extractFromListSource = function (ls) {
        if (ls.None) {
            return null;
        }
        var arr = [];
        for (var i = 0; i < ls.items.length; i++) {
            var item = ls.items[i].GetSelectedItem();
            if (item != null) {
                arr.push(item);
            }
        }
        return arr;
    };
    var wrapSurgeries = function (sourceItems, years, dobYear, dobMonth) {
        var result = { None: true, items: new Array(), dobYear: dobYear, dobMonth: dobMonth };
        var i;
        if (!sourceItems || sourceItems.length === 0) {
            result.None = true;
            for (i = 0; i < 3; i++) {
                result.items.push({ description: "", month: 0, year: "", yearSrc: years });
            }

        } else {

            for (i = 0; i < sourceItems.length; i++) {
                if (sourceItems[i]["description"] != "") {
                    result.None = false;
                }
                result.items.push({ description: sourceItems[i]["description"], month: sourceItems[i]["month"], year: sourceItems[i]["year"], yearSrc: years });
            }
            for (i = sourceItems.length; i < 3; i++) {
                result.items.push({ description: "", month: 0, year: "", yearSrc: years });
            }
        }

        return result;
    };
    var validateOptionalArray = function (isNone, array, singleName, multipleName, validationResult) {
        if (!isNone) {
            var hasValue = false;
            for (var i = 0; i < array.length; i++) {
                if (array[i] && array[i].CodeId != specialCodes.Choose) {
                    hasValue = true;
                    break;
                }
            }

            if (!hasValue) {
                validationResult.valid = false;
                validationResult.message += 'Please select at least one' + singleName + ', or check "None".</br>';
            } else {
                for (var i = 0; i < array.length - 1; i++) {
                    for (var j = i + 1; j < array.length; j++) {
                        if (array[i].CodeId != specialCodes.Choose && array[j].CodeId != specialCodes.Choose && array[i].CodeId === array[j].CodeId) {
                            validationResult.valid = false;
                            validationResult.message += "You have selected duplicate " + multipleName + ". Please list each " + singleName + " only once.</br>";
                            return validationResult;
                        }
                    }
                }
            }

        }
        return validationResult;
    };
    var getConcerns = function (vm) {

        var def1 = $.Deferred();
        var def2 = $.Deferred();
        var concern1Resolved = false;
        var concern2Resolved = false;
        if (vm.primaryConcern == specialCodes.OtherPrimary) {
            def1.resolve(vm.otherPrimaryConcernsText);
            concern1Resolved = true;
        }
        if (vm.secondaryCheckedNone) {
            def2.resolve(null);
            concern2Resolved = true;
        } else if (vm.secondaryConcern == specialCodes.OtherSecondary) {
            def2.resolve(vm.otherSecondaryConcernsText);
            concern2Resolved = true;
        }
        if (!(concern1Resolved && concern2Resolved)) {
            var primaryDs = Snap.Patient.PatientIntakeDataSources().getDataSources(snap.hospitalSession.hospitalId).PrimaryConcernSrc;
            primaryDs.read().then(function () {

                var primaryConcernData = primaryDs.data();
                //instead of putting .length in for loop. best apporach is to get len first and do straight loop
                var len = primaryConcernData.length;
                for (var i = 0; i < len; i++) {
                    if (!concern1Resolved && primaryConcernData[i].codeId == vm.primaryConcern) {
                        concern1Resolved = true;
                        def1.resolve(primaryConcernData[i].text);
                    }
                    if (concern1Resolved) {
                        break;
                    }
                }
            });
            var secondaryDs = Snap.Patient.PatientIntakeDataSources().getDataSources(snap.hospitalSession.hospitalId).SecondaryConcernSrc;
            secondaryDs.read().then(function () {
                var secondaryConcernData = secondaryDs.data();
                var secondaryLen = secondaryConcernData.length;
                for (var i = 0; i < secondaryLen; i++) {
                    if (!concern2Resolved && secondaryConcernData[i].codeId == vm.secondaryConcern) {
                        concern2Resolved = true;
                        def2.resolve(secondaryConcernData[i].text);
                    }
                    if (concern2Resolved) {
                        break;
                    }
                }
            });
        }
        return $.when(def1, def2).promise();
    };
    var InitializeConsultation = function (vm) {

        var promise = $.Deferred();
        var concerns = [{ isPrimary: true, description: "" }];
        var that = this;
        getConcerns(vm).then(function (desc1, desc2) {
            concerns[0].description = desc1;
            if (desc2 !== null) {
                concerns.push({ isPrimary: false, description: desc2 });
            }
            snap.updateSnapConsultationSessionMultipleValues({ concerns: concerns });
            if (!snap.consultationSession.consultationId) {
                snap.DataService.customerDataService().createOnDemandConsltation({
                    patientId: snap.consultationSession.patientId,
                    phone: snap.consultationSession.phone,
                    concerns: concerns,
                    encounterTypeCode: snap.enums.EncounterTypeCode.Video //snap.consultationSession.communicationMethod
                })
                    .done(function (resp) {
                        var respData = resp.data[0];
                        var consultationSession = {
                            consultationId: respData.consultationId,
                            consultationAmount: respData.consultationAmount,
                            patientQueueEntryId: respData.patientQueueEntryId,
                            personId: respData.patientPersonId,
                            meetingId: respData.meetingId
                        };
                        snap.updateSnapConsultationSessionMultipleValues(consultationSession);
                        promise.resolve();
                    }).fail(function (resp) {
                        promise.reject(resp);
                    });
            } else {
                promise.resolve();
            }
        });

        return promise.promise();
    };

    snap.namespace("Snap.Patient")
        .define("PatientIntakeDataSources", function () {
            this.codeSetsDs = new snap.dataSource.codeSetDataSourceWrapper(
              ["medicalconditions", "medications", "medicationallergies", "consultprimaryconcerns", "consultsecondaryconcerns"]
              );

            this.getDataSources = function (hospitalId) {
                var ds = {
                    MedicalConditionsSrc: this.GetMedicalConditionsSrc(hospitalId),
                    MedicalAllergiesSrc: this.GetMedicalAllergiesSrc(hospitalId),
                    PatientMedicationSrc: this.GetPatientMedicationSrc(hospitalId),
                    PrimaryConcernSrc: this.GetPrimaryConcernSrc(hospitalId),
                    SecondaryConcernSrc: this.GetSecondaryConcernSrc(hospitalId)
                };
                return ds;
            };

            this.GetMedicalConditionsSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("condi", hospitalId);
            };

            this.GetMedicalAllergiesSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("aller", hospitalId);
            };

            this.GetPatientMedicationSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("medications", hospitalId);
            };

            this.GetPrimaryConcernSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSourceReplacingNames(
                        "primary",
                        hospitalId,
                        [
                            "Other"
                        ],
                        [
                            { "codeId": specialCodes.OtherPrimary, "text": "Other (provide details below)" }
                        ]
                    );
            };

           
            this.GetSecondaryConcernSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSourceReplacingNames(
                        "secondary",
                        hospitalId,
                        [
                            "Other"
                        ],
                        [
                            { "codeId": specialCodes.OtherSecondary, "text": "Other (provide details below)" }
                        ]
                    );
            };
        }).singleton();

    //API call URL to get and update medical history of a patient. will be used in step-4
    ///api/v2/patients/medicalprofile/+patientId	
    ///api/v2/patients/medicalprofile/+patientId

    snap.namespace("Snap.Patient").use(["snapNotification", "snapHttp", "snapLoader", "snap.DataService.customerDataService", "Snap.Patient.PaymentSubmitButton"])
         .extend(kendo.observable)
        .define("PatientIntakeViewModel", function ($snapNotification, $snapHttp, $snapLoader, $service, $paymentSubmitButton) {
            this.router = {};
            var masterVM = this;
            this.IsIntakeStep = false;
            var stepsBeforeIntake = 1; // 2 if we include Encounter selection step
            this.hospitalLogoSource = "/images/Hospital_DefaultImage.jpg";
            this.footerObjects = [
                {
                    id: 1,
                    viewPath: '/content/patient/intake/footer/intakeButtonsFooter.html' + snap.addVersion,
                    viewModel: kendo.observable({
                        showLoader: false,
                        OnNextIntakeStep: function (e) {
                            masterVM.OnNextIntakeStep(e);
                        },
                        OnPreviousIntakeStep: function (e) {
                            masterVM.OnPreviousIntakeStep(e);
                        },
                        cancelConsultation: function (e) {
                            masterVM.cancelConsultation(e);
                        }
                    })
                },
                {
                    id: 2,
                    viewPath: '/content/patient/intake/footer/tocFooter.html' + snap.addVersion,
                    viewModel: kendo.observable({
                        acceptConditions: false,
                        showLoader: false,
                        submit: function (e) {
                            masterVM.submitConditions(e);
                        },
                        OnPreviousIntakeStep: function (e) {
                            masterVM.OnPreviousIntakeStep(e);
                        },
                        cancelConsultation: function (e) {
                            masterVM.cancelConsultation(e);
                        }
                    })

                },
                 {
                     id: 3,
                     viewPath: '/content/patient/intake/footer/paymentFooter.html' + snap.addVersion,
                     viewModel: (function() {
                         var vm = kendo.observable({
                             updInProfile: false,
                             showLoader: false,
                             submit: function(e) {
                                 masterVM.submitPayment(e);
                             },
                             OnPreviousIntakeStep: function(e) {
                                 $(cancelPaymentNote).trigger("click");
                                 masterVM.OnPreviousIntakeStep(e);
                                 $paymentSubmitButton.disable();
                             },
                             cancelConsultation: function(e) {
                                 masterVM.cancelConsultation(e);
                             },
                             submitPaymentDisabled: true
                         });

                         $paymentSubmitButton.subscribeToEnabledChanged(function (enabled) {
                             vm.set("submitPaymentDisabled", !enabled);
                         });

                         return vm;
                     })() 
                 },
                 {
                     id: 4,
                     viewPath: '/content/patient/intake/footer/insuranceFooter.html' + snap.addVersion,
                     viewModel: kendo.observable({
                         updInProfile: false,
                         planVerificationAllowed: false,
                         showLoader: false,
                         nextStepAllowed: function () {
                             return (snap.hospitalSettings.eCommerce && !snap.consultationSession.isScheduled) || (snap.consultationSession.isScheduled && !snap.hospitalSettings.hidePaymentPageBeforeWaitingRoom);
                         },
                         verifyPlan: function (e) {
                             masterVM.verifyPlan(e);
                         },
                         OnPreviousIntakeStep: function (e) {
                             masterVM.OnPreviousIntakeStep(e);
                         },
                         OnNextIntakeStep: function (e) {
                             masterVM.OnNextIntakeStep(e);
                         },
                         cancelConsultation: function (e) {
                             masterVM.cancelConsultation(e);
                         }

                     })
                 },
                 {
                    id: 5,
                    viewPath: '/content/patient/intake/footer/communicationMethodFooter.html' + snap.addVersion,
                    viewModel: kendo.observable({
                        showLoader: false,
                        OnPreviousIntakeStep: function (e) {
                            masterVM.OnPreviousIntakeStep(e);
                        },
                        cancelConsultation: function (e) {
                            masterVM.cancelConsultation(e);
                        }
                    })
                }
            ];
            this.currentFooterId = 0;
            this.stepObjects = [
                {
                    viewPath: '/content/patient/intake/stepConsultationConditions.html' + snap.addVersion,
                    header: 'Patient Information',
                    viewModel: kendo.observable({
                        primaryConcern: specialCodes.Choose,
                        secondaryConcern: specialCodes.Choose,
                        showPrimaryConcernRemark: function () {
                            return this.get("primaryConcern") == specialCodes.OtherPrimary;
                        },
                        showSecondaryConcernRemark: function () {
                            return this.get("secondaryConcern") == specialCodes.OtherSecondary;
                        },
                        secondaryCheckedNone: true,
                        otherSecondaryConcernsText: '',
                        otherPrimaryConcernsText: '',
                        PrimaryConcernSrc: Snap.Patient.PatientIntakeDataSources().getDataSources(snap.hospitalSession.hospitalId).PrimaryConcernSrc,
                        SecondaryConcernSrc: Snap.Patient.PatientIntakeDataSources().getDataSources(snap.hospitalSession.hospitalId).SecondaryConcernSrc,
                        NoneSecondaryConcernsChecked: function () {
                            if (this.secondaryCheckedNone) {
                                this.set("secondaryConcern", specialCodes.Choose);
                                this.trigger("change", { field: "secondaryConcern" });
                                this.trigger("change", { field: "showSecondaryConcernRemark" });
                                this.set("otherSecondaryConcernsText", '');
                            }
                            if (isEmpty(this.secondaryConcern) || this.secondaryConcern == specialCodes.Choose)
                                this.set("secondaryCheckedNone", true);
                            else
                                this.set("secondaryCheckedNone", false);

                            this.trigger("change", { field: "secondaryCheckedNone" });
                        },
                        SecondaryConcernsSelection: function () {
                            this.otherSecondaryConcernsText = '';
                            this.trigger("change", { field: "showSecondaryConcernRemark" });
                            this.set("secondaryCheckedNone", isEmpty(this.secondaryConcern));
                            this.trigger("change", { field: "secondaryCheckedNone" });
                        },
                        PrimaryConcernsSelection: function () {
                            this.otherPrimaryConcernsText = '';
                            this.trigger("change", { field: "showPrimaryConcernRemark" });
                        }
                    }),
                    validation: function (vm) {
                        var validationResult = {
                            valid: true,
                            message: ""
                        };
                        if (isEmpty(vm.primaryConcern) || (vm.primaryConcern == specialCodes.Choose)) {
                            validationResult.valid = false;
                            validationResult.message += "Please select a primary concern</br>";
                            return validationResult;
                        }
                        if (vm.primaryConcern == specialCodes.OtherPrimary && ($.trim(vm.otherPrimaryConcernsText) === "")) {
                            validationResult.valid = false;
                            validationResult.message += "Please enter a primary concern</br>";
                            return validationResult;
                        }
                        if (!vm.secondaryCheckedNone) {
                            if (vm.secondaryConcern == specialCodes.Choose) {
                                validationResult.valid = false;
                                validationResult.message += 'Please select a secondary concern, or check "None"</br>';
                            }
                            if (vm.secondaryConcern == specialCodes.OtherSecondary && ($.trim(vm.otherSecondaryConcernsText) === "")) {
                                validationResult.valid = false;
                                validationResult.message += 'Please enter a secondary concern, or check "None"</br>';
                            }
                            var concern1 = "";
                            if (vm.primaryConcern == specialCodes.OtherPrimary) {
                                concern1 = vm.otherPrimaryConcernsText;
                            }
                            else {
                                if (!isEmpty(vm.primaryConcern)) {
                                    concern1 = vm.PrimaryConcernSrc.data().filter(function (item) {
                                        return item.codeId == vm.primaryConcern;
                                    })[0].text;
                                }
                            }
                            var concern2 = "";
                            if (vm.secondaryConcern == specialCodes.OtherSecondary) {
                                concern2 = vm.otherSecondaryConcernsText;
                            }
                            else {
                                if (!isEmpty(vm.secondaryConcern)) {
                                    concern2 = vm.SecondaryConcernSrc.data().filter(function (item) {
                                        return item.codeId == vm.secondaryConcern;
                                    })[0].text;
                                }
                            }

                            if (concern1 === concern2) {
                                validationResult.valid = false;
                                validationResult.message += " Primary and Secondary Concerns must be different.</br>";
                            }
                        }
                        return validationResult;
                    },
                    init: function () {
                        var data = snap.consultationSession;
                        if (!data)
                            return;
                        this.viewModel.set("primaryConcern", data.primaryConcern ? data.primaryConcern : this.viewModel.primaryConcern);
                        this.viewModel.set("secondaryConcern", data.secondaryConcern ? data.secondaryConcern : this.viewModel.secondaryConcern);
                        this.viewModel.set("otherSecondaryConcernsText", data.otherSecondaryConcernsText ? data.otherSecondaryConcernsText : this.viewModel.otherSecondaryConcernsText);
                        this.viewModel.set("otherPrimaryConcernsText", data.otherPrimaryConcernsText ? data.otherPrimaryConcernsText : this.viewModel.otherPrimaryConcernsText);
                        if (isEmpty(this.viewModel.secondaryConcern) || this.viewModel.secondaryConcern == specialCodes.Choose)
                            this.viewModel.set("secondaryCheckedNone", true);
                        else
                            this.viewModel.set("secondaryCheckedNone", false);
                        if (isEmpty(this.viewModel.secondaryConcern) || this.viewModel.secondaryConcern == specialCodes.Choose)
                            this.viewModel.set("secondaryCheckedNone", true);
                        else
                            this.viewModel.set("secondaryCheckedNone", false);

                    },
                    saveData: function () {
                        var def = $.Deferred();
                        var vm = this.viewModel;
                        InitializeConsultation(vm).done(function () {
                            var data = {
                                primaryConcern: vm.primaryConcern,
                                secondaryConcern: vm.secondaryConcern,
                                otherSecondaryConcernsText: vm.otherSecondaryConcernsText,
                                otherPrimaryConcernsText: vm.otherPrimaryConcernsText
                            };
                            snap.updateSnapConsultationSessionMultipleValues(data);
                            def.resolve();
                        }).fail(function () {
                            def.reject();
                        });
                        return def.promise();
                    }
                },
                {
                    viewPath: '/content/patient/intake/stepHistConditions.html' + snap.addVersion,
                    header: 'Medical History',
                    viewModel: kendo.observable({
                        medicalConditions: wrapListSource([], intakeDataSources.medicalConditionsSrc),
                        medSurgeries: wrapSurgeries([
                            {
                                description: "",
                                year: "",
                                month: ""
                            },
                            {
                                description: "",
                                year: "",
                                month: ""
                            },
                            {
                                description: "",
                                year: "",
                                month: ""
                            }
                        ], masterVM.yearsSrc, masterVM.dobYear, masterVM.dobMonth),
                        SurgeriesSelection: function () {
                            this.set("medSurgeries.None", false);
                        },
                        NoSelectionMedicalConditions: function () {
                            this.set("medicalConditions", wrapListSource([], intakeDataSources.medicalConditionsSrc));
                        },
                        NoSelectionSurgeries: function () {
                            this.set("medSurgeries", wrapSurgeries([], masterVM.yearsSrc, masterVM.dobYear, masterVM.dobMonth));
                        }

                    }),
                    init: function (vm, parentVM) {

                        var data = snap.consultationSession;
                        if (!data)
                            return;
                        this.viewModel.set("medicalConditions", typeof (data.medicalConditions) !== "undefined" ? wrapListSource(data.medicalConditions, intakeDataSources.medicalConditionsSrc) : this.viewModel.medicalConditions);
                        this.viewModel.set("medSurgeries", typeof (data.surgeries) !== "undefined" ? wrapSurgeries(data.surgeries, masterVM.yearsSrc, masterVM.dobYear, masterVM.dobMonth) : this.viewModel.medSurgeries);
                    },
                    validation: function (vm) {
                        var validationResult = {
                            valid: true,
                            message: ""
                        };
                        validationResult = validateOptionalArray(vm.medicalConditions.None, vm.medicalConditions.items, "Chronic Medical Condition", "conditions", validationResult);
                        //removing any regex for surgery name /^[ A-Za-z0-9_@./#&+-]*$/;

                        if (!vm.medSurgeries.None) {
                            var hasValue = false;
                            for (var i = 0; i < vm.medSurgeries.items.length; i++) {
                                if ($.trim(vm.medSurgeries.items[i].description) !== "") {
                                    hasValue = true;
                                    break;
                                }
                            }
                            if (!hasValue) {
                                validationResult.valid = false;
                                validationResult.message += 'Please mention at least one Prior Surgery, or select "None"</br>';
                                return validationResult;
                            }

                            var numeral = ["first", "second", "third"];
                            for (var i = 0; i < vm.medSurgeries.items.length; i++) {
                                var string = $.trim(vm.medSurgeries.items[i].description);
                                if (string != "") {
                                    validationResult = getSurgeryValidation(vm.medSurgeries.items[i].description, vm.medSurgeries.items[i].month, vm.medSurgeries.items[i].year, vm.medSurgeries.dobYear, vm.medSurgeries.dobMonth, validationResult);
                                    if (validationResult.valid === false) {
                                        return validationResult;
                                    }
                                }
                                else {
                                    if (parseInt(vm.medSurgeries.items[i].month) != 0 || vm.medSurgeries.items[i].year != "") {
                                        validationResult.valid = false;
                                        validationResult.message += "Please enter your " + numeral[i] + " surgery.</br>";
                                        return validationResult;
                                    }
                                }
                            }
                        }

                        return validationResult;
                    },
                    saveData: function () {
                        var def = $.Deferred();
                        var data = {
                            medicalConditions: extractFromListSource(this.viewModel.medicalConditions),
                            surgeries: this.viewModel.medSurgeries.None ? null : this.viewModel.medSurgeries.items
                        };
                        snap.updateSnapConsultationSessionMultipleValues(data);
                        def.resolve();
                        return def.promise();
                    }
                },
                {
                    viewPath: '/content/patient/intake/stepHistMedications.html' + snap.addVersion,
                    header: 'Medications',
                    viewModel: kendo.observable({
                        medicalAllergies: wrapListSource([], intakeDataSources.medicalAllergiesSrc),
                        currentMedications: wrapListSource([], intakeDataSources.patientMedicationSrc),
                        NoSelectionAllergies: function () {
                            this.set("medicalAllergies", wrapListSource([], intakeDataSources.medicalAllergiesSrc));
                        },
                        NoSelectionPetientMedication: function () {
                            this.set("currentMedications", wrapListSource([], intakeDataSources.patientMedicationSrc));
                        }
                    }),
                    validation: function (vm) {
                        var validationResult = {
                            valid: true,
                            message: ""
                        };
                        validationResult = validateOptionalArray(vm.medicalAllergies.None, vm.medicalAllergies.items, "Medication Allergy", "allergies", validationResult);
                        validationResult = validateOptionalArray(vm.currentMedications.None, vm.currentMedications.items, "Current Medication", "medications", validationResult);

                        return validationResult;
                    },
                    init: function () {
                        var data = snap.consultationSession;
                        if (!data)
                            return;
                        this.viewModel.set("medicalAllergies", typeof (data.medicalAllergies) !== "undefined" ? wrapListSource(data.medicalAllergies, intakeDataSources.medicalAllergiesSrc) : this.viewModel.medicalAllergies);
                        this.viewModel.set("currentMedications", typeof (data.currentMedications) !== "undefined" ? wrapListSource(data.currentMedications, intakeDataSources.patientMedicationSrc) : this.viewModel.currentMedications);
                    },
                    saveData: function () {
                        var def = $.Deferred();

                        var data = {
                            currentMedications: extractFromListSource(this.viewModel.currentMedications),
                            medicalAllergies: extractFromListSource(this.viewModel.medicalAllergies)
                        };
                        snap.updateSnapConsultationSessionMultipleValues(data);
                        def.resolve();
                        return def.promise();
                    }
                },
                {
                    viewPath: '/content/patient/intake/stepUnderOne.html' + snap.addVersion,
                    header: 'Birth History',
                    viewModel: kendo.observable({
                        fullTerm: null,
                        vaginally: null,
                        discharged: null,
                        vaccinationsUpToDate: null
                    }),
                    validation: function (vm) {
                        var validationResult = {
                            valid: true,
                            message: ""
                        };
                        if (!vm.fullTerm) {
                            validationResult.valid = false;
                            validationResult.message += "Please indicate if the patient was born at full term? <br />";
                        }
                        if (!vm.vaginally) {
                            validationResult.valid = false;
                            validationResult.message += "Please indicate if the patient was born vaginally?  <br />";
                        }
                        if (!vm.discharged) {
                            validationResult.valid = false;
                            validationResult.message += "Please indicate if the patient was discharged with the Mother?  <br />";
                        }
                        if (!vm.vaccinationsUpToDate) {
                            validationResult.valid = false;
                            validationResult.message += "Please indicate if the patients vaccinations are up-to-date?  <br />";
                        }
                        return validationResult;
                    },
                    init: function () {
                        jcf.init();
                        var data = snap.consultationSession;
                        if (!data)
                            return;
                        this.viewModel.set("fullTerm", data.fullTerm ? data.fullTerm : this.viewModel.fullTerm);
                        this.viewModel.set("vaginally", data.vaginally ? data.vaginally : this.viewModel.vaginally);
                        this.viewModel.set("discharged", data.discharged ? data.discharged : this.viewModel.discharged);
                        this.viewModel.set("vaccinationsUpToDate", data.vaccinationsUpToDate ? data.vaccinationsUpToDate : this.viewModel.vaccinationsUpToDate);
                    },
                    saveData: function () {
                        var def = $.Deferred();
                        var data = {
                            fullTerm: this.viewModel.fullTerm,
                            vaginally: this.viewModel.vaginally,
                            discharged: this.viewModel.discharged,
                            vaccinationsUpToDate: this.viewModel.vaccinationsUpToDate
                        };
                        snap.updateSnapConsultationSessionMultipleValues(data);
                        def.resolve();
                        return def.promise();
                    }
                }
            ];

            this.currentIntakeStep = currentIntakeStep;
            this.currentIntakeStepText = function () {
                return parseInt(this.get("currentIntakeStep")) + (snap.consultationSession && snap.consultationSession.isScheduled ? 1 : 0);
            };
            this.intakeHeader = this.stepObjects[0].header;
            this.showLoader = false;
            this.isStepVisible = false;
            this.isNameVisible = false;
            this.isFooterVisible = false;
            this.patientName = "";
            this.submitConditions = function () {
                var footerVm = this.footerObjects[1].viewModel;

                if (!this.footerObjects[1].viewModel.acceptConditions) {
                    $snapNotification.error("You must read and accept the Terms and Conditions and Consent to Treatment in order to proceed");
                    return;
                }

                snap.updateSnapConsultationSessionValue("acceptConditions", true);

                
                footerVm.set("showLoader", true);
                footerVm.trigger("change", { field: "showLoader" });
                //TODO: re-organize to handle intako on sceduled consultations
                if (!snap.consultationSession.isScheduled) {
                    this.updateConsultationMetadata().done(function () {
                        masterVM.OnNextIntakeStep();
                    }).fail(function (resp) {
                        $snapNotification.error(JSON.parse(resp.responceText).message);
                    })
                    .always(function () {

                        $snapLoader.hideLoader();
                    });
                } else {
                    masterVM.OnNextIntakeStep();
                }
            };
            this.verifyPlan = function (e) {
                var footerVm = this.footerObjects[3].viewModel;
                footerVm.set("showLoader", true);
                footerVm.trigger("change", { field: "showLoader" });
                this.currentStepVm.applyPlan(e);
            };
            this.updateConsultationMetadata = function () {
                var that = this;
                var data = {
                    medicationAllergies: snap.consultationSession.medicalAllergies,
                    surgeries: snap.consultationSession.surgeries,
                    medicalConditions: snap.consultationSession.medicalConditions,
                    medications: snap.consultationSession.currentMedications,
                    concerns: snap.consultationSession.concerns ? snap.consultationSession.concerns.map(function (item) {
                        return {
                            isPrimary: item.isPrimary,
                            customCode: {
                                description: item.description
                            }
                        };
                    }) : null,
                    infantData: snap.consultationSession.IsUnder1 ? {
                        dischargedWithMother: snap.consultationSession.discharged,
                        fullTerm: snap.consultationSession.fullTerm,
                        patientAgeUnderOneYear: "Y",
                        vaccinationsCurrent: snap.consultationSession.vaccinationsUpToDate,
                        vaginalBirth: snap.consultationSession.vaginally
                    } : null
                };
                return $service.updateConsultationMetadata(snap.consultationSession.consultationId, data);
            };

            this.submitPayment = function (e) {
                e.preventDefault();
                
                var footerVm = this.footerObjects[2].viewModel;
                footerVm.set("showLoader", true);
                footerVm.trigger("change", { field: "showLoader" });

                masterVM.currentStepVm.submitPayment().done(function () {
                    snap.consultationId = snap.consultationSession.consultationId;
                    window.location.href = '/Customer/PaymentSuccessful';
                }).fail(function () {
                    footerVm.set("showLoader", false);
                    footerVm.trigger("change", { field: "showLoader" });
                }).always(function () {
                    $snapLoader.hideLoader();
                });
            };

            this.OnNextIntakeStep = function () {
                snapRemoveErrorNotification();

                var pos = this.intakeHeader == "Insurance" ? 3 : 0;
                var footerVm = this.footerObjects[pos].viewModel;

                if (this.validateForNextStep()) {
                    
                    footerVm.set("showLoader", true);
                    footerVm.trigger("change", { field: "showLoader" });

                    var that = this;
                    var def = $.Deferred();
                    if (this.IsIntakeStep) {
                        this.stepObjects[this.currentIntakeStep - stepsBeforeIntake].saveData().done(function () {
                            def.resolve();
                        }).fail(function () {
                            window.location.href = snap.getPatientHome();
                        });
                    } else {
                        def.resolve();
                    }
                    def.done(function () {

                        $snapLoader.hideLoader();
                        var nextStepNum = parseInt(that.currentIntakeStep) + 1;
                        var nextStep = that.stepsMachine.getNextStep(nextStepNum);
                        if (nextStep) {
                            snap.updateSnapConsultationSessionValue("currentStep", nextStepNum);
                            that.router.navigate("/" + nextStep);
                        } else if (!snap.consultationHelper.isPaymentRequired()) {
                            goToWaitingRoom();
                        } else {
                            window.location.href = "/Customer/PaymentSuccessful";
                        }
                    });

                }
            };

            this.OnPreviousIntakeStep = function () {

                var prevStep = this.stepsMachine.getPreviousStep(this.currentIntakeStep);

                if (prevStep) {
                    snap.updateSnapConsultationSessionValue("currentStep", this.currentIntakeStep - 1);
                    this.router.navigate("/" + prevStep);
                } else {
                    window.location.href = snap.getPatientHome();
                }
            };

            this.PatientFullName = function (data) {
                return wrapValue(data.patientName) + " " + wrapValue(data.lastName);
            };
            this.guardianName = "";
            this.setPatientData = function (data) {
                if (data.account) {
                    this.set("patientId", data.account.patientId);
                }
                this.set("patientName", this.PatientFullName(data));

                var that = this;
                if (!this.guardianName) {
                    if (data.account.isDependent == "Y") {
                        this.set("guardianName", "Loading...");
                        $service.getAccountUserProfiles().done(function(responce) {
                            if (responce.data.length) {
                                var guardian = responce.data.find(function(item) {
                                    return item.description = "Account Admin";
                                });
                                guardian = guardian || responce.data[0];
                                that.set("guardianName", guardian.name + " " + guardian.lastname);
                            } else {
                                that.set("guardianName", "Self");
                            }
                        });
                    } else {
                        that.set("guardianName", "Self");
                    }
                }
                this.set("hospitalLogoSource", wrapValue(snap.hospitalSession.hospitalLogo));
                if (this.PatientFullName(data) == this.guardianName) {
                    this.set("isGuardianVisible", false);
                } else {
                    this.set("isGuardianVisible", true);
                }
                this.set("dob", data.dob);

                var dob = new Date(data.dob);
                var dobYear = dob.getFullYear();
                var dobMonth = dob.getMonth() + 1;
                var currentYear = new Date().getFullYear();
                var yearData = [];
                for (var i = dobYear; i <= currentYear; i++) {
                    yearData.push({ 'id': i, 'year': i });
                }
                this.set("yearsSrc", yearData);
                var d = new Date();
                d.setFullYear(d.getFullYear() - 1);


                snap.updateSnapConsultationSessionValue("IsUnder1", dob > d);

                this.set("dobYear", dobYear);
                this.set("dobMonth", dobMonth);

                this.stepObjects[1].viewModel.set("medicalConditions", wrapListSource(data.medicalHistory.medicalConditions, intakeDataSources.medicalConditionsSrc));
                this.stepObjects[1].viewModel.set("medSurgeries", wrapSurgeries(data.medicalHistory.surgeries, masterVM.yearsSrc, dobYear, dobMonth));
                this.stepObjects[2].viewModel.set("medicalAllergies", wrapListSource(data.medicalHistory.medicationAllergies, intakeDataSources.medicalAllergiesSrc));
                this.stepObjects[2].viewModel.set("currentMedications", wrapListSource(data.medicalHistory.medications, intakeDataSources.patientMedicationSrc));
                snap.updateSnapConsultationSessionMultipleValues({ patientName: this.PatientFullName(data), guardianName: this.guardianName, dob: data.dob, phone: data.mobilePhone });
            };

            //Medical History


            this.cancelConsultation = function (e) {
                snapConfirm("Are you sure that you want to cancel this consultation?");
                $("#btnConfirmYes").click(function () {
                    $(".k-notification-confirmation").parent().remove();
                    Snap.Patient.ApplyInsurancePlanViewModel().clearPlan();                    
                    location.href = snap.getPatientHome();
                });
                $("#btnConfirmNo").click(function () {
                    $(".k-notification-confirmation").parent().remove();
                });
                e.preventDefault();
            };

            this.validateForNextStep = function () {
                var validObj;
                if (this.IsIntakeStep) {
                    validObj = this.stepObjects[this.currentIntakeStep - stepsBeforeIntake].validation(this.stepObjects[this.currentIntakeStep - stepsBeforeIntake].viewModel);
                    if (!validObj.valid) {
                        $snapNotification.error(validObj.message);
                    }
                    return validObj.valid;
                }
                return true;
            };
        }).singleton();


    snap.namespace("Snap.Patient").use(["snapNotification", "snapHttp", "snapLoader", "snap.DataService.customerDataService", "Snap.Patient.PatientIntakeViewModel"])
        .define("PatientIntakeService", function ($snapNotification, $snapHttp, $snapLoader, $service, $viewmodel) {
            var vm = $viewmodel;
            var currentView;
            this.reBindVM = function (containerId, responce) {
                vm.setPatientData(responce.data[0]);
            },

            this.LoadViewModel = function (containerId, hospitalId, currentStep, totalSteps, router) {
                var stepsMachine = new function () {
                    this.pushStep = function (stepName, stepPath) {
                        this.currentStepName.push(stepName);
                        var stepPath = stepPath || stepName;
                        this.currentStepPath[stepPath] = this.currentStepName.length - 1;
                    };
                    this.recalcSteps = function () {
                        if (snap.consultationSession.isScheduled) {
                            this.currentStepPath = {
                            };
                            this.currentStepName = [];
                            if (snap.hospitalSettings.showCTTOnScheduled) {
                                this.pushStep("Confirmation");
                            }
                            if (snap.hospitalSettings.insuranceVerification && snap.hospitalSettings.insuranceBeforeWaiting) {
                                this.pushStep("Insurance");
                            }
                            if (snap.consultationHelper.isPaymentRequired()) {
                                this.pushStep("Payment");
                            }
                        } else {
                            this.currentStepPath = {
                                ChoosePatient: 0,
                                /*"CommunicationMethod": 1,*/
                                "Intake/1": 1,
                                "Intake/2": 2,
                                "Intake/3": 3
                            };
                            this.currentStepName = ["ChoosePatient", /*"CommunicationMethod",*/ "IntakeStep/1", "IntakeStep/2", "IntakeStep/3"];
                            if (snap.consultationSession.IsUnder1) {
                                this.pushStep("IntakeStep/4", "Intake/4");
                                this.pushStep("Confirmation");
                                if (snap.hospitalSettings.insuranceVerification) {
                                    this.pushStep("Insurance");

                                    if (snap.hospitalSettings.eCommerce) {
                                        this.pushStep("Payment");
                                    }

                                } else {
                                    if (snap.hospitalSettings.eCommerce) {
                                        this.pushStep("Payment");
                                        return;
                                    }
                                }

                            } else {
                                this.pushStep("Confirmation");
                                if (snap.hospitalSettings.insuranceVerification) {
                                    this.pushStep("Insurance");
                                    if (snap.hospitalSettings.eCommerce) {
                                        this.pushStep("Payment");
                                    }

                                } else {
                                    if (snap.hospitalSettings.eCommerce) {
                                        this.pushStep("Payment");
                                        return;
                                    }
                                }
                            }
                        }
                    };

                    this.recalcSteps();


                    this.verifyStep = function (step) {
                        if (!(step || (step === 0 && snap.consultationSession.isScheduled)))
                            return false;
                        if (!(snap.consultationSession && snap.consultationSession.totalSteps))
                            return false;
                        if (this.currentStepName.length < step) {
                            return false;
                        }

                        if (snap.consultationSession.currentStep < step) {
                            return false;
                        }

                        return true;
                    };
           
                    this.getNextStep = function (step) {
                        if (this.currentStepName.length <= (step)) {
                            return false;
                        } else if (this.currentStepName[step] === "Payment" && !snap.consultationHelper.isPaymentRequired()) {
                            return false;
                        }
                        return this.currentStepName[step];
                    };
                    this.getPreviousStep = function (step) {
                        if ((step - 1) < 0) {
                            return false;
                        }
                        return this.currentStepName[step - 1];
                    };
                };

                var that = this;
                $viewmodel.stepsMachine = stepsMachine;

                this.patientResponce = null;

                $.get("/content/patient/intake/patientIntakeForm.html" + snap.addVersion).then(function (html) {
                    layout = new kendo.Layout(html);
                    var router = new kendo.Router({
                        init: function () {
                            layout.render(containerId);
                            snap.localize();
                            kendo.bind($(containerId), vm);
                        },
                        routeMissing: function () {
                            window.location.href = "/Customer/Intake/#/ChoosePatient";
                        }
                    });
                    var patientDataFill = function () {
                        var def = $.Deferred();
                        if (snap.consultationSession && snap.consultationSession.patientId) {
                            if (that.patientResponce) {
                                that.reBindVM(containerId, that.patientResponce);
                                stepsMachine.recalcSteps();
                                def.resolve();
                            } else {
                                $service.getPatientProfileDetails(snap.consultationSession.patientId, "all").done(function (resp) {
                                    that.patientResponce = resp;
                                    that.reBindVM(containerId, resp);
                                    stepsMachine.recalcSteps();
                                    def.resolve();
                                }).fail(function () {
                                    def.reject();
                                    snapInfo("Unable to access profile");
                                    window.location.href = snap.getPatientHome();
                                });
                            }
                        } else {
                            def.reject();
                        }
                        return def.promise();
                    };
                    router.route('/IntakeStep/:step', function (step) {
                        
                        stepsMachine.recalcSteps();
                        snap.updateSnapConsultationSessionValue("totalSteps", stepsMachine.currentStepName.length);
                        var currentStep = stepsMachine.currentStepPath["Intake/" + step];

                        if (!stepsMachine.verifyStep(currentStep)) {
                            window.location.href = snap.getPatientHome();
                        }
                        vm.set("currentIntakeStep", currentStep);
                        vm.set("IsIntakeStep", true);
                        var currentEffectiveStep = step - 1;
                        vm.set("intakeHeader", vm.stepObjects[currentEffectiveStep].header);
                        vm.set("isFooterVisible", true);
                        document.title = vm.intakeHeader;
                        if (currentView) {
                            currentView.destroy();
                        }


                        if (vm.currentFooterId !== vm.footerObjects[0].id) {
                            $.get(vm.footerObjects[0].viewPath, function (data) {

                                footer = new kendo.Layout(data, { model: vm.footerObjects[0].viewModel });
                                layout.showIn('#footerPannel', footer);
                                vm.currentFooterId = vm.footerObjects[0].id;
                            });
                        }

                        patientDataFill().done(function () {
                            $.get(vm.stepObjects[currentEffectiveStep].viewPath, function (data) {
                                vm.stepObjects[currentEffectiveStep].init(vm.stepObjects[currentEffectiveStep].viewModel, vm);
                                currentView = new kendo.Layout(data, { model: vm.stepObjects[currentEffectiveStep].viewModel });
                                vm.currentStepVm = vm.stepObjects[currentEffectiveStep].viewModel;
                                layout.showIn('#patientIntakePanel', currentView);
                            });
                            snap.updateSnapConsultationSessionValue("totalSteps", stepsMachine.currentStepName.length);
                            vm.set("totalSteps", snap.consultationSession.totalSteps);
                            vm.trigger("change", { field: "totalSteps" });

                        }).fail(function () {
                            window.location.href = snap.patientLogin();
                        }).always(function () {
                            if($viewmodel.footerObjects[0].viewModel.showLoader){
                                $viewmodel.footerObjects[0].viewModel.showLoader = false;
                                $viewmodel.footerObjects[0].viewModel.trigger("change", { field: "showLoader" });
                            };
                            $snapLoader.hideLoader();
                        });
                        vm.set("isStepVisible", true);
                        vm.set("isNameVisible", true);
                    });

                    router.route('/CommunicationMethod', function () {
                        vm.set("IsIntakeStep", false);
                        vm.set("isFooterVisible", true);
                        stepsMachine.recalcSteps();
                        snap.updateSnapConsultationSessionValue("totalSteps", stepsMachine.currentStepName.length);
                        vm.set("totalSteps", snap.consultationSession.totalSteps);
                        var currentStep = stepsMachine.currentStepPath["CommunicationMethod"];
                        if (!stepsMachine.verifyStep(currentStep)) {
                            window.location.href = snap.getPatientHome();
                        }
                        vm.set("intakeHeader", 'Communication Method');
                        vm.set("currentIntakeStep", currentStep);
                        if (currentView) {
                            currentView.destroy();
                        }
                        if (vm.currentFooterId !== vm.footerObjects[4].id) {
                            $.get(vm.footerObjects[4].viewPath, function (data) {

                                footer = new kendo.Layout(data, { model: vm.footerObjects[4].viewModel });
                                layout.showIn('#footerPannel', footer);
                                vm.currentFooterId = vm.footerObjects[4].id;
                            });
                        }

                        $.get('/content/patient/intake/stepSelectCommunicationMethod.html' + snap.addVersion, function (data) {
                            var model = snap.resolveObject("Snap.Patient.CommunicationMethodSelector");
                            if (model) {
                                currentView = new kendo.Layout(data, { model: model });
                                layout.showIn('#patientIntakePanel', currentView);
                                snap.localize();
                            }
                            else {
                                $snapNotification.error("Can't bind communication methods viewmodel.");
                            }
                        });
                    });

                    router.route('/ChoosePatient', function () {
                        var currentStep = stepsMachine.currentStepPath["ChoosePatient"];
                        snap.clearSnapConsultationSession();
                        document.title = vm.intakeHeader;
                        that.patientResponce = null;
                        vm.set("IsIntakeStep", false);
                        vm.set("currentIntakeStep", currentStep);
                        vm.set("isStepVisible", false);
                        vm.set("isNameVisible", false);
                        vm.set("isFooterVisible", false);
                        vm.set("intakeHeader", 'Select Patient');
                        vm.set("hospitalLogoSource", wrapValue(snap.hospitalSession.hospitalLogo));
                        if (currentView) {
                            currentView.destroy();
                        }
                        $.get('/content/patient/intake/stepSelectPatient.html' + snap.addVersion, function (data) {
                            currentView = new kendo.Layout(data, { model: app.patientSelectionService.viewModel });
                            layout.showIn('#patientIntakePanel', currentView);
                            snap.localize();
                            app.patientSelectionService.viewModel.LoadViewModel();
                            vm.currentStepVm = app.patientSelectionService.viewModel;
                        });

                        snap.updateSnapConsultationSessionMultipleValues({ totalSteps: totalSteps, consultationId: 0 });
                        vm.currentFooterId = -1;
                    });
                    router.route('/Confirmation', function () {
                        
                        vm.set("IsIntakeStep", false);
                        stepsMachine.recalcSteps();
                        snap.updateSnapConsultationSessionValue("totalSteps", stepsMachine.currentStepName.length);
                        vm.set("totalSteps", snap.consultationSession.totalSteps);
                        if (!stepsMachine.verifyStep(stepsMachine.currentStepPath["Confirmation"])) {
                            window.location.href = snap.getPatientHome();
                        }
                        document.title = 'Consent to Treat';
                        vm.set("isStepVisible", true);
                        vm.set("isNameVisible", false);
                        vm.set("isFooterVisible", true);
                        vm.set("intakeHeader", 'Consent to Treat');
                        vm.set("currentIntakeStep", stepsMachine.currentStepPath["Confirmation"]);
                        if (currentView) {
                            currentView.destroy();
                        }
                        patientDataFill().done(function () {
                            $.get('/content/patient/intake/stepToC.html' + snap.addVersion, function (data) {
                                var stepVm = Snap.Patient.TermsAndConditionsConfirmationViewmodel();
                                stepVm.loadDocuments().always(function () { $snapLoader.hideLoader(); });
                                currentView = new kendo.Layout(data, { model: stepVm });
                                layout.showIn('#patientIntakePanel', currentView);
                                vm.currentStepVm = stepVm;
                            });

                            snap.updateSnapConsultationSessionMultipleValues({ totalSteps: totalSteps });
                            if (vm.currentFooterId !== vm.footerObjects[1].id) {
                                $.get(vm.footerObjects[1].viewPath, function (data) {

                                    footer = new kendo.Layout(data, { model: vm.footerObjects[1].viewModel });
                                    vm.footerObjects[1].viewModel.set("acceptConditions", snap.consultationSession.acceptConditions);
                                    layout.showIn('#footerPannel', footer);
                                    vm.currentFooterId = vm.footerObjects[1].id;
                                });
                            }
                        }).always(function () {
                            if($viewmodel.footerObjects[0].viewModel.showLoader){
                                $viewmodel.footerObjects[0].viewModel.showLoader = false;
                                $viewmodel.footerObjects[0].viewModel.trigger("change", { field: "showLoader" });
                            };
                            $snapLoader.hideLoader();
                        });
                    });
                    router.route('/Insurance', function () {
                        
                        vm.set("IsIntakeStep", false);
                        stepsMachine.recalcSteps();
                        snap.updateSnapConsultationSessionValue("totalSteps", stepsMachine.currentStepName.length);
                        vm.set("totalSteps", snap.consultationSession.totalSteps);
                        if (!stepsMachine.verifyStep(stepsMachine.currentStepPath["Insurance"])) {
                            window.location.href = snap.getPatientHome();
                        }
                        vm.set("currentIntakeStep", stepsMachine.currentStepPath["Insurance"]);
                        document.title = 'Insurance';
                        vm.set("isStepVisible", true);
                        vm.set("isNameVisible", false);
                        vm.set("isFooterVisible", true);
                        vm.set("intakeHeader", 'Insurance');
                        if (currentView) {
                            currentView.destroy();
                        }
                        patientDataFill().done(function () {
                            $.get('/content/patient/intake/stepInsurance.html' + snap.addVersion, function (data) {
                                var stepVm = Snap.Patient.ApplyInsurancePlanViewModel();
                                currentView = new kendo.Layout(data, { model: stepVm });
                                layout.showIn('#patientIntakePanel', currentView);
                                snap.localize();
                                stepVm.loadPlans().always(function () { $snapLoader.hideLoader(); });
                                vm.currentStepVm = stepVm;
                                vm.currentStepVm.insuranceDone = function () { vm.OnNextIntakeStep(); };
                                vm.currentStepVm.bind("change", function (e) {
                                    if (e.field === "plans") {
                                        vm.footerObjects[3].viewModel.set("planVerificationAllowed", vm.currentStepVm.planExists() && ((!snap.hospitalSettings.eCommerce && !snap.consultationSession.isScheduled) || (snap.consultationSession.isScheduled && snap.hospitalSettings.hidePaymentPageBeforeWaitingRoom)));
                                    }
                                });
                            });


                            if (vm.currentFooterId !== vm.footerObjects[3].id) {
                                $.get(vm.footerObjects[3].viewPath, function (data) {

                                    footer = new kendo.Layout(data, { model: vm.footerObjects[3].viewModel });
                                    layout.showIn('#footerPannel', footer);
                                    vm.currentFooterId = vm.footerObjects[3].id;
                                });
                            }
                        }).always(function () {
                            if($viewmodel.footerObjects[1].viewModel.showLoader){
                                $viewmodel.footerObjects[1].viewModel.showLoader = false;
                                $viewmodel.footerObjects[1].viewModel.trigger("change", { field: "showLoader" });
                            };
                            $snapLoader.hideLoader();
                        });
                    });
                    router.route('/Payment', function () {
                        var footerVm = $viewmodel.footerObjects[3].viewModel;
                        vm.set("IsIntakeStep", false);
                        stepsMachine.recalcSteps();
                        snap.updateSnapConsultationSessionValue("totalSteps", stepsMachine.currentStepName.length);
                        vm.set("totalSteps", snap.consultationSession.totalSteps);
                        if (!stepsMachine.verifyStep(stepsMachine.currentStepPath["Payment"])) {
                            window.location.href = snap.getPatientHome();
                        }
                        vm.set("currentIntakeStep", stepsMachine.currentStepPath["Payment"]);
                        document.title = 'Payment';
                        vm.set("isStepVisible", true);
                        vm.set("isNameVisible", false);
                        vm.set("isFooterVisible", true);
                        vm.set("intakeHeader", 'Payment');

                        if (currentView) {
                            currentView.destroy();
                        }
                        patientDataFill().done(function () {
                            if(footerVm.showLoader){
                                footerVm.showLoader = false;
                                footerVm.trigger("change", { field: "showLoader" });
                            };

                            $.get('/content/patient/intake/stepPayment.html' + snap.addVersion, function (data) {
                                var stepVm = Snap.Patient.PatientPaymentViewModel();
                                currentView = new kendo.Layout(data, { model: stepVm });
                                layout.showIn('#patientIntakePanel', currentView);
                                snap.localize();
                                stepVm.loadData().always(function () {
                                    
                                    $snapLoader.hideLoader();
                                });
                                vm.currentStepVm = stepVm;
                            });

                            snap.updateSnapConsultationSessionMultipleValues({ totalSteps: totalSteps });
                            if (vm.currentFooterId !== vm.footerObjects[2].id) {
                                $.get(vm.footerObjects[2].viewPath, function (data) {

                                    footer = new kendo.Layout(data, { model: vm.footerObjects[2].viewModel });
                                    layout.showIn('#footerPannel', footer);
                                    vm.currentFooterId = vm.footerObjects[2].id;
                                });
                            }
                        }).fail(function () {
                            $snapLoader.hideLoader();
                            
                            footerVm.set("showLoader", false);
                            footerVm.trigger("change", { field: "showLoader" });
                        });
                    });

                    vm.router = router;
                    router.start();
                });
                return vm;
            };
        });
}(jQuery));