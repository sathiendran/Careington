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

.factory('LoginService', function($http) { 
	return { 
		loginUser: function($email,$providerId,$password) {
				
				/*var request = $http({
							method: "post",
							url: "https://snap-dev.com/api/account/token/",
							 data: "email=ben.ross.310.95348@gmail.com&password=Password@123&hospitalId=126&userTypeId=1",
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				});
			
				    $http($scope.send).success(function(data){
					$scope.response = "SUCCESS";
					console.log(data);
				   })
				   .error(function(error){
					$scope.response = "FAILED";
					console.log(error);
				   });*/
				   
			var promise = $http({method: 'post',
						url: 'https://snap-dev.com/api/account/token/',
						data: "email="+$email+"&password="+$password+"&hospitalId="+$providerId+"&userTypeId=1",
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
						})
			
				.success(function (data, status, headers, config) {
					//console.log(data);
					return data;
				})
				.error(function (data, status, headers, config) {
					return {"status": false};
				});
			return promise;
				   
				   
				},
				
		getCount: function($data) {
			
			var promise = $http({method: 'get',
						url: 'https://snap-dev.com/api/patientconsultation/2440/all',
						headers: { 'Authorization': 'Bearer '+ $data }
						})	
			
			
			.success(function (data, status, headers, config) {
			console.log(data);
					return data;
				})
				.error(function (data, status, headers, config) {
					return {"status": false};
				});
			return promise;
		},
		
		getPostPaymentDetails: function(params) {
	 
		$http.defaults.headers.common['Authorization'] = "Bearer " + params.accessToken;
		
        $http.
			post('https://snap-dev.com/api/patients/' + params.userId + '/payments', 
			{
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
			}).
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


