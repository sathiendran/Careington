var util = {
    setHeaders: function (request, credentials) {
        if (typeof credentials != 'undefined') {
            request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
        }
        request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        request.defaults.headers.post['X-Developer-Id'] = '4ce98e9fda3f405eba526d0291a852f0';
        request.defaults.headers.post['X-Api-Key'] = '1de605089c18aa8318c9f18177facd7d93ceafa5';
        return request;
    },
    getHeaders: function (accessToken) {
        var headers = {
                'X-Developer-Id': '4ce98e9fda3f405eba526d0291a852f0',
                'X-Api-Key': '1de605089c18aa8318c9f18177facd7d93ceafa5',
                'Content-Type': 'application/json; charset=utf-8'
            };
        if (typeof accessToken != 'undefined') {
            headers['Authorization'] = 'Bearer ' + accessToken;
        }
        
        return headers;
    }
}
// Declare app level module which depends on views, and components
var app = angular.module('apiTestApp', ['ui.bootstrap', 'ngLoadingSpinner']);

app.controller('apiTestController', ['$scope', 'apiComService', function ($scope, apiComService) {
        $scope.title = 'SnapMD API Test';
        $scope.accessToken = 'No Token';
        $scope.tokenStatus = 'alert-warning';
        $scope.existingConsultation = '{ "message": "NO EXISITING CONSULTATION JSON" }';
        $scope.consultationId = 2440;
        $scope.patientId = 471;
        $scope.hospitalId = 126;
        $scope.userTypeId = 1;
        $scope.profileId = 31867222;
        $scope.Amount = 30;
        $scope.paymentProfileId = 28804398;

        $scope.userId = 471;
        $scope.BillingAddress = '123 chennai';
        $scope.CardNumber = 4111111111111111;
        $scope.City = 'chennai';
        $scope.ExpiryMonth = 8;
        $scope.ExpiryYear = 2019;
        $scope.FirstName = 'Rin';
        $scope.LastName = 'Soft';
        $scope.State = 'Tamilnadu';
        $scope.Zip = 91302;
        $scope.Country = 'US';
        $scope.Cvv = 123;
        
        $scope.codesFields = 'medicalconditions,medications,medicationallergies,consultprimaryconcerns,consultsecondaryconcerns';

        $scope.existingConsultationReport = '{ "message": "NO EXISTING CONSULTATION REPORT JSON" }';
        $scope.scheduledConsultationList = '{ "message": "NO EXISTING CONSULTATION LIST JSON" }';
        $scope.patientPaymentProfiles = '{ "message": "NO PATIENT PROFILE JSON" }';
        $scope.patientFacilitiesList = '{ "message": "NO PATIENT FACILITIES LIST JSON" }';
        $scope.hospitalCodesList = '{ "message": "NO HOSPITAL CODES LIST JSON" }';
		$scope.patientHealthPlanList = '{ "message": "NO PATIENT HEALTH PLAN JSON" }';
		$scope.ConsultationSave = '{ "message": "NO CONSULTATION SAVE JSON" }';
	  $scope.emailAddress = 'ben.ross.310.95348@gmail.com';

        $scope.doGetToken = function () {
            var params = {
                email: $scope.emailAddress,
                password: 'Password@123',
                userTypeId: $scope.userTypeId,
                hospitalId: $scope.hospitalId,
                success: function (data) {
                    $scope.accessToken = data.access_token;
                    $scope.tokenStatus = 'alert-success';
                },
                error: function (data) {
                    $scope.accessToken = 'Error getting access token';
                    $scope.tokenStatus = 'alert-danger';
                    console.log(data);
                }
            };

            apiComService.getToken(params);
        }

        $scope.doGetExistingConsulatation = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                consultationId: $scope.consultationId,
                accessToken: $scope.accessToken,
                success: function (data) {
                    $scope.existingConsultation = data;
                },
                error: function (data) {
                    $scope.existingConsultation = 'Error getting existing consultation';
                    console.log(data);
                }
            };

            apiComService.getExistingConsulatation(params);
        }

        $scope.doGetExistingConsulatationReport = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                consultationId: $scope.consultationId,
                accessToken: $scope.accessToken,
                success: function (data) {
                    $scope.existingConsultationReport = data;
                },
                error: function (data) {
                    $scope.existingConsultationReport = 'Error getting consultation report';
                    console.log(data);
                }
            };

            apiComService.getConsultationFinalReport(params);
        }

        $scope.doGetPatientPaymentProfiles = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                hospitalId: $scope.hospitalId,
                patientId: $scope.patientId,
                accessToken: $scope.accessToken,
                success: function (data) {
                    $scope.patientPaymentProfiles = data;
                },
                error: function (data) {
                    $scope.patientPaymentProfiles = 'Error getting patient payment profiles';
                    console.log(data);
                }
            };

            apiComService.getPatientPaymentProfile(params);
        }

        $scope.doPostCoPayDetails = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                profileId: $scope.profileId,
                emailAddress: $scope.emailAddress,
                Amount: $scope.Amount,
                consultationId: $scope.consultationId,
                paymentProfileId: $scope.paymentProfileId,
                accessToken: $scope.accessToken,
                success: function (data) {
                    $scope.CreditCardDetails = data;
                },
                error: function (data) {
                    $scope.CreditCardDetails = 'Error getting patient payment profiles';
                    console.log(data);
                }
            };

            apiComService.postCoPayDetails(params);
        }

        $scope.doPostPaymentProfileDetails = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                userId: $scope.userId,
                BillingAddress: $scope.BillingAddress,
                CardNumber: $scope.CardNumber,
                City: $scope.City,
                ExpiryMonth: $scope.ExpiryMonth,
                ExpiryYear: $scope.ExpiryYear,
                FirstName: $scope.FirstName,
                LastName: $scope.LastName,
                State: $scope.State,
                Zip: $scope.Zip,
                Country: $scope.Country,
                ProfileId: $scope.profileId,
                Cvv: $scope.Cvv,
                accessToken: $scope.accessToken,
                success: function (data) {
                    $scope.PostPaymentDetails = data;
                },
                error: function (data) {
                    $scope.PostPaymentDetails = 'Error getting consultation report';
                    console.log(data);
                }
            };

            apiComService.postPaymentProfileDetails(params);
        }

        $scope.doGetFacilitiesList = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                emailAddress: $scope.emailAddress,
                accessToken: $scope.accessToken,
                success: function (data) {
                    $scope.patientFacilitiesList = data;
                },
                error: function (data) {
                    $scope.patientFacilitiesList = 'Error getting consultation report';
                    console.log(data);
                }
            };

            apiComService.getFacilitiesList(params);
        }
        
        $scope.doGetCodesSet = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                hospitalId: $scope.hospitalId,
                accessToken: $scope.accessToken,
                fields: $scope.codesFields,
                success: function (data) {
                    $scope.hospitalCodesList = data;
                },
                error: function (data) {
                    $scope.hospitalCodesList = 'Error getting hospital codes list';
                    console.log(data);
                }
            };

            apiComService.getCodesSet(params);
        }

        $scope.doGetScheduledConsulatation = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                patientId: $scope.patientId,
                accessToken: $scope.accessToken,
                success: function (data) {
                    $scope.scheduledConsultationList = data;
                },
                error: function (data) {
                    $scope.scheduledConsultationList = 'Error getting patient scheduled consultaion list';
                    console.log(data);
                }
            };

            apiComService.getScheduledConsulatation(params);
        }
		
		 $scope.doGetPatientHealthPlansList = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                patientId: $scope.patientId,
                accessToken: $scope.accessToken,
                success: function (data) {
                    $scope.patientHealthPlanList = data;
                },
                error: function (data) {
                    $scope.patientHealthPlanList = 'Error getting patient health plan list';
                    console.log(data);
                }
            };

            apiComService.getPatientHealthPlansList(params);
        }
		
		 $scope.doPutConsultationSave = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                consultationId: $scope.consultationId,
                accessToken: $scope.accessToken,
                success: function (data) {
                    $scope.ConsultationSave = data;
                },
                error: function (data) {
                    $scope.ConsultationSave = 'Error getting patient Consultation Save';
                    console.log(data);
                }
            };

            apiComService.putConsultationSave(params);
        }
		
		
		
		
		
    }]);

app.service('apiComService', function ($http) {
    /*
     params: email, password, userTypeId, hospitalId
     (event handlers): success, failure
     */
	 
	 //var CommonAPIURL = 'https://snap-dev.com';
	 var CommonAPIURL = 'https://sandbox.connectedcare.md';
	 
    this.getToken = function (params) {
        var requestInfo = {
            headers: util.getHeaders(),
            url: CommonAPIURL + '/api/Account/Token',
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
                        params.success(data);
                    }
                });
    }

    this.getScheduledConsulatation = function (params) {
        //https://snap-dev.com/api/v2/patients/scheduledconsultations?patientId={patientId}	
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/v2/patients/scheduledconsultations?Id=' + params.patientId,
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
                        params.success(data);
                    }
                });
    }

    this.getExistingConsulatation = function (params) {
        //https://snap-dev.com/api/v2/patients/consultations/2440/all
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/v2/patients/consultations/' + params.consultationId + '/all',
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
                        params.success(data);
                    }
                });
    }

    this.getConsultationFinalReport = function (params) {
        //https://snap-dev.com/api/reports/consultationreportdetails/2440
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/reports/consultationreportdetails/' + params.consultationId,
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
                        params.success(data);
                    }
                });
    }

    this.getPatientPaymentProfile = function (params) {
        //https://snap-dev.com/api/v2/patients/profile/471/payments?hospitalId=126
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/v2/patients/profile/' + params.patientId + '/payments?hospitalId=' + params.hospitalId,
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
                        params.success(data);
                    }
                });
    }

    this.getFacilitiesList = function (params) {
        //GET v2/patients/hospitals?email=<email>
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/v2/hospitals?patient=' + params.emailAddress,
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
                        params.success(data);
                    }
                });
    }

    this.postCoPayDetails = function (params) {
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/patients/copay',
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
                        params.success({
                            "transaction": "SUCCESSFUL"
                        });
                    }
                }).
                error(function (data, status, headers, config) {
                    if (typeof params.error != 'undefined') {
                        params.success(data);
                    }
                });
    }
	
	this.getPatientHealthPlansList = function (params) {
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/HealthPlan?patientId=' + params.patientId ,
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
                        params.success(data);
                    }
                });
    }
    
    this.getCodesSet = function(params) {
        //sample uri: /api/v2/codesets?hospitalId=1&fields=medications
        //"fields" is a comma-delimited list of the following: medicalconditions, medications, medicationallergies, consultprimaryconcerns, consultsecondaryconcerns
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/v2/codesets?hospitalId=' + params.hospitalId + '&fields=' + params.fields,
            method: 'GET'    
        };

        $http(requestInfo).
                success(function(data, status, headers, config) {
                        if(typeof params.success != 'undefined') {
                                params.success(data);
                        }
                }).
                error(function(data, status, headers, config) {
                        if(typeof params.error != 'undefined') {
                                params.success(data);
                        }
                });
    }

    this.postPaymentProfileDetails = function (params) {
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/patients/' + params.userId + '/payments',
            method: 'POST',
            data: {
                userId: params.userId,
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
                        params.success(data);
                    }
                });
    }
	this.putConsultationSave = function (params) {
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: CommonAPIURL + '/api/v2/patients/consultations/' + params.consultationId + '/intake',
            method: 'put'       
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
	
	
});
	
