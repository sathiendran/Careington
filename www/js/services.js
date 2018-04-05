angular.module('starter.services', [])





    .service('LoginService', function ($http) {
        /*
            params: email, password, userTypeId, hospitalId
                    (event handlers): success, failure
    
    
        if(deploymentEnv == "Sandbox"){
            $rootScope.APICommonURL = 'https://sandbox.connectedcare.md';
            apiCommonURL = 'https://sandbox.connectedcare.md';
    
        }else if(deploymentEnv == "Production"){
            $rootScope.APICommonURL = 'https://connectedcare.md';
            apiCommonURL = 'https://connectedcare.md';
        }else if(deploymentEnv == "QA"){
            $rootScope.APICommonURL = 'https://snap-qa.com';
            apiCommonURL = 'https://snap-qa.com';
        }else if(deploymentEnv == "Single"){
            $rootScope.APICommonURL = 'https://sandbox.connectedcare.md';
            apiCommonURL = 'https://sandbox.connectedcare.md';
        }
    
         */
        //var apiCommonURL = 'https://snap-dev.com';

        //var apiCommonURL = 'https://sandbox.connectedcare.md';
        //var apiCommonURL = 'https://connectedcare.md';

        this.getToken = function (params) {
            var requestInfo = {
                headers: util.getHeaders(),
                url: apiCommonURL + '/api/v2/Account/Token',
                method: 'POST',
                data: {
                    UserTypeId: params.userTypeId,
                    HospitalId: params.hospitalId,
                    Email: params.email,
                    Password: params.password
                }
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }
        this.getcheckssoToken = function (params) {
            var requestInfo = {
                headers: util.getHeaders(),
                url: params.apiSsoURL,
                method: 'POST',
                data: {
                    email: params.email,
                    password: params.password
                }
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getTokenFromJWT = function (params) {
            var requestInfo = {
                headers: util.getHeaders(),
                url: apiCommonURL + '/api/v2/account/token?jwt=' + params.jwtKey,
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.ssoPasswordReset = function (params) {
            var ssoresetpassword = {
                headers: util.getHeaders(),
                url: params.apiSsoURL,
                method: 'POST',
                data: {
                    email: params.email
                }
            };
            $http(ssoresetpassword).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data);
                    }
                });
        }

        this.postSendPasswordResetEmail = function (params) {
            var confirmSendPasswordResetEmail = {
                headers: util.getHeaders(params.accessToken),
                //  url: apiCommonURL + '/api/v2/patients/' + params.patientEmail + '/mail?type=' + params.emailType + '&hospitalId=' + params.hospitalId,
                url: apiCommonURL + '/api/v2/patients/mail/' + params.emailType,
                //http://emeraldg.local/v2/patients/mail/resetPassword
                method: 'POST',
                data: {
                    userTypeId: 1,
                    email: params.patientEmail,
                    hospitalId: params.hospitalId,
                }
            };

            $http(confirmSendPasswordResetEmail).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postResendEmail = function (params) {
            var confirmResendMail = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/single-trip-registration/resend-onboarding-email',
                method: 'POST',
                data: {
                    email: params.email,
                    hospitalId: params.hospitalId,
                }
            };

            $http(confirmResendMail).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getSearchProviderList = function (params) {
            var searchProviderList = {
                headers: util.getHeaders(params.accessToken),
                // url: apiCommonURL + '/api/api/v2/patients?include=AccountDetails,Physician,Pharmacy,Anatomy,Addresses,Consultations',
                url: apiCommonURL + '/api/v2/hospitals/providers/' + params.providerSearchKey,
                method: 'GET'
            };

            $http(searchProviderList).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postSsoRegisterDetails = function (params) {
            var registerDetails = {
                headers: util.getHeaders(),
                url: params.apiSsoURL,
                method: 'POST',
                data: {
                    email: params.email,
                    password: params.password,
                    firstname: params.firstname,
                    lastname: params.lastname,
                    address: params.address,
                    dob: params.dob,
                    gender: params.gender,
                    mobileNumberWithCountryCode: params.mobile,

                }
            };

            $http(registerDetails).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                catch(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }






        this.postRegisterDetails = function (params) {
            var registerDetails = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/single-trip-registration',
                method: 'POST',
                data: {
                    address: params.address,
                    addressObject: params.addressObject,
                    dob: params.dob,
                    email: params.email,
                    name: params.name,
                    password: params.password,
                    providerId: params.providerId,
                    gender: params.gender,
                    mobileNumberWithCountryCode: params.mobileNumberWithCountryCode,
                    //  timeZoneId: params.timeZoneId,
                    //  country: params.country
                }
            };

            $http(registerDetails).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                catch(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }
        this.chkAddressForReg = function (params) {
            var AddressForReg = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/patients/registrations/availability?HospitalId=' + params.HospitalId + '&AddressText=' + params.AddressText,
                method: 'GET'
            };

            $http(AddressForReg).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getPatientProfiles = function (params) {
            var PatientDetailsList = {
                headers: util.getHeaders(params.accessToken),
                // url: apiCommonURL + '/api/v2/patients?include=AccountDetails,Physician,Pharmacy,Anatomy,Addresses,Consultations',
                // url: apiCommonURL + '/api/v2/patients/profile?include=AccountDetails,Physician,Pharmacy,Anatomy,Addresses,Consultations',
                url: apiCommonURL + '/api/v2/patients/profile?include=all,appointments',
                method: 'GET'
            };

            $http(PatientDetailsList).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getSelectedPatientProfiles = function (params) {
            var PatientDetailsList = {
                headers: util.getHeaders(params.accessToken),
                // url: apiCommonURL + '/api/v2/patients?include=AccountDetails,Physician,Pharmacy,Anatomy,Addresses,Consultations,Tracking,All',
                url: apiCommonURL + '/api/v2/patients/profile/' + params.patientId + '?include=All/role/' + 1,
                method: 'GET'
            };

            $http(PatientDetailsList).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getPrimaryPatientLastName = function (params) {
            var PatientDetailsList = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/profiles/' + params.patientId,
                method: 'GET'
            };

            $http(PatientDetailsList).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getPatientFilledAllRequirements = function (params) {
            var PatientDetailsList = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/userprofile',
                method: 'GET'
            };

            $http(PatientDetailsList).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getLocationResponse = function (params) {
            var PatientLocation = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/patients/response-rules-active',
                method: 'GET'
            };

            $http(PatientLocation).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getRelatedPatientProfiles = function (params) {
            var confirmHealthPlanList = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/familyprofiles/' + /*params.patientID +*/ 'dependents',
                method: 'GET'
            };

            $http(confirmHealthPlanList).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getScheduledNowPhoneConsulatation = function (params) {
            var requestInfo = {
                //	headers: util.getHeaders(params.accessToken),
                headers: {
                    'Authorization': 'Bearer ' + params.accessToken,
                    'X-Api-Key': util.getHeaders()["X-Api-Key"],
                    'X-Developer-Id': util.getHeaders()["X-Developer-Id"],
                    'Time-Zone': params.userTimeZoneId,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                url: apiCommonURL + '/api/v2.1/patients/filtered-appointments?appointmentStatusCodes=2&appointmentTypeCodes=1&appointmentTypeCodes=3&patientIds=' + params.patientId + '&includePatientDependents=true&startDate=' + params.yesterdayDate,
                //	 url: apiCommonURL + '/api/v2/patients/availableconsultations',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getScheduledAvailableConsultation = function (params) {
            var requestInfo = {
                //	headers: util.getHeaders(params.accessToken),
                headers: {
                    'Authorization': 'Bearer ' + params.accessToken,
                    'X-Api-Key': util.getHeaders()["X-Api-Key"],
                    'X-Developer-Id': util.getHeaders()["X-Developer-Id"],
                    'Time-Zone': params.userTimeZoneId,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                url: apiCommonURL + '/api/v2/patients/availableconsultations',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }



        this.getScheduledConsulatation = function (params) {
            //https://snap-dev.com/api/v2/patients/scheduledconsultations?patientId={patientId}
            //util.setHeaders($http, params);
            var requestInfo = {
                //headers: util.getHeaders(params.accessToken),
                headers: {
                    'Authorization': 'Bearer ' + params.accessToken,
                    'X-Api-Key': util.getHeaders()["X-Api-Key"],
                    'X-Developer-Id': util.getHeaders()["X-Developer-Id"],
                    'Time-Zone': params.userTimeZoneId,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                url: apiCommonURL + '/api/v2.1/patients/appointments?includePatientCoUsers=false ',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getIndividualScheduledConsulatation = function (params) {
            //https://snap-dev.com/api/v2/patients/scheduledconsultations?patientId={patientId}
            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                //url: apiCommonURL + '/api/v2/patients/scheduledconsultations?Id=' + params.patientId,

                url: apiCommonURL + '/api/v2.1/patients/' + params.patientId + '/details?include=Appointments&includeInactive=false',
                method: 'GET'

            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getSelectedappoimentDetails = function (params) {
            var requestInfo = {
                //  headers: util.getHeaders(params.accessToken),
                headers: {
                    'Authorization': 'Bearer ' + params.accessToken,
                    'X-Api-Key': util.getHeaders()["X-Api-Key"],
                    'X-Developer-Id': util.getHeaders()["X-Developer-Id"],
                    'Time-Zone': params.userTimeZoneId,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                url: apiCommonURL + '/api/v2.1/patients/appointments/' + params.appointmentId,
                method: 'GET'

            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getListOfCodeSet = function (params) {
            var PatientDetailsList = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/codesets?hospitalId=' + params.hospitalId + '&fields=medicalconditions, medications, medicationallergies, consultprimaryconcerns, consultsecondaryconcerns, eyecolor, haircolor, ethnicity, bloodtype, relationship, heightunit, weightunit',
                method: 'GET'
            };

            $http(PatientDetailsList).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getPatientMedicalProfile = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/medicalprofile/' + params.patientId,
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }



        this.putPatientMedicalProfile = function (params) {
            var requestpatientInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/medicalprofile/' + params.PatientId,
                method: 'PUT',
                data: {
                    MedicationAllergies: params.MedicationAllergies,
                    Surgeries: params.Surgeries,
                    MedicalConditions: params.MedicalConditions,
                    Medications: params.Medications,
                    InfantData: params.InfantData,
                    PatientId: params.PatientId
                }


            };
            $http(requestpatientInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data, status);
                    }
                });
        }
        this.putProfileUpdation = function (params) {
            var requestpatientInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/patients/profile',
                method: 'PUT',
                data: {
                    emailAddress: params.emailAddress,
                    timeZoneId: params.timeZoneId,
                    patientProfileData: params.patientProfileData,
                    patientMedicalHistoryData: params.patientMedicalHistoryData,
                    patientProfileFieldsTracing: params.patientProfileFieldsTracing
                }
            };
            $http(requestpatientInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                catch(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postGetConsultationId = function (params) {
            var registerDetails = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/patients/' + params.personID + '/encounters',

                method: 'POST',
                data: {
                    AppointmentId: params.AppointmentId
                }
            };

            $http(registerDetails).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                catch(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postOnDemandConsultation = function (params) {

            var confirmOnDemandConsultationSave = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/consultations',
                method: 'POST',
                data: params.OnDemandConsultationData
            };

            $http(confirmOnDemandConsultationSave).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }


        this.postClearHealthPlan = function (params) {
            var confirmPostClearHealthPlan = {
                headers: util.getHeaders(params.accessToken),
                //  url: apiCommonURL + '/api/v2/patients/' + params.patientEmail + '/mail?type=' + params.emailType + '&hospitalId=' + params.hospitalId,
                url: apiCommonURL + '/api/healthplan/' + params.healthPlanID + '/clear',
                method: 'POST',
                data: {
                    InsuranceCompanyName: params.InsuranceCompanyName,
                    PolicyNumber: params.PolicyNumber,
                    ConsultationId: params.ConsultationId,
                }
            };

            $http(confirmPostClearHealthPlan).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getConcentToTreat = function (params) {
            var PatientDetailsList = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/publicdocuments?documentType=' + params.documentType + '&hospitalId=' + params.hospitalId,
                method: 'GET'
            };

            $http(PatientDetailsList).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.putActiveSession = function (params) {
            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/activesessions',
                method: 'PUT',
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }
        this.getActiveSession = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/activesessions',

                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.putConsultationSave = function (params) {
            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/consultations/' + params.consultationId + '/intake',
                method: 'PUT',
                data: params.ConsultationSaveData
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getHealthPlanProvidersList = function (params) {

            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/healthplan/providers',

                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getUserAccountCondition = function (params) {

            //util.setHeaders($http, params);
            var newdate = new Date();
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                //            url: apiCommonURL + '/api/v2/patients/consultations/' + params.patientId + '/all',
                url: apiCommonURL + '/api/v2.1/patients/appointments/self-scheduling/clinicians?date=' + newdate + '&name=&availableOnly=false&patientId=' + params.patientId + '&take=20&skip=0&onlyMyProviders=false&applyVisibilityRules=true',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getExistingConsulatation = function (params) {
            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),

                url: apiCommonURL + '/api/v2/patients/consultations/' + params.consultationId + '/all',

                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getDoctorDetails = function (params) {

            var requestInfo = {
                headers: util.getHeaders(params.accessToken),

                url: apiCommonURL + '/api/v2/clinicianprofiles/' + params.doctorId,

                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getPatientHealthPlansList = function (params) {
            //util.setHeaders($http, params);

            var requestInfo = {
                headers: util.getHeaders(params.accessToken),

                //	url: apiCommonURL + '/api/v2/healthplans?patientId=' + params.patientId ,
                url: apiCommonURL + '/api/v2/healthplans?patientId=' + params.primaryPatientId + '&filterMembers=true&memberPatientId=' + params.patientId,
                //url: apiCommonURL + '/api/v2/healthplans',

                method: 'get'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postNewHealthPlan = function (params) {
            var confirmPatientProfile = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/healthplan',
                method: 'POST',
                data: {
                    //  healthPlanId: params.healthPlanID,
                    patientId: params.PatientId,
                    insuranceCompany: params.insuranceCompany,
                    insuranceCompanyNameId: params.insuranceCompanyNameId,
                    isDefaultPlan: params.isDefaultPlan,
                    insuranceCompanyPhone: params.insuranceCompanyPhone,
                    memberName: params.memberName,
                    subsciberId: params.subsciberId,
                    policyNumber: params.policyNumber,
                    subscriberFirstName: params.subscriberFirstName,
                    subscriberLastName: params.subscriberLastName,
                    subscriberDob: params.subscriberDob,
                    isActive: params.isActive,
                    payerId: params.payerId,
                    Members: params.Members
                }
            };

            $http(confirmPatientProfile).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                        return data;
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.putEditHealthPlan = function (params) {
            var confirmPatientProfile = {
                headers: util.getHeaders(params.accessToken),
                //    url: apiCommonURL + '/api/v2/reports/consultation/'+ params.consultationId +'?include=',
                url: apiCommonURL + '/api/healthplan/' + params.healthPlanID,
                method: 'PUT',
                data: {
                    healthPlanId: params.healthPlanID,
                    patientId: params.PatientId,
                    insuranceCompany: params.insuranceCompany,
                    insuranceCompanyNameId: params.insuranceCompanyNameId,
                    isDefaultPlan: params.isDefaultPlan,
                    insuranceCompanyPhone: params.insuranceCompanyPhone,
                    memberName: params.memberName,
                    subsciberId: params.subsciberId,
                    policyNumber: params.policyNumber,
                    subscriberFirstName: params.subscriberFirstName,
                    subscriberLastName: params.subscriberLastName,
                    subscriberDob: params.subscriberDob,
                    isActive: params.isActive,
                    payerId: params.payerId,
                    Members: params.Members
                }
            };

            $http(confirmPatientProfile).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                        return data;
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }


        this.PostChargifyDetails = function (params) {
            var confirmPatientProfile = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                url: params.uri,
                method: 'POST',
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    "secure[api_id]": params.api_id,
                    "secure[data]": params.data,
                    "secure[nonce]": params.nonce,
                    "secure[timestamp]": params.timestamp,
                    "secure[signature]": params.signature,
                    "signup[customer][id]": params.customerID,
                    "signup[product][id]": params.productID,
                    "signup[payment_profile][card_number]": params.card_number,
                    "signup[payment_profile][expiration_month]": params.expiration_month,
                    "signup[payment_profile][expiration_year]": params.expiration_year,
                    "signup[payment_profile][cvv]": params.cvv,
                    "signup[payment_profile][first_name]": params.first_name,
                    "signup[payment_profile][last_name]": params.last_name,
                    "signup[payment_profile][billing_address]": params.billing_address,
                    "signup[payment_profile][billing_city]": params.billing_city,
                    "signup[payment_profile][billing_state]": params.billing_state,
                    "signup[payment_profile][billing_zip]": params.billing_zip,
                    "signup[payment_profile][billing_country]": params.billing_country
                }
            };

            $http(confirmPatientProfile).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                        return data;
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }


        this.PostUpdateChargifyDetails = function (params) {
            var confirmPatientProfile = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                url: params.uri,
                method: 'POST',
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    "secure[api_id]": params.api_id,
                    "secure[data]": params.data,
                    "secure[nonce]": params.nonce,
                    "secure[timestamp]": params.timestamp,
                    "secure[signature]": params.signature,
                    "payment_profile[id]": params.profile_ID,
                    "payment_profile[card_number]": params.card_number,
                    "payment_profile[expiration_month]": params.expiration_month,
                    "payment_profile[expiration_year]": params.expiration_year,
                    "payment_profile[cvv]": params.cvv,
                    "payment_profile[first_name]": params.first_name,
                    "payment_profile[last_name]": params.last_name,
                    "payment_profile[billing_address]": params.billing_address,
                    "payment_profile[billing_city]": params.billing_city,
                    "payment_profile[billing_state]": params.billing_state,
                    "payment_profile[billing_zip]": params.billing_zip,
                    "payment_profile[billing_country]": params.billing_country
                }
            };

            $http(confirmPatientProfile).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                        return data;
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.editPaymentProfile = function (params) {
            var editPayment = {
                headers: util.getHeaders(params.accessToken),
                //    url: apiCommonURL + '/api/v2/reports/consultation/'+ params.consultationId +'?include=',
                url: apiCommonURL + '/api/patients/payments/' + params.Patientprofileid,
                method: 'PUT',
                data: {
                    emailId: params.EmailId,
                    billingAddress: params.BillingAddress,
                    cardNumber: params.CardNumber,
                    city: params.City,
                    expiryMonth: params.ExpiryMonth,
                    expiryYear: params.ExpiryYear,
                    firstName: params.FirstName,
                    lastName: params.LastName,
                    state: params.State,
                    zip: params.Zip,
                    country: params.Country,
                    profileID: params.ProfileId,
                    cvv: params.Cvv
                }
            };

            $http(editPayment).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                        return data;
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }


        this.getConsultationFinalReport = function (params) {
            //https://snap-dev.com/reports/consultationreportdetails/2440
            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                //  url: apiCommonURL + '/api/v2/reports/consultation/'+ params.consultationId +'?include=',
                url: apiCommonURL + '/api/v2/reports/consultation/' + params.consultationId + '?include=prescription',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getPatientsSoapNotes = function (params) {
            var confirmSoapPost = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/Soapnotes/Get/' + params.consultationId,
                method: 'GET'
            };

            $http(confirmSoapPost).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });

        }

        this.getPayCardDetails = function (params) {
            /*  var requestInfo = {
                  headers: util.getHeaders(params.accessToken),
                  url: apiCommonURL + '/api/v2.1/payments/direct/add-card',
                  method: 'GET'
              };*/
            var requestInfo = {
                //	headers: util.getHeaders(params.accessToken),
                headers: {
                    'Authorization': 'Bearer ' + params.accessToken,
                    'X-Api-Key': util.getHeaders()["X-Api-Key"],
                    'X-Developer-Id': util.getHeaders()["X-Developer-Id"],
                    'Time-Zone': params.userTimeZoneId,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                url: apiCommonURL + '/api/v2.1/payments/direct/add-card',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data, status);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (status == 404) {
                        if (typeof params.error != 'undefined') {
                            params.success(data, status);
                        }
                    } else {
                        if (typeof params.error != 'undefined') {
                            params.error(data, status);
                        }
                    }
                });
        }


        this.getPayUpdateCardDetails = function (params) {
		    /*  var requestInfo = {
		          headers: util.getHeaders(params.accessToken),
		          url: apiCommonURL + '/api/v2.1/payments/direct/update-card?paymentProfileId=' + params.profileID,
		          method: 'GET'
		      };*/
            var requestInfo = {
                //	headers: util.getHeaders(params.accessToken),
                headers: {
                    'Authorization': 'Bearer ' + params.accessToken,
                    'X-Api-Key': util.getHeaders()["X-Api-Key"],
                    'X-Developer-Id': util.getHeaders()["X-Developer-Id"],
                    'Time-Zone': params.userTimeZoneId,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                url: apiCommonURL + '/api/v2.1/payments/direct/update-card?paymentProfileId=' + params.profileID,
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data, status);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (status == 404) {
                        if (typeof params.error != 'undefined') {
                            params.success(data, status);
                        }
                    } else {
                        if (typeof params.error != 'undefined') {
                            params.error(data, status);
                        }
                    }
                });
        }

        this.getPatientPaymentProfile = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),

                // url: apiCommonURL + '/api/v2/patients/profile/' + params.patientId + '/payments?hospitalId=' + params.hospitalId,
                // url: apiCommonURL + '/api/v2/patients/profile/payments?hospitalId=' + params.hospitalId,
                // url: apiCommonURL + '/api/patients/' + params.patientId + '/payments',
                url: apiCommonURL + '/api/v2/patients/payments',

                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (status == 404) {
                        if (typeof params.error != 'undefined') {
                            params.success(data);
                        }
                    } else {
                        if (typeof params.error != 'undefined') {
                            params.error(data, status);
                        }
                    }
                });
        }

        this.getHospitalInfo = function (params) {
            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                // url: apiCommonURL + '/api/Hospital/Get',
                url: apiCommonURL + '/api/v2/hospital/' + params.hospitalId,

                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (status == 404) {
                        if (typeof params.error != 'undefined') {
                            params.success(data);
                        }
                    } else {
                        if (typeof params.error != 'undefined') {
                            params.error(data, status);
                        }
                    }
                });
        }


        this.getonDemandAvailability = function (params) {
            var onDemandAvailability = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/patients/ondemand/availability?providerId=' + params.hospitalId,
                method: 'GET'
            };

            $http(onDemandAvailability).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }


        this.getFacilitiesList = function (params) {
            //GET v2/patients/hospitals?email=<email>
            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/hospitals?patient=' + encodeURIComponent(params.emailAddress),
                //url: 'https://private-98763-snapmd.apiary-mock.com/api/Get503Error',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postCoPayDetails = function (params) {
            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/copay',
                method: 'POST',
                data: {
                    ProfileId: params.profileId,
                    Email: params.emailAddress,
                    Amount: params.Amount,
                    ConsultationId: params.consultationId,
                    PaymentProfileId: params.paymentProfileId
                }
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        /*params.success({
                            "transaction": "SUCCESSFUL"
                        });*/
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getCodesSet = function (params) {
            //"fields" is a comma-delimited list of the following: medicalconditions, medications, medicationallergies, consultprimaryconcerns, consultsecondaryconcerns
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),

                url: apiCommonURL + '/api/v2/codesets?hospitalId=' + params.hospitalId + '&fields=' + params.fields,

                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postPaymentProfileDetails = function (params) {
            //util.setHeaders($http, params);
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                // url: apiCommonURL + '/api/patients/' + params.userId + '/payments',
                url: apiCommonURL + '/api/v2/patients/payments',
                method: 'POST',
                data: {
                    EmailId: params.EmailId,
                    BillingAddress: params.BillingAddress,
                    CardNumber: params.CardNumber,
                    City: params.City,
                    ExpiryMonth: params.ExpiryMonth,
                    ExpiryYear: params.ExpiryYear,
                    FirstName: params.FirstName,
                    LastName: params.LastName,
                    State: params.State,
                    Zip: params.Zip,
                    Country: params.Country,
                    ProfileId: params.ProfileId,
                    Cvv: params.Cvv
                }
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postApplyHealthPlan = function (params) {
            var confirmPatientProfile = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/healthplan/' + params.healthPlanId + '/apply',
                method: 'POST',
                data: {
                    insuranceCompanyName: params.insuranceCompanyName,
                    policyNumber: params.policyNumber,
                    consultationId: params.consultationId
                }
            };

            $http(confirmPatientProfile).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postVerifyHealthPlan = function (params) {
            var confirmPatientProfile = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/healthplan/' + params.healthPlanId + '/apply?retry=1',
                method: 'POST',
                data: {
                    InsuranceCompanyName: params.insuranceCompanyName,
                    PolicyNumber: params.policyNumber,
                    ConsultationId: params.consultationId
                }
            };

            $http(confirmPatientProfile).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postSkipHealthPlan = function (params) {
            var confirmPatientProfile = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/healthplan/' + params.healthPlanId + '/skip',
                method: 'POST',
                data: {
                    InsuranceCompanyName: params.insuranceCompanyName,
                    PolicyNumber: params.policyNumber,
                    ConsultationId: params.consultationId
                }
            };

            $http(confirmPatientProfile).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.updateConsultationEvent = function (params) {
            var updatedConsultationEvent = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/consultations/events',
                method: 'POST',
                data: {
                    eventType: params.eventType,
                    consultationID: params.consultationID,
                    event: params.event
                }
            };

            $http(updatedConsultationEvent).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getVideoConferenceKeys = function (params) {
            var conferenceKeyInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/physicians/appointments/' + params.consultationId + '/videokey',

                method: 'GET'
            };

            $http(conferenceKeyInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }


        /*Account API Start*/

        this.getListOfCoUsers = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/familygroup/adults?authorizedOnly=False',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data, status);
                    }
                });
        }

        this.GetCreditDetails = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/patients/' + params.patientId + '/payments/credits',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }

        this.postDepitDetails = function (params) {
            var postDepitDetails = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/patients/' + params.patientId + '/payments/debits',
                method: 'POST',
                data: {
                    consultationId: params.consultationId
                }
            };

            $http(postDepitDetails).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                })
        }

        this.getAccountDependentDetails = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/familyprofiles/dependents',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data, status);
                    }
                });
        }

        this.deleteAccountUser = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/profiles/' + params.PatientId,
                method: 'DELETE',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }

        this.deleteAccountCoUser = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/patients/cousers/' + params.PatientId,
                method: 'DELETE',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }

        this.updateDependentsAuthorize = function (params) {
            var registerDetails = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/familygroup/' + params.patientId + '/relationship',
                method: 'PUT',
                data: {
                    RelationCodeId: params.RelationCodeId,
                    IsAuthorized: params.IsAuthorized
                }
            };
            $http(registerDetails).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.sendCoUserEmailInvitation = function (params) {
            var emailInvitationDetails = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/emails/cousers/invitations',
                method: 'POST',
                data: {
                    HospitalId: params.HospitalId,
                    UserId: params.UserId,
                    Name: params.Name,
                    Email: params.Email,
                    Token: params.Token
                }
            };
            $http(emailInvitationDetails).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getUserTimezone = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/users/current-time',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getAttachmentList = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/consultation/filesharing/' + params.consultationId + '/folder?fileSharingType=customer',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getAttachmentURL = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/filesharing/file/customer/' + params.attachmentFileId + '?patientId=0',

                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getChatTranscript = function (params) {

            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/reports/consultation/chat/' + params.consultationId,
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getWaitingRoomChatTranscript = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/reports/consultationreportdetails/chatnote/' + params.consultationId + '/1',
                method: 'GET'
            };

            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.postNewDependentuser = function (params) {

            var registerDependentdetails = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/familygroups/dependents',
                method: 'POST',
                data: {
                    EmailAddress: params.EmailAddress,
                    TimeZoneId: params.TimeZoneId,
                    PatientProfileData: params.PatientProfileData,
                    PatientMedicalHistoryData: params.PatientMedicalHistoryData,
                    PatientProfileFieldsTracing: params.PatientProfileFieldsTracing
                }
            };

            $http(registerDependentdetails).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                catch(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                })
        }

        this.postAddCousers = function (params) {

            var registerCouserdetails = {
                headers: util.getHeaders(params.accessToken),
                //  url: apiCommonURL +'/api/v2/patients/cousers',
                url: apiCommonURL + '/api/v2/familygroups/couser',
                method: 'POST',
                data: {
                    //  Name : params.firstName + " " + params.lastName,
                    Name: params.firstName,
                    Email: params.email,
                    /*	familyGroupId: params.familyGroupId,
                        relationshipId: params.relationshipId,
                        heightUnitId: params.heightUnitId,
                        weightUnitId: params.weightUnitId,
                        photo: params.photo,
                bloodType: params.bloodType,
                eyeColor: params.eyeColor,
                ethnicity: params.ethnicity,
                hairColor: params.hairColor,
                        height: params.height,
                        weight: params.weight,
                        heightUnit: params.heightUnit,
                        weightUnit: params.weightUnit,
                        address: params.address,
                        homePhone: params.homePhone,
                        mobilePhone: params.mobilePhone,
                        dob: params.dob,
                        gender: params.gender,
                        organizationName: params.organizationName,
                        locationName: params.locationName,*/
                    //	firstName: params.firstName,
                    //	lastName: params.lastName,
                    //	profileImagePath: params.profileImagePath,
                }
            };

            $http(registerCouserdetails).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                })
        }

        this.getListOfLocationOrganization = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/organizations',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data, status);
                    }
                });
        }
        this.getListOfPassedConsultations = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/' + params.patientId + '/consultations/status/' + 72,
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data, status);
                    }
                });
        }

        this.getListOfDroppedConsultations = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/' + params.patientId + '/consultations/status/' + 81,
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data, status);
                    }
                });
        }

        //appointmentStatusCodes=1&appointmentTypeCodes=1&appointmentTypeCodes=3&IncludePatientDependents=true

        this.getListOfMissedConsultation = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/patients/filtered-appointments?startDate=' + params.startDate + '&patientId=' + params.patientId + '&endDate=' + params.endDate + '&appointmentStatusCodes=' + params.appointmentStatusCodes + '&appointmentTypeCodes=1&appointmentTypeCodes=3&IncludePatientDependents=true',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data, status);
                    }
                });
        }

        this.getListOfPatientids = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/profiles/identifier-types?role/' + 1,
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }


        this.getCountiesList = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/CountryCode/Get',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }

        this.getTimezoneList = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/timezones',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }
        /* Get Token using SSO JWT Token */

        this.getTokenUsingSsoJwt = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/account/token?jwt=' + params.jwt,
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                catch(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data, status);
                    }
                });
        }
        this.getListOfCountryLocation = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/admin/rules/patient-provider-license-meta-rules',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }

        this.getInsuranceDetails = function (params) {
            var PatientInsuranceList = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/healthplan?policyNumber=' + params.policyNumber + '&patientId=' + params.patientId,
                method: 'GET'
            };

            $http(PatientInsuranceList).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }


        this.putListOfCountryLocation = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                //url: apiCommonURL + '/api/v2.1/patients/encounter/address?addressText='+ params.countrystate+'&patientID=' + params.patientID,
                url: apiCommonURL + '/api/v2.1/patients/encounter/address?patientId=' + params.patientID + '&country=' + params.countrystate + '&region=' + params.countryRegion,
                method: 'PUT',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }

        this.getAppointPaymentStatus = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/patients/copay/' + params.consultationId + '/paymentstatus',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }

        this.getCountriesList = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/addresses/countries',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }

        this.getStatesForUS = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2.1/addresses/countries/US/administrative-areas-level1',
                method: 'GET',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }




        this.getWaitingConsultent = function (params) {
            var PatientLocation = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/availableconsultations/waiting',
                method: 'GET'
            };

            $http(PatientLocation).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.error(data, status);
                    }
                });
        }
        this.deleteWaitingConsultant = function (params) {
            var requestInfo = {
                headers: util.getHeaders(params.accessToken),
                url: apiCommonURL + '/api/v2/patients/availableconsultations/waiting/' + params.consultationId,
                method: 'DELETE',
            };
            $http(requestInfo).
                success(function (data, status, headers, config) {
                    if (typeof params.success != 'undefined') {
                        params.success(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
        }

    })





    .service('SurgeryStocksListService', function () {
        var patientSurgeries = {};
        patientSurgeries = {
            SurgeriesList: [],
            addSurgery: function (SurgeryName, SurgeryDate) {
                Surgery = {
                    Name: SurgeryName,
                    Date: SurgeryDate
                };

                this.SurgeriesList.push(Surgery);

            },
            ClearSurgery: function () {
                this.SurgeriesList = [];
            }
        };
        return patientSurgeries;
    })




    .service('StateLists', function () {
        var StateDetails = [
            { "code": "US", "abbreviation": "AK", "state": "Alaska", "time_zone": "", "utc_offset": -9 }, { "code": "US", "abbreviation": "AL", "state": "Alabama", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "AR", "state": "Arkansas", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "AZ", "state": "Arizona", "time_zone": "MT", "utc_offset": -7 }, { "code": "US", "abbreviation": "CA", "state": "California", "time_zone": "PT", "utc_offset": -8 }, { "code": "US", "abbreviation": "CO", "state": "Colorado", "time_zone": "MT", "utc_offset": -7 }, { "code": "US", "abbreviation": "CT", "state": "Connecticut", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "DC", "state": "District of Columbia", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "DE", "state": "Delaware", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "FL", "state": "Florida", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "GA", "state": "Georgia", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "HI", "state": "Hawaii", "time_zone": "", "utc_offset": -10 }, { "code": "US", "abbreviation": "IA", "state": "Iowa", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "ID", "state": "Idaho", "time_zone": "MT", "utc_offset": -7 }, { "code": "US", "abbreviation": "IL", "state": "Illinois", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "IN", "state": "Indiana", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "KS", "state": "Kansas", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "KY", "state": "Kentucky", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "LA", "state": "Louisiana", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "MA", "state": "Massachusetts", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "MD", "state": "Maryland", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "ME", "state": "Maine", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "MI", "state": "Michigan", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "MN", "state": "Minnesota", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "MO", "state": "Missouri", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "MS", "state": "Mississippi", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "MT", "state": "Montana", "time_zone": "MT", "utc_offset": -7 }, { "code": "US", "abbreviation": "NC", "state": "North Carolina", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "ND", "state": "North Dakota", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "NE", "state": "Nebraska", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "NH", "state": "New Hampshire", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "NJ", "state": "New Jersey", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "NM", "state": "New Mexico", "time_zone": "MT", "utc_offset": -7 }, { "code": "US", "abbreviation": "NV", "state": "Nevada", "time_zone": "MT", "utc_offset": -7 }, { "code": "US", "abbreviation": "NY", "state": "New York", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "OH", "state": "Ohio", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "OK", "state": "Oklahoma", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "ON", "state": "Toronto", "time_zone": "ET", "utc_offset": -8 }, { "code": "US", "abbreviation": "OR", "state": "Oregon", "time_zone": "PT", "utc_offset": -8 }, { "code": "US", "abbreviation": "PA", "state": "Pennsylvania", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "RI", "state": "Rhode Island", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "SC", "state": "South Carolina", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "SD", "state": "South Dakota", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "TN", "state": "Tennessee", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "TX", "state": "Texas", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "UT", "state": "Utah", "time_zone": "MT", "utc_offset": -7 }, { "code": "US", "abbreviation": "VA", "state": "Virginia", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "VT", "state": "Vermont", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "WA", "state": "Washington", "time_zone": "PT", "utc_offset": -8 }, { "code": "US", "abbreviation": "WI", "state": "Wisconsin", "time_zone": "CT", "utc_offset": -6 }, { "code": "US", "abbreviation": "WV", "state": "West Virginia", "time_zone": "ET", "utc_offset": -5 }, { "code": "US", "abbreviation": "WY", "state": "Wyoming", "time_zone": "MT", "utc_offset": -7 }
        ];

        this.getStateDetails = function () {
            return StateDetails;
        }

    })

    .service('CountryList', function ($http) {
        /* var CountryDetails = [{"code": "US","country": "United States"},{"code": "UK","country": "United Kingdom"}];
     
         this.getCountryDetails = function(){
             return CountryDetails;
         } */

        this.getCountryDetails = function () {
            var obj = { Countries: null };

            $http.get('jsonFile/Countries.json').success(function (data) {
                obj.Countries = data;
            });

            return obj;
        }

    })


    .service('StateList', function ($http) {
        this.getStateDetails = function (params) {
            var googlePlacesUrl = 'http://maps.google.com/maps/geocode/json?address=' + params.SearchKeys + '&sensor=false&components=country:' + params.CountryCode;
            var obj = { State: null };
            $http.get(googlePlacesUrl).success(function (data) {
                obj.State = data;
                return obj;
            });

        }

        /*var request = {
                    headers: util.getHeaders(params.accessToken),
                    url: 'http://maps.google.com/maps/geocode/json?address=' + params.SearchKeys + '&sensor  =false&components=country:' + params.CountryCode,
        
                    method: 'GET'
                };
        
                $http(request).
                        success(function (data, status, headers, config) {
                            if (typeof params.success != 'undefined') {
                                params.success(data);
                            }
                        }).
                        error(function (data, status, headers, config) {
                            if (typeof params.error != 'undefined') {
                                params.success(data);
                            }
                        });
            }
            */
    })






    .service('UKStateList', function () {
        var UkStateDetails = [

            { "code": "UK", "state": "Anglesey" }, { "code": "UK", "state": "Angus (Forfarshire)" }, { "code": "UK", "state": "Antrim" }, { "code": "UK", "state": "Argyll (Argyllshire)" }, { "code": "UK", "state": "Armagh" }, { "code": "UK", "state": "Ayrshire" }, { "code": "UK", "state": "Banffshire" }, { "code": "UK", "state": "Bedfordshire" }, { "code": "UK", "state": "Berkshire" }, { "code": "UK", "state": "Angus (Forfarshire)" }, { "code": "UK", "state": "Anglesey" }, { "code": "UK", "state": "Berwickshire" }, { "code": "UK", "state": "Brecknockshire (Breconshire)" }, { "code": "UK", "state": "Buckinghamshire" }, { "code": "UK", "state": "Buteshire" }, { "code": "UK", "state": "Caernarfonshire (Carnarvonshire)" }, { "code": "UK", "state": "Caithness" }, { "code": "UK", "state": "Cambridgeshire" }, { "code": "UK", "state": "Cardiganshire" }, { "code": "UK", "state": "Carmarthenshire" }, { "code": "UK", "state": "Cheshire" }, { "code": "UK", "state": "Clackmannanshire" }, { "code": "UK", "state": "Cornwall" }, { "code": "UK", "state": "Cromartyshire" }, { "code": "UK", "state": "Cumberland" }, { "code": "UK", "state": "Denbighshire" }, { "code": "UK", "state": "Derbyshire" }, { "code": "UK", "state": "Devon" }, { "code": "UK", "state": "Dorset" }, { "code": "UK", "state": "Down" }, { "code": "UK", "state": "Dumbartonshire" }, { "code": "UK", "state": "Dumfriesshire" }, { "code": "UK", "state": "Durham" }, { "code": "UK", "state": "East Lothian" }, { "code": "UK", "state": "Essex" }, { "code": "UK", "state": "Fermanagh" }, { "code": "UK", "state": "Fife" }, { "code": "UK", "state": "Flintshire" }, { "code": "UK", "state": "Glamorgan" }, { "code": "UK", "state": "Gloucestershire" }, { "code": "UK", "state": "Hampshire" }, { "code": "UK", "state": "Herefordshire" }, { "code": "UK", "state": "Hertfordshire" }, { "code": "UK", "state": "Huntingdonshire" }, { "code": "UK", "state": "Inverness-shire" }, { "code": "UK", "state": "Kent" }, { "code": "UK", "state": "Kincardineshire" }, { "code": "UK", "state": "Kinross-shire" }, { "code": "UK", "state": "Kirkcudbrightshire" }, { "code": "UK", "state": "Lanarkshire" }, { "code": "UK", "state": "Lancashire" }, { "code": "UK", "state": "Leicestershire" }, { "code": "UK", "state": "Lincolnshire" }, { "code": "UK", "state": "Londonderry" }, { "code": "UK", "state": "Merionethshire" }, { "code": "UK", "state": "Middlesex" }, { "code": "UK", "state": "Midlothian" }, { "code": "UK", "state": "Monmouthshire" }, { "code": "UK", "state": "Montgomeryshire" }, { "code": "UK", "state": "Morayshire" }, { "code": "UK", "state": "Nairnshire" }, { "code": "UK", "state": "Norfolk" }, { "code": "UK", "state": "Northamptonshire" }, { "code": "UK", "state": "Northumberland" }, { "code": "UK", "state": "Nottinghamshire" }, { "code": "UK", "state": "Orkney" }, { "code": "UK", "state": "Oxfordshire" }, { "code": "UK", "state": "Peeblesshire" }, { "code": "UK", "state": "Pembrokeshire" }, { "code": "UK", "state": "Perthshire" }, { "code": "UK", "state": "Radnorshire" }, { "code": "UK", "state": "Renfrewshire" }, { "code": "UK", "state": "Ross-shire" }, { "code": "UK", "state": "Roxburghshire" }, { "code": "UK", "state": "Rutland" }, { "code": "UK", "state": "Selkirkshire" }, { "code": "UK", "state": "Shetland" }, { "code": "UK", "state": "Shropshire" }, { "code": "UK", "state": "Somerset" }, { "code": "UK", "state": "Staffordshire" }, { "code": "UK", "state": "Stirlingshire" }, { "code": "UK", "state": "Suffolk" }, { "code": "UK", "state": "Surrey" }, { "code": "UK", "state": "Sussex" }, { "code": "UK", "state": "Sutherland" }, { "code": "UK", "state": "Tyrone" }, { "code": "UK", "state": "Warwickshire" }, { "code": "UK", "state": "West Lothian (Linlithgowshire)" }, { "code": "UK", "state": "Westmorland" }, { "code": "UK", "state": "Wigtownshire" }, { "code": "UK", "state": "Worcestershire" }, { "code": "UK", "state": "Yorkshire" }];

        this.getUkStateDetails = function () {
            return UkStateDetails;
        }

    })


    .factory('$window.localStorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])


    .service('CustomCalendar', function ($filter) {
        var months = [
            { "value": "", "text": "MM", "selected": true },
            { "value": "01", "text": "01", "selected": false },
            { "value": "02", "text": "02", "selected": false },
            { "value": "03", "text": "03", "selected": false },
            { "value": "04", "text": "04", "selected": false },
            { "value": "05", "text": "05", "selected": false },
            { "value": "06", "text": "06", "selected": false },
            { "value": "07", "text": "07", "selected": false },
            { "value": "08", "text": "08", "selected": false },
            { "value": "09", "text": "09", "selected": false },
            { "value": "10", "text": "10", "selected": false },
            { "value": "11", "text": "11", "selected": false },
            { "value": "12", "text": "12", "selected": false }
        ];

        var surgerymonths = [
            { "value": "", "text": "MM" },
            { "value": "1", "text": "01" },
            { "value": "2", "text": "02" },
            { "value": "3", "text": "03" },
            { "value": "4", "text": "04" },
            { "value": "5", "text": "05" },
            { "value": "6", "text": "06" },
            { "value": "7", "text": "07" },
            { "value": "8", "text": "08" },
            { "value": "9", "text": "09" },
            { "value": "10", "text": "10" },
            { "value": "11", "text": "11" },
            { "value": "12", "text": "12" }
        ];

        /*var surgerymonths = [
            {"value" : "0","text" : "MM"},
            {"value" : "1", "text" : "01"},
            {"value" : "2", "text" : "02"},
            {"value" : "3", "text" : "03"},
            {"value" : "4", "text" : "04"},
            {"value" : "5", "text" : "05"},
            {"value" : "6", "text" : "06"},
            {"value" : "7", "text" : "07"},
            {"value" : "8", "text" : "08"},
            {"value" : "9", "text" : "09"},
            {"value" : "10", "text" : "10"},
            {"value" : "11", "text" : "11"},
            {"value" : "12", "text" : "12"}
       ];*/



        var monthsAll = [
            { "value": "", "text": "MM", "selected": true },
            { "value": "01", "text": "01 (Jan)", "selected": false },
            { "value": "02", "text": "02 (Feb)", "selected": false },
            { "value": "03", "text": "03 (Mar)", "selected": false },
            { "value": "04", "text": "04 (Apr)", "selected": false },
            { "value": "05", "text": "05 (May)", "selected": false },
            { "value": "06", "text": "06 (Jun)", "selected": false },
            { "value": "07", "text": "07 (Jul)", "selected": false },
            { "value": "08", "text": "08 (Aug)", "selected": false },
            { "value": "09", "text": "09 (Sep)", "selected": false },
            { "value": "10", "text": "10 (Oct)", "selected": false },
            { "value": "11", "text": "11 (Nov)", "selected": false },
            { "value": "12", "text": "12 (Dec)", "selected": false }
        ];


        this.getMonthsList = function () {
            return months;
        },
            this.getMonthsListforSurgery = function () {
                return surgerymonths;
            },

            this.getSurgeryYearsList = function (dateOfBirth) {
                var years = [];
                var now = new Date();
                var today = new Date(now.getYear(), now.getMonth(), now.getDate());

                var yearNow = now.getFullYear();
                var monthNow = now.getMonth();
                var dateNow = now.getDate();

                var dob = new Date(dateOfBirth);
                var birthYear = dob.getFullYear();
                years.push({ value: '', text: 'YYYY', selected: true });
                for (var i = birthYear; i <= yearNow; i++) {
                    years.push({ value: i, text: i });
                }
                return years;
            },

            this.getCCYearsList = function (dateOfBirth) {
                var years = [];
                var now = new Date();
                var today = new Date(now.getYear(), now.getMonth(), now.getDate());

                var yearNow = now.getFullYear();
                var monthNow = now.getMonth();
                var dateNow = now.getDate();

                years.push({ value: '', text: 'YYYY', selected: true });
                for (var i = yearNow; i <= yearNow + 10; i++) {
                    years.push({ value: i, text: i });
                }
                return years;
            }

        this.getLocalTime = function (dateTime) {
            /*var utcTime = moment.utc(dateTime).toDate();
              var localTime = $filter('date')(utcTime, 'yyyy-MM-ddTHH:mm:ss');
              return new Date(dateTime);//localTime;*/
            var year = dateTime.slice(0, 4);
            var month = dateTime.slice(5, 7) - 1;
            var day = dateTime.slice(8, 10);
            var hours = dateTime.slice(11, 13);
            var min = dateTime.slice(14, 16);
            return new Date(year, month, day, hours, min);

        }
        //vijay added
        this.getLocalTime1 = function (dateTime) {
            var serverDateTime = dateTime;
            var currentLocalTimeZoneDateTime = new Date(serverDateTime);
            return currentLocalTimeZoneDateTime;
        }

        //sakthi added
        this.GetFormattedTimeFromTimeStamp = function (jsonDate) {
            var value = jsonDate;
            var hours;
            var mins;
            if (typeof value !== "string" || value.substring(0, 6) == "/Date(") {
                var time;
                if (typeof value === "string")
                    time = new Date(parseInt(value.substring(6, value.length - 2)));
                else
                    time = new Date(value);

                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
            }
            else {
                hours = parseInt(value.substring(11, 13));
                mins = parseInt(value.substring(14, 16));
            }
            var ampm = 'AM';
            if (hours >= 12) {
                ampm = 'PM';
            }
            if (hours > 12) {
                hours -= 12;
            }
            if (hours === 0)
                hours = 12;
            if (mins < 10) {
                mins = '0' + mins;
            }
            return hours + ':' + mins + ' ' + ampm;
        }

        this.formatJSONDateShort = function(jsonDate) {

            var mon, day;
            var newDate;
            if (jsonDate != null) {
                var value = jsonDate;
                if (typeof value !== "string" || value.substring(0, 6) == "/Date(") {
                    if (typeof value === "string")
                        newDate = new Date(parseInt(value.substring(6, value.length - 2)));
                    else
                        newDate = new Date(value);
                    mon = newDate.getUTCMonth() + 1;
        
                    if (newDate.getUTCDate() < 10)
                        day = '0' + newDate.getUTCDate();
                    else
                        day = newDate.getUTCDate();
                    return (mon + "/" + day + "/" + newDate.getUTCFullYear());
                }
                else {
                    var newYear = value.substring(0, 4);
                    mon = value.substring(5, 7);
                    day = value.substring(8, 10);
        
                    return (mon + "/" + day + "/" + newYear);
                }
        
            }
            else
                return '';
        }
        // this.SnapDateTime1 = function(jsonDate) {
        //     return formatJSONDate1(jsonDate) + ' ' + GetFormattedTimeFromTimeStamp(jsonDate);
        // }
        // this.SnapDateTimeShort = function(jsonDate) {
        //     return formatJSONDateShort(jsonDate) + ' ' + GetFormattedTimeFromTimeStamp(jsonDate);
        // }

        this.getMonthName = function (PriorSurgerymonth) {
            PriorSurgerymonth = Number(PriorSurgerymonth);
            if (PriorSurgerymonth == 1) {
                return 'january';
            } else if (PriorSurgerymonth == 2) {
                return 'February';
            } else if (PriorSurgerymonth == 3) {
                return 'March';
            } else if (PriorSurgerymonth == 4) {
                return 'April';
            } else if (PriorSurgerymonth == 5) {
                return 'May';
            } else if (PriorSurgerymonth == 6) {
                return 'June';
            } else if (PriorSurgerymonth == 7) {
                return 'July';
            } else if (PriorSurgerymonth == 8) {
                return 'Auguest';
            } else if (PriorSurgerymonth == 9) {
                return 'September';
            } else if (PriorSurgerymonth == 10) {
                return 'October';
            } else if (PriorSurgerymonth == 11) {
                return 'November';
            } else if (PriorSurgerymonth == 12) {
                return 'December';
            }
        }

    })

    .service('CustomCalendarMonth', function () {
        this.getMonthName = function (PriorSurgerymonth) {
            if (PriorSurgerymonth == 'Jan') {
                return 01;
            } else if (PriorSurgerymonth == 'Feb') {
                return 02;
            } else if (PriorSurgerymonth == 'Mar') {
                return 03;
            } else if (PriorSurgerymonth == 'Apr') {
                return 04;
            } else if (PriorSurgerymonth == 'May') {
                return 05;
            } else if (PriorSurgerymonth == 'Jun') {
                return 06;
            } else if (PriorSurgerymonth == 'Jul') {
                return 07;
            } else if (PriorSurgerymonth == 'Aug') {
                return 08;
            } else if (PriorSurgerymonth == 'Sep') {
                return 09;
            } else if (PriorSurgerymonth == 'Oct') {
                return 10;
            } else if (PriorSurgerymonth == 'Nov') {
                return 11;
            } else if (PriorSurgerymonth == 'Dec') {
                return 12;
            }
        }

    })

    .service('htmlEscapeValue', function () {
        this.getHtmlEscapeValue = function (value) {
            //return angular.element('<div></div>').text(value).html();
            if (typeof value != 'undefined' && value != '') {
                return angular.element('<div>').html(value).text();
            }
        };

    })

    .service('replaceCardNumber', function () {
        this.getCardNumber = function (cardNo) {
            var str = cardNo;
            var res1 = str.replace("XXXX-XXXX-XXXX-", '');
            var res = res1.replace("XXXX", '');
            return res;
        };
    })

    .service('get2CharInString', function () {
        this.getProv2Char = function (providerName) {
            var str = providerName;
            var matches = str.match(/\b(\w)/g);
            var acronym = matches.join('').toUpperCase();
            if (acronym.length == 2) {
                var getProvider2char = acronym;
            } else if (acronym.length == 1) {
                var getProvider2char = acronym;
            } else if (acronym.length > 2) {
                var getProvider2char = acronym.substring(0, 2);
            }
            return getProvider2char;
        };
    })

    .service('ageFilter', function () {
        //this.getAge = function(dateString) {
        //.filter('ageFilter', function() {
        function getAge(dateString) {
            var now = new Date();
            var today = new Date(now.getYear(), now.getMonth(), now.getDate());

            var yearNow = now.getYear();
            var monthNow = now.getMonth();
            var dateNow = now.getDate();

            var dob = new Date(dateString.substring(6, 10),
                dateString.substring(0, 2) - 1,
                dateString.substring(3, 5)
            );

            var yearDob = dob.getYear();
            var monthDob = dob.getMonth();
            var dateDob = dob.getDate();
            var age = {};
            var ageString = "";
            var yearString = "";
            var monthString = "";
            var dayString = "";


            yearAge = yearNow - yearDob;

            if (monthNow >= monthDob)
                var monthAge = monthNow - monthDob;
            else {
                yearAge--;
                var monthAge = 12 + monthNow - monthDob;
            }

            if (dateNow >= dateDob)
                var dateAge = dateNow - dateDob;
            else {
                monthAge--;
                var dateAge = 31 + dateNow - dateDob;

                if (monthAge < 0) {
                    monthAge = 11;
                    yearAge--;
                }
            }

            age = {
                years: yearAge,
                months: monthAge,
                days: dateAge
            };

            /*  if ( age.years > 1 ) yearString = " years";
              else yearString = " year";
              if ( age.months> 1 ) monthString = " months";
              else monthString = " month";
              if ( age.days > 1 ) dayString = " days";
              else dayString = " day";
        
        
               if(age.years == 0 ) {
                    if(age.days <= 15) {
                        return ageString = '0.' + age.months;
                    } else if (age.days > 15) {
                         return ageString = '0.' + (age.months + 1);
                    }
               }
                if (age.years > 0) { return ageString = age.years; }
                */

            yearString = "yrs";
            monthString = "m";
            //dayString = "days";
            dayString = "d";

            if (age.years == 0) {
                /*if(age.days <= 15) {
                    return ageString = age.months + monthString;
                } else if (age.days > 15) {
                     return ageString = (age.months + 1) + monthString;
                }*/
                var dob1 = new Date(dateString);
                var difdt1 = new Date(new Date() - dob1);
                var num_years = difdt1 / 31536000000;
                var num_months = (difdt1 % 31536000000) / 2628000000;
                var num_days = ((difdt1 % 31536000000) % 2628000000) / 86400000;
                return ageString = Math.floor(num_months) + monthString + '/' + Math.floor(num_days) + dayString;
            }
            if (age.years > 0) {
                if (age.days <= 15) {
                    var month = age.months + monthString;
                } else if (age.days > 15) {
                    var month = (age.months + 1) + monthString;
                }
                //return ageString = age.years + yearString +'/'+ month;

                if (age.months !== 0) {
                    return ageString = age.years + yearString + '/' + month;
                } else {
                    return ageString = age.years + yearString;
                }

            }



        }
        this.getDateFilter = function (birthdate) {
            //return function(birthdate) {
            var BirthDate = new Date(birthdate);

            var year = BirthDate.getFullYear();
            var month = BirthDate.getMonth() + 1;
            if (month < 10) { month = '0' + month; } else { month = month; }
            var date = BirthDate.getDate();
            if (date < 10) { date = '0' + date; } else { date = date; }

            var newDate = month + '/' + date + '/' + year;

            var age = getAge(newDate);
            return age;
        };
    })

    .service('ageFilterReport', function () {
        //this.getAge = function(dateString) {
        //.filter('ageFilter', function() {
        function getAge(dateString) {
            var now = new Date();
            var today = new Date(now.getYear(), now.getMonth(), now.getDate());

            var yearNow = now.getYear();
            var monthNow = now.getMonth();
            var dateNow = now.getDate();

            var dob = new Date(dateString.substring(6, 10),
                dateString.substring(0, 2) - 1,
                dateString.substring(3, 5)
            );

            var yearDob = dob.getYear();
            var monthDob = dob.getMonth();
            var dateDob = dob.getDate();
            var age = {};
            var ageString = "";
            var yearString = "";
            var monthString = "";
            var dayString = "";


            yearAge = yearNow - yearDob;

            if (monthNow >= monthDob)
                var monthAge = monthNow - monthDob;
            else {
                yearAge--;
                var monthAge = 12 + monthNow - monthDob;
            }

            if (dateNow >= dateDob)
                var dateAge = dateNow - dateDob;
            else {
                monthAge--;
                var dateAge = 31 + dateNow - dateDob;

                if (monthAge < 0) {
                    monthAge = 11;
                    yearAge--;
                }
            }

            age = {
                years: yearAge,
                months: monthAge,
                days: dateAge
            };

            /*  if ( age.years > 1 ) yearString = " years";
              else yearString = " year";
              if ( age.months> 1 ) monthString = " months";
              else monthString = " month";
              if ( age.days > 1 ) dayString = " days";
              else dayString = " day";
        
        
               if(age.years == 0 ) {
                    if(age.days <= 15) {
                        return ageString = '0.' + age.months;
                    } else if (age.days > 15) {
                         return ageString = '0.' + (age.months + 1);
                    }
               }
                if (age.years > 0) { return ageString = age.years; }
                */

            yearString = "yrs";
            monthString = "m";
            //dayString = "days";
            dayString = "d";

            if (age.years == 0) {
                /*if(age.days <= 15) {
                    return ageString = age.months + monthString;
                } else if (age.days > 15) {
                     return ageString = (age.months + 1) + monthString;
                }*/
                var dob1 = new Date(dateString);
                var difdt1 = new Date(new Date() - dob1);
                var num_years = difdt1 / 31536000000;
                var num_months = (difdt1 % 31536000000) / 2628000000;
                var num_days = ((difdt1 % 31536000000) % 2628000000) / 86400000;
                return ageString = Math.floor(num_months) + monthString + '/' + Math.floor(num_days) + dayString;
            }
            if (age.years > 0) {
                if (age.days <= 15) {
                    var month = age.months + monthString;
                } else if (age.days > 15) {
                    var month = (age.months + 1) + monthString;
                }
                //return ageString = age.years + yearString +'/'+ month;

                if (age.months !== 0) {
                    return ageString = age.years + yearString + '/' + month;
                } else {
                    return ageString = age.years + yearString;
                }

            }



        }
        this.getDateFilter = function (birthdate) {
            //return function(birthdate) {
            var BirthDate = new Date(birthdate);

            var year = BirthDate.getFullYear();
            var month = BirthDate.getMonth() + 1;
            if (month < 10) { month = '0' + month; } else { month = month; }
            var date = BirthDate.getDate();
            if (date < 10) { date = '0' + date; } else { date = date; }

            var newDate = month + '/' + date + '/' + year;

            var age = getAge(newDate);
            return age;
        };
    })

    .service('CreditCardValidations', function () {

        this.luhn = function luhn(num) {
            num = (num + '').replace(/\D+/g, '').split('').reverse();
            if (!num.length) {
                return false;
            }
            var total = 0, i;
            for (i = 0; i < num.length; i++) {
                num[i] = parseInt(num[i])
                total += i % 2 ? 2 * num[i] - (num[i] > 4 ? 9 : 0) : num[i];
            }
            return (total % 10) == 0 ? true : false;
        },

            this.validCreditCard = function (card_number) {
                card_number = String(card_number);
                var firstnumber = parseInt(String(card_number).substr(0, 1));
                switch (firstnumber) {
                    case 3:
                        if (!card_number.match(/^3\d{3}[ \-]?\d{6}[ \-]?\d{5}$/)) {
                            return false;
                        }
                        break;
                    case 4:
                        if (!card_number.match(/^4\d{3}[ \-]?\d{4}[ \-]?\d{4}[ \-]?\d{4}$/)) {
                            return false;
                        }
                        break;
                    case 5:
                        if (!card_number.match(/^5\d{3}[ \-]?\d{4}[ \-]?\d{4}[ \-]?\d{4}$/)) {
                            return false;
                        }
                        break;
                    case 6:
                        if (!card_number.match(/^6011[ \-]?\d{4}[ \-]?\d{4}[ \-]?\d{4}$/)) {
                            return false;
                        }
                        break;
                    default:
                        return false;
                }
                return this.luhn(card_number);
            }
    })

    .service('step1PostRegDetailsService', function () {
        var regDetails = [];
        var addPostRegDetails = function (postRegDetails) {
            regDetails.push(postRegDetails);
        };
        var getPostRegDetails = function () {
            return regDetails;
        };
        var ClearPostRgDetails = function () {
            regDetails = [];
        };
        return {
            addPostRegDetails: addPostRegDetails,
            getPostRegDetails: getPostRegDetails,
            ClearPostRgDetails: ClearPostRgDetails
        };
    })
