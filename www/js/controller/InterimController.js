angular.module('starter.controllers')
.controller('InterimController', function($scope, $ionicScrollDelegate, htmlEscapeValue, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService, $filter, $timeout, StateList, CustomCalendar) {
    $rootScope.deploymentEnv = deploymentEnv;
    if (deploymentEnv !== 'Multiple') {
        $rootScope.APICommonURL = apiCommonURL;
    }
    $window.localStorage.setItem('ChkVideoConferencePage', "");
    $rootScope.is_iPadDeviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    $ionicPlatform.registerBackButtonAction(function() {
        if (($rootScope.currState.$current.name === "tab.userhome") ||
            ($rootScope.currState.$current.name === "tab.addCard") ||
            ($rootScope.currState.$current.name === "tab.submitPayment") ||
            ($rootScope.currState.$current.name === "tab.waitingRoom") ||
            ($rootScope.currState.$current.name === "tab.receipt") ||
            ($rootScope.currState.$current.name === "tab.videoConference") ||
            ($rootScope.currState.$current.name === "tab.connectionLost") ||
            ($rootScope.currState.$current.name === "tab.ReportScreen")
        ) {
            // H/W BACK button is disabled for these states (these views)
            // Do not go to the previous state (or view) for these states.
            // Do nothing here to disable H/W back button.
        } else if ($rootScope.currState.$current.name === "tab.login") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.loginSingle") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.chooseEnvironment") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.cardDetails") {
            var gSearchLength = $('.ion-google-place-container').length;
            if (($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) == 'block') {
                $ionicBackdrop.release();
                $(".ion-google-place-container").css({
                    "display": "none"
                });
            } else {
                $(".ion-google-place-container").css({
                    "display": "none"
                });
                navigator.app.backHistory();
            }
        } else {
            navigator.app.backHistory();
        }
    }, 100);
    $scope.ssoMessage = 'Authenticating..... Please wait!';
    $scope.addMinutes = function(inDate, inMinutes) {
        var newdate = new Date();
        newdate.setTime(inDate.getTime() + inMinutes * 60000);
        return newdate;
    }
    $scope.callServiceUnAvailableError = function() {
        var url = serviceAPIError;
        window.open(encodeURI(url), '_system', 'location=yes');
        return false;
    }
    $scope.doGetSingleUserHospitalInformation = function() {
        $rootScope.paymentMode = '';
        $rootScope.insuranceMode = '';
        $rootScope.onDemandMode = '';
        $rootScope.OrganizationLocation = '';
        $rootScope.PPIsBloodTypeRequired = '';
        $rootScope.PPIsHairColorRequired = '';
        $rootScope.PPIsEthnicityRequired = '';
        $rootScope.PPIsEyeColorRequired = '';
        $rootScope.InsVerificationDummy = '';
        $rootScope.InsuranceBeforeWaiting = '';
        $rootScope.HidePaymentPageBeforeWaitingRoom = '';
        var params = {
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                $rootScope.getDetails = data.data[0].enabledModules;
                $rootScope.ssopatienttoken = data.data[0].patientTokenApi;
                $rootScope.ssopatientregister = data.data[0].patientRegistrationApi;
                $rootScope.ssopatientforgetpwd = data.data[0].patientForgotPasswordApi;
                if ($rootScope.getDetails !== '') {
                    for (var i = 0; i < $rootScope.getDetails.length; i++) {
                        if ($rootScope.getDetails[i] === 'InsuranceVerification' || $rootScope.getDetails[i] === 'mInsVerification') {
                            $rootScope.insuranceMode = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'InsuranceBeforeWaiting' || $rootScope.getDetails[i] === 'mInsuranceBeforeWaiting') {
                            $rootScope.InsuranceBeforeWaiting = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'HidePaymentPageBeforeWaitingRoom' || $rootScope.getDetails[i] === 'mHidePaymentPageBeforeWaitingRoom') {
                            $rootScope.HidePaymentPageBeforeWaitingRoom = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'InsVerificationDummy' || $rootScope.getDetails[i] === 'mInsVerificationDummy') {
                            $rootScope.InsVerificationDummy = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'ECommerce' || $rootScope.getDetails[i] === 'mECommerce') {
                            $rootScope.paymentMode = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'OnDemand' || $rootScope.getDetails[i] === 'mOnDemand') {
                            $rootScope.onDemandMode = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'OrganizationLocation' || $rootScope.getDetails[i] === 'mOrganizationLocation') {
                            $rootScope.OrganizationLocation = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'PPIsBloodTypeRequired') {
                            $rootScope.PPIsBloodTypeRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'PPIsHairColorRequired') {
                            $rootScope.PPIsHairColorRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'PPIsEthnicityRequired') {
                            $rootScope.PPIsEthnicityRequired = 'on';
                        }
                        if ($rootScope.getDetails[i] === 'PPIsEyeColorRequired') {
                            $rootScope.PPIsEyeColorRequired = 'on';
                        }
                    }
                }
                $rootScope.brandColor = data.data[0].brandColor;
                $rootScope.backColor = data.data[0].brandColor;
                $rootScope.logo = data.data[0].hospitalImage;
                $rootScope.Hospital = data.data[0].brandName;
                $rootScope.singleHospital = data.data[0].brandName;
                if (deploymentEnvLogout === 'Multiple') {
                    $rootScope.alertMsgName = 'Virtual Care';
                    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                } else {
                    $rootScope.alertMsgName = $rootScope.Hospital;
                    $rootScope.reportHospitalUpperCase = $rootScope.Hospital.toUpperCase();
                }
                if(cobrandApp === 'MDAmerica' && deploymentEnv === "Single"){
                     $rootScope.cobrandApp_New = 'MDAmerica';
                     $rootScope.deploymentEnv_New = deploymentEnv;
                }
                $rootScope.HospitalTag = data.data[0].brandTitle;
                $rootScope.contactNumber = data.data[0].contactNumber;
                $rootScope.hospitalDomainName = data.data[0].hospitalDomainName;
                $rootScope.clientName = data.data[0].hospitalName;
                if (!angular.isUndefined(data.data[0].customerSso) && data.data[0].customerSso === "Mandatory") {
                    $rootScope.customerSso = "Mandatory";
                    ssoURL = data.data[0].patientLogin;
                } else {
                    $rootScope.customerSso = '';
                }
                if (!angular.isUndefined(data.data[0].patientRegistrationApi) && data.data[0].patientRegistrationApi !== "") {
                    $rootScope.isSSORegisterAvailable = data.data[0].patientRegistrationApi;
                } else {
                    $rootScope.isSSORegisterAvailable = '';
                }
            },
            error: function(data,status) {
            if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else {
                $rootScope.serverErrorMessageValidation();
              }
            }
        };
        LoginService.getHospitalInfo(params);
    }

    $scope.doGetScheduledConsulatation = function() {
        $rootScope.scheduledConsultationList = [];
        var params = {
            patientId: $rootScope.primaryPatientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                if (data !== "") {
                    $scope.scheduledConsultationList = data.data;
                    $rootScope.getScheduledList = [];
                    $rootScope.scheduleParticipants = [];
                    var currentDate = new Date();
                    currentDate = $scope.addMinutes(currentDate, -30);

                    angular.forEach($scope.scheduledConsultationList, function(index) {
                        if (currentDate < CustomCalendar.getLocalTime(index.startTime)) {
                            $rootScope.getScheduledList.push({
                                'scheduledTime': CustomCalendar.getLocalTime(index.startTime),
                                'appointmentId': index.appointmentId,
                                'appointmentStatusCode': index.appointmentStatusCode,
                                'appointmentTypeCode': index.appointmentTypeCode,
                                'availabilityBlockId': index.availabilityBlockId,
                                'endTime': index.endTime,
                                'intakeMetadata': angular.fromJson(index.intakeMetadata),
                                'participants': angular.fromJson(index.participants),
                                'waiveFee': index.waiveFee
                            });
                            angular.forEach(index.participants, function(index) {
                                $rootScope.scheduleParticipants.push({
                                    'appointmentId': index.appointmentId,
                                    'attendenceCode': index.attendenceCode,
                                    'participantId': index.participantId,
                                    'participantTypeCode': index.participantTypeCode,
                                    'person': angular.fromJson(index.person),
                                    'referenceType': index.referenceType,
                                    'status': index.status
                                });
                            })
                        }
                    });
                    $rootScope.scheduledList = $filter('filter')($filter('orderBy')($rootScope.getScheduledList, "scheduledTime"), "a");
                    $rootScope.nextAppointmentDisplay = 'none';
                    $rootScope.accountClinicianFooter = 'block';
                    var d = new Date();
                    d.setHours(d.getHours() + 12);
                    var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                    if ($rootScope.scheduledList !== '') {
                        var getReplaceTime = $rootScope.scheduledList[0].scheduledTime;
                        var currentUserHomeDate = currentUserHomeDate;

                        if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                            $rootScope.nextAppointmentDisplay = 'block';
                            $rootScope.accountClinicianFooter = 'none';
                            $rootScope.userHomeRecentAppointmentColor = '#FEEFE8';
                            $rootScope.timerCOlor = '#FEEFE8';
                            var beforAppointmentTime = getReplaceTime;
                            var doGetAppointmentTime = $scope.addMinutes(beforAppointmentTime, -30);
                            if ((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime())) {
                                $rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
                                $rootScope.timerCOlor = '#E1FCD4';
                            }
                        }
                    }
                }
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                }  else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };

        LoginService.getScheduledConsulatation(params);
    }

    $scope.doGetPrimaryPatientLastName = function() {
      var params = {
            patientId: $rootScope.primaryPatientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.primaryPatientLastNameArray = [];
                angular.forEach(data.data, function(index) {
                    $rootScope.primaryPatientLastNameArray.push({
                        'id': index.$id,
                        'patientName': index.patientName,
                        'lastName': index.lastName,
                        'profileImagePath': index.profileImagePath,
                        'mobilePhone': index.mobilePhone,
                        'homePhone': index.homePhone,
                        'primaryPhysician': index.primaryPhysician,
                        'primaryPhysicianContact': index.primaryPhysicianContact,
                        'physicianSpecialist': index.physicianSpecialist,
                        'physicianSpecialistContact': index.physicianSpecialistContact,
                        'organization': index.organization,
                        'location': index.location,
                    });
                });
                if (!angular.isUndefined($rootScope.primaryPatientLastNameArray[0].lastName)) {
                    $rootScope.primaryPatientLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.primaryPatientLastNameArray[0].lastName);
                } else {
                    $rootScope.primaryPatientLastName = '';
                }
                $rootScope.primaryPatientFullName = $rootScope.primaryPatientName + ' ' + $rootScope.primaryPatientLastName;
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                }  else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getPrimaryPatientLastName(params);
    };
    $scope.doGetPatientProfiles = function() {
      var params = {
            accessToken: $rootScope.accessToken,
            success: function(data) {
              $rootScope.primaryPatientDetails = [];
                angular.forEach(data.data, function(index) {
                    $rootScope.primaryPatientDetails.push({
                        'account': angular.fromJson(index.account),
                        'address': index.address,
                        'addresses': angular.fromJson(index.addresses),
                        'anatomy': angular.fromJson(index.anatomy),
                        'countryCode': index.countryCode,
                        'createDate': index.createDate,
                        'dob': index.dob,
                        'gender': index.gender,
                        'homePhone': index.homePhone,
                        'lastName': index.lastName,
                        'mobilePhone': index.mobilePhone,
                        'patientName': index.patientName,
                        'pharmacyDetails': index.pharmacyDetails,
                        'physicianDetails': index.physicianDetails,
                        'schoolContact': index.schoolContact,
                        'schoolName': index.schoolName
                    });
                });
                $rootScope.patientInfomation = data.data[0];
                $rootScope.patientAccount = data.data[0].account;
                $rootScope.patientAddresses = data.data[0].addresses;
                $rootScope.patientAnatomy = data.data[0].anatomy;
                $rootScope.patientPharmacyDetails = data.data[0].pharmacyDetails;
                $rootScope.patientPhysicianDetails = data.data[0].physicianDetails;
                $rootScope.PatientImage = $rootScope.patientAccount.profileImagePath;
                $rootScope.address = data.data[0].address;
                $rootScope.city = data.data[0].city;
                $rootScope.createDate = data.data[0].createDate;
                $rootScope.dob = data.data[0].dob;
                $rootScope.PatientAge = $rootScope.dob;
                $rootScope.ageBirthDate = ageFilter.getDateFilter(data.data[0].dob);
                if (typeof data.data[0].gender !== 'undefined') {
                    if (data.data[0].gender === 'F') {
                        $rootScope.primaryPatGender = "Female";
                    } else {
                        $rootScope.primaryPatGender = "Male";
                    }
                } else {
                    $rootScope.gender = "NA";
                }
                $rootScope.homePhone = data.data[0].homePhone;
                $rootScope.mobilePhone = data.data[0].mobilePhone;
                if ($rootScope.OrganizationLocation === 'on') {
                    if (typeof data.data[0].location !== 'undefined') {
                        $rootScope.location = data.data[0].location;
                    } else {
                        $rootScope.location = '';
                    }
                    if (typeof data.data[0].organization !== 'undefined') {

                        $rootScope.organization = data.data[0].organization;
                    } else {
                        $rootScope.organization = '';
                    }
                }
                $rootScope.primaryPatientName = angular.element('<div>').html(data.data[0].patientName).text();
                $rootScope.userCountry = data.data[0].country;
                if (typeof $rootScope.userCountry === 'undefined') {
                    $rootScope.userCountry = '';
                }
                $rootScope.primaryPatientGuardianName = '';
                $rootScope.state = data.data[0].state;
                $rootScope.zipCode = data.data[0].zipCode;
                $rootScope.primaryPatientId = $rootScope.patientAccount.patientId;
                $scope.doGetPrimaryPatientLastName();
                $rootScope.doGetScheduledConsulatation();
            },
            error: function(data,status) {
               if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else {
                $scope.ssoMessage = 'Authentication Failed! Please try again later!';
                $rootScope.patientInfomation = '';
                $rootScope.patientAccount = '';
                $rootScope.patientAddresses = '';
                $rootScope.patientAnatomy = '';
                $rootScope.patientPharmacyDetails = ''
                $rootScope.patientPhysicianDetails = '';
                $rootScope.PatientImage = '';
                $rootScope.address = '';
                $rootScope.city = '';
                $rootScope.createDate = '';
                $rootScope.dob = '';
                $rootScope.ageBirthDate = '';
                $rootScope.gender = '';
                $rootScope.homePhone = '';
                $rootScope.location = '';
                $rootScope.mobilePhone = '';
                $rootScope.organization = '';
                $rootScope.primaryPatientName = '';
                $rootScope.userCountry = '';
                $rootScope.primaryPatientGuardianName = '';
                $rootScope.state = '';
                $rootScope.zipCode = '';
                $rootScope.primaryPatientId = '';
              }
            }
        };

        LoginService.getPatientProfiles(params);
    };
    $scope.doGetRelatedPatientProfiles = function(redirectPage) {
      var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.RelatedPatientProfiles = [];
                angular.forEach(data.data, function(index) {
                    if (typeof index.gender !== 'undefined') {
                        if (index.gender === 'F') {
                            $scope.patGender = "Female";
                        } else {
                            $scope.patGender = "Male";
                        }
                    } else {
                        $scope.patGender = "NA";
                    }
                    var getdependRelationShip = $filter('filter')($rootScope.listOfRelationship[0].codes, {
                        codeId: index.relationCode
                    })
                    if (getdependRelationShip.length !== 0) {
                        var depRelationShip = getdependRelationShip[0].text;
                    } else {
                        var depRelationShip = '';
                    }
                    $rootScope.RelatedPatientProfiles.push({
                        'id': index.$id,
                        'patientId': index.patientId,
                        'patientName': index.patientName,
                        'profileImagePath': index.profileImagePath,
                        'relationCode': index.relationCode,
                        'depRelationShip': depRelationShip,
                        'isAuthorized': index.isAuthorized,
                        'birthdate': index.birthdate,
                        'ageBirthDate': ageFilter.getDateFilter(index.birthdate),
                        'addresses': angular.fromJson(index.addresses),
                        'gender': $scope.patGender,
                        'patientFirstName': angular.element('<div>').html(index.patientFirstName).text(),
                        'patientLastName': angular.element('<div>').html(index.patientLastName).text(),
                        'personId': index.personId,
                    });
                });
                $rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
                if (redirectPage === 'userhome') {
                    $state.go('tab.userhome');
                } else {
                    $scope.doGetExistingConsulatation();
                }
            },
            error: function(data,status) {
               if(status === 503) {
                $scope.callServiceUnAvailableError();
              } else{
                $rootScope.serverErrorMessageValidation();
              }
            }
        };
        LoginService.getRelatedPatientProfiles(params);
    };
    $scope.doGetCodesSet = function() {
      var params = {
            hospitalId: $rootScope.hospitalId,
            accessToken: $rootScope.accessToken,
            fields: 'medicalconditions,medications,medicationallergies,consultprimaryconcerns,consultsecondaryconcerns,eyecolor,haircolor,ethnicity,bloodtype,relationship,heightunit,weightunit',
            success: function(data) {
                $rootScope.hospitalCodesList = angular.fromJson(data.data[3].codes);
                $rootScope.primaryConcernList = $rootScope.hospitalCodesList;
                $rootScope.primaryConcernDataList = angular.fromJson(data.data[3].codes);
                $rootScope.getSecondaryConcernAPIList = angular.fromJson(data.data[4].codes);
                if (angular.fromJson(data.data[4].codes) !== "") {
                    $rootScope.scondaryConcernsCodesList = angular.fromJson(data.data[4].codes);
                } else {
                    $rootScope.scondaryConcernsCodesList = $rootScope.primaryConcernDataList;
                }
                $rootScope.chronicConditionsCodesList = angular.fromJson(data.data[0].codes);
                $rootScope.chronicConditionList = $rootScope.chronicConditionsCodesList;
                $rootScope.currentMedicationsCodesList = angular.fromJson(data.data[1].codes);
                $rootScope.CurrentMedicationList = $rootScope.currentMedicationsCodesList;
                $rootScope.medicationAllergiesCodesList = angular.fromJson(data.data[2].codes);
                $rootScope.MedicationAllegiesList = $rootScope.medicationAllergiesCodesList;
                $rootScope.surgeryYearsList = CustomCalendar.getSurgeryYearsList($rootScope.PatientAge);
                $rootScope.eyeHairEthnicityRelationCodeSets = [];
                angular.forEach(data.data, function(index) {
                    $rootScope.eyeHairEthnicityRelationCodeSets.push({
                        'codes': angular.fromJson(index.codes),
                        'hospitalId': index.hospitalId,
                        'name': index.name
                    });
                });
                $rootScope.listOfEyeColor = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Eye Color"
                });
                $rootScope.listOfHairColor = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Hair Color"
                });
                $rootScope.listOfEthnicity = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Ethnicity"
                });
                $rootScope.listOfRelationship = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Relationship"
                });
                $rootScope.listOfHeightunit = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Height Units"
                });
                $rootScope.listOfWeightunit = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Weight Units"
                });
                $rootScope.listOfBloodtype = $filter('filter')($rootScope.eyeHairEthnicityRelationCodeSets, {
                    name: "Blood Type"
                });
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        $rootScope.MedicationAllegiesItem = "";
        $rootScope.CurrentMedicationItem = "";
        $rootScope.PatientChronicConditionsSelected = "";
        $rootScope.SecondaryConcernText = "";
        $rootScope.PrimaryConcernText = "";
        $rootScope.PatientPrimaryConcern = "";
        $rootScope.PatientSecondaryConcern = "";
        $rootScope.PatientChronicCondition = "";
        $rootScope.patinentCurrentMedication = "";
        $rootScope.patinentMedicationAllergies = "";
        $rootScope.patientSurgeriess = "";
        $rootScope.MedicationCount === 'undefined';
        $rootScope.checkedChronic = 0;
        $rootScope.ChronicCount = "";
        $rootScope.AllegiesCount = "";
        $rootScope.checkedAllergies = 0;
        $rootScope.MedicationCount = "";
        $rootScope.checkedMedication = 0;
        $rootScope.IsValue = "";
        $rootScope.IsToPriorCount = "";
        $rootScope.IsToPriorCount = "";
        SurgeryStocksListService.ClearSurgery();
        LoginService.getCodesSet(params);
    }
    $scope.doGetExistingConsulatation = function() {
        $rootScope.consultionInformation = '';
        $rootScope.appointmentsPatientFirstName = '';
        $rootScope.appointmentsPatientLastName = '';
        $rootScope.appointmentsPatientDOB = '';
        $rootScope.appointmentsPatientGurdianName = '';
        $rootScope.appointmentsPatientImage = '';
        var params = {
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $scope.existingConsultation = data;
                $rootScope.consultionInformation = data.data[0].consultationInfo;
                $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                if (!angular.isUndefined($rootScope.consultationStatusId)) {
                    if ($rootScope.consultationStatusId === 71) {
                        navigator.notification.alert(
                            'Your consultation is already started on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId === 72) {
                        navigator.notification.alert(
                            'Your consultation is already ended.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId === 79) {
                        navigator.notification.alert(
                            'Your consultation is cancelled.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId === 80) {
                        navigator.notification.alert(
                            'Your consultation is in progress on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    }
                }
                $rootScope.patientExistInfomation = data.data[0].patientInformation;
                $rootScope.intakeForm = data.data[0].intakeForm;
                $rootScope.PatientAge = $rootScope.patientExistInfomation.dob;
                $rootScope.PatientGuardian = $rootScope.primaryPatientFullName;;
                $rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;
                $rootScope.PatientImageSelectUser = $rootScope.patientExistInfomation.profileImagePath;
                $scope.doGetExistingPatientName();
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getExistingConsulatation(params);
    }
    $scope.doGetExistingPatientName = function() {
        var params = {
            patientId: $rootScope.appointmentsPatientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.PatientFirstName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].patientName);
                $rootScope.PatientLastName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].lastName);
                if (typeof data.data[0].profileImagePath !== 'undefined' && data.data[0].profileImagePath !== '') {
                    var hosImage = data.data[0].profileImagePath;
                    if (hosImage.indexOf("http") >= 0) {
                        $rootScope.PatientImageSelectUser = hosImage;
                    } else {
                        $rootScope.PatientImageSelectUser = apiCommonURL + hosImage;
                    }
                } else {
                    $rootScope.PatientImageSelectUser = get2CharInString.getProv2Char(data.data[0].patientName + ' ' + data.data[0].lastName);
                }
                $state.go('tab.waitingRoom');
            },
            error: function(data, status) {
                if (status === 0) {
                    $scope.ErrorMessage = "Internet connection not available, Try again later!";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getPrimaryPatientLastName(params);
    }


    $rootScope.jwtKey = '';
    $scope.doGetTokenFromJWT = function() {
        var params = {
            jwtKey: $rootScope.jwtKey,
            success: function(data) {
                $rootScope.accessToken = data.data[0].access_token;
                $scope.getCurrentTimeForSessionLogout = new Date();
                $rootScope.addMinutesForSessionLogout = $scope.addMinutes($scope.getCurrentTimeForSessionLogout, 20);
                $window.localStorage.setItem('tokenExpireTime', $rootScope.addMinutesForSessionLogout);
                $window.localStorage.setItem('FlagForCheckingFirstLogin', 'Token');
                $scope.doGetCodesSet();
                $scope.doGetSingleUserHospitalInformation();
                $scope.doGetPatientProfiles();
                $scope.doGetRelatedPatientProfiles('userhome');
            },
            error: function(data, status) {
                var networkState = navigator.connection.type;
                if (networkState !== 'none') {
                    $scope.ErrorMessage = "Incorrect Password. Please try again";
                    $rootScope.Validation($scope.ErrorMessage);
                } else if(status === 503) {
                  $scope.callServiceUnAvailableError();
                } else {
                    $rootScope.serverErrorMessageValidation();
                }
            }
        };
        LoginService.getTokenFromJWT(params);
    }
    if ($stateParams.token === "jwt" && $stateParams.hospitalId === "0" && $stateParams.consultationId === "0") {
        if (window.localStorage.getItem("external_load") !== null && window.localStorage.getItem("external_load") !== "") {
            var ssoCallbackJWT = window.localStorage.getItem("external_load");
            if (ssoCallbackJWT.indexOf('jwt') > -1) {
                var EXTRA = {};
                var extQuery = window.localStorage.getItem("external_load").split('?')
                var extQueryOnly = extQuery[1];
                var query = extQueryOnly.split("&");
                for (var i = 0, max = query.length; i < max; i++) {
                    if (query[i] === "") // check for trailing & with no param
                        continue;
                    var param = query[i].split("=");
                    EXTRA[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
                }
                var jwtToken = EXTRA['jwt'];
                $rootScope.jwtKey = jwtToken;
                $scope.doGetTokenFromJWT();
            }
        }
    } else if ($stateParams.token !== "" && $stateParams.token !== "jwt" && $stateParams.hospitalId !== "" && $stateParams.consultationId !== "") {
        $rootScope.accessToken = $stateParams.token;
        $rootScope.hospitalId = $stateParams.hospitalId;
        $scope.doGetCodesSet();
        $rootScope.consultationId = $stateParams.consultationId;
        $scope.getCurrentTimeForSessionLogout = new Date();
        $rootScope.addMinutesForSessionLogout = $scope.addMinutes($scope.getCurrentTimeForSessionLogout, 20);
        $window.localStorage.setItem('tokenExpireTime', $rootScope.addMinutesForSessionLogout);
        $window.localStorage.setItem('FlagForCheckingFirstLogin', 'Token');
        $scope.doGetSingleUserHospitalInformation();
        $scope.doGetPatientProfiles();
        $scope.doGetRelatedPatientProfiles('waitingRoom');
    } else if ($stateParams.token !== "" && $stateParams.token !== "jwt" && $stateParams.hospitalId !== "" && $stateParams.consultationId === "") {
        $rootScope.accessToken = $stateParams.token;
        $rootScope.hospitalId = $stateParams.hospitalId;
        $scope.doGetCodesSet();
        $scope.getCurrentTimeForSessionLogout = new Date();
        $rootScope.addMinutesForSessionLogout = $scope.addMinutes($scope.getCurrentTimeForSessionLogout, 20);
        $window.localStorage.setItem('tokenExpireTime', $rootScope.addMinutesForSessionLogout);
        $window.localStorage.setItem('FlagForCheckingFirstLogin', 'Token');
        $scope.doGetSingleUserHospitalInformation();
        $scope.doGetPatientProfiles();
        $scope.doGetRelatedPatientProfiles('userhome');
    } else {
         if (deploymentEnvLogout === "Multiple") {
            $state.go('tab.chooseEnvironment');
        } else if (deploymentEnvLogout === "Single") {
             if(cobrandApp === 'MDAmerica' && deploymentEnv === "Single"){
                  $rootScope.cobrandApp_New = 'MDAmerica';
                  $rootScope.deploymentEnv_New = deploymentEnv;
                  $state.go('tab.login');
             } else {
                  $state.go('tab.loginSingle');
             }
        } else {
            $state.go('tab.login');
        }
    }
    $scope.showAlert = function() {};
})
