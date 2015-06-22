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
                       params.error(data);
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
					params.error(data);
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
					params.error(data);
				}
		});
	}
	
	this.getPrimaryPatientLastName = function(params) {
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
					params.error(data);
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
					params.error(data);
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
                       params.error(data);
                    }
                });
    }
	
	this.postOnDemandConsultation = function(params) {

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
					params.error(data);
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
                       params.error(data);
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
                       params.error(data);
                    }
                });
    }
    
    
    this.getExistingConsulatation = function (params) {
        //https://snap-dev.com/api/v2/patients/consultations/2440/all
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
            url: apiCommonURL + '/api/patients/consultations/' + params.consultationId + '/all',
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
                       params.error(data);
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
                       params.error(data);
                    }
                });
    }
	
	this.getPatientHealthPlansList = function (params) {
        //util.setHeaders($http, params);

		var requestInfo = {
			headers: util.getHeaders(params.accessToken),
			url: apiCommonURL + '/api/v2/healthplans?patientId=' + params.patientId ,
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
                      params.error(data);
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
					params.error(data);
				}
		});
	}
	

    this.getConsultationFinalReport = function (params) {
        //https://snap-dev.com/api/reports/consultationreportdetails/2440
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
          //  url: apiCommonURL + '/api/reports/consultationreportdetails/' + params.consultationId,
		   // url: apiCommonURL + '/api/v2/reports/consultation/'+ params.consultationId +'?include=',
		    url: apiCommonURL + '/api/v2/reports/consultation/2538?include=',
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
                       params.error(data);
                    }
                });
    }
	
	this.getPatientsSoapNotes = function (params) {
		var confirmSoapPost = {
			headers: util.getHeaders(params.accessToken),
           // url: apiCommonURL + '/api/patients/consultations/' + params.consultationID + '/soapnote',
		    url: apiCommonURL + '/api/patients/consultations/2538/soapnote',
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
					params.error(data);
				}
		});
		
	}

    this.getPatientPaymentProfile = function (params) {
        //https://snap-dev.com/api/v2/patients/profile/471/payments?hospitalId=126
        //util.setHeaders($http, params);
        var requestInfo = {
            headers: util.getHeaders(params.accessToken),
           // url: apiCommonURL + '/api/v2/patients/profile/' + params.patientId + '/payments?hospitalId=' + params.hospitalId,
		   // url: apiCommonURL + '/api/v2/patients/profile/payments?hospitalId=' + params.hospitalId,
		    url: apiCommonURL + '/api/patients/' + params.patientId + '/payments',
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
                       params.error(data);
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
                       params.error(data);
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
                        params.error(data);
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
                               params.error(data);
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
                       params.error(data);
                    }
                });
    }
    
    this.postApplyHealthPlan = function(params) {
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
					params.error(data);
				}
		});
	}
    
    this.updateConsultationEvent = function(params) {
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
					params.error(data);
				}
		});
	}
    
    this.getVideoConferenceKeys = function(params) {
        var conferenceKeyInfo = {
            headers: util.getHeaders(params.accessToken),
            url: apiCommonURL + '/api/v2/physicians/appointments/' + params.consultationId + '/videokey',
            method: 'GET'    
        };

        $http(conferenceKeyInfo).
            success(function(data, status, headers, config) {
                    if(typeof params.success != 'undefined') {
                            params.success(data);
                    }
            }).
            error(function(data, status, headers, config) {
                    if(typeof params.error != 'undefined') {
                           params.error(data);
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

 
.service('CustomCalendar', function($filter){
    var months = [
        {"value" : "", "text" : "MM", "selected" : true},
        {"value" : "01", "text" : "01", "selected" : false},
        {"value" : "02", "text" : "02", "selected" : false},
        {"value" : "03", "text" : "03", "selected" : false},
        {"value" : "04", "text" : "04", "selected" : false},
        {"value" : "05", "text" : "05", "selected" : false},
        {"value" : "06", "text" : "06", "selected" : false},
        {"value" : "07", "text" : "07", "selected" : false},
        {"value" : "08", "text" : "08", "selected" : false},
        {"value" : "09", "text" : "09", "selected" : false},
        {"value" : "10", "text" : "10", "selected" : false},
        {"value" : "11", "text" : "11", "selected" : false},
        {"value" : "12", "text" : "12", "selected" : false}
    ];
    
    var monthsAll = [
        {"value" : "", "text" : "MM", "selected" : true},
        {"value" : "01", "text" : "01 (Jan)", "selected" : false},
        {"value" : "02", "text" : "02 (Feb)", "selected" : false},
        {"value" : "03", "text" : "03 (Mar)", "selected" : false},
        {"value" : "04", "text" : "04 (Apr)", "selected" : false},
        {"value" : "05", "text" : "05 (May)", "selected" : false},
        {"value" : "06", "text" : "06 (Jun)", "selected" : false},
        {"value" : "07", "text" : "07 (Jul)", "selected" : false},
        {"value" : "08", "text" : "08 (Aug)", "selected" : false},
        {"value" : "09", "text" : "09 (Sep)", "selected" : false},
        {"value" : "10", "text" : "10 (Oct)", "selected" : false},
        {"value" : "11", "text" : "11 (Nov)", "selected" : false},
        {"value" : "12", "text" : "12 (Dec)", "selected" : false}
    ];
    
    
    this.getMonthsList = function(){
        return months;
    },
    
    this.getSurgeryYearsList = function(dateOfBirth){
        var years = [];
        var now = new Date();
        var today = new Date(now.getYear(),now.getMonth(),now.getDate());

	  var yearNow = now.getFullYear();
	  var monthNow = now.getMonth();
	  var dateNow = now.getDate();

	  var dob = new Date(dateOfBirth);
        var birthYear = dob.getFullYear();
        years.push({ value: '', text: 'Year', selected: true});
        for(var i = birthYear; i <= yearNow; i++){
            years.push({ value: i, text: i });
        }
        return years;
    },
    
    this.getCCYearsList = function(dateOfBirth){
        var years = [];
        var now = new Date();
        var today = new Date(now.getYear(),now.getMonth(),now.getDate());

	  var yearNow = now.getFullYear();
	  var monthNow = now.getMonth();
	  var dateNow = now.getDate();

	  years.push({ value: '', text: 'YYYY', selected: true});
        for(var i = yearNow; i <= yearNow + 10; i++){
            years.push({ value: i, text: i });
        }
        return years;
    }
	
	this.getLocalTime = function(dateTime){
       var utcTime = moment.utc(dateTime).toDate();
		var localTime = $filter('date')(utcTime, 'yyyy-MM-ddTHH:mm:ss');
        return localTime;
    }
    
}) 
.service('CreditCardValidations', function(){
    
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
        
    this.validCreditCard = function(card_number) {
        card_number = String(card_number);
	    var firstnumber = parseInt(String(card_number).substr(0,1));
	    switch (firstnumber)
	    {
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
