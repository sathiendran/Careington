angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})


.factory('PatientConcernsListService', function() { 
	return { 
		PatientConcernsList: function($scope) {
			//alert($scope)	
				
		}
	}
})


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

.factory('pickadateUtils', ['dateFilter', function(dateFilter) {
      return {
        isDate: function(obj) {
          return Object.prototype.toString.call(obj) === '[object Date]';
        },

        stringToDate: function(dateString) {
          if (this.isDate(dateString)) return new Date(dateString);
          var dateParts = dateString.split('-'),
            year  = dateParts[0],
            month = dateParts[1],
            day   = dateParts[2];

          // set hour to 3am to easily avoid DST change
          return new Date(year, month - 1, day, 3);
        },

        dateRange: function(first, last, initial, format) {
          var date, i, _i, dates = [];

          if (!format) format = 'yyyy-MM-dd';

          for (i = _i = first; first <= last ? _i < last : _i > last; i = first <= last ? ++_i : --_i) {
            date = this.stringToDate(initial);
            date.setDate(date.getDate() + i);
            dates.push(dateFilter(date, format));
          }
          return dates;
        }
      };
    }])
	
	
.service('SurgeryStocksSession', function () {
    var SurgeryStocksSession = {};
    return {
        getSurgeryStocksSession: function () {
            return SurgeryStocksSession;
        },
        setSurgeryStocksSession: function (value) {
            SurgeryStocksSession = value;
        }
    };
})

.service('ChronicStocksSession', function () {
    var ChronicStocksSession = {};
    return {
        getChronicStocksSession: function () {
            return ChronicStocksSession;
        },
        setChronicStocksSession: function (value) {
            ChronicStocksSession = value;
        }
    };
})

.service('IntakeLists', function(){
	
    var primaryConcerns1 = [
        { text: "Fever (100+)", checked: false },
        { text: "Cough", checked: false },
        { text: "Vomiting", checked: false },
        { text: "Pink Eye", checked: false },
        { text: "Stomach and Abdominal Pain", checked: false },
        { text: "Cramps and Spasms", checked: false },
        { text: "Diarrhea or Constipation", checked: false },
        { text: "Skin Rash", checked: false },
        { text: "Earache or Ear Infection", checked: false },
        { text: "Sore Throat", checked: false },
        { text: "Injury: Head, Neck, Face", checked: false },    
        { text: "Headache", checked: false },
        { text: "Other", checked: false },
    ];
    
    var secondaryConcerns = [
        { text: "Fever (100+)", checked: false },
        { text: "Cough", checked: false },
        { text: "Vomiting", checked: false },
        { text: "Pink Eye", checked: false },
        { text: "Stomach and Abdominal Pain", checked: false },
        { text: "Cramps and Spasms", checked: false },
        { text: "Diarrhea or Constipation", checked: false },
        { text: "Skin Rash", checked: false },
        { text: "Earache or Ear Infection", checked: false },
        { text: "Sore Throat", checked: false },
        { text: "Injury: Head, Neck, Face", checked: false },    
        { text: "Headache", checked: false },
        { text: "Other", checked: false },
    ];
    
    var chronics = [
        { text: "ADD or ADHD", checked: false },
        { text: "Allergies", checked: false },
        { text: "Asthma", checked: false },
        { text: "Cancer", checked: false },
        { text: "Cerebral Palsy", checked: false },
        { text: "Cystic Fibrosis", checked: false },
        { text: "Diabetes", checked: false },
        { text: "Shakes and Seizures", checked: false },
        { text: "Sickle Cell Anemia", checked: false },
        { text: "Other", checked: false },
    ];
    
    var allergies = [
        { text: "Allergy Medication", checked: false },
        { text: "Antibiotics", checked: false },
        { text: "Anticonvulsants", checked: false },
        { text: "Aspirin", checked: false },
        { text: "Insulin", checked: false },
        { text: "Other", checked: false },
    ];
    
    var medications =[
        { text: "Allergy Medications", checked: false },
        { text: "Antibiotics", checked: false },
        { text: "Asthma Medications", checked: false },
        { text: "Pain Medications", checked: false },
        { text: "Mental Health Medications", checked: false },
        { text: "Seizure Medications", checked: false },
        { text: "Other", checked: false },
    ];
   
    this.getPrimaryConcerns = function($a){
        var primaryConcerns = $a;
		return primaryConcerns;
    }
    
    this.getSecondaryConcerns = function(){
        return secondaryConcerns;
    }
    
    this.getChronics = function(){
        return chronics;
    }
    
    this.getAllergies = function(){
        return allergies;
    }
    
    this.getMedications = function(){
        return medications;
    }
})


