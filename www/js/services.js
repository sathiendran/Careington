angular.module('starter.services', [])





.service('LoginService', function($http){
    /*
        params: email, password, userTypeId, hospitalId
                (event handlers): success, failure
    */
	 this.getToken = function (params) {
        var requestInfo = {
            headers: util.getHeaders(),
            url: 'https://snap-dev.com/api/Account/Token',
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
            url: 'https://snap-dev.com/api/v2/patients/scheduledconsultations?patientId=' + params.patientId,
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
            url: 'https://snap-dev.com/api/v2/patients/consultations/' + params.consultationId + '/all',
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
            url: 'https://snap-dev.com/api/reports/consultationreportdetails/' + params.consultationId,
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
            url: 'https://snap-dev.com/api/v2/patients/profile/' + params.patientId + '/payments?hospitalId=' + params.hospitalId,
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
            url: 'https://snap-dev.com/api/v2/hospitals?patient=' + params.emailAddress,
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
            url: 'https://snap-dev.com/api/patients/copay',
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
            url: 'https://snap-dev.com/api/v2/codesets?hospitalId=' + params.hospitalId + '&fields=' + params.fields,
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
            url: 'https://snap-dev.com/api/patients/' + params.userId + '/payments',
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
    var StateDetails = [{"abbreviation": "AK","state": "Alaska","time_zone": "","utc_offset": -9}, {"abbreviation": "AL","state": "Alabama","time_zone": "CT","utc_offset": -6}, {"abbreviation": "AR","state": "Arkansas","time_zone": "CT","utc_offset": -6}, {"abbreviation": "AZ","state": "Arizona","time_zone": "MT","utc_offset": -7}, {"abbreviation": "CA","state": "California","time_zone": "PT","utc_offset": -8}, {"abbreviation": "CO","state": "Colorado","time_zone": "MT","utc_offset": -7}, {"abbreviation": "CT","state": "Connecticut","time_zone": "ET","utc_offset": -5}, {"abbreviation": "DC","state": "District of Columbia","time_zone": "ET","utc_offset": -5}, {"abbreviation": "DE","state": "Delaware","time_zone": "ET","utc_offset": -5}, {"abbreviation": "FL","state": "Florida","time_zone": "ET","utc_offset": -5}, {"abbreviation": "GA","state": "Georgia","time_zone": "ET","utc_offset": -5}, {"abbreviation": "HI","state": "Hawaii","time_zone": "","utc_offset": -10}, {"abbreviation": "IA","state": "Iowa","time_zone": "CT","utc_offset": -6}, {"abbreviation": "ID","state": "Idaho","time_zone": "MT","utc_offset": -7}, {"abbreviation": "IL","state": "Illinois","time_zone": "CT","utc_offset": -6}, {"abbreviation": "IN","state": "Indiana","time_zone": "ET","utc_offset": -5}, {"abbreviation": "KS","state": "Kansas","time_zone": "CT","utc_offset": -6}, {"abbreviation": "KY","state": "Kentucky","time_zone": "ET","utc_offset": -5}, {"abbreviation": "LA","state": "Louisiana","time_zone": "CT","utc_offset": -6}, {"abbreviation": "MA","state": "Massachusetts","time_zone": "ET","utc_offset": -5}, {"abbreviation": "MD","state": "Maryland","time_zone": "ET","utc_offset": -5}, {"abbreviation": "ME","state": "Maine","time_zone": "ET","utc_offset": -5}, {"abbreviation": "MI","state": "Michigan","time_zone": "ET","utc_offset": -5}, {"abbreviation": "MN","state": "Minnesota","time_zone": "CT","utc_offset": -6}, {"abbreviation": "MO","state": "Missouri","time_zone": "CT","utc_offset": -6}, {"abbreviation": "MS","state": "Mississippi","time_zone": "CT","utc_offset": -6}, {"abbreviation": "MT","state": "Montana","time_zone": "MT","utc_offset": -7}, {"abbreviation": "NC","state": "North Carolina","time_zone": "ET","utc_offset": -5}, {"abbreviation": "ND","state": "North Dakota","time_zone": "CT","utc_offset": -6}, {"abbreviation": "NE","state": "Nebraska","time_zone": "CT","utc_offset": -6}, {"abbreviation": "NH","state": "New Hampshire","time_zone": "ET","utc_offset": -5}, {"abbreviation": "NJ","state": "New Jersey","time_zone": "ET","utc_offset": -5}, {"abbreviation": "NM","state": "New Mexico","time_zone": "MT","utc_offset": -7}, {"abbreviation": "NV","state": "Nevada","time_zone": "MT","utc_offset": -7}, {"abbreviation": "NY","state": "New York","time_zone": "ET","utc_offset": -5}, {"abbreviation": "OH","state": "Ohio","time_zone": "ET","utc_offset": -5}, {"abbreviation": "OK","state": "Oklahoma","time_zone": "CT","utc_offset": -6}, {"abbreviation": "ON","state": "Toronto","time_zone": "ET","utc_offset": -8}, {"abbreviation": "OR","state": "Oregon","time_zone": "PT","utc_offset": -8}, {"abbreviation": "PA","state": "Pennsylvania","time_zone": "ET","utc_offset": -5}, {"abbreviation": "RI","state": "Rhode Island","time_zone": "ET","utc_offset": -5}, {"abbreviation": "SC","state": "South Carolina","time_zone": "ET","utc_offset": -5}, {"abbreviation": "SD","state": "South Dakota","time_zone": "CT","utc_offset": -6}, {"abbreviation": "TN","state": "Tennessee","time_zone": "CT","utc_offset": -6}, {"abbreviation": "TX","state": "Texas","time_zone": "CT","utc_offset": -6}, {"abbreviation": "UT","state": "Utah","time_zone": "MT","utc_offset": -7}, {"abbreviation": "VA","state": "Virginia","time_zone": "ET","utc_offset": -5}, {"abbreviation": "VT","state": "Vermont","time_zone": "ET","utc_offset": -5}, {"abbreviation": "WA","state": "Washington","time_zone": "PT","utc_offset": -8}, {"abbreviation": "WI","state": "Wisconsin","time_zone": "CT","utc_offset": -6}, {"abbreviation": "WV","state": "West Virginia","time_zone": "ET","utc_offset": -5}, {"abbreviation": "WY","state": "Wyoming","time_zone": "MT","utc_offset": -7}];
    
    this.getStateDetails = function(){
        return StateDetails;
    }
   
})


.factory('todayStocks', function ($http) {



	return {
		all: function () {
		    var promise = $http({method: 'GET', url: 'http://private-98763-snapmd.apiary-mock.com/api/paymentDetails'})
			//var promise = $http({method: 'GET', url: 'http://25.61.110.5/chartapi/api/equitypattern/datewiseByType?date=' + today, params:{limit: $a, signalType: $b}})
		   // var promise = $http({ method: 'GET', url: 'stock.json' })
				.success(function (data, status, headers, config) {
					return data;
				})
				.error(function (data, status, headers, config) {
					return {"status": false};
				});
			return promise;
		}
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