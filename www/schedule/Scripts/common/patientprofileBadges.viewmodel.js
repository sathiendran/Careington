"use strict";

// ReSharper disable CoercedEqualsUsing
; (function ($, snap, kendo) {
    var specialCodes = {
        Other: -1,
        Choose: -2
    };
    var noneValue = snap.noneReportedMessage;
    var emptyIdentifierType = "None";

    var patientDataSources = {
        medicalConditionsSrc: "MedicalConditionsSrc",
        medicalAllergiesSrc: "MedicalAllergiesSrc",
        patientMedicationSrc: "PatientMedicationSrc"
    };
    var getNewDataSource = function (dataSources) {
        var DataSrc;
        var hospitalId = snap.hospitalSession.hospitalId;
        var patientDS = Snap.Common.PatientProfileDataSources();

        switch (dataSources) {
            case patientDataSources.medicalConditionsSrc:
                DataSrc = patientDS.GetMedicalConditionsSrc(hospitalId);
                break;
            case patientDataSources.medicalAllergiesSrc:
                DataSrc = patientDS.GetMedicalAllergiesSrc(hospitalId);
                break;
            case patientDataSources.patientMedicationSrc:
                DataSrc = patientDS.GetPatientMedicationSrc(hospitalId);
                break;
            default:
                DataSrc = null;
        }

        return DataSrc;
    };

    var ddValueIsNotDefault = function (value) {
        return value != specialCodes.Choose && !isEmpty(value);
    };
    var extractDdValue = function (value) {
        if (typeof value === "object") {
            if (value.CodeId && ddValueIsNotDefault(value.CodeId)) {
                return value.CodeId;
            }

        } else {
            if (ddValueIsNotDefault(value)) {
                return value;
            }
        }
    };


    function wrapOptionalField(field, secondField, isNone) {
        if (isNone) {
            return noneValue;
        } else {
            if (field || secondField) {
                return field;
            } else {
                return null;
            }
        }
    }

    function isPositiveNumber(val) {
        if (val == null || val == 0 || val === "" || isNaN(parseInt(val) ) ) {
            return false;
        } 

        return true;
    }

    var createViewModelForCombobox = function (defaultValue, dsName, listSourceVm) {
        var model = kendo.observable({
            CodeId: defaultValue,
            DataSrc: getNewDataSource(dsName),
            ignoreChange: true,
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
        model.bind("change", function (e) {
            model.ignoreChange = e.field === "DataSrc";
        });
        return model;
    };

    var $intakeValidator = snap.resolveObject("snap.patient.intake.intakeValidator");
    var createViewModelForSurgery = function (yearsSrc, sourceItem, listSourceVm) {
        return kendo.observable({
            description: sourceItem.description || "",
            month: sourceItem.month || 0,
            year: sourceItem.year || "",
            yearSrc: yearsSrc,
            onChange: function () {
                listSourceVm.tiggerNoneCheckbox();
            },
            Validate: function (dob) {
                var 
                    d = new Date(dob),
                    validationResult = {
                    valid: true,
                };

                var result = $intakeValidator.validateSergery(
                    this.description,
                    this.year,
                    this.month,
                    d.getFullYear(),
                    d.getMonth() + 1
                );
                    
                if(result !== null) {
                        validationResult.valid = false;
                    validationResult.message = result + "</br>";
                    } 

                return validationResult;
            },
            IsEmpty: function () {
                return $intakeValidator.isSergeryEmpty(this.description, this.year, this.month);
            }

        });
    };
    var wrapListSource = function (sourceItems, dsName) {
        var result = kendo.observable({
            None: true,
            items: [],
            tiggerNoneCheckbox: function () {
                var isEmpty = true;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].GetSelectedItem() !== null) {
                        isEmpty = false;
                        break;
                    }
                }
                this.set("None", isEmpty);
            },
            ignoreChange: function () {
                var ignoreChange = true;
                this.items.forEach(function (item) {
                    if (!item.ignoreChange) {
                        ignoreChange = false;
                    }
                });
                return ignoreChange;
            }
        });


        var i;
        if (!sourceItems || sourceItems.length === 0) {
            result.set("None", true);
            for (i = 0; i < 4; i++) {
                result.items.push(createViewModelForCombobox("", dsName, result));
            }

        } else {

            for (i = 0; i < sourceItems.length; i++) {
                if (sourceItems[i]["code"] && sourceItems[i]["code"] != specialCodes.Choose) {
                    result.set("None", false);
                }
                result.items.push(createViewModelForCombobox(sourceItems[i].code, dsName, result));
            }
            for (i = sourceItems.length; i < 4; i++) {
                result.items.push(createViewModelForCombobox("", dsName, result));
            }
        }
        return result;
    };

    var wrapSurgeries = function (sourceItems, years) {
        var result = kendo.observable({
            None: true,
            items:[],

            tiggerNoneCheckbox: function () {
                var isEmpty = true;
                for (var i = 0; i < this.items.length; i++) {
                    if (!this.items[i].IsEmpty()) {
                        isEmpty = false;
                        break;
                    }
                }

                this.set("None", isEmpty);
            }
        });
        var i;
        if (!sourceItems || sourceItems.length === 0) {
            result.None = true;
            for (i = 0; i < 3; i++) {
                result.items.push(createViewModelForSurgery(years, {}, result));
            }

        } else {

            for (i = 0; i < sourceItems.length; i++) {
                if (sourceItems[i]["description"] != "") {
                    result.None = false;
                }
                result.items.push(createViewModelForSurgery(years, { description: sourceItems[i]["description"], month: sourceItems[i]["month"], year: sourceItems[i]["year"] }, result));
            }
            for (i = sourceItems.length; i < 3; i++) {
                result.items.push(createViewModelForSurgery(years, {}, result));
            }
        }

        return result;
    };
    var isCodeDefault = function (codeId) {
        return typeof codeId === "undefined" || codeId === "" || codeId === null || codeId === specialCodes.Choose;
    };
    var validateOptionalArray = function (isNone, array, singleName, multipleName, validationResult) {
        if (!isNone) {
            var isEmpty = true;
            for (var i = 0; i < array.length; i++) {
                if (!isCodeDefault(array[i].CodeId)) {
                    isEmpty = false;
                }
                for (var j = i + 1; j < array.length; j++) {
                    if (!isCodeDefault(array[i].CodeId) && !isCodeDefault(array[j].CodeId) && array[i].CodeId === array[j].CodeId) {
                        validationResult.valid = false;
                        validationResult.message += "You have selected duplicate " + multipleName + ". Please list each " + singleName + " only once.</br>";
                        return validationResult;
                    }
                }
            }

            if (isEmpty) {
                validationResult.valid = false;
                validationResult.message += "Please select at least one " + singleName + " or check None.</br>";
            }
        }
        return validationResult;
    };


    var validateSurgeries = function (isNone, array, dob, validationResult) {
        if (!dob) {
            return;
        }
        if (!isNone) {
            var isEmpty = true;
            for (var i = 0; i < array.length; i++) {
                if(!array[i].IsEmpty()) {
                    isEmpty = false;

                    var itemValidation = array[i].Validate(dob);

                if (!itemValidation.valid) {
                    validationResult.valid = false;
                    validationResult.message += itemValidation.message;
                }
            }
            }
            if (isEmpty) {
                validationResult.valid = false;
                validationResult.message += "Please input at least one Surgery or check None.</br>";
            }
        }
        return validationResult;
    };
    var wrapValue = function (value) {
        return typeof value === "undefined" ? "" : value;
    };

    var wrapDdValue = function (value) {

        return value || specialCodes.Choose;

    };

    var patientIdItem = 0;

    function catalogIdentifiers(obj) {
        var _obj = obj;

        for(var i=0; i < _obj.length; i++){
            _obj[i]._id = patientIdItem++;
        }

        return _obj;
    }

    snap.namespace("Snap.Common")
        .define("PatientProfileDataSources", function () {
            this.codeSetsDs = new snap.dataSource.codeSetDataSourceWrapper(
                ["medicalconditions", "medications", "medicationallergies", "eyecolor", "haircolor", "ethnicity", "bloodtype", "relationship", "heightunit", "weightunit"]
                );


            this.getDataSources = function (hospitalId) {
                var ds = {
                    MedicalConditionsSrc: this.GetMedicalConditionsSrc(hospitalId),
                    MedicalAllergiesSrc: this.GetMedicalAllergiesSrc(hospitalId),
                    PatientMedicationSrc: this.GetPatientMedicationSrc(hospitalId),
                    EthnicitySrc: this.GetEthnicitySrc(hospitalId),
                    EyeColorSrc: this.GetEyeColorSrc(hospitalId),
                    HairColorSrc: this.GetHairColorSrc(hospitalId),
                    BloodTypeSrc: this.GetBloodTypeSrc(hospitalId),
                    RelationshipSrc: this.GetRelationshipSrc(hospitalId),
                    HeightUnitSrc: this.GetHeightUnitSrc(hospitalId),
                    WeightUnitSrc: this.GetWeightUnitSrc(hospitalId),
                    CountriesSrc: this.GetCountriesSrc(),
                    OrganizationsSrc: this.GetOrganizationsSrc(),
                    TimeZoneSrc: this.GetTimeZoneSrc()
                };
                return ds;
            };

            this.GetMedicalConditionsSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("condition", hospitalId);
            };

            this.GetMedicalAllergiesSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("allerg", hospitalId);
            };

            this.GetPatientMedicationSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("medications", hospitalId);
            };

            this.GetEthnicitySrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("ethnicity", hospitalId);
            };
            this.GetEyeColorSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("eye", hospitalId);
            };
            this.GetHairColorSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("hair", hospitalId);
            };
            this.GetBloodTypeSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("blood", hospitalId);
            };
            this.GetRelationshipSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("relationship", hospitalId);
            };

            this.GetHeightUnitSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("height", hospitalId);
            };
            this.GetWeightUnitSrc = function (hospitalId) {
                return this.codeSetsDs.getCodeSetDataSource("weight", hospitalId);
            };
            this.GetCountriesSrc = function () {
                return new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: [snap.baseUrl, "/api/countrycode"].join(""),
                            dataType: "json"
                        }
                    },
                    schema: {
                        data: function (response) {
                            var data = response.data;
                            return data;
                        },
                        id: "Id"
                    }
                });
            };

            this.GetOrganizationsSrc = function () {
                return new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: [snap.baseUrl, "/api/v2/organizations"].join(""),
                            dataType: "json"
                        }
                    },
                    schema: {
                        data: function (response) {
                            var data = response.data;
                            return data;
                        },
                        id: "id"
                    }
                });
            };
            this.GetTimeZoneSrc = function () {
                return snap.dataSource.getTimeZones();

            };
        }).singleton();

    snap.namespace("Snap.Common").define("PatientProfileViewModelMode", function () {
        var ModeData = function (mode, isClinician, isReadOnly, isNew) {
            this.mode = mode;
            this.isClinician = isClinician;
            this.isReadOnly = isReadOnly;
            this.isNew = isNew;
        };

        this.Customer_EditProfile = 0;
        this.Customer_AddDependent = 1;
        this.Customer_ViewProfile = 2;
        this.Clinician_AddProfile = 3;
        this.Clinician_EditProfile = 4;
        this.Clinician_ViewProfile = 5;

        this.Customer = {
            EditProfile: new ModeData(this.Customer_EditProfile, false, false, false),
            AddDependent: new ModeData(this.Customer_AddDependent, false, false, true),
            ViewProfile: new ModeData(this.Customer_ViewProfile, false, true, false)
        };
        this.Admin = {
            EditProfile: new ModeData(this.Clinician_EditProfile, true, false, false),
            AddProfile: new ModeData(this.Clinician_AddProfile, true, false, true),
            ViewProfile: new ModeData(this.Clinician_ViewProfile, true, true, false)
        };
        this.Physician = {
            ViewProfile: new ModeData(this.Clinician_ViewProfile, true, true, false)
        };

    });

    snap.namespace("Snap.Common").use(["snapNotification", "snapHttp", "snapLoader", "Snap.Common.PatientProfileDataSources", "snap.DataService.customerDataService", "Snap.Common.PatientProfileViewModelMode", "invitationService"])
       .extend(kendo.observable)
      .define("PatientProfileEditViewModel", function ($snapNotification, $snapHttp, snapLoader, $ds, $service, $modeEnum, $invitationService) {
          var vm = this;
          this.OnBoardStatus = {

              None: 0,
              Active: 1,
              Inactive: -1
          };
          this.defaultTextFieldValue = snap.noneReportedMessage;
          this.formatTextField = function (value) {
              return ": " + (value ? value : this.defaultTextFieldValue);
          };
          this.hideLoader = function () {
              snapLoader.hideLoader();
          };
          this.viewOnly = false;
          this.isUserRegistrationMode = false;
          if (snap.hospitalSession.customerSSO === "Mandatory")
              vm.isEmailEnabled = false;
          else
              vm.isEmailEnabled = true;
          this.changesSavedCallback = function () {
              // Empty is intentional
          };
          this.cancelCallback = function () {
              // Empty is intentional
          };

          this.AuthorizeSwitched = function () {
              var viewmodel = this;
              snapPopUp.Show(
                  this.isAuthorized === 'Y' ? "Authorize Dependent" : "De-Authorize Dependent",
                  this.isAuthorized === 'Y' ? 'By adding this new user to my account, I declare that either he or she is my child or an individual ' +
                              'to which I have the obligation of care. I further state that I have all relevant legal authority to act ' +
                              'for and on behalf of this user regarding all medical related decisions regarding their personal health ' +
                              'by way of Natural Guardian status or through the granting of Medical Power-of-Attorney. My legal status ' +
                              'regarding this user meets all requirements defined within the Health Insurance Portability and Accountability ' +
                              'Act of 1996 (HIPPA).' :
             'You will no longer be able to view profile or perform consultations until you authorize again.',
               function () {
                   viewmodel.set("isAuthorizedBool", viewmodel.isAuthorized === 'Y');
                   viewmodel.trigger("change", { field: "canUploadPhoto" });

               },
               function () { viewmodel.set("isAuthorized", viewmodel.isAuthorized === 'Y' ? 'N' : 'Y'); }
              );
          };
          this.IsOrganizationVisible = snap.hospitalSettings ? snap.hospitalSettings.organizationLocation : false;
          this.IsLocationVisible = function () {
              return this.IsOrganizationVisible && !!this.get("organizationId");
          };
          this.elementsEnum = {};

          this.modeData = {};
          this.address = "";
          this.guardianAddress = "";

          this.yearsSrc = [];
          for (var i = 1920; i <= new Date().getFullYear() ; i++) {
              this.yearsSrc.push({ id: i, year: i });
          }

          this.set("medicationAllergies", wrapListSource([], patientDataSources.medicalAllergiesSrc));
          this.set("medicalConditions", wrapListSource([], patientDataSources.medicalConditionsSrc));
          this.set("currentMedications", wrapListSource([], patientDataSources.patientMedicationSrc));
          this.set("surgeries", wrapSurgeries([], this.yearsSrc));
          this.timeZoneId = "";
          this.ethnicity = specialCodes.Choose + "";
          this.ethnicityText = this.formatTextField(this.defaultTextFieldValue);
          this.bloodType = specialCodes.Choose + "";
          this.bloodTypeText = this.formatTextField(this.defaultTextFieldValue);
          this.hairColor = specialCodes.Choose + "";
          this.hairColorText = this.formatTextField(this.defaultTextFieldValue);
          this.eyeColor = specialCodes.Choose + "";
          this.eyeColorText = this.formatTextField(this.defaultTextFieldValue);
          this.heightFt = 0;
          this.heightIn = 0;
          this.heightText = this.formatTextField(this.defaultTextFieldValue);
          this.weight = 0;
          this.heightUnit = "";
          this.weightUnit = "";
          this.weightText = this.formatTextField(this.defaultTextFieldValue);

          this.patientId = 0;
          this.personId = null;
          this.guardianId = 0;
          this.isEditMode = false;
          this.isAdmin = false;
          this.isSendEmailToAdminUser = false;
          this.hospitalId = 0;
          this.profileImage = getDefaultProfileImageForPatient();
          this.profileImagePath = getDefaultProfileImageForPatient();
          this.medicalConditionsText = this.defaultTextFieldValue;
          this.medicationAllergiesText = this.defaultTextFieldValue;
          this.isChild = "";
          this.isActive = "";
          this.email = "";
          this.confirmEmail = "";
          this.relation = specialCodes.Choose + "";
          this.oldRelation = specialCodes.Choose + "";
          this.txtRelation = "";
          this.country = "";
          this.organizationId = "";
          this.organizationText = this.formatTextField(this.defaultTextFieldValue);
          this.locationId = 0;
          this.locationText = this.formatTextField(this.defaultTextFieldValue);
          this.primaryPhysician = "";
          this.primaryPhysicianContact = "";
          this.physicianSpecialist = "";
          this.physicianSpecialistContact = "";
          this.ClinicianSpecialistIsNone = false;
          this.PreferedPharmacyIsNone = false;
          this.PrimaryPhysicianIsNone = false;
          this.physicianText = this.defaultTextFieldValue;
          this.pharmacyText = this.defaultTextFieldValue;
          this.specialistText = this.defaultTextFieldValue;

          this.preferedPharmacy = "";
          this.pharmacyContact = "";

          this.patientName = "";
          this.dob = "";
          this.dobText = this.formatTextField(this.defaultTextFieldValue);
          this.ageText = this.formatTextField(this.defaultTextFieldValue);
          this.gender = "";
          this.genderText = this.formatTextField(this.defaultTextFieldValue);
          this.schoolName = "";
          this.schoolContact = "";
          this.homePhone = "";
          this.homephoneText = this.formatTextField(this.defaultTextFieldValue);
          this.genderText = this.formatTextField(this.defaultTextFieldValue);
          this.mobilePhone = "";
          this.lastName = "";
          this.LocationsSrc = [];
          this.fieldsSetByClinician = {};
          this.isPending = false;
          this.maxdate = snap.dateLimits.getTodayMaxDate();
          this.mindate = snap.dateLimits.getStartDate();
          this.identifiersDS = [];
          this.identiferTypes = [];
          this.identifiersList = [];
          this.hasIdentifiers = function(){
            return this.identifiersList.length > 0;
          };
          this.findIdentifierCode = function(title){
            for(var i = 0; this.identiferTypes.length > i; i++){
                if(this.identiferTypes[i].display == title){
                    return this.identiferTypes[i].identifierTypeCode;
                }
            }
          };

            this.identifierChange = function(e){
                var oldId = e.data._id;

                var element =  snap.util.findElement(this.identifiersDS, "_id", oldId);

                if(element) {
                    element.set("value", ""); 
                }
            };

            this.extractIdentifiersObject = function () {
                var identifiersArr = [];

                // Step 1. UPSERT all identifiers from UI.
                this.identifiersDS.forEach(function (item) {
                    if(typeof(item.value) === "string" && item.value.length > 0) {
                         identifiersArr.push(copyItemWithoutInternalInfo(item));
                    }
                });

                // Step 2. Add identifiers which should be removed.
                this.identifiersList.forEach(function(item) {
                    var index = snap.util.findIndex(identifiersArr, "identifierTypeCode" ,item.identifierTypeCode);

                    if(index < 0) {
                        var copy = copyItemWithoutInternalInfo(item);
                        copy.value = null;

                        identifiersArr.push(copy);
                    }
                });

                function copyItemWithoutInternalInfo(item) {
                    return {
                        effectiveDate: item.effectiveDate,
                        identifierTypeCode: item.identifierTypeCode,
                        identifierTypeTitle: item.identifierTypeTitle,
                        statusCode: item.statusCode,
                        value: item.value
                    };
                }

                return identifiersArr;
            };


            this.setIdentifiers = function(identifersJSON){
                // if identifiers list not exist, use empty array instead.
                if(!$.isArray(identifersJSON)) {
                    identifersJSON = [];
                }

                // copy of existed identifiers list.
                this.set("identifiersList", $.extend(true, [], identifersJSON));

                // identifiersDS used for manipulations with identifiers.
                this.set("identifiersDS", catalogIdentifiers(identifersJSON));

                // if there is no identifiers we add one empty, so user can enter data. 
                if(this.identifiersDS.length === 0) {
                    this.addNewIdentifer();
                }

                this.trigger("change", { field: "hasIdentifiers" });
            };

            this.addNewIdentifer = function() {
                var identifierItem = new kendo.observable({
                    identifierTypeCode: emptyIdentifierType,
                    value: "",
                    effectiveDate: new Date().toISOString(),
                    statusCode: 1,
                    _id: patientIdItem++,
                    identifierTypeTitle: "",
                    readOnly: false
                });

                this.identifiersDS.push(identifierItem);
                this.trigger("change", { field: "identifiersDS" });
            }

            this.vm_addIdentifer = function (e) { 
                e.preventDefault();
                this.addNewIdentifer();
            };

            this.vm_removeIdentifer = function(e) {
                var index = snap.util.findIndex(this.identifiersDS, "_id", e.data._id);

                if(index >= 0) {
                    this.identifiersDS.splice(index, 1);
                    this.trigger("change", { field: "identifiersDS" });
                }
            };

            this.allowAlphanumeric = function(e) {
                 //taking out e.ctrlKey || e.altKey which will allow illegal symbols (Ctrl + V).
                if(!isCharCodeAlphaNumeric(e.key)) {
                    e.preventDefault();
                }
            };

            this.textValidate = function(e){
                if (e.shiftKey || e.ctrlKey || e.altKey) {
                    e.preventDefault();
                } else {
                    var key = e.keyCode;
                    if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 92) || (key >= 96 && key <= 105) || (key == 109) || (key == 189))) {
                        e.preventDefault();
                    }
                }
            };

          if (snap.hospitalSettings) {
              this.isBloodTypeRequired = snap.hospitalSettings.pPIsBloodTypeRequired;
              this.isHairColorRequired = snap.hospitalSettings.pPIsHairColorRequired;
              this.isEthnicityRequired = snap.hospitalSettings.pPIsEthnicityRequired;
              this.isEyeColorRequired = snap.hospitalSettings.pPIsEyeColorRequired;
          } else {
              this.isBloodTypeRequired = false;
              this.isHairColorRequired = false;
              this.isEthnicityRequired = false;
              this.isEyeColorRequired = false;
          }

          this.IsEmailVisibleOnView = false;
          this.IsTimeZoneVisibleOnView = false;

          this.IsTimezoneVisibleOnView = false;

          this.isLoginUser = function () {
              return this.EmailIsSet() && !this.isPending && this.isActive == "A";
          };

          this.isHomeAddressRequired = function () {
              if (this.get("isDependent") !== "Y" && this.get("isDependent") !== true) {
                  return true;
              }
              return false;

          };
          this.isEmailRequired = function () {
              if (this.get("isDependent") !== "Y" && this.get("isDependent") !== true) {
                  return true;
              }
              return false;

          };
          this.isDependentBool = function () {
              return this.isDependent === "Y" || this.isDependent === true;
          };

          this.AddressPlaceHolder = function () {
              return this.isDependentVisible ? this.get("guardianAddress") : "Full Address";
          };
          this.AddressText = function () {
              if (this.get("address") !== "") {
                  return this.address;
              } else {
                  if (this.isDependentBool()) {
                      return this.get("guardianAddress");
                  }
              }
          };
          this.CellPhoneText = function () {
              var code = this.get("country");
              var phone = this.get("mobilePhone");
              var cellPhone = (!code || !phone) ? snap.noneReportedMessage : snap.formatPhoneNumber(phone, code);
              return ": " + cellPhone;
          };
          this.CellphoneView = function () {
              var code = this.get("country");
              var phone = this.get("mobilePhone");
              return !code || !phone ? "" : snap.formatPhoneNumber(phone, code);
          };
          this.IsCellPhoneSet = function () {
              var code = this.get("country");
              var phone = this.get("mobilePhone");
              return !!code && !!phone;
          };

          this.showHomePhone = function () {
              return !!this.get("homePhone");
          };

          this.title = function () {
              switch (this.get("modeData").mode) {
                  case $modeEnum.Customer_AddDependent:
                  case $modeEnum.Clinician_AddProfile:
                      if (this.isDependentVisible) {
                          return "Add Dependent for " + this.get("guardianFullName");
                      } else {
                          return "Add A New Patient";
                      }
                  case $modeEnum.Customer_EditProfile:
                  case $modeEnum.Clinician_EditProfile:
                      return "Edit Patient Profile";
                  default:
                      return "";
              }
          };

          this.IsPhotoDefault = function (path) {
              return !path || isDefaultProfileImageForPatient(path);
          };

          this.UploadPhotoText = function () {
              if (this.IsPhotoDefault(this.get("profileImage"))) {
                  return "Upload Photo";
              }
              return "Change Photo";
          };


          this.calcFullYears = function (dateOfBirth, today) {
              var dob = new Date(dateOfBirth);
              var yearDiff = today.getFullYear() - dob.getFullYear();
              if (today.getMonth() < dob.getMonth()) {
                  yearDiff--;
              }
              else if ((today.getMonth() === dob.getMonth()) && (today.getDate() < dob.getDate())) {
                  yearDiff--;
              }
              return yearDiff;
          };

          this.setUpYearsSrc = function () {
              var startDate = new Date(this.dob).getFullYear();
              var endDate = new Date().getFullYear();
              var yearsArr = [];
              for (var i = startDate; i <= endDate; i++) {
                  yearsArr.push({ id: i, year: i });
              }
              this.set("yearsSrc", yearsArr);
          };

          this.MedicalAllergiesChanged = function () {
              var none = true;
              for (var i = 0; i < 4; i++) {
                  if (this.medicationAllergies.items[i].CodeID != specialCodes.Choose) {
                      none = false;
                      break;
                  }
              }
              this.set("medicationAllergies.None", none);
          };

          this.MedicalConditionsChanged = function () {
              var none = true;
              for (var i = 0; i < 4; i++) {
                  if (this.medicalConditions.items[i].CodeID != specialCodes.Choose) {
                      none = false;
                      break;
                  }
              }
              this.set("medicalConditions.None", none);
          };


          this.PrimaryPhysitcianNoneChecked = function () {
              if (this.PrimaryPhysicianIsNone) {
                  this.set("primaryPhysician", "");
                  this.set("primaryPhysicianContact", "");
              }
          };

          this.ClinicianSpecialistNoneChecked = function () {
              if (this.ClinicianSpecialistIsNone) {
                  this.set("physicianSpecialist", "");
                  this.set("physicianSpecialistContact", "");
              }
          };

          this.PreferedPharmacyChanged = function () {
              this.set("PreferedPharmacyIsNone", !(!!this.preferedPharmacy || !!this.pharmacyContact));
          };

          this.ClinicianSpecialistChanged = function () {
              this.set("ClinicianSpecialistIsNone", !(!!this.physicianSpecialist || !!this.physicianSpecialistContact));
          };

          this.PrimaryPhysicianChanged = function () {
              this.set("PrimaryPhysicianIsNone", !(!!this.primaryPhysician || !!this.primaryPhysicianContact));
          };

          this.PreferedPharmacyNoneChecked = function () {
              if (this.PreferedPharmacyIsNone) {
                  this.set("preferedPharmacy", "");
                  this.set("pharmacyContact", "");
              }
          };

          this.NoneMedicalAllergiesChecked = function () {
              if (this.medicationAllergies.None) {
                  this.set("medicationAllergies", wrapListSource([], patientDataSources.medicalAllergiesSrc));
                  this.trigger("change", { field: "medicationAllergies.items" });
                  this.trigger("change", { field: "medicationAllergies.None" });
              }
          };

          this.NoneMedicalConditionsChecked = function () {
              if (this.medicalConditions.None) {
                  this.set("medicalConditions", wrapListSource([], patientDataSources.medicalConditionsSrc));
                  this.trigger("change", { field: "medicalConditions.items" });
                  this.trigger("change", { field: "medicalConditions.None" });
              }
          };

          this.NoneCurrentMedicationsChecked = function () {
              if (this.currentMedications.None) {
                  this.set("currentMedications", wrapListSource([], patientDataSources.patientMedicationSrc));
                  this.trigger("change", { field: "currentMedications.items" });
                  this.trigger("change", { field: "currentMedications.None" });
              }
          };
          this.NoneSurgeriesChecked = function () {
              if (this.surgeries.None) {
                  this.set("surgeries", wrapSurgeries([], this.yearsSrc));
              }
          };

          this.SetLocationSrc = function (items) {
              if (items) {
                  this.set("LocationsSrc", items);
              } else {
                  this.set("LocationsSrc", []);
              }
          };

          this.SetUpLocation = function (locationId) {
              var that = this;

              var ds = Snap.Common.PatientProfileDataSources().GetOrganizationsSrc();
              ds.read().then(
                  function () {
                      var organization = ds.get(that.organizationId);
                      that.SetLocationSrc(organization && organization.location);
                      that.set("locationId", locationId);
                  });

          };
          this.organizationChanged = function (e) {
              this.set("locationId", 0);
              this.SetLocationSrc(e.sender.dataItem().locations);

          };
          this.ageText = function () {
              if (!this.get("dob")) {
                  return this.formatTextField("");
              } else {
                  return this.formatTextField(this.dob);
              }
          };

          this.dobText = function () {
              var date = this.get("dob");
              if (typeof date === "string") {
                  return this.formatTextField(this.dob);
              } else {
                  return this.formatTextField("");
              }
          };
          this.IsPatientPending = function () {
              return this.isEmailVisible() && (!this.get("patientId") || this.get("isPending"));
          };

          this.IsInvitationPossible = function () {
              return this.IsPatientPending() && this.EmailIsSet();
          };

          this.PatientFullName = function () {
              return this.get("patientName") + " " + this.get("lastName");
          };
          this.OrganizationIsSet = function () {
              return this.get("organizationId") > 0;
          };

          this.EmailIsSet = function () {
              return !!this.get("email");
          };
          this.SetUpPhysician = function (name, contact) {
              if (name === "" || contact === "") {
                  this.set("PrimaryPhysicianIsNone", true);
              } else {
                  this.set("primaryPhysician", name);
                  this.set("primaryPhysicianContact", contact);
              }

          };
          this.setUpFunctions = function () {
              var editable = this.patientId === snap.profileSession.profileId;
              var removable = this.isDependentVisible && this.get("isPending");
              this.set("ProfileEditable", editable || this.isDependentVisible);
              this.set("ProfileRemovable", removable);
          };

          this.SetUpPharmacy = function (name, contact) {
              if (name === "" || contact === "") {
                  this.set("PreferedPharmacyIsNone", true);
              } else {
                  this.set("preferedPharmacy", name);
                  this.set("pharmacyContact", contact);
              }
          };
          this.SetUpSpecialist = function (name, contact) {
              if (name === "" || contact === "") {
                  this.set("ClinicianSpecialistIsNone", true);
              } else {
                  this.set("physicianSpecialist", name);
                  this.set("physicianSpecialistContact", contact);
              }
          };

          this.setUpDataSources = function (hospitalId) {
              this.set("organizationSrc", $ds.GetOrganizationsSrc());
              this.set("weightUnitSrc", $ds.GetWeightUnitSrc(hospitalId));
              this.set("heightUnitSrc", $ds.GetHeightUnitSrc(hospitalId));
              this.set("bloodTypeSrc", $ds.GetBloodTypeSrc(hospitalId));
              this.set("ethnicitySrc", $ds.GetEthnicitySrc(hospitalId));
              this.set("hairColorSrc", $ds.GetHairColorSrc(hospitalId));
              this.set("eyeColorSrc", $ds.GetEyeColorSrc(hospitalId));
              this.set("timeZoneSrc", $ds.GetTimeZoneSrc());
              this.set("countriesSrc", $ds.GetCountriesSrc());
              this.set("relationsSrc", $ds.GetRelationshipSrc(hospitalId));

          };
          this.setUpHeightUnit = function () {
              var vm = this;
              this.get("heightUnitSrc").read().done(function () {
                  var list = vm.get("heightUnitSrc").data();
                  if (list.length) {
                      for (var i = 0; i < list.length; i++) {
                          if (list[i].text == snap.defaultHeight) {
                              vm.set("heightUnit", list[i].codeId);
                              break;
                          }
                      }
                  }
              });
          };
          this.setUpWeightUnit = function () {
              var vm = this;
              this.get("weightUnitSrc").read().done(function () {
                  var list = vm.get("weightUnitSrc").data();
                  if (list.length) {
                      for (var i = 0; i < list.length; i++) {
                          if (list[i].text == snap.defaultWeight) {
                              vm.set("weightUnit", list[i].codeId);
                              break;
                          }
                      }
                  }
              });
          };
          this.setUpUnits = function () {
              this.setUpHeightUnit();
              this.setUpWeightUnit();
          };
          this.formatListAsText = function (list) {
              if (!list || !list.length) {
                  return this.defaultTextFieldValue;
              } else {
                  var res = [];
                  for (var i = 0; i < list.length; i++) {
                      if (list[i].code != specialCodes.Choose) {
                          res.push(list[i].description);
                      }
                  }
                  if (res.length === 0) {
                      return this.defaultTextFieldValue;
                  }
                  return res.join(", ");
              }
          };

          this.reloadProfileInfo = function () {
              var profileReloaded = $.Deferred();
              var viewmodel = this;
              $.ajax({
                  url: "/api/v2/patients/userprofile",
                  type: 'GET',
                  dataType: 'json',
                  contentType: "application/json; charset=utf-8",
                  success: function (response) {
                      var data = response.data[0];

                      var profileData = {};
                      profileData.firstName = data.firstName;
                      profileData.fullName = data.fullName;
                      profileData.gender = data.gender;
                      profileData.lastName = data.lastName;
                      profileData.profileId = data.profileId;
                      profileData.profileImage = data.profileImage
                          || getDefaultProfileImageForPatient(data.gender);
                      profileData.userId = data.userId;
                      profileData.dob = data.dob;
                      profileData.timeZone = data.timeZone;
                      profileData.timeZoneId = data.timeZoneId;
                      profileData.hasRequiredFields = data.hasRequiredFields;
                      profileData.contactNumber = data.mobilePhone;
                      profileData.isLogouted = false;

                      profileData.userRoleDescription = data.userRoleDescription; 

                      snap.setSnapJsSession("snap_patientprofile_session", profileData);
                      snapLoader.hideLoader();
                      profileReloaded.resolve(profileData);
                  },
                  error: function () {
                      snapError("Failed to Load Profile");
                      profileReloaded.reject();
                  }
              });
              return profileReloaded.promise();
          };

          this.displayBadges = function () {
              return !this.modeData.isNew;
          };
          this.displayBadgeForField = function (isSetBlyClinician) {
              if (!this.displayBadges() || isEmpty(isSetBlyClinician)) {
                  return false;
              }
              return isSetBlyClinician != this.get("modeData").isClinician;
          };

          this.ethnicityBadgeIsVisible = function () {
              return this.displayBadgeForField(vm.get("fieldsSetByClinician.ethnicity"));
          };
          this.bloodTypeBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.bloodType"));
          };
          this.hairColorBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.hairColor"));
          };
          this.eyeColorBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.eyeColor"));
          };
          this.heightBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.height"));
          };
          this.weightBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.weight"));
          };
          this.weightGeneralBadgeIsVisible = function () {
              return (this.displayBadgeForField(this.get("fieldsSetByClinician.weight")) && this.displayBadgeForField(this.get("fieldsSetByClinician.weightUnit")));
          };
          this.heightUnitBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.heightUnit"));
          };
          this.heightGeneralBadgeIsVisible = function () {
              return (this.displayBadgeForField(this.get("fieldsSetByClinician.height")) && this.displayBadgeForField(this.get("fieldsSetByClinician.heightUnit")));
          };
          this.weightUnitBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.weightUnit"));
          };
          this.organizationBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.organization"));
          };
          this.locationBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.location"));
          };
          this.primaryPhysicianGeneralBadgeIsVisible = function () {
              return (this.displayBadgeForField(this.get("fieldsSetByClinician.primaryPhysician")) && this.displayBadgeForField(this.get("fieldsSetByClinician.primaryPhysicianContact")));
          };
          this.primaryPhysicianBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.primaryPhysician"));
          };
          this.primaryPhysicianContactBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.primaryPhysicianContact"));
          };
          this.physicianSpecialistGeneralBadgeIsVisible = function () {
              return (this.displayBadgeForField(this.get("fieldsSetByClinician.physicianSpecialist")) && this.displayBadgeForField(this.get("fieldsSetByClinician.physicianSpecialistContact")));
          };
          this.physicianSpecialistBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.physicianSpecialist"));
          };
          this.physicianSpecialistContactBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.physicianSpecialistContact"));
          };
          this.pharmacyGeneralBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.preferedPharmacy")) && this.displayBadgeForField(this.get("fieldsSetByClinician.pharmacyContact"));
          };
          this.preferedPharmacyBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.preferedPharmacy"));
          };
          this.pharmacyContactBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.pharmacyContact"));
          };
          this.homePhoneBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.homePhone"));
          };
          this.patientNameBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.patientName"));
          };
          this.lastNameBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.lastName"));
          };
          this.nameBadgeIsVisible = function () {
              var badgesFields = this.get("fieldsSetByClinician");
              return this.displayBadgeForField(badgesFields.patientName || badgesFields.lastName);
          };
          this.dobBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.dob"));
          };
          this.mobilePhoneBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.mobilePhone"));
          };
          this.addressBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.address"));
          };
          this.emailBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.email"));
          };
          this.timeZoneBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.timeZone"));
          };
          this.genderBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.gender"));
          };
          this.medicalConditionsBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.medicalConditions"));
          };
          this.currentMedicationsBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.currentMedications"));
          };
          this.surgeriesBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.priorSurgeries"));
          };
          this.allergiesBadgeIsVisible = function () {
              return this.displayBadgeForField(this.get("fieldsSetByClinician.medicationAllergies"));
          };


          this.onChangeDob = function () {
              if (this.dob == null) {
                  snapError('Please enter a valid Date of Birth');
              } else if (new Date((new Date(this.dob)).toISOString().slice(0, 19) + 'Z') - new Date(this.maxdate) > 0) {
                  snapError('Date of birth cannot be in the future');
              }
          };
          this.setUpHeightText = function (heightFt, heightIn, heightUnit) {
              var ds = Snap.Common.PatientProfileDataSources().GetHeightUnitSrc(this.hospitalId);
              var vm = this;
              ds.read().then(function () {
                  if (isEmpty(heightUnit) || heightUnit == specialCodes.Choose) {
                      vm.set("heightText", vm.formatTextField(heightFt + " / " + heightIn + " " + snap.defaultHeight));
                  }
                  else {
                      ds.data().forEach(function (el) {
                          if (el.codeId === heightUnit) {
                              var units = el.text.split('/');
                              vm.set("heightText", vm.formatTextField(heightFt + " " + units[0] + " " + heightIn + " " + units[1]));
                          }
                      });
                  }
              });
          };

          this.setUpWeightText = function (weight, weightUnit) {
              var ds = Snap.Common.PatientProfileDataSources().GetWeightUnitSrc(this.hospitalId);
              var vm = this;
              ds.read().then(function () {

                  if (isEmpty(weightUnit) || weightUnit == 94) {
                      vm.set("weightText", vm.formatTextField(weight + " " + snap.defaultWeight));
                  }
                  else {
                      ds.data().forEach(function (el) {
                          if (el.codeId === weightUnit) {
                              var units = el.text;
                              vm.set("weightText", vm.formatTextField(weight + " " + units));
                          }
                      });
                  }

              });
          };
          this.setUpDefaultImage = function () {
              if (this.IsPhotoDefault(this.profileImage)) {
                  this.set("profileImage", getDefaultProfileImageForPatient(this.gender));
              }
          };
          this.setDefaultPatientData = function (data) {
              this.setUpDataSources(snap.hospitalSession.hospitalId);
              var today = new Date();
              today.setHours(0);
              today.setMinutes(0);
              today.setSeconds(0);
              this.set("dob", today);
              this.set("country", data.countryCode);
              this.set("isAuthorized", "N");
              this.set("isAuthorizedBool", false);
              this.set("isDependent", "Y");
              this.set("isDependentVisible", true);
              this.set("relation", specialCodes.Choose);
              this.set("ethnicity", specialCodes.Choose);
              this.set("eyeColor", specialCodes.Choose);
              this.set("bloodType", specialCodes.Choose);
              this.set("hairColor", specialCodes.Choose);

              if (data.addresses && data.addresses.length) {
                  this.set("address", wrapValue(data.addresses[0].addressText));
              }
              this.setUpUnits();
              this.set("guardianFullName", data.patientName + ' ' + data.lastName);
              this.trigger("change", { field: "isTimeZoneVisible" });
              this.trigger("change", { field: "isEmailVisible" });
              this.trigger("change", { field: "isLoginUser" });
          };
          this.setPatientData = function (data) {
                
              this.setUpDataSources(snap.hospitalSession.hospitalId);
              this.set("fieldsSetByClinician", data.fieldChangesTrackingDetails);
              if (data.anatomy) {
                  this.set("ethnicity", wrapDdValue(data.anatomy.ethnicityId));
                  this.set("ethnicityText", this.formatTextField(data.anatomy.ethnicity));
                  this.set("bloodType", wrapDdValue(data.anatomy.bloodTypeId));
                  this.set("bloodTypeText", this.formatTextField(data.anatomy.bloodType));
                  this.set("hairColor", wrapDdValue(data.anatomy.hairColorId));
                  this.set("hairColorText", this.formatTextField(data.anatomy.hairColor));
                  this.set("eyeColor", wrapDdValue(data.anatomy.eyeColorId));
                  this.set("eyeColorText", this.formatTextField(data.anatomy.eyeColor));

                  if (data.anatomy.height) {
                      var height = data.anatomy.height.split('|');
                      this.set("heightFt", wrapValue(height[0]));
                      this.set("heightIn", wrapValue(height[1]));
                  }
                  this.set("weight", wrapValue(data.anatomy.weight));
                  this.set("weightUnit", wrapDdValue(data.anatomy.weightUnitId));

                  this.set("heightUnit", wrapDdValue(data.anatomy.heightUnitId));
                  this.setUpHeightText(this.heightFt, this.heightIn, this.heightUnit);
                  this.setUpWeightText(this.weight, this.weightUnit);
              }
              if (!this.get("weightUnit") || this.get("weightUnit") < 0) {
                  this.setUpWeightUnit();
              }
              if (!this.get("heightUnit") || this.get("heightUnit") < 0) {
                  this.setUpHeightUnit();
              }

              if (data.account) {
                  this.set("patientId", data.account.patientId);
                  this.set("hospitalId", data.account.hospitalId);

                  this.set("profileImage", wrapValue(data.account.profileImagePath)
                      || getDefaultProfileImageForPatient(data.gender));

                  this.set("isChild", wrapValue(data.account.isChild));
                  this.set("isActive", wrapValue(data.account.isActive));
                  this.set("isUserActive", wrapValue(data.account.isUserActive));
                  if ((typeof (data.account.isDependent) === "undefined") || (data.account.isDependent === "N") || data.account.isDependent === false) {
                      this.set("isDependent", wrapValue("N"));
                      this.set("isDependentVisible", false);
                  } else {
                      this.set("isDependent", wrapValue("Y"));
                      this.set("isDependentVisible", this.patientId != snap.profileSession.profileId);
                      this.set("guardianFullName", sessionStorage.getItem('snap_guardianFullName'));
                  }
                  this.set("email", wrapValue(data.account.email));
                  this.set("confirmEmail", wrapValue(data.account.email));
                  this.set("relation", data.account.relationshipCodeId);
                  this.set("oldRelation", data.account.relationshipCodeId);
                  this.set("isAuthorized", data.account.isAuthorized);
                  this.set("isAuthorizedBool", data.account.isAuthorized === "Y");

                  this.set("timeZoneId", data.account.timeZoneId);
                  this.timeZoneSrc.read().done(function () {
                      vm.timeZoneSrc.data().forEach(function (item) {
                          if (item.id === vm.timeZoneId) {
                              vm.set("timeZoneText", item.name);
                          }
                      });

                  });
                  this.set("txtRelation", data.account.isDependent == "Y" ? data.account.relationship : data.account.userRoleDescription);

                  this.set("isPending", (data.account.isActive == "A" && data.account.isUserActive != "Y" && data.account.isUserActive != "A"));
                  this.set("IsEmailVisibleOnView", data.account.isDependent == "Y" ? !this.isPending : true);
                  this.set("IsTimeZoneVisibleOnView", data.account.isDependent == "Y" ? new Date(data.dob).toLocalISO() <= snap.dateLimits.getMinDOBforEmail().toLocalISO() && !!data.account.timeZoneId : true);
                  this.trigger("change", { field: "canUploadPhoto" });
                  this.trigger("change", { field: "isLoginUser" });
              }

              if (data.physicianDetails) {
                  this.SetUpPhysician(wrapValue(data.physicianDetails.primaryPhysician), wrapValue(data.physicianDetails.primaryPhysicianContact));
                  this.SetUpSpecialist(wrapValue(data.physicianDetails.physicianSpecialist), wrapValue(data.physicianDetails.physicianSpecialistContact));
              }
              if (data.pharmacyDetails) {
                  this.SetUpPharmacy(wrapValue(data.pharmacyDetails.preferedPharmacy), wrapValue(data.pharmacyDetails.pharmacyContact));
              }
              this.set("personId", data.personId);
              this.set("patientName", wrapValue(data.patientName));
              this.set("lastName", wrapValue(data.lastName));
              this.set("dob", data.dob);
              this.setUpYearsSrc();
              this.set("gender", data.gender ? data.gender : "M");
              this.set("genderText", this.formatTextField(data.gender));
              this.set("schoolName", wrapValue(data.schoolName));
              this.set("schoolContact", wrapValue(data.schoolContact));
              this.set("homePhone", wrapValue(data.homePhone));
              this.set("homephoneText", this.formatTextField(data.homePhone));
              this.set("organizationId", data.organizationId ? data.organizationId : 0);
              this.set("organizationText", this.formatTextField(data.organization));
              this.set("locationText", this.formatTextField(data.location));
              this.SetUpLocation(data.locationId ? data.locationId : 0);
              this.set("country", data.countryCode);
              this.set("mobilePhone", this.country ? wrapValue(data.mobilePhone).substring(this.country.length) : wrapValue(data.mobilePhone));
              if (data.addresses && data.addresses.length) {
                  this.set("address", wrapValue(data.addresses[0].addressText));
              }

              if (data.medicalHistory) {
                  this.set("medicationAllergies", wrapListSource(data.medicalHistory.medicationAllergies, patientDataSources.medicalAllergiesSrc));
                  this.set("medicationAllergiesText", this.formatListAsText(data.medicalHistory.medicationAllergies));
                  this.set("medicalConditions", wrapListSource(data.medicalHistory.medicalConditions, patientDataSources.medicalConditionsSrc));
                  this.set("medicalConditionsText", this.formatListAsText(data.medicalHistory.medicalConditions));
                  this.set("currentMedications", wrapListSource(data.medicalHistory.medications, patientDataSources.patientMedicationSrc));
                  this.set("surgeries", wrapSurgeries(data.medicalHistory.surgeries, this.yearsSrc));
              }
              this.setIdentifiers(data.identifiers);
              this.trigger("change", { field: "isEmailVisible" });
              this.trigger("change", { field: "isTimeZoneVisible" });
              this.setUpFunctions();
          };
          this.calcFullYears = function (dateOfBirth, today) {
              var dob = new Date(dateOfBirth);
              var yearDiff = today.getFullYear() - dob.getFullYear();
              if (today.getMonth() < dob.getMonth()) {
                  yearDiff--;
              } else if ((today.getMonth() === dob.getMonth()) && (today.getDate() < dob.getDate())) {
                  yearDiff--;
              }
              return yearDiff;
          };
          this.authorizeText = function () {
              return "I confirm that " + this.get("guardianFullName") + " is an authorized healthcare proxy for this dependent.";
          };

          this.isTimeZoneVisible = function () {
              if (this.isDependentVisible) {
                  return this.isEmailVisible() && ($.trim(this.get("email")).length > 0);
              } else {
                  return true;
              }
          };


          this.isDependent = "";
          this.isEmailVisible = function () {
              if (this.get("isDependentVisible")) {
                  var dob = this.get("dob");
                  return dob && new Date(dob).toLocalISO() <= snap.dateLimits.getMinDOBforEmail().toLocalISO();
              } else {
                  return true;
              }
          };
          this.EditProfile = function (e) {
              e.preventDefault();
              if (!this.isDependentVisible || this.patientId == snap.profileSession.profileId) {
                  sessionStorage.setItem("snap_patientId_ref", this.patientId);
                  window.location.href = "/patient/EditProfile";
              } else {
                  sessionStorage.setItem("snap_patientId_ref", this.patientId);
                  window.location.href = "/patient/EditDependent";
              }
          };
          this.isAuthorizedBool = false;
          this.canUploadPhoto = function () {
              return this.isAuthorizedBool || this.isActive === 'A' || this.isActive === 'Y';
          };
          this.RelationshipChanged = function (e) {
              if (this.oldRelation !== e.data.relation) {
                  var that = this;
                  if (this.oldRelation && that.patientId > 0) {
                      $snapNotification.confirmationWithCallbacks("Are you sure that you want to change the relationship for this dependent?",
                          function () {
                              that.set("oldRelation", that.relation);
                              that.set("txtRelation", e.sender.text());
                          },
                         function () {
                             that.set("relation", that.oldRelation);
                         }
                     );
                  } else {
                      that.set("oldRelation", that.relation);
                      that.set("txtRelation", e.sender.text());
                  }
              }
          };
          //TODO: Put this mechanism to backend

          this.extractCountryId = function () {
              var data = this.get("countriesSrc").data();
              for (var i = 0; i < data.length; i++) {
                  if (data[i].code == this.country)
                      return data[i].id;
              }
              return 0;
          };

          this.SendEmailInvitationToDependentUser = function (securityToken) {
              var def = $.Deferred();
              if (isEmpty(securityToken) || securityToken.length < 3) {
                  def.reject(null, null, "Error");
                  return def.promise();
              }

              if (securityToken.substring(0, 2) == "##") {
                  return $invitationService.sendEmailInvitationToDependent(securityToken.substring(2), snap.hospitalSession.hospitalId);
              } else {
                  def.reject(null, null, securityToken);
              }

              return def.promise();
          };
          this.formatISOString = function (date) {
              if (typeof date === "string") {
                  var dateComponents = date.split('/');
                  return dateComponents[2] + '-' + dateComponents[0] + '-' + dateComponents[1];
              } else {
                  // set current hours and minutes to get correct utc date
                  var now = new Date();
                  date.setHours(now.getHours());
                  date.setMinutes(now.getMinutes());
                  return date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
              }
          };
          this.sendData = function () {
              var data = {
                  emailAddress: this.email,
                  patientProfileData: {
                      patientId: this.patientId,
                      patientName: this.patientName,
                      lastName: this.lastName,
                      dob: this.formatISOString(this.dob),
                      bloodType: extractDdValue(this.bloodType),
                      eyeColor: extractDdValue(this.eyeColor),
                      gender: this.gender,
                      ethnicity: extractDdValue(this.ethnicity),
                      hairColor: extractDdValue(this.hairColor),
                      homePhone: this.homePhone,
                      mobilePhone: this.country + this.mobilePhone,
                      schoolName: this.schoolName,
                      schoolContact: this.schoolContact,
                      primaryPhysician: wrapOptionalField(this.primaryPhysician, this.primaryPhysicianContact, this.PrimaryPhysicianIsNone),
                      primaryPhysicianContact: wrapOptionalField(this.primaryPhysicianContact, this.primaryPhysician, this.PrimaryPhysicianIsNone),
                      physicianSpecialist: wrapOptionalField(this.physicianSpecialist, this.physicianSpecialistContact, this.ClinicianSpecialistIsNone),
                      physicianSpecialistContact: wrapOptionalField(this.physicianSpecialistContact, this.physicianSpecialist, this.ClinicianSpecialistIsNone),
                      preferedPharmacy: wrapOptionalField(this.preferedPharmacy, this.pharmacyContact, this.PreferedPharmacyIsNone),
                      pharmacyContact: wrapOptionalField(this.pharmacyContact, this.preferedPharmacy, this.PreferedPharmacyIsNone),
                      address: this.address,
                      profileImagePath: this.profileImagePath,
                      profileImage: this.profileImagePath || getDefaultProfileImageForPatient(),
                      height: this.heightFt + '|' + this.heightIn,
                      weight: this.weight,
                      heightUnit: extractDdValue(this.heightUnit),
                      weightUnit: extractDdValue(this.weightUnit),
                      organizationId: this.organizationId ? this.organizationId : null,
                      locationId: this.locationId ? this.locationId : null,
                      country: this.country,
                      identifiers: this.extractIdentifiersObject()
                  },
                  timeZoneId: this.timeZoneId,
                  patientProfileFieldsTracing: this.modeData.isNew ? $.extend({
                      ethnicity: this.isEthnicityRequired ? this.modeData.isClinician : this.fieldsSetByClinician.ethnicity,
                      address: this.modeData.isClinician,
                      bloodType: this.isBloodTypeRequired ? this.modeData.isClinician : this.fieldsSetByClinician.bloodType,
                      hairColor: this.isHairColorRequired ? this.modeData.isClinician : this.fieldsSetByClinician.hairColor,
                      eyeColor: this.isEyeColorRequired ? this.modeData.isClinician : this.fieldsSetByClinician.eyeColor,
                      country: this.modeData.isClinician,
                      height: this.modeData.isClinician,
                      heightUnit: this.modeData.isClinician,
                      weight: this.modeData.isClinician,
                      weightUnit: this.modeData.isClinician,
                      patientName: this.modeData.isClinician,
                      dob: this.modeData.isClinician,
                      gender: this.modeData.isClinician,
                      mobilePhone: this.modeData.isClinician,
                      lastName: this.modeData.isClinician,
                      email: this.modeData.isClinician,
                      timeZone: this.modeData.isClinician,
                      medicationAllergies: this.modeData.isClinician,
                      medicalConditions: this.modeData.isClinician,
                      currentMedications: this.modeData.isClinician,
                      priorSurgeries: this.modeData.isClinician,
                      primaryPhysician: this.fieldsSetByClinician.primaryPhysician,
                      primaryPhysicianContact: this.fieldsSetByClinician.primaryPhysicianContact,
                      physicianSpecialist: this.fieldsSetByClinician.physicianSpecialist,
                      physicianSpecialistContact: this.fieldsSetByClinician.physicianSpecialistContact,
                      preferedPharmacy: this.fieldsSetByClinician.preferedPharmacy,
                      pharmacyContact: this.fieldsSetByClinician.pharmacyContact

                  }, this.fieldsSetByClinician) : this.fieldsSetByClinician,
                  patientMedicalHistoryData: {
                      patientId: this.patientId
                  }
              };
              if (!this.medicalConditions.None) {
                  data.patientMedicalHistoryData.medicalCondition1 = extractDdValue(this.medicalConditions.items[0]);
                  data.patientMedicalHistoryData.medicalCondition2 = extractDdValue(this.medicalConditions.items[1]);
                  data.patientMedicalHistoryData.medicalCondition3 = extractDdValue(this.medicalConditions.items[2]);
                  data.patientMedicalHistoryData.medicalCondition4 = extractDdValue(this.medicalConditions.items[3]);
              }
              if (!this.medicationAllergies.None) {
                  data.patientMedicalHistoryData.allergicMedication1 = extractDdValue(this.medicationAllergies.items[0]);
                  data.patientMedicalHistoryData.allergicMedication2 = extractDdValue(this.medicationAllergies.items[1]);
                  data.patientMedicalHistoryData.allergicMedication3 = extractDdValue(this.medicationAllergies.items[2]);
                  data.patientMedicalHistoryData.allergicMedication4 = extractDdValue(this.medicationAllergies.items[3]);
              }
              if (!this.surgeries.None) {
                  data.patientMedicalHistoryData.priorSurgery1 = $.trim(this.surgeries.items[0].description);
                  data.patientMedicalHistoryData.priorSurgery2 = $.trim(this.surgeries.items[1].description);
                  data.patientMedicalHistoryData.priorSurgery3 = $.trim(this.surgeries.items[2].description);
                  data.patientMedicalHistoryData.surgery1Month = this.surgeries.items[0].month;
                  data.patientMedicalHistoryData.surgery2Month = this.surgeries.items[1].month;
                  data.patientMedicalHistoryData.surgery3Month = this.surgeries.items[2].month;
                  data.patientMedicalHistoryData.surgery1Year = this.surgeries.items[0].year;
                  data.patientMedicalHistoryData.surgery2Year = this.surgeries.items[1].year;
                  data.patientMedicalHistoryData.surgery3Year = this.surgeries.items[2].year;
              }
              if (!this.currentMedications.None) {
                  data.patientMedicalHistoryData.takingMedication1 = extractDdValue(this.currentMedications.items[0]);
                  data.patientMedicalHistoryData.takingMedication2 = extractDdValue(this.currentMedications.items[1]);
                  data.patientMedicalHistoryData.takingMedication3 = extractDdValue(this.currentMedications.items[2]);
                  data.patientMedicalHistoryData.takingMedication4 = extractDdValue(this.currentMedications.items[3]);
              }
              return this.doSendData(this, $service, data);

          };

          this.CloseProfile = function (e) {
              e.preventDefault();
              this.cancelCallback();
          };


          this.doRemoveDependentProfile = function (confirmationText, patientId) {
              $snapNotification.confirmationWithCallbacks(confirmationText, function () {
                  try {
                      snapLoader.showLoader();
                      var path = '/api/v2/patients/profiles/' + patientId;
                      $.ajax({
                          type: "DELETE",
                          url: path,
                          contentType: "application/json; charset=utf-8",
                          dataType: "json",
                          success: function (response) {
                              if (response == "Success") {
                                  snapSuccess($('#lblDependent').text() + " has been deleted successfully");
                                  setTimeout(function () {
                                      window.location = "Dependents";
                                  }, 3000);

                              }
                          },
                          error: function (xhr) {
                              if (!snap.userAborted(xhr)) {
                                  snapError(xhr.statusText);
                              }
                              snapLoader.hideLoader();
                          }
                      });
                  }
                  catch (err) {
                      logError("DeleteDependentProfile - PatientProfileView.aspx", "Error", err, "while deleting dependent patient profile  this error may occured");
                  }
              });
          };

          this.RemoveProfile = function (e) {
              e.preventDefault();

              var vm = this;
              $service.getScheduledConsultation().done(function (resp) {
                  if (resp.data && resp.data.length) {
                      var hasConsultations = false;
                      for (var i = 0; i < resp.data.length; i++) {
                          // filter all appointments to find ones for current patient
                          if (resp.data[i].patientId == vm.patientId) {
                              hasConsultations = true;
                              break;
                          }
                      }

                      if (hasConsultations) {
                          $snapNotification.confirmationWithCallbacks("This patient currently has scheduled appointments",
                              function () {
                                  vm.doRemoveProfile();
                              });
                      } else {
                          vm.doRemoveProfile();
                      }
                  } else {
                      vm.doRemoveProfile();
                  }
              });
          };

          this.doRemoveProfile = function () {
              var vm = this;
              var waitCloseNotificationTimeout = 700;

              if (!vm.isDependentVisible) {
                  //Callback to legacy code.
                  window.setTimeout(function () {
                      $snapNotification.confirmationWithCallbacks("Are you sure that you want to Remove this user?",
                      function () {

                          var PatientID = vm.patientId;

                          var Path = '/api/v2/patients/profiles/' + PatientID;
                          if (PatientID !== "") {
                              try {
                                  snapLoader.showLoader();
                                  $.ajax({
                                      type: "DELETE",
                                      url: Path,
                                      contentType: "application/json; charset=utf-8",
                                      dataType: "json",
                                      success: function (response) {
                                          if (response == "Success") {
                                              snapSuccess('User Removed Successfully');
                                              setTimeout(function () { window.location = "Users"; }, 3000);
                                          }
                                          snapLoader.hideLoader();

                                      },

                                      error: function (xhr) {
                                          if (!snap.userAborted(xhr)) {
                                              snapError(xhr.statusText);
                                          }
                                          snapLoader.hideLoader();
                                      }

                                  });
                              }
                              catch (err) {
                                  logError("DeleteUserProfile - UserProfileView.aspx", "Error", err, "while removing user profile this error may occured");
                              }
                          }
                      });
                  }, waitCloseNotificationTimeout);

              } else {
                  if (vm.patientId != "") {
                      try {
                          var dependentText = $('#lblDependent').text();
                          var confirmationText = "Are you sure that you want to delete this " + dependentText + "?";

                          window.setTimeout(function () {
                              vm.doRemoveDependentProfile(confirmationText, vm.patientId);
                          }, waitCloseNotificationTimeout);
                      }
                      catch (err) {
                          logError("DoesPatientHaveScheduledAppointments - PatientProfileView.aspx", "Error", err, "While verifying whether patient having any scheduled consultations this error may occured.");
                      }
                  }
              }
          };


          this.validateInput = function () {
              var that = this;
              var varvalidationResult = {
                  valid: true,
                  message: ""
              };

              if ($.trim(this.patientName) === "") {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please enter First name </br>";

              } else if ($.trim(this.patientName).length > 24) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "First name should contain 24 characters or less </br>";
              }

              if ($.trim(this.lastName) === "") {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please enter Last name </br>";

              } else if ($.trim(this.lastName).length > 24) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Last name should contain 24 characters or less </br>";
              }

              if (this.isEmailVisible()) {
                  if (!that.isDependentVisible) {
                      if ($.trim(this.email) === "") {
                          varvalidationResult.valid = false;
                          varvalidationResult.message += "Please enter Email address </br>";
                      } else if (!validateEmail($.trim(this.email))) {
                          varvalidationResult.valid = false;
                          varvalidationResult.message += "Please enter a valid Email address </br>";
                      }
                      if (this.modeData.isClinician) {
                          if ($.trim(this.confirmEmail) === "") {
                              varvalidationResult.valid = false;
                              varvalidationResult.message += "Please confirm Email address </br>";
                          } else if ($.trim(this.confirmEmail) !== $.trim(this.email)) {
                              varvalidationResult.valid = false;
                              varvalidationResult.message += "Email address and Email address confirmation do not match </br>";
                          }
                      }
                  } else if ($.trim(this.email) !== "") {
                      if (!validateEmail($.trim(this.email))) {
                          varvalidationResult.valid = false;
                          varvalidationResult.message += "Please enter a valid Email address </br>";
                      }
                      if (this.modeData.isClinician) {
                          if ($.trim(this.confirmEmail) === "") {
                              varvalidationResult.valid = false;
                              varvalidationResult.message += "Please confirm Email address </br>";
                          } else if ($.trim(this.confirmEmail) !== $.trim(this.email)) {
                              varvalidationResult.valid = false;
                              varvalidationResult.message += "Email address and Email address confirmation do not match </br>";
                          }
                      }
                  }
              }

              if (!this.dob) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please enter a valid Date of Birth </br>";
              } else {

                  if (new Date((new Date(this.dob)).toISOString().slice(0, 19) + 'Z') - new Date(this.maxdate) > 0) {
                      varvalidationResult.valid = false;
                      varvalidationResult.message += "Date of birth cannot be in the future </br>";
                  }
                  if ((!this.isDependentBool()|| this.isUserActive === "A") && new Date(this.dob).toLocalISO() > snap.dateLimits.getMinDOBforEmail().toLocalISO()) {
                          varvalidationResult.valid = false;
                          var age = new Date().getFullYear() - snap.dateLimits.getMinDOBforEmail().getFullYear();
                          varvalidationResult.message += "User should be at least " + age + " years old to log in to the system </br>";
                   }

              }
              if (!this.gender) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please select Gender </br>";

              }

              if (this.isEthnicityRequired && !ddValueIsNotDefault(this.ethnicity)) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please select Ethnicity </br>";

              }

              if (!isPositiveNumber(this.weight)) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please choose Weight <br />";
              }

              if (!(isPositiveNumber(this.heightFt) || isPositiveNumber(this.heightIn))) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please choose Height <br />";
              }
              var heightUnitsItem = this.heightUnitSrc.data().find(function (item) { return item.codeId == vm.heightUnit; });
              var heightUnits = typeof (heightUnitsItem) !== 'undefined' ? heightUnitsItem.text : "";
              if ((heightUnits.indexOf('in') > -1 && this.heightIn > 11) || (heightUnits.indexOf('cm') > -1 && this.heightIn > 99)) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please choose valid Height <br />";
              }


              if (!this.weightUnit || this.weightUnit == specialCodes.Choose || this.weightUnit < 0) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please choose Weight Unit<br />";
              }
              if (!this.heightUnit || this.heightUnit == specialCodes.Choose || this.heightUnit < 0) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please choose Height Unit<br />";
              }


              if (!this.isDependentBool() && $.trim(this.address) === "") {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please enter your Home Address </br>";
              }

              if (this.country == null || this.country == '') {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please Select Country for Country Code <br />";
              }

              if ((isEmpty(this.mobilePhone)) || (this.mobilePhone.trim() == '')) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please Enter Cell Phone Number <br />";
              }
              else if (this.mobilePhone && this.mobilePhone.length && this.mobilePhone.length > 10) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Cell phone allow maximum 10 chars <br />";
              }
              var emsg = ValidatePhone(getNumbersFromString(this.homePhone), "Home Phone Number", false)
              if ((emsg).length > 0) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += emsg + " <br />";

              }

              validateOptionalArray(this.medicalConditions.None, this.medicalConditions.items, 'Medical Condition', 'conditions', varvalidationResult);
              validateOptionalArray(this.medicationAllergies.None, this.medicationAllergies.items, 'Medication Allergy', 'allergies', varvalidationResult);
              validateOptionalArray(this.currentMedications.None, this.currentMedications.items, 'Current Medication', 'medications', varvalidationResult);
              validateSurgeries(this.surgeries.None, this.surgeries.items, this.dob, varvalidationResult);
              if (this.isHairColorRequired && !ddValueIsNotDefault(this.hairColor)) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please select Hair Color </br>";

              }
              if (this.isEyeColorRequired && !ddValueIsNotDefault(this.eyeColor)) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please select Eye Color </br>";

              }
              if (this.isBloodTypeRequired && !ddValueIsNotDefault(this.bloodType)) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please select Blood Type </br>";

              }
              if (this.isTimeZoneVisible() && !parseInt(this.timeZoneId)) {
                  varvalidationResult.valid = false;
                  varvalidationResult.message += "Please select your Time Zone </br>";
              }
            if (this.isDependentVisible) {
                  if (!this.relation || this.relation == specialCodes.Choose) {
                      varvalidationResult.valid = false;
                        varvalidationResult.message += "Please select Relationship between guardian and this dependent </br>";
                    }
                    
                    if (!this.modeData.isClinician && !this.isAuthorizedBool) {
                        varvalidationResult.valid = false;
                    varvalidationResult.message += "Please confirm that you are an authorized guardian for this dependent </br>";
                }
            }

            var identifierError = false,
                idTypeCodeArr = this.identifiersDS.map(function(item) {
                    return item.identifierTypeCode;
                }),
                isDuplicateId = idTypeCodeArr.some(function(item, idx) {
                    return idTypeCodeArr.indexOf(item) != idx;
                });


            for(var i = 0; i < this.identifiersDS.length; i++) {
                var item = this.identifiersDS[i];

                var errorMessage = null;
                if(item.identifierTypeCode !== emptyIdentifierType && item.value.trim() === "") {
                    errorMessage = "A selected patient ID is missing a value. </br>";
                } else if(item.value.trim() !== "" && item.identifierTypeCode === emptyIdentifierType) {
                    errorMessage = "A value is missing an ID type. </br>";
                }

                if(errorMessage) {
                    varvalidationResult.valid = false;
                    varvalidationResult.message += errorMessage;
                    break;
                }
            }

            if(isDuplicateId) {
                varvalidationResult.valid = false;
                varvalidationResult.message += "Cannot add duplicate Patient IDs </br>";
            }

              return varvalidationResult;
          };
          this.isSaving = false;
          this.saveChanges = function (e) {
              var that = this;
              e.preventDefault();
              if (that.isSaving) {
                  return;
              }
              that.isSaving = true;
              var viewmodel = this;
              if (viewmodel.patientId || viewmodel.isDependentBool()) {
                  var validation = viewmodel.validateInput();
                  if (validation.valid) {
                      $('.button.green').addClass("loading").prop("disabled", true);
                      viewmodel.saveChangesInternal().done(function () {
                          if (viewmodel.isAdmin) {
                              if (snap.hasAnyPermission(snap.security.view_patients_accounts)) {
                                  setTimeout(function () { viewmodel.changesSavedCallback(); }, 2000);
                              }
                              else {
                                  setTimeout(function () { viewmodel.changesSavedCallback(); }, 2000);
                              }
                          }
                          $('.button.green').removeClass("loading");
                          viewmodel.isSaving = false;
                      }).fail(function () {
                          $('.button.green').removeClass("loading").removeAttr("disabled");
                          viewmodel.isSaving = false;
                      });
                  } else {
                      that.isSaving = false;
                      snapError(validation.message);
                  }
              } else {
                  that.saveNewPatient(true);
              }
          };

          this.saveNewPatient = function (preventSendingInvitation) {
              var that = this;
              var validation = this.validateInput();
              if (validation.valid) {
                  var viewmodel = this;
                  snapLoader.showLoader();
                  viewmodel.sendPrimaryData(preventSendingInvitation).done(function (resp) {
                      viewmodel.patientId = resp.data[0].patientId;
                      viewmodel.invitationIsSent = !preventSendingInvitation;
                      $('.button.green').addClass("loading").prop("disabled", true);
                      viewmodel.saveChangesInternal().done(function () {
                          window.setTimeout(function() {
                              viewmodel.changesSavedCallback();
                          }, 2000);
                      }).always(function () { 
                        $('.button.green').removeClass("loading").removeAttr("disabled");
                        that.isSaving = false; 
                        snapLoader.hideLoader(); 
                    });
                  }).fail(function (error, status) {
                      if (!!error || !!status) {
                          snapError(that.formatErrorMessage(error, "Error Creating User"));
                      }

                      snapLoader.hideLoader();
                      that.isSaving = false;
                  });
              } else {
                  $snapNotification.error(validation.message);
                  that.isSaving = false;
              }
          };

          this.setChangedListener = function (isClinician) {
              var vm = this;
              vm.bind("change", function (e) {
                  if (e.field.substring(0, 'fieldsSetByClinician'.length) != 'fieldsSetByClinician') {
                      switch (e.field) {
                          case "ethnicity":
                              vm.set("fieldsSetByClinician.ethnicity", isClinician);
                              break;
                          case "address":
                              vm.set("fieldsSetByClinician.address", isClinician);
                              break;
                          case "bloodType":
                              vm.set("fieldsSetByClinician.bloodType", isClinician);
                              break;
                          case "hairColor":
                              vm.set("fieldsSetByClinician.hairColor", isClinician);
                              break;
                          case "eyeColor":
                              vm.set("fieldsSetByClinician.eyeColor", isClinician);
                              break;
                          case "heightFt":
                          case "heightIn":
                          case "heightUnit":
                              vm.set("fieldsSetByClinician.height", isClinician);
                              vm.set("fieldsSetByClinician.heightUnit", isClinician);
                              break;
                          case "weight":
                          case "weightUnit":
                              vm.set("fieldsSetByClinician.weight", isClinician);
                              vm.set("fieldsSetByClinician.weightUnit", isClinician);
                              break;
                          case "country":
                              vm.set("fieldsSetByClinician.country", isClinician);
                              break;
                          case "organizationId":
                              vm.set("fieldsSetByClinician.organization", isClinician);
                              break;
                          case "locationId":
                              vm.set("fieldsSetByClinician.location", isClinician);
                              break;
                          case "primaryPhysician":
                              vm.set("fieldsSetByClinician.primaryPhysician", isClinician);
                              break;
                          case "primaryPhysicianContact":
                              vm.set("fieldsSetByClinician.primaryPhysicianContact", isClinician);
                              break;
                          case "PrimaryPhysicianIsNone":
                              vm.set("fieldsSetByClinician.primaryPhysician", isClinician);
                              vm.set("fieldsSetByClinician.primaryPhysicianContact", isClinician);
                              break;
                          case "physicianSpecialist":
                              vm.set("fieldsSetByClinician.physicianSpecialist", isClinician);
                              break;
                          case "physicianSpecialistContact":
                              vm.set("fieldsSetByClinician.physicianSpecialistContact", isClinician);
                              break;
                          case "ClinicianSpecialistIsNone":
                              vm.set("fieldsSetByClinician.physicianSpecialist", isClinician);
                              vm.set("fieldsSetByClinician.physicianSpecialistContact", isClinician);
                              break;
                          case "preferedPharmacy":
                              vm.set("fieldsSetByClinician.preferedPharmacy", isClinician);
                              break;
                          case "pharmacyContact":
                              vm.set("fieldsSetByClinician.pharmacyContact", isClinician);
                              break;
                          case "PreferedPharmacyIsNone":
                              vm.set("fieldsSetByClinician.preferedPharmacy", isClinician);
                              vm.set("fieldsSetByClinician.pharmacyContact", isClinician);
                              break;
                          case "patientName":
                              vm.set("fieldsSetByClinician.patientName", isClinician);
                              break;
                          case "dob":
                              vm.set("fieldsSetByClinician.dob", isClinician);
                              vm.trigger("change", { field: "isEmailVisible" });
                              vm.trigger("change", { field: "IsPatientPending" });
                              vm.trigger("change", { field: "IsInvitationPossible" });
                              break;
                          case "gender":
                              vm.set("fieldsSetByClinician.gender", isClinician);
                              vm.setUpDefaultImage();
                              break;
                          case "schoolName":
                              vm.set("fieldsSetByClinician.schoolName", isClinician);
                              break;
                          case "schoolContact":
                              vm.set("fieldsSetByClinician.schoolContact", isClinician);
                              break;
                          case "homePhone":
                              vm.set("fieldsSetByClinician.homePhone", isClinician);
                              break;
                          case "mobilePhone":
                              vm.set("fieldsSetByClinician.mobilePhone", isClinician);
                              break;
                          case "lastName":
                              vm.set("fieldsSetByClinician.lastName", isClinician);
                              break;
                          case "email":
                              vm.set("fieldsSetByClinician.email", isClinician);
                              vm.trigger("change", { field: "isTimeZoneVisible" });
                              vm.trigger("change", { field: "IsInvitationPossible" });
                              vm.trigger("change", { field: "isLoginUser" });
                              break;
                          case "timeZoneId":
                              vm.set("fieldsSetByClinician.timeZone", isClinician);
                              vm.trigger("change", { field: "timeZoneClass" });
                              break;
                          case "medicationAllergies.items":
                          case "medicationAllergies.None":
                              if (!vm.medicationAllergies.ignoreChange() || e.field === "medicationAllergies.None") {
                                  vm.set("fieldsSetByClinician.medicationAllergies", isClinician);
                              }
                              break;
                          case "medicalConditions.items":
                          case "medicalConditions.None":
                              if (!vm.medicalConditions.ignoreChange() || e.field === "medicalConditions.None") {
                                  vm.set("fieldsSetByClinician.medicalConditions", isClinician);
                              }
                              break;
                          case "currentMedications.items":
                          case "currentMedications.None":
                              if (!vm.currentMedications.ignoreChange() || e.field === "currentMedications.None") {
                                  vm.set("fieldsSetByClinician.currentMedications", isClinician);
                              }
                              break;
                          case "surgeries.items":
                          case "surgeries.None":
                              vm.set("fieldsSetByClinician.priorSurgeries", isClinician);
                              break;
                          default:
                              vm = this;
                      }
                  }
              });
          };

          this.saveAndSend = function (e) {
              var viewmodel = this;
              if (this.get("patientId")) {
                  var validation = this.validateInput();
                  if (validation.valid) {
                      this.doSendInvitation = viewmodel.EmailIsSet();
                      
                      $('.button.green').addClass("loading").prop("disabled", true);
                      viewmodel.saveChangesInternal().done(function () {
                        window.setTimeout(function() {
                            viewmodel.changesSavedCallback();
                        }, 2000);

                        $('.button.green').removeClass("loading");
                      }).fail(function() {
                        $('.button.green').removeClass("loading").removeAttr("disabled");
                      });
                  } else {
                      snapError(validation.message);

                  }

              } else {
                  if (!this.isDependentBool()) {
                      this.saveNewPatient(false);
                  } else {
                      this.doSendInvitation = viewmodel.EmailIsSet();
                      this.saveChanges(e);
                  }
              }
          };

          this.onCancel = function () {
              var viewmodel = this;
              viewmodel.cancelCallback();
          };


          this.formatErrorMessage = function (error, defaultMessage) {
              if (typeof error === "undefined" || error === null) {
                  return defaultMessage;
              }

              window.console.error(error);

              var errorMessage = defaultMessage;
              if (typeof error === 'string') {
                  errorMessage = error;
              } else {
                  if (error.status === 500) {
                        var errString = JSON.stringify(error);

                        if (errString.indexOf("Cannot insert duplicate key row in object") >= 0){
                            errorMessage = "Cannot add duplicate Patient IDs";
                            catalogIdentifiers(this.identifiersDS);
                        }else{
                            errorMessage = "Internal server error";
                        }
                            
                  } else if (error.status === 404) {
                      errorMessage = "Not found";
                  } else if (error.responseText) {
                      try {
                          var payload = JSON.parse(error.responseText);
                          if (payload.message) {
                              errorMessage = payload.message;
                          } else {
                              errorMessage = error.responseText;
                          }
                      }
                      catch (e) {
                          errorMessage = error.responseText;
                      }

                  } else {
                      errorMessage = error.statusText;
                  }
              }

              return errorMessage;
          };
      });
}(jQuery, snap, kendo));
