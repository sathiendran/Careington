angular.module('starter.services', [])





.service('LoginService', function($http){
    /*
        params: email, password, userTypeId, hospitalId
                (event handlers): success, failure
    */
		
		//var apiCommonURL = 'https://snap-dev.com';
		
		var apiCommonURL = 'https://sandbox.connectedcare.md';
	
	 this.getToken = function (params) {
        var requestInfo = {
            headers: util.getHeaders(),
            url: apiCommonURL + '/api/Account/Token',
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
	
	this.postSendPasswordResetEmail = function(params) {
		var confirmSendPasswordResetEmail = {
			headers: util.getHeaders(params.accessToken),
            url: apiCommonURL + '/api/v2/patients/' + params.patientEmail + '/mail?type=' + params.emailType,
            method: 'POST'
		};
		
		$http(confirmSendPasswordResetEmail).
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
	
	this.getPatientProfiles = function(params) {
		var PatientDetailsList = {
			headers: util.getHeaders(params.accessToken),
            url: apiCommonURL + '/api/v2/patients?include=AccountDetails,Physician,Pharmacy,Anatomy,Addresses,Consultations',
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
					params.success(data);
				}
		});
	}
	
	
	this.getRelatedPatientProfiles = function(params) {
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
					params.success(data);
				}
		});
	}
	
	

    this.getScheduledConsulatation = function (params) {
        //https://snap-dev.com/api/v2/patients/scheduledconsultations?patientId={patientId}	
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: apiCommonURL + '/api/v2/patients/scheduledconsultations?Id=' + params.patientId,
			//url: apiCommonURL + '/api/patients/consultations/' + params.patientId +'/availableconsultation',
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

    this.getHealthPlanProvidersList = function (params) {
        //https://snap-dev.com/api/v2/patients/scheduledconsultations?patientId={patientId}	
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
                        params.success(data);
                    }
                });
    }
    
    
    this.getExistingConsulatation = function (params) {
        //https://snap-dev.com/api/v2/patients/consultations/2440/all
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
                        params.success(data);
                    }
                });
    }
	
	this.getPatientHealthPlansList = function (params) {
        //util.setHeaders($http, params);

		var requestInfo = {
			headers: util.getHeaders(params.accessToken),
			url: apiCommonURL + '/api/v2/healthplans?patientId=' + params.patientId ,
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
	
	this.postNewHealthPlan = function(params) {
		var confirmPatientProfile = {
			headers: util.getHeaders(params.accessToken),
            url: apiCommonURL + '/api/healthplan',
            method: 'POST',
			data: {
                healthPlanId: params.healthPlanID,
				patientId: params.patientID,
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
				payerId: params.payerId
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
					params.success(data);
				}
		});
	}
	

    this.getConsultationFinalReport = function (params) {
        //https://snap-dev.com/api/reports/consultationreportdetails/2440
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: apiCommonURL + '/api/reports/consultationreportdetails/' + params.consultationId,
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
           // url: apiCommonURL + '/api/v2/patients/profile/' + params.patientId + '/payments?hospitalId=' + params.hospitalId,
		    url: apiCommonURL + '/api/v2/patients/profile/payments?hospitalId=' + params.hospitalId,
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
            url: apiCommonURL + '/api/v2/hospitals?patient=' + params.emailAddress,
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
            url: apiCommonURL + '/api/patients/copay',
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
    
    this.getCodesSet = function(params) {
        //sample uri: /api/v2/codesets?hospitalId=1&fields=medications
        //"fields" is a comma-delimited list of the following: medicalconditions, medications, medicationallergies, consultprimaryconcerns, consultsecondaryconcerns
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: apiCommonURL + '/api/v2/codesets?hospitalId=' + params.hospitalId + '&fields=' + params.fields,
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
            url: apiCommonURL + '/api/patients/' + params.userId + '/payments',
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
})





.service('SurgeryStocksListService', function () {
    var patientSurgeries={};
     patientSurgeries = {
        SurgeriesList: [],
        addSurgery: function (SurgeryName,SurgeryDate) {
            Surgery = {
                   Name: SurgeryName,
                   Date: SurgeryDate
                };
 
            this.SurgeriesList.push(Surgery);
            
        },
        ClearSurgery: function () {
            this.SurgeriesList=[];
          }
    };
  return patientSurgeries;
})




.service('StateLists', function(){
    var StateDetails = [
        {"code":"US","abbreviation": "AK","state": "Alaska","time_zone": "","utc_offset": -9}, {"code":"US","abbreviation": "AL","state": "Alabama","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "AR","state": "Arkansas","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "AZ","state": "Arizona","time_zone": "MT","utc_offset": -7}, {"code":"US","abbreviation": "CA","state": "California","time_zone": "PT","utc_offset": -8}, {"code":"US","abbreviation": "CO","state": "Colorado","time_zone": "MT","utc_offset": -7}, {"code":"US","abbreviation": "CT","state": "Connecticut","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "DC","state": "District of Columbia","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "DE","state": "Delaware","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "FL","state": "Florida","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "GA","state": "Georgia","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "HI","state": "Hawaii","time_zone": "","utc_offset": -10}, {"code":"US","abbreviation": "IA","state": "Iowa","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "ID","state": "Idaho","time_zone": "MT","utc_offset": -7}, {"code":"US","abbreviation": "IL","state": "Illinois","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "IN","state": "Indiana","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "KS","state": "Kansas","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "KY","state": "Kentucky","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "LA","state": "Louisiana","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "MA","state": "Massachusetts","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "MD","state": "Maryland","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "ME","state": "Maine","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "MI","state": "Michigan","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "MN","state": "Minnesota","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "MO","state": "Missouri","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "MS","state": "Mississippi","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "MT","state": "Montana","time_zone": "MT","utc_offset": -7}, {"code":"US","abbreviation": "NC","state": "North Carolina","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "ND","state": "North Dakota","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "NE","state": "Nebraska","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "NH","state": "New Hampshire","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "NJ","state": "New Jersey","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "NM","state": "New Mexico","time_zone": "MT","utc_offset": -7}, {"code":"US","abbreviation": "NV","state": "Nevada","time_zone": "MT","utc_offset": -7}, {"code":"US","abbreviation": "NY","state": "New York","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "OH","state": "Ohio","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "OK","state": "Oklahoma","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "ON","state": "Toronto","time_zone": "ET","utc_offset": -8}, {"code":"US","abbreviation": "OR","state": "Oregon","time_zone": "PT","utc_offset": -8}, {"code":"US","abbreviation": "PA","state": "Pennsylvania","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "RI","state": "Rhode Island","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "SC","state": "South Carolina","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "SD","state": "South Dakota","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "TN","state": "Tennessee","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "TX","state": "Texas","time_zone": "CT","utc_offset": -6}, {"code":"US","abbreviation": "UT","state": "Utah","time_zone": "MT","utc_offset": -7}, {"code":"US","abbreviation": "VA","state": "Virginia","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "VT","state": "Vermont","time_zone": "ET","utc_offset": -5}, {"code":"US","abbreviation": "WA","state": "Washington","time_zone": "PT","utc_offset": -8}, {"code":"US","abbreviation": "WI","state": "Wisconsin","time_zone": "CT","utc_offset": -6},             {"code":"US","abbreviation": "WV","state": "West Virginia","time_zone": "ET","utc_offset": -5},             {"code":"US","abbreviation": "WY","state": "Wyoming","time_zone": "MT","utc_offset": -7}
    ];
    
    this.getStateDetails = function(){
        return StateDetails;
    }
   
})

.service('CountryList', function($http){
   /* var CountryDetails = [{"code": "US","country": "United States"},{"code": "UK","country": "United Kingdom"}];
    
    this.getCountryDetails = function(){
        return CountryDetails;
    } */
    
this.getCountryDetails = function () {  
    var obj = {Countries:null};

    $http.get('jsonFile/Countries.json').success(function(data) {
      obj.Countries = data;
    });    

    return obj;   
  }
   
})


 .service('StateList', function($http){    
    this.getStateDetails = function (params) {
        var googlePlacesUrl = 'http://maps.google.com/maps/api/geocode/json?address=' + params.SearchKeys + '&sensor=false&components=country:' + params.CountryCode;
    var obj = {State:null};
       $http.get(googlePlacesUrl).success(function(data) {
          obj.State = data;
            return obj; 
        });    
          
      } 
    
/*var request = {
            headers: util.getHeaders(params.accessToken),
            url: 'http://maps.google.com/maps/api/geocode/json?address=' + params.SearchKeys + '&sensor  =false&components=country:' + params.CountryCode,
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

 
  



.service('UKStateList', function(){
    var UkStateDetails = [
        
        {"code": "UK","state": "Anglesey"},{"code": "UK","state": "Angus (Forfarshire)"},{"code": "UK","state": "Antrim"},{"code": "UK","state": "Argyll (Argyllshire)"},{"code": "UK","state": "Armagh"},{"code": "UK","state": "Ayrshire"},{"code": "UK","state": "Banffshire"},{"code": "UK","state": "Bedfordshire"},{"code": "UK","state": "Berkshire"},{"code": "UK","state": "Angus (Forfarshire)"},{"code": "UK","state": "Anglesey"},{"code": "UK","state": "Berwickshire"},{"code": "UK","state": "Brecknockshire (Breconshire)"},{"code": "UK","state": "Buckinghamshire"},{"code": "UK","state": "Buteshire"},{"code": "UK","state": "Caernarfonshire (Carnarvonshire)"},{"code": "UK","state": "Caithness"},{"code": "UK","state": "Cambridgeshire"},{"code": "UK","state": "Cardiganshire"},{"code": "UK","state": "Carmarthenshire"},{"code": "UK","state": "Cheshire"},{"code": "UK","state": "Clackmannanshire"},{"code": "UK","state": "Cornwall"},{"code": "UK","state": "Cromartyshire"},{"code": "UK","state": "Cumberland"},{"code": "UK","state": "Denbighshire"},{"code": "UK","state": "Derbyshire"},{"code": "UK","state": "Devon"},{"code": "UK","state": "Dorset"},{"code": "UK","state": "Down"},{"code": "UK","state": "Dumbartonshire"},{"code": "UK","state": "Dumfriesshire"},{"code": "UK","state": "Durham"},{"code": "UK","state": "East Lothian"},{"code": "UK","state": "Essex"},{"code": "UK","state": "Fermanagh"},{"code": "UK","state": "Fife"},{"code": "UK","state": "Flintshire"},{"code": "UK","state": "Glamorgan"},{"code": "UK","state": "Gloucestershire"},{"code": "UK","state": "Hampshire"},{"code": "UK","state": "Herefordshire"},{"code": "UK","state": "Hertfordshire"},{"code": "UK","state": "Huntingdonshire"},{"code": "UK","state": "Inverness-shire"},{"code": "UK","state": "Kent"},{"code": "UK","state": "Kincardineshire"},{"code": "UK","state": "Kinross-shire"},{"code": "UK","state": "Kirkcudbrightshire"},{"code": "UK","state": "Lanarkshire"},{"code": "UK","state": "Lancashire"},{"code": "UK","state": "Leicestershire"},{"code": "UK","state": "Lincolnshire"},{"code": "UK","state": "Londonderry"},{"code": "UK","state": "Merionethshire"},{"code": "UK","state": "Middlesex"},{"code": "UK","state": "Midlothian"},{"code": "UK","state": "Monmouthshire"},{"code": "UK","state": "Montgomeryshire"},{"code": "UK","state": "Morayshire"},{"code": "UK","state": "Nairnshire"},{"code": "UK","state": "Norfolk"},{"code": "UK","state": "Northamptonshire"},{"code": "UK","state": "Northumberland"},{"code": "UK","state": "Nottinghamshire"},{"code": "UK","state": "Orkney"},{"code": "UK","state": "Oxfordshire"},{"code": "UK","state": "Peeblesshire"},{"code": "UK","state": "Pembrokeshire"},{"code": "UK","state": "Perthshire"},{"code": "UK","state": "Radnorshire"},{"code": "UK","state": "Renfrewshire"},{"code": "UK","state": "Ross-shire"},{"code": "UK","state": "Roxburghshire"},{"code": "UK","state": "Rutland"},{"code": "UK","state": "Selkirkshire"},{"code": "UK","state": "Shetland"},{"code": "UK","state": "Shropshire"},{"code": "UK","state": "Somerset"},{"code": "UK","state": "Staffordshire"},{"code": "UK","state": "Stirlingshire"},{"code": "UK","state": "Suffolk"},{"code": "UK","state": "Surrey"},{"code": "UK","state": "Sussex"},{"code": "UK","state": "Sutherland"},{"code": "UK","state": "Tyrone"},{"code": "UK","state": "Warwickshire"},{"code": "UK","state": "West Lothian (Linlithgowshire)"},{"code": "UK","state": "Westmorland"},{"code": "UK","state": "Wigtownshire"},{"code": "UK","state": "Worcestershire"},{"code": "UK","state": "Yorkshire"}];
    
    this.getUkStateDetails = function(){
        return UkStateDetails;
    }
   
})


.factory('$localstorage', ['$window', function($window) {
  return {
 set: function(key, value) {
   $window.localStorage[key] = value;
 },
 get: function(key, defaultValue) {
   return $window.localStorage[key] || defaultValue;
 },
 setObject: function(key, value) {
   $window.localStorage[key] = JSON.stringify(value);
 },
 getObject: function(key) {
   return JSON.parse($window.localStorage[key] || '{}');
 }
  }
}])

