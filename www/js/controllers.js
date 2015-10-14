var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
	  if (i in this && this[i] === item) return i;
	}
	return -1;
}
       // request.defaults.headers.post['X-Developer-Id'] = '4ce98e9fda3f405eba526d0291a852f0';
        //request.defaults.headers.post['X-Api-Key'] = '1de605089c18aa8318c9f18177facd7d93ceafa5';

if(deploymentEnv == "Sandbox" || deploymentEnv == "Multiple" || deploymentEnv == "QA"){
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
}else if(deploymentEnv == "Production"){
	var util = {
		setHeaders: function (request, credentials) {
			if (typeof credentials != 'undefined') {
				request.defaults.headers.common['Authorization'] = "Bearer " + credentials.accessToken;
			}
			request.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
			request.defaults.headers.post['X-Developer-Id'] = '1f9480321986463b822a981066cad094';
			request.defaults.headers.post['X-Api-Key'] = '1d3d2f653608d25c080810794928fcaa12ef372a2';
			return request;
		},
		getHeaders: function (accessToken) {
			var headers = {
					'X-Developer-Id': '1f9480321986463b822a981066cad094',
					'X-Api-Key': 'd3d2f653608d25c080810794928fcaa12ef372a2',
					'Content-Type': 'application/json; charset=utf-8'
				};
			if (typeof accessToken != 'undefined') {
				headers['Authorization'] = 'Bearer ' + accessToken;
			}
			
			return headers;
		}
	}
}else if(deploymentEnv == "Single"){
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
}

var REVIEW_CONSULTATION_EVENT_CODE = 116;
var STARTED_CONSULTATION_EVENT_CODE = 117;
var STOPPED_CONSULTATION_EVENT_CODE = 118;
var ENDED_CONSULTATION_EVENT_CODE = 119;
var WAITING_CONSULTATION_EVENT_CODE = 120;
var JOIN_CONSULTATION_EVENT_CODE = 121;

var CLINICIAN_CONSULTATION_EVENT_TYPE_ID = 22;
var PATIENT_CONSULTATION_EVENT_TYPE_ID = 23;

var REVIEW_CONSULTATION_STATUS_CODE = 69;
var STARTED_CONSULTATION_STATUS_CODE = 70;
var STOPPED_CONSULTATION_STATUS_CODE = 118;
var ENDED_CONSULTATION_STATUS_CODE = 119;
var WAITING_CONSULTATION_STATUS_CODE = 68;
var JOIN_CONSULTATION_STATUS_CODE = 121;

angular.module('ngIOS9UIWebViewPatch', ['ng']).config(function($provide) {
  $provide.decorator('$browser', ['$delegate', '$window', function($delegate, $window) {

    if (isIOS9UIWebView($window.navigator.userAgent)) {
      return applyIOS9Shim($delegate);
    }

    return $delegate;

    function isIOS9UIWebView(userAgent) {
      return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
    }

    function applyIOS9Shim(browser) {
      var pendingLocationUrl = null;
      var originalUrlFn= browser.url;

      browser.url = function() {
        if (arguments.length) {
          pendingLocationUrl = arguments[0];
          return originalUrlFn.apply(browser, arguments);
        }

        return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
      };

      window.addEventListener('popstate', clearPendingLocationUrl, false);
      window.addEventListener('hashchange', clearPendingLocationUrl, false);

      function clearPendingLocationUrl() {
        pendingLocationUrl = null;
      }

      return browser;
    }
  }]);
});

angular.module('starter.controllers', ['starter.services','ngLoadingSpinner', 'timer','ngStorage', 'ion-google-place', 'ngIOS9UIWebViewPatch'])

//InterimController - To manipulate URL Schemes
.controller('InterimController', function($scope, $ionicScrollDelegate, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage,StateList, CustomCalendar, CreditCardValidations) {
	
	$rootScope.deploymentEnv = deploymentEnv;
	if(deploymentEnv == "single"){
	}
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
	
	$scope.ssoMessage = 'Authenticating..... Please wait!';
	$scope.addMinutes = function (inDate, inMinutes) {   
		var newdate = new Date();
		newdate.setTime(inDate.getTime() + inMinutes * 60000);
		return newdate;
	}
	
	$scope.doGetScheduledConsulatation = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
             $rootScope.scheduledConsultationList = [];
            var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
					console.log(data);
                    $scope.scheduledConsultationList = data.data;
					if(data != "") {
						$rootScope.scheduledList = [];
						var currentDate = new Date();
						currentDate = $scope.addMinutes(currentDate, -30);
					//	var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");
							
												
						angular.forEach($scope.scheduledConsultationList, function(index, item) {							
							if(currentDate < CustomCalendar.getLocalTime(index.scheduledTime)) {
								 $rootScope.scheduledList.push({							
									'id': index.$id,
									'scheduledTime': CustomCalendar.getLocalTime(index.scheduledTime),
									'consultantUserId': index.consultantUserId,
									'consultationId': index.consultationId,
									'patientFirstName': index.patientFirstName,
									'patientLastName': index.patientLastName,	
									'patientId': index.patientId,
									'assignedDoctorName': index.assignedDoctorName,
									'patientName': index.patientName,
									'consultationStatus': index.consultationStatus,
									'scheduledId': index.scheduledId,    
								});
							}	
						});
						
						
						$rootScope.nextAppointmentDisplay = 'none';
						
						var d = new Date();
						d.setHours(d.getHours() + 12);
						var currentUserHomeDate = CustomCalendar.getLocalTime(d);
						
						if($rootScope.scheduledList != '')
						{
							//var getReplaceTime = ($rootScope.scheduledList[0].scheduledTime).replace("T"," ");
							//var currentUserHomeDate = currentUserHomeDate.replace("T"," ");
							var getReplaceTime = $rootScope.scheduledList[0].scheduledTime;
							var currentUserHomeDate = currentUserHomeDate;
							
							if((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
								console.log('scheduledTime <= getTwelveHours UserHome');
								$rootScope.nextAppointmentDisplay = 'block';
								$rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
							}
						}
						 
					}
                },
                error: function (data) {
                   $rootScope.serverErrorMessageValidation();
                }
            };

            LoginService.getScheduledConsulatation(params);
        };
	$scope.doGetPrimaryPatientLastName = function() {
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			 var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
				success: function (data) {
					//$scope.RelatedPatientProfiles = data.data;
					$rootScope.primaryPatientLastName = [];	
						angular.forEach(data.data, function(index, item) {		
							$rootScope.primaryPatientLastName.push({
								'id': index.$id,
								'patientName': index.patientName,
								'lastName': index.lastName,
								'profileImagePath': $rootScope.APICommonURL + index.profileImagePath,
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
					$rootScope.primaryPatientLastName = $rootScope.primaryPatientLastName[0].lastName;	
					
					$rootScope.primaryPatientFullName = $rootScope.primaryPatientName + ' '+$rootScope.primaryPatientLastName;					
						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getPrimaryPatientLastName(params);
		};
	$scope.doGetPatientProfiles = function() {
		if ($rootScope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
			var params = {
			accessToken: $rootScope.accessToken,
			success: function (data) {
				
				$rootScope.patientInfomation = data.data[0];
				$rootScope.patientAccount = data.data[0].account;	
				$rootScope.patientAddresses = data.data[0].addresses;	
				$rootScope.patientAnatomy = data.data[0].anatomy;
				$rootScope.patientPharmacyDetails = data.data[0].pharmacyDetails;
				$rootScope.patientPhysicianDetails = data.data[0].physicianDetails;	
				//alert("$T/ESTONE../$TESTONE../../".replace( new RegExp("\\../","gm")," "))
				$rootScope.PatientImage = ($rootScope.APICommonURL + $rootScope.patientAccount.profileImagePath).replace(new RegExp("\\../","gm"),"/");
				$rootScope.address = data.data[0].address;
				$rootScope.city = data.data[0].city;
				$rootScope.createDate = data.data[0].createDate;
				$rootScope.dob = data.data[0].dob;
				$rootScope.ageBirthDate = ageFilter.getDateFilter(data.data[0].dob);
				$rootScope.gender = data.data[0].gender;
				$rootScope.homePhone = data.data[0].homePhone;
				$rootScope.location = data.data[0].location;
				$rootScope.mobilePhone = data.data[0].mobilePhone;
				$rootScope.organization = data.data[0].organization;
				$rootScope.primaryPatientName = data.data[0].patientName;
				$rootScope.userCountry = data.data[0].country;
				if(typeof $rootScope.userCountry == 'undefined') {
					$rootScope.userCountry = '';
				}
				$rootScope.primaryPatientGuardianName = '';
				$rootScope.state = data.data[0].state;
				$rootScope.zipCode = data.data[0].zipCode;
				$rootScope.primaryPatientId = $rootScope.patientAccount.patientId;	
				$scope.doGetPrimaryPatientLastName();	
				$scope.doGetScheduledConsulatation();
					
			},
			error: function (data) {
				$scope.ssoMessage = 'Authentication Failed! Please try again later!';
				$rootScope.patientInfomation = '';
				$rootScope.patientAccount = '';	
				$rootScope.patientAddresses = '';	
				$rootScope.patientAnatomy = '';
				$rootScope.patientPharmacyDetails = ''
				$rootScope.patientPhysicianDetails = '';	
				//alert("$T/ESTONE../$TESTONE../../".replace( new RegExp("\\../","gm")," "))
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
		};
		
		LoginService.getPatientProfiles(params);
	};
	$scope.doGetRelatedPatientProfiles = function(redirectPage) {		
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
			var params = {
			patientId: $rootScope.patientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {
				//$scope.RelatedPatientProfiles = data.data;
				$rootScope.RelatedPatientProfiles = [];	
				
					angular.forEach(data.data, function(index, item) {		
						$rootScope.RelatedPatientProfiles.push({
							'id': index.$id,
							'patientId': index.patientId,
							'patientName': index.patientName,
							'profileImagePath': ($rootScope.APICommonURL + index.profileImagePath).replace(new RegExp("\\../","gm"),"/"),
							'relationCode': index.relationCode,
							'isAuthorized': index.isAuthorized,
							'birthdate': index.birthdate,
							'ageBirthDate': ageFilter.getDateFilter(index.birthdate),
							'addresses': angular.fromJson(index.addresses),
							'patientFirstName': index.patientFirstName,
							'patientLastName': index.patientLastName,
							'guardianFirstName': index.guardianFirstName,
							'guardianLastName': index.guardianLastName,
							'guardianName': index.guardianName,
						});
					});	
					
					$rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
					if(redirectPage == 'userhome'){
						$state.go('tab.userhome');
					}else{
						//$state.go('tab.waitingRoom');
						$scope.doGetExistingConsulatation();
					}
					
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation();
			}
		};
		
		LoginService.getRelatedPatientProfiles(params);
	};
	
	$scope.doGetExistingConsulatation = function () {
		$rootScope.consultionInformation = '';
		$rootScope.appointmentsPatientFirstName = '';
		$rootScope.appointmentsPatientLastName = '';
		$rootScope.appointmentsPatientDOB = '';
		$rootScope.appointmentsPatientGurdianName = '';
		$rootScope.appointmentsPatientImage = '';
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            consultationId: $rootScope.consultationId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $scope.existingConsultation = data;
			
                $rootScope.consultionInformation = data.data[0].consultationInfo;
				$rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
				if(!angular.isUndefined($rootScope.consultationStatusId)) {
						if($rootScope.consultationStatusId == 71 ) {
							navigator.notification.alert(
								'Your consultation is already started on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 72 ) {
							navigator.notification.alert(
								'Your consultation is already ended.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 79 ) {
							navigator.notification.alert(
								'Your consultation is cancelled.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 80 ) {
							navigator.notification.alert(
								'Your consultation is in progress on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						}
						
				}
                $rootScope.patientExistInfomation = data.data[0].patientInformation;
				$rootScope.intakeForm = data.data[0].intakeForm;
				$rootScope.PatientAge = $rootScope.patientExistInfomation.dob;
				$rootScope.PatientGuardian = $rootScope.patientExistInfomation.guardianName;
				$rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;
				$rootScope.PatientImageSelectUser = $rootScope.APICommonURL + $rootScope.patientExistInfomation.profileImagePath;
				$scope.doGetExistingPatientName();
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getExistingConsulatation(params);	
		
	}
	
	$scope.doGetExistingPatientName = function () {
		var params = {
			patientId: $rootScope.appointmentsPatientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {				
				$rootScope.PatientFirstName = data.data[0].patientName;	
				$rootScope.PatientLastName = data.data[0].lastName;		 
				$state.go('tab.waitingRoom');
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation();
			}
		};
		
		LoginService.getPrimaryPatientLastName(params);
	}
	
	if($stateParams.token != "" && $stateParams.hospitalId != "" && $stateParams.consultationId != ""){
		$rootScope.accessToken = $stateParams.token;
		$rootScope.hospitalId = $stateParams.hospitalId;
		$rootScope.consultationId = $stateParams.consultationId;
		$scope.doGetPatientProfiles();
		//$scope.doGetExistingConsulatation();	
		$scope.doGetRelatedPatientProfiles('waitingRoom');
		//$state.go('tab.waitingRoom');
	}else if($stateParams.token != "" && $stateParams.hospitalId != "" && $stateParams.consultationId == ""){
		$rootScope.accessToken = $stateParams.token;
		$rootScope.hospitalId = $stateParams.hospitalId;
		//$rootScope.accessToken = "RXC5PBj-uQbrKcsoQv3i6EY-uxfWrQ-X5RzSX13WPYqmaqdwbLBs2WdsbCZFCf_5jrykzkpuEKKdf32bpU4YJCvi2XQdYymvrjZQHiAb52G-tIYwTQZ9IFwXCjf-PRst7A9Iu70zoQgPrJR0CJMxtngVf6bbGP86AF2kiomBPuIsR00NISp2Kd0I13-LYRqgfngvUXJzVf703bq2Jv1ixBl_DRUlWkmdyMacfV0J5itYR4mXpnjfdPpeRMywajNJX6fAVTP0l5KStKZ3-ufXIKk6l5iRi6DtNfxIyT2zvd_Wp8x2nOQezJSvwtrepb34quIr5jSB_s3_cv9XE6Sg3Rtl9qbeKQB2gfU20WlJMnOVAoyjYq36neTRb0tdq6WeWo1uqzmuuYlepxl2Tw5BaQ";
		//localStorage.setItem("external_load", null);
		$scope.doGetPatientProfiles();	
		$scope.doGetRelatedPatientProfiles('userhome');
	}else{
		if(deploymentEnv == "Multiple"){
			$state.go('tab.chooseEnvironment');
		}else if(deploymentEnv == "Single"){
			$state.go('tab.loginSingle');
		}else{
			$state.go('tab.login');
		}
	}
	$scope.showAlert = function(){
	
	};
})       


.controller('LoginCtrl', function($scope, $ionicScrollDelegate, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage,StateList, CustomCalendar, CreditCardValidations) {
    
	$rootScope.deploymentEnv = deploymentEnv;
	//$rootScope.APICommonURL = 'https://sandbox.connectedcare.md';
	//$rootScope.APICommonURL = 'https://connectedcare.md';
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
		$rootScope.brandColor = brandColor;
		$rootScope.logo = logo;
		$rootScope.Hopital = Hopital;
		$rootScope.APICommonURL = 'https://sandbox.connectedcare.md';
		apiCommonURL = 'https://sandbox.connectedcare.md';
		$rootScope.hospitalId = singleHospitalId;
	}
	
	$rootScope.envList = ["Snap.QA", "Sandbox" ];
	
	$scope.ChangeEnv = function(env){
		if(env == "Snap.QA"){
			$rootScope.APICommonURL = ' https://snap-qa.com';
			apiCommonURL = ' https://snap-qa.com';
			
		}else if(env == "Sandbox"){
			$rootScope.APICommonURL = 'https://sandbox.connectedcare.md';
			apiCommonURL = 'https://sandbox.connectedcare.md';
		}
		$state.go('tab.login');
	};
	    //$rootScope.externalURL = localStorage.getItem("external_load");
			/*$scope.externalVideoURLFromWeb = localStorage.getItem("external_load");
			if($scope.externalVideoURLFromWeb != ""){
				alert($scope.externalVideoURLFromWeb);
				alert($scope.externalVideoURLFromWeb.search().user);
			}*/
            /*
    $timeout(function(){
        $rootScope.externalURL = localStorage.getItem("external_load");
   },900);
    */
	/*$rootScope.online = navigator.onLine;	
	$rootScope.IsOnline = navigator.onLine;
	alert($rootScope.online + 'aaa');
	alert($rootScope.IsOnline + 'bbb');
	connectionCheck = $interval(function(){
			if($rootScope.online) { 
				$scope.networkError();
			}
    }, 1000);
	
	$scope.networkError = function(){				
		$interval.cancel(connectionCheck);
		$rootScope.online = true;
	return alert('Network Disconnected');		
	}
	*/
	
	
	
	$rootScope.currState = $state;
    $rootScope.monthsList = CustomCalendar.getMonthsList();
    $rootScope.ccYearsList = CustomCalendar.getCCYearsList();
    
    $rootScope.IOSDevice = ionic.Platform.isIOS();
	$rootScope.AndroidDevice = ionic.Platform.isAndroid();
	$rootScope.WindowsPhone = ionic.Platform.isWindowsPhone();
    $rootScope.isWebView = ionic.Platform.isWebView();
    $rootScope.isIPad = ionic.Platform.isIPad();
    $rootScope.isWindow = true;
     
    if($rootScope.IOSDevice || $rootScope.isIPad) {
		$rootScope.screenwidth = window.innerWidth;
		if($rootScope.screenwidth < 325) { //alert($rootScope.screenwidth);
			$rootScope.consentScreenSize = "margin-top: 224px !important;";
		}
		
		$rootScope.deviceName = "IOS";
        $rootScope.BarHeaderLessDevice = "bar-headerLessIOS";
        $rootScope.SubHeaderLessDevice = "bar-subheaderLessIOS";
		$rootScope.loginSub = "height: 100px; top: 43px;";
		$rootScope.loginSubTitle = "top: 31px;";
        $rootScope.HeadTitleLessDevice = "head_titleLessIOS";
        $rootScope.password_sub_header = "password_sub_headerIOS";
        $rootScope.password_header_content = "password_header_contentIOS";
        $rootScope.header_image = "header_imageIOS";
        $rootScope.title_patient = "title_patientIOS";
        $rootScope.HeaderList = "HeaderListIOS";
        $rootScope.menuiconIOS = "menuiconIOS";
        $rootScope.sidemenuHome = "SidemenuHomeIOS";
        $rootScope.calendarTitle = "calendarTitleIOS";
        $rootScope.barsubheaderHomeUser = "bar-subheaderHomeUserIOS";
        $rootScope.patient_subHeaderTopMove = "margin-top: 1px !important;";
        $rootScope.intakeTittle = "intakeTittleIOS";
        $rootScope.MenuInnerStyle = "top: 0px;";
        $rootScope.IntakeFormInnerStyle = "margin-top: 7px;";
		$rootScope.IntakeFormInnerStyleMedication = "margin-top: 0px;";
        $rootScope.PatientCalentarInnerStyle = "margin-top: 1px;";
        $rootScope.PatientCalentarSchedule = "top: 7px;position: relative; height: 49px;";
        $rootScope.PatientCalentarScheduleItem = "top: 48px;"
        $rootScope.PatientCalentarInnerStyleDetail = "margin-top: 1px;";
        $rootScope.PatientCalentarInnerStyleAppointmentWith = "margin-top: -16px !important;";
        $rootScope.appoinmentStyle = "  margin-top: -5px;";
		$rootScope.appointContent = "margin: 85px 0 0 0;";
        $rootScope.MenuIconBottom = "top: 4px;";
        $rootScope.patientsubHeaderInnerStyle = "margin-top: 0px;";
		$rootScope.waitingContentIos = "margin-top: 124px; ";
        $rootScope.BackBotton = "top: 7px; position: relative;";
        $rootScope.Appoinmentwaitcenter = "left: -27px;";
        $rootScope.PaymentStyle = "top: 11px;";
        $rootScope.HeadercardDetails = "height: 69px;";
        $rootScope.HeadercardDetailsBack = "margin-top: 13px;";
        $rootScope.HeadercardDetailsBack = "margin-top: 13px;";
        $rootScope.AddHealthPlanCancel = "margin-top: 6px";
        $rootScope.ReportScreen = " top: 1px; position: relative;";
        $rootScope.PlanDetails= "margin-top: 17px;";
        $rootScope.SubDetailsPlanDetails= "margin-top: -16px;";
        $rootScope.PatientTitle= "  margin-top: 26px;";
        $rootScope.MenuIconBottomRecipt = "top: -4px;";
        $rootScope.PatientConcerns = "margin-top: 90px;";
        $rootScope.GoogleSearchStyle = "top: 24px;";
        $rootScope.BackgroundColorGoogle = "background-color: #fff;";
        $rootScope.GoogleSearchContent = "top: 55px;";
        $rootScope.NextButtonReduce = "right: 5px;";
        $rootScope.CardDetailsNextButton = "left: 0px;margin-top: 13px;";
        $rootScope.IntakeFormInnerStyleTitle = "top: 3px;position: relative;";
		$rootScope.loginLineHeight = "top: 2px; position: relative;";
		$rootScope.passwordLineHeight = "top: 2px; position: relative;";
		$rootScope.ContentOverlop = "margin: 147px 0 0 0;";	
		$rootScope.ContentConsultCharge = "margin: 141px 0 0 0; padding-top: 43px;"; 	
		$rootScope.currentMedicationContent = "margin-top: 125px !important;";
		$rootScope.usHomeCOntent = "margin: 75px 0 0 0 !important;";
    if($rootScope.IOSDevice) {
        $rootScope.patientConternFontStyle = "patientConternFontStyle-ios";
        $rootScope.concernListTitleStyle = "concernListTitle-ios"; 
        $rootScope.concernListDoneStyle = "concernListDone-ios";
        $rootScope.PrimaryConcernPopupH = "height: 66px;";
        $rootScope.PrimaryConcernPopupSearchBox = "margin-top: -7px;";
        $rootScope.PrimaryConcernPopupTitle = "margin-top: 7px; font-family: 'Glober SemiBold'; ";
        $rootScope.PrimaryConcernPopupDone = "margin-top: 10px; padding-right: 0px; padding-left: 0px;padding: 0px;"; 
        $rootScope.PriorSurgeryPopupTitle = "margin-top: 16px;";
        $rootScope.PriorSurgeryPopupDone = "  margin-top: 21px;";
        $rootScope.PriorSurgeryPopupCancel = " margin-top: 2px;  padding-right: 0px; padding-left: 0px;padding: 0px;";
        $rootScope.ChronicConditionPopupTitle = "margin-top: 13px;";
        $rootScope.ChronicConditionPopupDone = "margin-top: 13px;";
        $rootScope.NextIntakeForm = "margin-left: -21px;";
        $rootScope.LoginContant = "padding-top: 43px !important; margin: 99px 0 0 0;"; //margin: 30px 0 0 0 remove
        $rootScope.LoginContantDiv = " height: 50px;";  //95px
        //$rootScope.PasswordOverlop = "margin: 235px 0 0 0;";
        $rootScope.PasswordOverlop = "margin: 105px 0 0 0 !important; padding-top: 18px !important;";  
        $rootScope.PriorSurgeryPopupTextBox = "margin-top: 15px;";  
        $rootScope.PriorSurgeryPopupTextBox = "margin-top: 11px;";
        $rootScope.ContentOverlop = "margin: 147px 0 0 0;";
        $rootScope.AddhealthplanOverlop = "margin: 187px 0 0 0;";
        $rootScope.PositionIOS = "position:fixed; top:105px;";
        $rootScope.MarginHomeTop = "margin-top: -10px";  
        $rootScope.concernsItemDivs = "top: 5px;";        
        $rootScope.FootNextButtonRight = "margin-left: -83px !important;";
        $rootScope.FootNextButton = "left: 24px;";
        $rootScope.PriorSurgeryContant = "margin-top: 43px;";    
        $rootScope.reportDone = "padding-top: 26px;"; 
        $rootScope.reportTitletop = "top:4px !important;"; 
        $rootScope.resetContent = "margin: -46px 0 0 0;";
        $rootScope.ConcernFooterNextIOS = "margin-left: -46px !important; left: -16px !important;";
        $rootScope.providerItamMarginTop  = "top: 5px;";
    }
    if($rootScope.isIPad) { 
        $rootScope.PrimaryConcernPopupH = "height: 66px;";
        $rootScope.PrimaryConcernPopupSearchBox = "margin-top: -7px;";
        $rootScope.PrimaryConcernPopupTitle = "margin-top: 6px; font-family: 'Glober SemiBold'; ";
        $rootScope.PrimaryConcernPopupDone = "margin-top: 8px; padding-right: 0px; padding-left: 0px;padding: 0px;"; 
        $rootScope.PriorSurgeryPopupTitle = "margin-top: 0px;";
        $rootScope.PriorSurgeryPopupDone = "margin-top: 6px;";
        $rootScope.PriorSurgeryPopupCancel = " margin-top: 2px; padding-right: 0px; padding-left: 0px;padding: 0px;";
        $rootScope.ChronicConditionPopupTitle = "margin-top: 6px;";
        $rootScope.ChronicConditionPopupDone = "margin-top: 10px;";
        /*$rootScope.FootNextButtonRight = "margin-left: -61px !important;"; */
        $rootScope.FootNextButtonRight = "margin-left: -87px !important;";
        $rootScope.FootNextButton = "left: 22px;";
        $rootScope.FootNextButtonPatient = "left: 3px;"; 
    }
        $rootScope.PriorSurgeryContant = "margin-top: 53px;";     
        $rootScope.CardDetailYear = "padding-left: 11px;";
        $rootScope.CardDetailmonth = "padding-right: 11px;";
        $rootScope.CountrySearchItem = "top: 13px;";
        $rootScope.ConstantTreat = "font-size: 16px;";
		$rootScope.NeedanAcountStyle = "NeedanAcount_ios";
        $rootScope.calendarBackStyle = "top: 13px !important;";
    } else if($rootScope.AndroidDevice) { 
		$rootScope.deviceName = "Android";
        $rootScope.BarHeaderLessDevice = "bar-headerLessAndroid";
        $rootScope.SubHeaderLessDevice = "bar-subheaderLessAndroid";
        $rootScope.HeadTitleLessDevice = "head_titleLessAndroid";
        $rootScope.password_sub_header = "password_sub_headerAndroid";
        $rootScope.password_header_content = "password_header_contentAndroid";
        $rootScope.header_image = "header_imageAndroid";
        $rootScope.title_patient = "title_patientAndroid";
        $rootScope.HeaderList = "HeaderListAndroid";
        $rootScope.sidemenuHome = "SidemenuHomeAndroid";
        $rootScope.calendarTitle = "calendarTitleAndroid";
        $rootScope.barsubheaderHomeUser = "bar-subheaderHomeUserAndroid";
        $rootScope.calendarBack = "calendarBackAndroid";
        $rootScope.intakeTittle = "intakeTittleAndroid"; 
        $rootScope.MenuInnerStyle = "top: -8px;"; 
        $rootScope.MenuIconBottomRecipt = "top: -8px;";
        $rootScope.AddhealthplanOverlop = "margin: 186px 0 0 0;";  
         $rootScope.PriorSurgeryPopupCancel = "margin-top: -4px;  padding-right: 0px; padding-left: 0px;padding: 0px;";    
       $rootScope.PasswordOverlop = "margin: 105px 0 0 0; padding-top: 30px;"; 
	   $rootScope.resetContent = "margin: 202px 0 0 0;";
	    $rootScope.NeedanAcountStyle = "NeedanAcount_android";
        $rootScope.calendarBackStyle = "";
        $rootScope.patientConternFontStyle = "patientConternFontStyle";
        $rootScope.concernListTitleStyle = "concernListTitle"; 
        $rootScope.concernListDoneStyle = "concernListDone";
        $rootScope.PrimaryMarginTop  = "margin-top: -16px";
        $rootScope.ConcernFooterNextIOS = "margin-left: -22px !important; left: -36px !important;";
        $rootScope.providerItamTop  = "top: 6px;";
		$rootScope.appointContent = "margin: 76px 0 0 0;";
		$rootScope.currentMedicationContent = "margin-top: 118px !important;";
		 $rootScope.MarginHomeTop = "margin-top: -50px;";
		$rootScope.waitingContentIos = "margin-top: 120px; ";		 
        $rootScope.providerItamMarginTop  = "";
    }
   $scope.showSearchInput = function(){
		var searchStyle = $('#divSearchInput').css('display');
	
		if(searchStyle == 'none'){
			$("#divSearchInput").css("display", "block");
		
			if($('#divSearchInput').hasClass("ng-hide"))
				$('#divSearchInput').removeClass('ng-hide');
			if($('#divSearchInput').hasClass("slideOutUp"))
				$('#divSearchInput').removeClass('slideOutUp');
			$('#divSearchInput').addClass('animated slideInDown');
			
			
			var searchStyle1 = $('#divSearchInput').css('display');
			if(searchStyle1 == 'block'){
				if($rootScope.AndroidDevice) {
					$('.ContentUserHome').animate({"margin" : "140px 0 0 0"}, 290);
				} else {
					$('.ContentUserHome').animate({"margin" : "138px 0 0 0"}, 290);
				}
			}		
			
		}else{
			if($('#divSearchInput').hasClass("slideInDown")){
				$('#divSearchInput').removeClass('slideInDown');
			}
			$('#divSearchInput').addClass('animated slideOutUp');
			if($rootScope.AndroidDevice) {
			
				$('.ContentUserHome').animate({"margin" : "70px 0 0 0"}, 290);
			} else {
				$('.ContentUserHome').animate({"margin" : "75px 0 0 0"}, 290);
			}	
			
			setTimeout(function(){		
				$("#divSearchInput").css("display", "none");			
			}, 500);	
		}
   };
   
	$ionicPlatform.registerBackButtonAction(function (event, $state) {	
        if ( ($rootScope.currState.$current.name=="tab.addCard") ||
			  ($rootScope.currState.$current.name=="tab.submitPayment") ||
			  ($rootScope.currState.$current.name=="tab.waitingRoom") ||
			 ($rootScope.currState.$current.name=="tab.receipt") || 	
             ($rootScope.currState.$current.name=="tab.videoConference") ||
			 ($rootScope.currState.$current.name=="tab.ReportScreen")
            ){ 
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states. 
                // Do nothing here to disable H/W back button.
            }else if($rootScope.currState.$current.name=="tab.login"){
                navigator.app.exitApp();
            }else if($rootScope.currState.$current.name=="tab.cardDetails"){
				var gSearchLength = $('.ion-google-place-container').length;
				if(($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) == 'block')	{
					$ionicBackdrop.release();					
					$(".ion-google-place-container").css({"display": "none"});						 
					
				}else{		
					$(".ion-google-place-container").css({"display": "none"});
					navigator.app.backHistory(); 
				}
												
			}else {                
                navigator.app.backHistory(); 
            }
        }, 100); 	
		
		/* $ionicPlatform.registerBackButtonAction(function (event, $state) {	
			if($rootScope.currState.$current.name=="tab.login"){
                navigator.app.exitApp();
            }else if($rootScope.currState.$current.name=="tab.cardDetails"){
				var gSearchLength = $('.ion-google-place-container').length;
				if(($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) == 'block')	{
					$ionicBackdrop.release();					
					$(".ion-google-place-container").css({"display": "none"});						 
					
				}else{		
					$(".ion-google-place-container").css({"display": "none"});
					navigator.app.backHistory(); 
				}
												
			}else {                
               
            }
        }, 100); */	
		
	
/*	var dtNow = new Date("2015-05-26T13:20:04.268Z");	*/

    $scope.$storage = $localStorage;
   
    
	var checkAndChangeMenuIcon;
    $interval.cancel(checkAndChangeMenuIcon);
    
    $rootScope.checkAndChangeMenuIcon = function(){
        if (!$ionicSideMenuDelegate.isOpen(true)){
          if($('#BackButtonIcon').hasClass("ion-close")){
            $('#BackButtonIcon').removeClass("ion-close");
            $('#BackButtonIcon').addClass("ion-navicon-round"); 
          }
        }else{
            if($('#BackButtonIcon').hasClass("ion-navicon-round")){
            $('#BackButtonIcon').removeClass("ion-navicon-round");
            $('#BackButtonIcon').addClass("ion-close"); 
          }
        }
    }
    //$localstorage.set("Cardben.ross.310.95348@gmail.com", undefined);
	//$localstorage.set("CardTextben.ross.310.95348@gmail.com", undefined);
 $scope.toggleLeft = function() {
  $ionicSideMenuDelegate.toggleLeft();
        $rootScope.checkAndChangeMenuIcon();
        if(checkAndChangeMenuIcon){
            $interval.cancel(checkAndChangeMenuIcon);
        }
		if($state.current.name != "tab.login" && $state.current.name != "tab.loginSingle"){
			checkAndChangeMenuIcon = $interval(function(){
				$rootScope.checkAndChangeMenuIcon();
			}, 300);
		}
 };
 
  $scope.doRefreshUserHome = function() {
	$scope.doGetPatientProfiles();	
	$scope.doGetRelatedPatientProfiles();
	//$scope.doGetScheduledConsulatation();
	 $timeout( function() {		
		//$scope.getScheduledDetails($rootScope.patientId);
        $scope.$broadcast('scroll.refreshComplete');
     }, 1000);
    $scope.$apply();	
  };
	
	
	
	$scope.ClearRootScope = function() {
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
		if(deploymentEnv == "Multiple"){
			$state.go('tab.chooseEnvironment');
		}else if(deploymentEnv == "Single"){
			$state.go('tab.loginSingle');
		}else{
			$state.go('tab.login');
		}
	}
	
	
	
	$('#Provider').change(function () {
        $('div.viewport1').text($("option:selected", this).text());
    }); 

    //$rootScope.StateList = StateLists.getStateDetails();
	$scope.currentYear = new Date().getFullYear()
      $scope.currentMonth = new Date().getMonth() + 1
      $scope.months = $locale.DATETIME_FORMATS.MONTH
      $scope.ccinfo = {type:undefined}
      $scope.save = function(data){
        if ($scope.paymentForm.$valid){
			console.log('valid data saving stuff here');
          console.log(data) // valid data saving stuff here
        }
      }
	
	$rootScope.Validation = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> '+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$("#Error_Message").append(top);
				//$("#notifications-top-center").addClass('animated ' + 'slideOutUp');
				refresh_close();
			//});
	}
	
	$rootScope.serverErrorMessageValidation = function(){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> Unable to connect to the server. Please try again later.! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$(".Server_Error").append(top);
				//$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}

	$rootScope.serverErrorMessageValidationForPayment = function(){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> Invalid card details. Please correct and try again.! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$(".Server_Error").append(top);
				//$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}	
	
	$rootScope.serverErrorMessageValidationForHealthPlanApply = function(){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> Unable to apply health plan. Please correct and try again.! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$(".Server_Error").append(top);
				//$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}
	
	$rootScope.serverErrorMessageValidationForHealthPlanVerify = function(){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> Unable to verify health plan. Please correct and try again.! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline"></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$(".Server_Error").append(top);
				//$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}
	
	 $scope.$watch('userLogin.UserEmail', function(UserEmail){	
			if($localstorage.get('username') == UserEmail) {
				if($localstorage.get('username')) {
					$rootScope.chkedchkbox = true;
					}
			}
			if($localstorage.get('username') != UserEmail) {
					 $localstorage.set('username', ""); 
					$rootScope.chkedchkbox = false;					
			} else {			
				if($("#squaredCheckbox").prop('checked') == true) {
					$rootScope.chkedchkbox = true;
				}	
			}
		
		  //$localstorage.set('chkedchkbox', "");	
    });
	
	
	

    $('#UserEmail').val($localstorage.get('username'));
	
    
	$scope.userLogin = {};
    $scope.userLogin.UserEmail = $localStorage.oldEmail;
    $scope.LoginFunction = function(item,event){
		if($('#UserEmail').val() == ''){			
			$scope.ErrorMessage = "Please enter your email";
			$rootScope.Validation($scope.ErrorMessage);
			
		} else {
			 $scope.ValidateEmail = function(email){
				var expr = /^[a-zA-Z0-9.!#$%&amp;'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
				return expr.test(email);
			};
			
			if (!$scope.ValidateEmail($("#UserEmail").val())) {
				$scope.ErrorMessage = "Please enter a valid email address";
				$rootScope.Validation($scope.ErrorMessage);
			}
			else {
				if($("#squaredCheckbox").prop('checked') == true) {
                    $localstorage.set('username', $("#UserEmail").val());
                    $localStorage.oldEmail = $scope.userLogin.UserEmail;  
                    $rootScope.UserEmail = $scope.userLogin.UserEmail;
					$rootScope.chkedchkbox = true;

                } else { 
                   $rootScope.UserEmail = $scope.userLogin.UserEmail;
                   $localStorage.oldEmail = '';
                   $localstorage.set('username', ""); 				  				
				   $rootScope.chkedchkbox = false;
                }                
				$scope.doGetFacilitiesList();
			}
		}
		
    };
	
	$scope.checkSingleHospitalLogin = function(item,event){
		if($('#UserEmail').val() == ''){			
			$scope.ErrorMessage = "Please enter an email";
			$rootScope.Validation($scope.ErrorMessage);
			
		}else if($('#UserEmail').val() == ''){			
			$scope.ErrorMessage = "Please enter your password";
			$rootScope.Validation($scope.ErrorMessage);
			
		}else{
			if($("#squaredCheckbox").prop('checked') == true) {
				$localstorage.set('username', $("#UserEmail").val());
				$localStorage.oldEmail = $scope.userLogin.UserEmail;  
				$rootScope.UserEmail = $scope.userLogin.UserEmail;
				$rootScope.chkedchkbox = true;

			} else { 
				$rootScope.UserEmail = $scope.userLogin.UserEmail;
				$localStorage.oldEmail = '';
				$localstorage.set('username', ""); 				  				
				$rootScope.chkedchkbox = false;
			}
			$scope.doGetToken();
		}
	};
	
	$scope.doGetFacilitiesList = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		var params = {
            emailAddress: $rootScope.UserEmail, 
			accessToken: $rootScope.accessToken,			
            success: function (data) {
				//console.log(data);
                $rootScope.PostPaymentDetails = data.data;
				if($rootScope.PostPaymentDetails == "")	 {
					$scope.ErrorMessage = "No account associated with this email.  Please try again";
					$rootScope.Validation($scope.ErrorMessage);
				} else {				
					$rootScope.hospitalDetailsList = [];
					angular.forEach($rootScope.PostPaymentDetails, function(index, item) {	
						$rootScope.hospitalDetailsList.push({							
							'id': index.$id,
							'domainName': index.domainName,
							'logo': $rootScope.APICommonURL + index.logo,
							'name': index.name,
							'operatingHours': index.operatingHours,
							'providerId': index.providerId,	
							'brandColor': index.brandColor,
							'contactNumber':index.contactNumber,
							'appointmentsContactNumber': index.appointmentsContactNumber,
						});
					});
					
					$rootScope.contactNumber = $rootScope.hospitalDetailsList[0].contactNumber;
					$rootScope.appointmentsContactNumber = $rootScope.hospitalDetailsList[0].appointmentsContactNumber;
					
					if(typeof $rootScope.contactNumber != 'undefined') {
						$rootScope.contactNumber = $rootScope.contactNumber;
					} else if(typeof $rootScope.contactNumber == 'undefined') {
						if(typeof $rootScope.appointmentsContactNumber != 'undefined') {
							$rootScope.contactNumber = $rootScope.appointmentsContactNumber;
						} else if(typeof $rootScope.appointmentsContactNumber == 'undefined') {
							$rootScope.contactNumber = '';
						}
					}
					
					$rootScope.CountryLists = CountryList.getCountryDetails();	
                    $state.go('tab.provider');
				}
				
				//console.log($rootScope.hospitalDetailsList);		
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
		
		LoginService.getFacilitiesList(params);
	}
	
	
	
	$scope.ProviderFunction = function(hospitalDetailsDatas) {
        $rootScope.hospitalId = hospitalDetailsDatas.providerId;
        $rootScope.Hopital = hospitalDetailsDatas.name;
        $rootScope.logo = hospitalDetailsDatas.logo;
        $rootScope.operatingHours = hospitalDetailsDatas.operatingHours;
        $rootScope.id = hospitalDetailsDatas.id;
        $rootScope.brandColor = hospitalDetailsDatas.brandColor;
        $rootScope.backgroundimage = "background-image: none;"; 
		$state.go('tab.password');
	}
	
	$scope.textboxUp = function() {
		/*$timeout(function(){			
			$ionicScrollDelegate.scrollTo(0, 150, true);
		}, 400);*/
		// $('#passwordtop').css({"padding-bottom": "2px !important"});
		 $timeout(function(){			 
			 $ionicScrollDelegate.scrollTo(0, 150, true);	
			 //$ionicScrollDelegate.getScrollView().scrollTo(0, 150, false);		
		},900);
    };
	
	
	
	$scope.goBackProvider = function() {		
		$state.go('tab.provider');
	};
	
	//Password functionality	
	$scope.pass = {};
	$scope.doGetToken = function () {		
		if($('#password').val() == ''){
			$scope.ErrorMessage = "Please enter your password";
			$rootScope.Validation($scope.ErrorMessage);
		} else {
			console.log($scope.password);
			var params = {
				email: $rootScope.UserEmail, 
				password: $scope.pass.password,
				userTypeId: 1,
				hospitalId: $rootScope.hospitalId,
				success: function (data) {
					//Get default payment profile from localstorage if already stored.
					$rootScope.userDefaultPaymentProfile = $localstorage.get("Card" + $rootScope.UserEmail);
					$rootScope.userDefaultPaymentProfileText = $localstorage.get("CardText" + $rootScope.UserEmail);
					
					$rootScope.accessToken = data.access_token;
					console.log($scope.accessToken);
					if(typeof data.access_token == 'undefined') {
						$scope.ErrorMessage = "Incorrect Password. Please try again";
						$rootScope.Validation($scope.ErrorMessage);
					} else {
						$scope.tokenStatus = 'alert-success';				
						$scope.doGetPatientProfiles();	
						$scope.doGetRelatedPatientProfiles();
                        //$rootScope.CountryLists = CountryList.getCountryDetails();							
					}
				},
				error: function (data) {
					$scope.ErrorMessage = "Incorrect Password. Please try again";
					$rootScope.Validation($scope.ErrorMessage);
				}
			};
			
			LoginService.getToken(params);
		}
    }
	$scope.emailType = 'resetpassword';
	
	$scope.doPostSendPasswordResetEmail = function() {
			if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
			if($('#UserEmail').val() == ''){			
				$scope.ErrorMessage = "Please enter an email!";
				$rootScope.Validation($scope.ErrorMessage);			
			} else {
				if(deploymentEnv == "Single"){ 
					//$rootScope.UserEmail = $('#UserEmail').val();
					if($("#squaredCheckbox").prop('checked') == true) {
						$localstorage.set('username', $("#UserEmail").val());
						$localStorage.oldEmail = $scope.userLogin.UserEmail;  
						$rootScope.UserEmail = $scope.userLogin.UserEmail;
						$rootScope.chkedchkbox = true;

					} else { 
						$rootScope.UserEmail = $scope.userLogin.UserEmail;
						$localStorage.oldEmail = '';
						$localstorage.set('username', ""); 				  				
						$rootScope.chkedchkbox = false;
					}
				}
				 var params = {
					patientEmail: $rootScope.UserEmail,
					emailType: $scope.emailType,
					hospitalId: $rootScope.hospitalId,
					accessToken: $rootScope.accessToken,
					success: function (data) {
					console.log('dopostsentpass');
						console.log(data);
						$scope.PasswordResetEmail = data;
						$state.go('tab.resetPassword');	
					},
					error: function (data) {
						$rootScope.serverErrorMessageValidation();
					}
				};
				
				LoginService.postSendPasswordResetEmail(params);
			}
		}	
	
	$scope.goBackFromReset = function() {
		if(deploymentEnv == "Single"){
			$state.go('tab.loginSingle');
		} else {
			$state.go('tab.password');
		}
	}
	

	//$rootScope.patientId = 471;
	//$rootScope.patientId = 3056;
	//$rootScope.consultationId = 2440;
	//$scope.userId = 471;
	//$scope.userId = 3056;
	//$scope.BillingAddress = '123 chennai';
	//$scope.CardNumber = 4111111111111111;
	//$scope.City = 'chennai';
	//$scope.ExpiryMonth = 8;
	//$scope.ExpiryYear = 2019;
	//$scope.FirstName = 'Rin';
	//$scope.LastName = 'Soft';
	//$scope.State = 'Tamilnadu';
	//$scope.Zip = 91302;
	//$scope.Country = 'US';	
	//$scope.Cvv = 123;
	//$scope.profileId = 31867222;
	$scope.codesFields = 'medicalconditions,medications,medicationallergies,consultprimaryconcerns,consultsecondaryconcerns';
	
	
	
    $rootScope.searchPatientList = {};
    $scope.searched = false;
    //$rootScope.age = 25;
    
    $scope.$watch('data.searchQuery', function(searchKey){
        if(searchKey != '' && typeof searchKey != 'undefined'){
            $rootScope.patientSearchKey = searchKey;
            var loggedInPatient = {
                'patientFirstName': $rootScope.primaryPatientName,
                'patientLastName': $rootScope.primaryPatientLastName,
                'birthdate': $rootScope.dob,
				'ageBirthDate': $rootScope.ageBirthDate,
                'profileImagePath': $rootScope.PatientImage,
				'patientName': $rootScope.primaryPatientFullName,
				'patientId': $rootScope.primaryPatientId,
				'isAuthorized': true
            };
            if(!$scope.searched){
                //$rootScope.dependentDetails.push(loggedInPatient);
                $rootScope.RelatedPatientProfiles.splice(0, 0, loggedInPatient);
            }
            $scope.searched = true;
        }else{
            if($scope.searched){
                $rootScope.RelatedPatientProfiles.shift();
                $scope.searched = false;
            }
        }
    });  
	
	$scope.doGetPatientProfiles = function() {
			if ($rootScope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			 var params = {
                accessToken: $rootScope.accessToken,
				success: function (data) {
					
					$rootScope.patientInfomation = data.data[0];
					$rootScope.patientAccount = data.data[0].account;	
					$rootScope.patientAddresses = data.data[0].addresses;	
					$rootScope.patientAnatomy = data.data[0].anatomy;
					$rootScope.patientPharmacyDetails = data.data[0].pharmacyDetails;
					$rootScope.patientPhysicianDetails = data.data[0].physicianDetails;	
					//alert("$T/ESTONE../$TESTONE../../".replace( new RegExp("\\../","gm")," "))
					$rootScope.PatientImage = ($rootScope.APICommonURL + $rootScope.patientAccount.profileImagePath).replace(new RegExp("\\../","gm"),"/");
					$rootScope.address = data.data[0].address;
					$rootScope.city = data.data[0].city;
					$rootScope.createDate = data.data[0].createDate;
					$rootScope.dob = data.data[0].dob;
					$rootScope.ageBirthDate = ageFilter.getDateFilter(data.data[0].dob);
					$rootScope.gender = data.data[0].gender;
					$rootScope.homePhone = data.data[0].homePhone;
					$rootScope.location = data.data[0].location;
					$rootScope.mobilePhone = data.data[0].mobilePhone;
					$rootScope.organization = data.data[0].organization;
					$rootScope.primaryPatientName = data.data[0].patientName;
					$rootScope.userCountry = data.data[0].country;
					if(typeof $rootScope.userCountry == 'undefined') {
						$rootScope.userCountry = '';
					}
					$rootScope.primaryPatientGuardianName = '';
					$rootScope.state = data.data[0].state;
					$rootScope.zipCode = data.data[0].zipCode;
					$rootScope.primaryPatientId = $rootScope.patientAccount.patientId;	
					$scope.doGetPrimaryPatientLastName();	
					 $scope.doGetScheduledConsulatation();
						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
					$rootScope.patientInfomation = '';
					$rootScope.patientAccount = '';	
					$rootScope.patientAddresses = '';	
					$rootScope.patientAnatomy = '';
					$rootScope.patientPharmacyDetails = ''
					$rootScope.patientPhysicianDetails = '';	
					//alert("$T/ESTONE../$TESTONE../../".replace( new RegExp("\\../","gm")," "))
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
			};
			
			LoginService.getPatientProfiles(params);
		}
		
	$scope.doGetPrimaryPatientLastName = function() {
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			 var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
				success: function (data) {
					//$scope.RelatedPatientProfiles = data.data;
					$rootScope.primaryPatientLastName = [];	
						angular.forEach(data.data, function(index, item) {		
							$rootScope.primaryPatientLastName.push({
								'id': index.$id,
								'patientName': index.patientName,
								'lastName': index.lastName,
								'profileImagePath': $rootScope.APICommonURL + index.profileImagePath,
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
					$rootScope.primaryPatientLastName = $rootScope.primaryPatientLastName[0].lastName;	
					
					$rootScope.primaryPatientFullName = $rootScope.primaryPatientName + ' '+$rootScope.primaryPatientLastName;					
						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getPrimaryPatientLastName(params);
		}	
	
	
	$scope.doGetRelatedPatientProfiles = function() {
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			 var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
				success: function (data) {
					//$scope.RelatedPatientProfiles = data.data;
					$rootScope.RelatedPatientProfiles = [];	
					
						angular.forEach(data.data, function(index, item) {		
							$rootScope.RelatedPatientProfiles.push({
								'id': index.$id,
								'patientId': index.patientId,
								'patientName': index.patientName,
								'profileImagePath': ($rootScope.APICommonURL + index.profileImagePath).replace(new RegExp("\\../","gm"),"/"),
								'relationCode': index.relationCode,
								'isAuthorized': index.isAuthorized,
								'birthdate': index.birthdate,
								'ageBirthDate': ageFilter.getDateFilter(index.birthdate),
								'addresses': angular.fromJson(index.addresses),
								'patientFirstName': index.patientFirstName,
								'patientLastName': index.patientLastName,
								'guardianFirstName': index.guardianFirstName,
								'guardianLastName': index.guardianLastName,
								'guardianName': index.guardianName,
							});
						});	
						
						 $rootScope.searchPatientList = $rootScope.RelatedPatientProfiles;
						 $state.go('tab.userhome');	
						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getRelatedPatientProfiles(params);
		}
    
    
    
	$scope.doGetExistingConsulatation = function () {
		$rootScope.consultionInformation = '';
		$rootScope.appointmentsPatientFirstName = '';
		$rootScope.appointmentsPatientLastName = '';
		$rootScope.appointmentsPatientDOB = '';
		$rootScope.appointmentsPatientGurdianName = '';
		$rootScope.appointmentsPatientImage = '';
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            consultationId: $rootScope.consultationId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $scope.existingConsultation = data;
			
                $rootScope.consultionInformation = data.data[0].consultationInfo;
				$rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
				if(!angular.isUndefined($rootScope.consultationStatusId)) {
						if($rootScope.consultationStatusId == 71 ) {
							navigator.notification.alert(
								'Your consultation is already started on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 72 ) {
							navigator.notification.alert(
								'Your consultation is already ended.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 79 ) {
							navigator.notification.alert(
								'Your consultation is cancelled.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 80 ) {
							navigator.notification.alert(
								'Your consultation is in progress on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						}
						
				}
				
                $rootScope.patientExistInfomation = data.data[0].patientInformation;
				 $rootScope.intakeForm = data.data[0].intakeForm;
				$rootScope.assignedDoctorId = $rootScope.consultionInformation.assignedDoctor.id;
				$rootScope.appointmentsPatientDOB = $rootScope.patientExistInfomation.dob;
				$rootScope.appointmentsPatientGurdianName = $rootScope.patientExistInfomation.guardianName;
				$rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;
				$rootScope.appointmentsPatientImage = $rootScope.APICommonURL + $rootScope.patientExistInfomation.profileImagePath;
				$rootScope.reportScreenPrimaryConcern = $rootScope.intakeForm.concerns[0].customCode.description;
				$rootScope.reportScreenSecondaryConcern = $rootScope.intakeForm.concerns[1].customCode.description;
				if($rootScope.reportScreenSecondaryConcern == "") {
					$rootScope.reportScreenSecondaryConcern = "None Reported";
				}
				if(typeof $rootScope.consultionInformation.note != 'undefined') {
					$rootScope.preConsultantNotes = $rootScope.consultionInformation.note;				
				} else {
					$rootScope.preConsultantNotes = '';
				}
				$scope.doGetExistingPatientName();
				$scope.doGetDoctorDetails();
               
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getExistingConsulatation(params);	
		
	}
	
	$scope.doGetExistingPatientName = function () {
		var params = {
			patientId: $rootScope.appointmentsPatientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {				
				$rootScope.appointmentsPatientFirstName = data.data[0].patientName;	
				$rootScope.appointmentsPatientLastName = data.data[0].lastName;		 
					
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation();
			}
		};
		
		LoginService.getPrimaryPatientLastName(params);
	}
	
	$scope.doGetDoctorDetails = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            doctorId: $rootScope.assignedDoctorId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
				$rootScope.doctorImage = $rootScope.APICommonURL + data.data[0].profileImagePath;	
				$state.go('tab.appoimentDetails');
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getDoctorDetails(params);	
		
	}
	
	/*$scope.doGetExistingConsulatationReport = function () {	
	
		$rootScope.appointmentsPatientFirstName = '';
		$rootScope.appointmentsPatientLastName = '';
		$rootScope.appointmentsPatientDOB = '';
		$rootScope.appointmentsPatientGurdianName = '';
		$rootScope.appointmentsPatientImage = '';
			
		 if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            consultationId: $rootScope.consultationId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $rootScope.consultReport = data.data[0].details[0];				
				$rootScope.reportScreenPrimaryConcern = $rootScope.consultReport.primaryConcern;
				if(typeof $rootScope.reportScreenPrimaryConcern != 'undefined') {
					$rootScope.reportScreenPrimaryConcern1 = $rootScope.reportScreenPrimaryConcern.split("?");
					$rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern1[1];
				} else {
					$rootScope.reportScreenPrimaryConcern = "";
				}
				$rootScope.reportScreenSecondaryConcern = $rootScope.consultReport.secondaryConcern;
				if(typeof $rootScope.reportScreenSecondaryConcern != 'undefined') {
					$rootScope.reportScreenSecondaryConcern1 = $rootScope.reportScreenSecondaryConcern.split("?");
					$rootScope.reportScreenSecondaryConcern = $rootScope.reportScreenSecondaryConcern1[1];
				} else {
					$rootScope.reportScreenSecondaryConcern = "";
				}
				$rootScope.preConsultantNotes = $rootScope.consultReport.rx; 	
				
				//$rootScope.assignedDoctorId = $rootScope.consultionInformation.assignedDoctor.id;
				$rootScope.appointmentsPatientDOB = $rootScope.consultReport.dob;
				
				$rootScope.appointmentsPatientId = $rootScope.consultReport.patientId;
				
				//$rootScope.appointmentsPatientGurdianName = $rootScope.consultReport.guardianName;
				if($rootScope.appointmentsPatientId != $rootScope.primaryPatientId) {
					$rootScope.appointmentsPatientGurdianName = $rootScope.primaryPatientName + ' '+ $rootScope.primaryPatientLastName;
				}
				
				$rootScope.appointmentsPatientImage = $rootScope.APICommonURL + $rootScope.consultReport.profileImagePath;
				$rootScope.appointmentsPatientFirstName = $rootScope.consultReport.patientName;	
				$rootScope.appointmentsPatientLastName = $rootScope.consultReport.lastName;	
				$state.go('tab.appoimentDetails');
				
		   },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
		LoginService.getConsultationFinalReport(params);
	}*/
	
	$scope.GetHealthPlanList = function () {
		$scope.doGetPatientHealthPlansList();
	}
	
	if(typeof $rootScope.providerName == 'undefined' || $rootScope.providerName == "")	
		{
			$rootScope.chooseHealthHide = 'initial';
			$rootScope.chooseHealthShow = 'none';
		} else if(typeof $rootScope.providerName != 'undefined' || $rootScope.providerName != "") {
			$rootScope.chooseHealthHide = 'none';
			$rootScope.chooseHealthShow = 'initial';
		}
	
	$rootScope.openAddHealthPlanSection = function () {
		if($rootScope.insuranceMode == 'on' && $rootScope.paymentMode != 'on') {
			$rootScope.applyPlanMode = "none";
			$rootScope.chooseHealthHide = 'initial';
			$rootScope.chooseHealthShow = 'none';
			$rootScope.verifyPlanMode = "block";
		} else {
			$rootScope.applyPlanMode = "block";
			$rootScope.verifyPlanMode = "none";
		}
		$rootScope.consultChargeNoPlanPage = "none";	
		//$rootScope.verifyHealthPlanPage = "none";
		$rootScope.consultChargeSection = "block";
		$rootScope.healthPlanSection = "none";
		$rootScope.healthPlanPage = "block";			
		$rootScope.chooseHealthHide = 'initial';
		$rootScope.chooseHealthShow = 'none';
		$rootScope.providerName = "";
		$rootScope.PolicyNo = "";
		$scope.doGetPatientHealthPlansList();
	}
	
	$scope.openVerifyInsuranceSection = function () {
		
		$rootScope.consultChargeSection = "none";
		$rootScope.healthPlanSection = "block";
		$rootScope.verifyHealthPlanPage = "block";
		$rootScope.healthPlanPage = "none";
		$rootScope.consultChargeNoPlanPage = "none";		
		$rootScope.chooseHealthHide = 'initial';
		$rootScope.chooseHealthShow = 'none';
		$rootScope.providerName = "";
		$rootScope.PolicyNo = "";
		$scope.doGetPatientHealthPlansList();
	}	
	
	
	$scope.doGetPatientHealthPlansList = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		var params = {
			patientId: $rootScope.patientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {
				//$scope.patientHealthPlanList = data;
				
				if(data.data != '') {
						$rootScope.patientHealthPlanList = [];	
						angular.forEach(data.data, function(index, item) {	
							$rootScope.patientHealthPlanList.push({
								'id': index.$id,
								'healthPlanId': index.healthPlanId,
								'familyGroupId': index.familyGroupId,
								'patientId': index.patientId,
								'insuranceCompany': index.insuranceCompany,
								'isDefaultPlan': index.isDefaultPlan,
								'insuranceCompanyPhone': index.insuranceCompanyPhone,
								'memberName': index.memberName,
								'subsciberId': index.subsciberId,
								'payerId': index.payerId,
								'policyNumberLong': index.policyNumber,
								'policyNumber': index.policyNumber.substring(index.policyNumber.length-4, index.policyNumber.length),
							});
						});	
						
					
						
						if($rootScope.currState.$current.name=="tab.consultCharge")
						{
							$rootScope.enableAddHealthPlan = "block";
							$rootScope.disableAddHealthPlan = "none;";
							$rootScope.consultChargeSection = "none";
							$rootScope.healthPlanSection = "block";	
							//$state.go('tab.addHealthPlan');
						} else if ($rootScope.currState.$current.name=="tab.planDetails") {
							//$rootScope.ApplyPlanPatientHealthPlanList =  $rootScope.patientHealthPlanList;
							$rootScope.consultChargeSection = "none";
							$rootScope.disableAddHealthPlan = "none";
							$rootScope.healthPlanSection = "block";
							$rootScope.enableAddHealthPlan = "block";							
							$state.go('tab.consultCharge');						
							
						}
					} else {
						if($rootScope.currState.$current.name=="tab.consultCharge")
						{
							$rootScope.enableAddHealthPlan = "none";
							$rootScope.disableAddHealthPlan = "block;";
							$rootScope.consultChargeSection = "none";
							$rootScope.healthPlanSection = "block";
							//$state.go('tab.addHealthPlan');
						} else if ($rootScope.currState.$current.name=="tab.planDetails") {
							$rootScope.consultChargeSection = "none";
							$rootScope.healthPlanSection = "block";
							$state.go('tab.consultCharge');		
						}
					}	
				
				
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation();
			}
		};

		LoginService.getPatientHealthPlansList(params);
        
	}
	
    /* country and State */
    
        $rootScope.StateText = "Select your state";

         //Start Open Country List popup
        $scope.loadCountriesList = function() {

               $ionicModal.fromTemplateUrl('templates/tab-CountryList.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    focusFirstInput: false
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                }); 
            //$rootScope.CountryLists = CountryList.getCountryDetails();
        };
    
        // Onchange of Contries
        $scope.OnSelectContryData = function(CountriesList, items) {
             angular.forEach(CountriesList, function(item, index) {
                 if (item.Name == items.Name){
                     item.checked = true;
                     $rootScope.SelectedCountry={							
                        'CountryName': items.Name,
                        'CountryCode': items.CountryCodes.iso2,
                     };
                 }
                 else {
                     item.checked = false; 
                 }
             });
        };

        $scope.closeCountryList = function() {
            $rootScope.SelectedCountry;
            $scope.modal.hide(); 
            //$scope.data.searchCountry = '';    
        };
       //End Countries 
   
        //Start Open State List popup
        $scope.loadStateList = function(CountryCode) {
         $ionicModal.fromTemplateUrl('templates/tab-StateList.html', {
                    scope: $scope,
                    animation: 'slide-in-up',
                    focusFirstInput: false
          }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
             }); 
        $rootScope.CountryCode = CountryCode;
        };
        $scope.stateList = '';
    
    
    
    
    $scope.StateSelect = function($a) {
        if($a.length >= 3){
            
            $timeout(function(){
                var params = { SearchKeys: $a, CountryCode: $rootScope.CountryCode};
                //$rootScope.stateList = StateList.getStateDetails(params);
                var config = { 'params': { 'callback': 'JSON_CALLBACK'} };
                
                var googlePlacesUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?callback=angular.callbacks._&input=' + $a + '&types=(cities)&language=en&components=country:'+$rootScope.CountryCode+'&key=AIzaSyCjq4bTUhjvIxSFJBA6Ekk3DPdA_VrU9Zs';
               
                var googlePlacesResponsePromise = $http.jsonp(googlePlacesUrl,{ 'params': { 'callback': 'JSON_CALLBACK'} });
                
                googlePlacesResponsePromise.success(function(data, status, headers, config) {
                    $rootScope.stateList = JSON.stringify(data);
                });
                
                googlePlacesResponsePromise.error(function(data, status, headers, config) {
                    alert("AJAX failed");
                });
                
            }, 1000);
            
            console.log($rootScope.stateList);
        }else{
            $rootScope.stateList = {};
        }
    };
  
   $scope.closeStateList = function() {
     $rootScope.stateList;
     $rootScope.stateList;
     $scope.modal.hide(); 
    };
   //End State 
    
    
    $scope.CountryChange = function () {
        if($('#country').val() == 'US') {
            $rootScope.StateList = {};
            $rootScope.StateList = StateLists.getStateDetails();
            $rootScope.StateText = "Select your state";
        }else if($('#country').val() == 'UK') {
            $rootScope.StateList = {};
             $rootScope.StateList = UKStateList.getUkStateDetails();
            $rootScope.StateText = "Select your County";
        } else { 
            $rootScope.StateText = "Select your state";
            $rootScope.StateList = StateLists.getStateDetails(); 
        }
        $timeout(function(){
            $('select option').filter(function() {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);
        
     }
    /* country and State */
    
	 $("#addHealthPlan").change(function() {
        //console.log( $('option:selected', this).text() );
		if($('option:selected', this).text() == 'Add a new health plan') {
            if ($rootScope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
			$rootScope.submitPayBack = $rootScope.currState.$current.name;
            $scope.doGetHealthPlanProvider();
		} else {
			$('div.viewport').text($("option:selected", this).text());
		}
    });
	
	/*$('#addHealthPlan').change(function () {
		if($('option:selected', this).text() == 'Add a new health plan') {
			$rootScope.submitPayBack = $rootScope.currState.$current.name;
			$state.go('tab.planDetails');
		} else {
			$('div.viewport').text($("option:selected", this).text());
		}
    }); */
	
	$scope.doGetHealthPlanProvider = function() {
		$rootScope.HealthPlanProvidersList = [];
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
				console.log('addHealthPlan');
					console.log(data);
                    $scope.HealthPlanProvidersList = data.data;
                    if(data != "")
                    $rootScope.ProviderList = [];
                    angular.forEach($scope.HealthPlanProvidersList, function(index, item) {	
						  $rootScope.ProviderList.push({							
							'id': index.$id,
							'id': index.id,
							'payerId': index.payerId,
							'payerName': index.payerName,
							    
						});
					});	
                    $state.go('tab.planDetails');
                },
                error: function (data) {
					$rootScope.serverErrorMessageValidation();
                }
            };
        LoginService.getHealthPlanProvidersList(params);
	}
	

    
    $scope.AddHealth = {};
    $scope.doPostNewHealthPlan = function() {
        if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
        
        var HealthPlanProviders =  $scope.AddHealth.Provider.split("@");
        $scope.insuranceCompany = HealthPlanProviders[0];
        $scope.insuranceCompanyNameId = HealthPlanProviders[1];
        $scope.payerId = HealthPlanProviders[2];
        $scope.ProviderId = HealthPlanProviders[3];
        //$scope.healthPlanID = $scope.ProviderId;
       // console.log($scope.healthPlanID);
       //End 
		$rootScope.providerName = HealthPlanProviders[0];
        $rootScope.PolicyNo = $scope.AddHealth.policyNumber;
		$rootScope.healthPlanID = HealthPlanProviders[1];
       
        if(typeof $rootScope.patientHealthPlanList != 'undefined') { 
                var subsciberNewID = $rootScope.patientHealthPlanList.length + 1;
            } else {
                var subsciberNewID = 1;
            }
        
        $scope.insuranceCompany = $scope.insuranceCompany;
		$scope.insuranceCompanyNameId = $scope.insuranceCompanyNameId;
		$scope.isDefaultPlan =  'Y';
		$scope.insuranceCompanyPhone = '8888888888';
		$scope.memberName = $scope.AddHealth.firstName + $scope.AddHealth.lastName;
		$scope.subsciberId = subsciberNewID // patient id
		$scope.policyNumber = $scope.AddHealth.policyNumber; //P20
		$scope.subscriberFirstName = $scope.AddHealth.firstName;
		$scope.subscriberLastName =  $scope.AddHealth.lastName;
		$scope.subscriberDob = $scope.AddHealth.dateBirth;
		$scope.isActive = 'A';
		$scope.payerId = $scope.payerId; 
        
			 var params = {
                accessToken: $rootScope.accessToken,
                PatientId: $rootScope.patientId,
				insuranceCompany: $scope.insuranceCompany,
				insuranceCompanyNameId: $scope.insuranceCompanyNameId,
				isDefaultPlan: $scope.isDefaultPlan,
				insuranceCompanyPhone: $scope.insuranceCompanyPhone,
				memberName: $scope.memberName,
				subsciberId: $scope.subsciberId,
				policyNumber: $scope.policyNumber,
				subscriberFirstName: $scope.subscriberFirstName,
				subscriberLastName: $scope.subscriberLastName,
				subscriberDob: $scope.subscriberDob,
				isActive: $scope.isActive,
				payerId: $scope.payerId,
				success: function (data) {
					$scope.NewHealthPlan = data;
					if($scope.NewHealthPlan.healthPlanID != '')	{	
			            $rootScope.healthPlanID = data.healthPlanID;
						$scope.doGetPatientHealthPlansList();						
					} else {					
						$scope.ErrorMessage = data.message;
						$rootScope.Validation($scope.ErrorMessage);
						$state.go('tab.planDetails');
					}
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.postNewHealthPlan(params);
		}
	
	$scope.goCardDetailsPage = function() {
		$rootScope.cardPage = "consultCharge";
		$state.go('tab.cardDetails');
	}
	$scope.goCardDetailsPageFromAddCard = function() {
		$rootScope.cardPage = "addCard";
		$state.go('tab.cardDetails');
	}
	
	
	 $("#addNewCard").change(function() {
        console.log( $('option:selected', this).text() );
		if($('option:selected', this).text() == 'Add a new card') {
			$rootScope.submitPayBack = $rootScope.currState.$current.name;
			console.log($rootScope.submitPayBack);
			$rootScope.cardPage = "consultCharge";
			$state.go('tab.cardDetails');
		} else {
			$('div.cardViewport').text($("option:selected", this).text());
        }
    });
	
	$("#addNewCard_addCard").change(function() {
        console.log( $('option:selected', this).text() );
		if($('option:selected', this).text() == 'Add a new card') {
			$rootScope.submitPayBack = $rootScope.currState.$current.name;
			console.log($rootScope.submitPayBack);
			$rootScope.cardPage = "addCard";
			$state.go('tab.cardDetails');
		} else {
			$('div.cardViewport').text($("option:selected", this).text());
        }
    });
	
	$("#addNewCard_submitPay").change(function() {
        console.log( $('option:selected', this).text() );
		if($('option:selected', this).text() == 'Add a new card') {
			$rootScope.submitPayBack = $rootScope.currState.$current.name;
			console.log($rootScope.submitPayBack);
			$rootScope.cardPage = "submitPayment";
			$state.go('tab.cardDetails');
		} else {
			$('div.cardViewport').text($("option:selected", this).text());
        }
    });
		
    $scope.GetConsultChargeNoPlan = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Page) {	
	//$("#aaaa").addClass('animated ' + 'slideInUp');	
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
		$rootScope.BackPage = P_Page;
		$rootScope.copayAmount = $rootScope.consultationAmount;
		$rootScope.consultChargeSection = "none";
		$rootScope.healthPlanSection = "block";
		$rootScope.healthPlanPage = "none";
		$rootScope.consultChargeNoPlanPage = "block";
		//$state.go('tab.consultChargeNoPlan');
	}
	
	 $scope.showConsultChargeNoPlan = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian, P_Page) {		
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
		$rootScope.BackPage = P_Page;
		$rootScope.copayAmount = $rootScope.consultationAmount;
		$rootScope.healthPlanPage = "none";
		$rootScope.consultChargeNoPlanPage = "block";
		//$state.go('tab.consultChargeNoPlan');
	}
	
	$scope.backAddHealthPlan = function() {
		if($rootScope.healthPlanPage == "block") {
			$state.go('tab.consultCharge');
		} else {
			$rootScope.healthPlanPage = "block";
			$rootScope.consultChargeNoPlanPage = "none";
		}
			
	}
	
	$scope.backConsultCharge = function() {
		if(($rootScope.insuranceMode != 'on' && $rootScope.paymentMode == 'on') || ($rootScope.insuranceMode == 'on' && $rootScope.paymentMode != 'on')) {
			$state.go('tab.ConsentTreat');
		}
		else if($rootScope.consultChargeSection == "block") {
			$state.go('tab.ConsentTreat');
		} else if($rootScope.healthPlanSection == "block") {			
			$rootScope.healthPlanSection = "none";
			$rootScope.consultChargeSection = "block";
		}
			
	}
	
	$scope.goToNextPage = function() {
			$state.go($rootScope.BackPage);
	}
	
	$scope.goToPreviosPage = function() {
		/*if($rootScope.submitPayBack=="tab.addCard") {
			$state.go('tab.applyPlan');
		} else {
			$state.go('tab.consultCharge');
		}*/
		$rootScope.consultChargeSection = "block";
		$rootScope.healthPlanSection = "none";	
		$state.go('tab.' + $rootScope.cardPage);	
	}
	
	/*
	$scope.doGetPatientPaymentProfilesCardDetails = function () {
		if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}			
			var params = {
				hospitalId: $rootScope.hospitalId, 
				patientId: $rootScope.patientId,
				accessToken: $rootScope.accessToken,
				success: function (data) {
					if(data != '') {						

						$rootScope.PaymentProfile = [];	
						$rootScope.patientprofileID = data.data.profileID;
						
						$rootScope.PaymentDetailsList = data.data.paymentProfiles;
						$rootScope.SelectedPaymentDetails = $rootScope.PaymentDetailsList[data.data.paymentProfiles.length - 1];
						
						
						$rootScope.PaymentDetailsList.push({
							'cardNumber': 'Add a new card'
						});
					
						angular.forEach(data.data.paymentProfiles, function(index, item) {
							$rootScope.PaymentProfile.push({
								'id': index.$id,
								'billingAddress': angular.fromJson(index.billingAddress),
								'cardExpiration': index.cardExpiration,
								'cardNumber': index.cardNumber,
								'isBusiness': index.isBusiness,
								'profileID': index.profileID,
							});
						});	
						$rootScope.enableSubmitpayment = "block";
						$rootScope.disableSubmitpayment = "none;";
						 $state.go('tab.submitPayment');
					} else {
						$rootScope.enableSubmitpayment = "none";
						$rootScope.disableSubmitpayment = "block;";						
						 $state.go('tab.submitPayment');
					}		
					
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getPatientPaymentProfile(params);
		
	}*/
	
	//Come to this issues : value="? undefined:undefined ?". Use this following Function //
      $timeout(function(){
            $('select option').filter(function() {
                return this.value.indexOf('?') >= 0;
            }).remove();
        }, 100);
    //value="? undefined:undefined ?"//
    
    $scope.Health = {};	
    $scope.doPostApplyHealthPlan = function() {
         if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
        $scope.Choose = 'false';
        console.log($scope.Health.addHealthPlan);
        
        if($rootScope.currState.$current.name=="tab.applyPlan") {
            if(typeof $scope.Health.addHealthPlan != 'undefined') {
                 $rootScope.NewHealth = $scope.Health.addHealthPlan;
                 $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                 var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                 $rootScope.providerName = healthInsurance[0];
                 $rootScope.PolicyNo = healthInsurance[1];
                 $rootScope.healthPlanID = healthInsurance[2];
                 //$rootScope.providerName   =  InsuranceCompany;
               
            
            }  else if(typeof $scope.Health.addHealthPlan == 'undefined') {
                 $rootScope.providerName = $rootScope.providerName;
                 $rootScope.PolicyNo = $rootScope.PolicyNo;
                 $rootScope.healthPlanID = $rootScope.healthPlanID;
                 //$rootScope.providerName   =  InsuranceCompany;
                
            }
        } 
        
        if($rootScope.currState.$current.name=="tab.consultCharge") {
                       if(typeof $scope.Health.addHealthPlan != 'undefined') { 
                            if($scope.Health.addHealthPlan != 'Choose Your Health Plan') {
                                 $rootScope.NewHealth = $scope.Health.addHealthPlan;
                                 $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                                 var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                                 $rootScope.providerName = healthInsurance[0];
                                 $rootScope.PolicyNo = healthInsurance[1];
                                 $rootScope.healthPlanID = healthInsurance[2];
                            } else { 
                                $rootScope.NewHealth = "";
                                $rootScope.providerName = "";
                                $rootScope.PolicyNo = "";
                                $rootScope.healthPlanID = "";
                            }
                                 //$rootScope.providerName   =  InsuranceCompany;
                       } if(typeof $scope.Health.addHealthPlan == 'undefined' || $scope.Health.addHealthPlan == 'Choose Your Health Plan') {
                           if($rootScope.NewHealth == "" && $rootScope.providerName == "") {
                                $scope.Choose = 'true';
                            } else { 
                                  if($rootScope.NewHealth != "") {
									  if($rootScope.providerName != '') {
										 $rootScope.providerName = $rootScope.providerName;
										 $rootScope.PolicyNo = $rootScope.PolicyNo;
										 $rootScope.healthPlanID = $rootScope.healthPlanID;
									  } else {
										 $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
										 var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
										 $rootScope.providerName = healthInsurance[0];
										 $rootScope.PolicyNo = healthInsurance[1];
										 $rootScope.healthPlanID = healthInsurance[2];
										}
                                  } else {
                                 $rootScope.providerName = $rootScope.providerName;
                                 $rootScope.PolicyNo = $rootScope.PolicyNo;
                                 $rootScope.healthPlanID = $rootScope.healthPlanID;
                                  }
                           }
			              
                       } else {

                            $rootScope.NewHealth ;
                            $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                            var healthInsurance = $rootScope.SelectedHealthPlans.split('@');

                            $rootScope.providerName = healthInsurance[0];
                            $rootScope.PolicyNo = healthInsurance[1];
                            $rootScope.healthPlanID = healthInsurance[2];
                            // $rootScope.providerName   =  InsuranceCompany;
                            }
                       
                    }
        if($scope.Choose != 'true') {
         var params = {
                accessToken: $rootScope.accessToken,
				insuranceCompanyName: $rootScope.providerName,
				policyNumber: $rootScope.PolicyNo,
				consultationId: $rootScope.consultationId,
				healthPlanId: $rootScope.healthPlanID,
				success: function (data) {
                    if(!data.message) {
						$scope.ApplyHealthPlan = data;
						$rootScope.copayAmount = data.copayAmount;
						if($rootScope.consultationAmount > $rootScope.copayAmount) {
							$rootScope.PlanCoversAmount = $rootScope.consultationAmount - $rootScope.copayAmount;
						} else  {
							$rootScope.PlanCoversAmount = '';
						}
						console.log($scope.ApplyHealthPlan);
						$rootScope.doGetPatientPaymentProfiles();
						$state.go('tab.addCard');
                    } else {
                        if($scope.Health.addHealthPlan != ''){
                    $scope.ErrorMessage = "Bad Request Please check it";
			        $rootScope.Validation($scope.ErrorMessage);
                        } else {
                    $scope.ErrorMessages = "Choose Your Health Plan";
			        $rootScope.Validation($scope.ErrorMessages);
                        }
                    }
                    

				},
				error: function (data) { 
                   $rootScope.serverErrorMessageValidationForHealthPlanApply();
				}
			};
        } else {
            $scope.ErrorMessages = "Choose Your Health Plan";
            $rootScope.Validation($scope.ErrorMessages);
        }
        
			LoginService.postApplyHealthPlan(params);
   	 }
	 
	 $scope.doPostVerifyHealthPlan = function() {
	 
		 if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
        $scope.Choose = 'false';
        console.log($scope.Health.addHealthPlan);        
       
        
        if($rootScope.currState.$current.name=="tab.consultCharge") {
                       if(typeof $scope.Health.addHealthPlan != 'undefined') { 
                            if($scope.Health.addHealthPlan != 'Choose Your Health Plan') {
                                 $rootScope.NewHealth = $scope.Health.addHealthPlan;
                                 $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                                 var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
                                 $rootScope.providerName = healthInsurance[0];
                                 $rootScope.PolicyNo = healthInsurance[1];
                                 $rootScope.healthPlanID = healthInsurance[2];
                            } else { 
                                $rootScope.NewHealth = "";
                                $rootScope.providerName = "";
                                $rootScope.PolicyNo = "";
                                $rootScope.healthPlanID = "";
                            }
                                 //$rootScope.providerName   =  InsuranceCompany;
                       } if(typeof $scope.Health.addHealthPlan == 'undefined' || $scope.Health.addHealthPlan == 'Choose Your Health Plan') {
                           if($rootScope.NewHealth == "" && $rootScope.providerName == "") {
                                $scope.Choose = 'true';
                            } else { 
                                  if($rootScope.NewHealth != "") {
									  if($rootScope.providerName != '') {
										 $rootScope.providerName = $rootScope.providerName;
										 $rootScope.PolicyNo = $rootScope.PolicyNo;
										 $rootScope.healthPlanID = $rootScope.healthPlanID;
									  } else {
										 $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
										 var healthInsurance = $rootScope.SelectedHealthPlans.split('@');
										 $rootScope.providerName = healthInsurance[0];
										 $rootScope.PolicyNo = healthInsurance[1];
										 $rootScope.healthPlanID = healthInsurance[2];
										}
                                  } else {
                                 $rootScope.providerName = $rootScope.providerName;
                                 $rootScope.PolicyNo = $rootScope.PolicyNo;
                                 $rootScope.healthPlanID = $rootScope.healthPlanID;
                                  }
                           }
			              
                       } else {

                            $rootScope.NewHealth ;
                            $rootScope.SelectedHealthPlans = $rootScope.NewHealth;
                            var healthInsurance = $rootScope.SelectedHealthPlans.split('@');

                            $rootScope.providerName = healthInsurance[0];
                            $rootScope.PolicyNo = healthInsurance[1];
                            $rootScope.healthPlanID = healthInsurance[2];
                            // $rootScope.providerName   =  InsuranceCompany;
                            }
                       
                    }
        if($scope.Choose != 'true') {
         var params = {
                accessToken: $rootScope.accessToken,
				insuranceCompanyName: $rootScope.providerName,
				policyNumber: $rootScope.PolicyNo,
				consultationId: $rootScope.consultationId,
				healthPlanId: $rootScope.healthPlanID,
				success: function (data) {
					console.log(data);
					$scope.doGetSkipHealthPlan();
				},
				error: function (data) { 
                   //$rootScope.serverErrorMessageValidationForHealthPlanVerify();
				   $scope.doGetSkipHealthPlan();
				}
			};
        } else {
            $scope.ErrorMessages = "Choose Your Health Plan";
            $rootScope.Validation($scope.ErrorMessages);
        }		
        
			LoginService.postVerifyHealthPlan(params);
   	 }
	 
	 
	 $scope.doGetSkipHealthPlan = function () {	
		
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			
			var params = {
				accessToken: $rootScope.accessToken,
				insuranceCompanyName: $rootScope.providerName,
				policyNumber: $rootScope.PolicyNo,
				consultationId: $rootScope.consultationId,
				healthPlanId: $rootScope.healthPlanID,
				success: function (data) {
					console.log(data);
					$rootScope.enablePaymentSuccess = "none";
					$rootScope.enableInsuranceVerificationSuccess = "block";
					$state.go('tab.receipt'); 
					$scope.ReceiptTimeout();
					
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.postSkipHealthPlan(params);		
    }
	 
	 
    
   
	$rootScope.doGetPatientPaymentProfiles = function () {	
		
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			
			var params = {
				hospitalId: $rootScope.hospitalId, 
				patientId: $rootScope.patientId,
				accessToken: $rootScope.accessToken,
				success: function (data) {
					if(data != 0) {				
						
						$rootScope.patientprofileID = data.data[0].profileID;	

						$rootScope.PaymentProfile = [];	
					
						angular.forEach(data.data[0].paymentProfiles, function(index, item) {	
				
							
							$rootScope.PaymentProfile.push({
								'id': index.$id,
								'billingAddress': angular.fromJson(index.billingAddress),
								'cardExpiration': index.cardExpiration,
								'cardNumber': replaceCardNumber.getCardNumber(index.cardNumber),
								'isBusiness': index.isBusiness,
								'profileID': index.profileID,
							});
						});	
						$rootScope.totalPaymentCard = $rootScope.PaymentProfile.length; 
						
						$rootScope.enableSubmitpayment = "block";
						$rootScope.disableSubmitpayment = "none";
						$rootScope.enablePaymentSuccess = "block";	
						if($rootScope.copayAmount != 0) {
							$rootScope.enableSubmitpaymentAddCard =	"block";
							$rootScope.disableSubmitpaymentAddCard = "none";	
							$rootScope.continueAddCard = "none";
							$rootScope.textAddCard = "block";
						} else {
							$rootScope.enableSubmitpaymentAddCard =	"none";
							$rootScope.disableSubmitpaymentAddCard = "none";	
							$rootScope.continueAddCard = "block";
							$rootScope.textAddCard = "none";
						}	
						//$state.go('tab.addCard');
					} else if(data == 0) {
						$rootScope.enableSubmitpayment = "none";
						$rootScope.disableSubmitpayment = "block";
						if($rootScope.copayAmount != 0) {
							$rootScope.enableSubmitpaymentAddCard =	"none";
							$rootScope.disableSubmitpaymentAddCard = "block;";
							$rootScope.continueAddCard = "none";
							$rootScope.textAddCard = "block";
						} else {
							$rootScope.enableSubmitpaymentAddCard =	"none";
							$rootScope.disableSubmitpaymentAddCard = "none";	
							$rootScope.continueAddCard = "block";
							$rootScope.textAddCard = "none";
						}		
						//$state.go('tab.addCard');
					}
					
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.getPatientPaymentProfile(params);		
    }
	
	$scope.cancelConsultation = function() {
		navigator.notification.confirm(
			'Are you sure that you want to cancel this consultation?',
			 function(index){
				if(index == 1){					
					
				}else if(index == 2){
					$state.go('tab.userhome');
				}
			 },
			'Confirmation:',
			['No','Yes']     
		);
	}
	
	$scope.doGetReceipt = function () {
		$rootScope.enablePaymentSuccess = "none";
		$state.go('tab.receipt');
		$scope.ReceiptTimeout();
	}
	
	
	
	$rootScope.verifyCardDisplay = "none";
	$rootScope.cardDisplay = "inherit;";
	
	$scope.getCardDetails = {};  

    $scope.ccCvvLength = 3;
    $scope.$watch('getCardDetails.CardNumber', function(cardNumber){
        var ccn1 = String(cardNumber).substr(0,1); 
        if(typeof cardNumber != "undefined"){
            if(ccn1 == 3){
                $scope.ccCvvLength = 4;
            }else{
                $scope.ccCvvLength = 3;
                if($scope.getCardDetails.Cvv.length > 0){
                    $scope.getCardDetails.Cvv = String($scope.getCardDetails.Cvv).substr(0,3);
                }
            }
        }
    });
    
	$scope.doPostPaymentProfileDetails = function () {
	
        /*$scope.BillingAddress = '123 chennai';
        $scope.CardNumber = 4111111111111111;
        $scope.City = 'chennai';
        $scope.ExpiryMonth = 8;
        $scope.ExpiryYear = 2019;
        $scope.FirstName = 'Rin';
        $scope.LastName = 'Soft';
        $scope.State = 'Tamilnadu';
        $scope.Zip = 91302;
        $scope.Country = 'US';	
        $scope.Cvv = 123;*/

        var zipCount = $('#Zip').val().length;
        //var ExpiryDate = $('#ExpireDate').val().split("/");        

        var currentTime = new Date()
        var ExpiryDateCheck = new Date();
            //var CurrentDate = $filter('date')(currentTime, 'MM-dd-yyyy').split("-");

        ExpiryDateCheck.setFullYear($scope.getCardDetails.CardExpireDatesYear, $scope.getCardDetails.CardExpireDatesMonth, 1);

        $rootScope.FirstName = $scope.getCardDetails.FirstName;
        $rootScope.LastName = $scope.getCardDetails.LastName;
        $rootScope.CardNumber = $scope.getCardDetails.CardNumber;
        $rootScope.ccexpiry = $scope.getCardDetails.CardExpireDates;
        $rootScope.Cvv = $scope.getCardDetails.Cvv;
        $rootScope.BillingAddress = $scope.getCardDetails.BillingAddress;
        $rootScope.City = $scope.getCardDetails.City;
        $rootScope.State = $scope.getCardDetails.State;	
        $rootScope.Zip = $scope.getCardDetails.CardZipCode;
        $rootScope.ExpiryMonth = $scope.getCardDetails.CardExpireDatesMonth;
        $rootScope.ExpiryYear = $scope.getCardDetails.CardExpireDatesYear;
        $scope.Country = $scope.getCardDetails.Country;
		
      
      if($('#FirstName').val() == '' || $('#LastName').val() == '' || $('#CardNumber').val() == '' || $('#datepicker').val() == '' || $('#Cvv').val() == '' || $('#BillingAddress').val() == '' ||  $('#City').val() == '' || $('#State').val() == ''|| $('#Zip').val() == '' )  {			
			$scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
		}else if(!CreditCardValidations.validCreditCard($rootScope.CardNumber)){
			$scope.invalidZip = "";
			$scope.invalidMonth = "";			
			$scope.invalidCVV = "";
			$scope.invalidCard = "border: 1px solid red;";
            $scope.ErrorMessage = "Invalid Card Number";
            $rootScope.Validation($scope.ErrorMessage);	
		} else if(ExpiryDateCheck < currentTime) {
			 $scope.invalidZip = "";			
			$scope.invalidCard = "";
			$scope.invalidCVV = "";	
			 $scope.invalidMonth = "border: 1px solid red;";	
             $scope.ErrorMessage = "Verify month & year";
			 $rootScope.Validation($scope.ErrorMessage);
		  }else if($rootScope.Cvv.length != $scope.ccCvvLength){
			$scope.invalidZip = "";
			$scope.invalidMonth = "";
			$scope.invalidCard = "";			
			 $scope.invalidCVV = "border: 1px solid red;";	
            $scope.ErrorMessage = "Security code must be " + $scope.ccCvvLength + " numbers";
            $rootScope.Validation($scope.ErrorMessage);  
		} else if(zipCount <= 4) {			
			$scope.invalidMonth = "";
			$scope.invalidCard = "";
			$scope.invalidCVV = "";
			$scope.invalidZip = "border: 1px solid red;";
			$scope.ErrorMessage = "Verify Zip";
			$rootScope.Validation($scope.ErrorMessage);  
        }
        else {		
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
			$scope.invalidZip = "";
			$scope.invalidMonth = "";
			$scope.invalidCard = "";
			$scope.invalidCVV = "";
			
            $rootScope.cardDisplay = "none;";
            $rootScope.verifyCardDisplay = "inherit";
            var params = {
                EmailId: $rootScope.UserEmail, 
                BillingAddress: $rootScope.BillingAddress,
                CardNumber: $rootScope.CardNumber,
                City: $rootScope.City,
                ExpiryMonth: $rootScope.ExpiryMonth,
                ExpiryYear: $rootScope.ExpiryYear,
                FirstName: $rootScope.FirstName,
                LastName: $rootScope.LastName,
                State: $rootScope.State,
                Zip: $rootScope.Zip,
                Country: $scope.Country,
                ProfileId: $rootScope.patientprofileID,
                Cvv: $rootScope.Cvv,		
                accessToken: $rootScope.accessToken,

                success: function (data) {
                    $scope.PostPaymentDetails = data;
					
                    
                    //if(data.message == "Success")	{
                       $rootScope.userCardDetails = data.data[0].paymentProfileId;
					   if(typeof $rootScope.CardNumber == 'undefined') {
							$rootScope.choosePaymentShow = 'none';
							$rootScope.choosePaymentHide = 'initial';
					   } else if(typeof $rootScope.CardNumber != 'undefined') {
							$rootScope.choosePaymentShow = 'initial';
							$rootScope.choosePaymentHide = 'none';
							var cardNo = $rootScope.CardNumber;
							var strCardNo = cardNo.toString();
							var getLastFour = strCardNo.substr(strCardNo.length - 4);
							$rootScope.userCardNumber = getLastFour;
					   }
                       // $scope.doGetPatientPaymentProfilesCardDetails();  
						$rootScope.doGetPatientPaymentProfiles();
						$state.go('tab.submitPayment');					   
                    /*} else {
						if(!angular.isUndefined(data.message)) {
							$scope.ErrorMessage = data.message;
							$rootScope.Validation($scope.ErrorMessage);
							$state.go('tab.cardDetails');
						} else {
							$rootScope.serverErrorMessageValidationForPayment();
						}
                    }*/
                    $rootScope.cardDisplay = "inherit;";
                    $rootScope.verifyCardDisplay = "none";
                },
                error: function (data) {
                    $rootScope.cardDisplay = "inherit;";
                    $rootScope.verifyCardDisplay = "none";
                    $rootScope.serverErrorMessageValidationForPayment();
                }
            };

            LoginService.postPaymentProfileDetails(params);
		
		}
	}
	
	
	
	$scope.doGetCodesSet = function (P_img, P_Fname, P_Lname, P_Age, P_Guardian,P_id) {
       if($rootScope.P_isAuthorized == true) {
			// Start Intake Sub Header Information 
			$rootScope.paymentMode = '';
			$rootScope.insuranceMode = '';
			$rootScope.PatientImageSelectUser = P_img;
			$rootScope.PatientFirstName = P_Fname;
			$rootScope.PatientLastName = P_Lname;
			$rootScope.PatientAge = P_Age;
			$rootScope.PatientGuardian = P_Guardian;
            $rootScope.patientId = P_id;
			// End Intake Sub Header Information 
			
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			var params = {
				hospitalId: $rootScope.hospitalId,
				accessToken: $rootScope.accessToken,
				fields: $scope.codesFields,
				success: function (data) {
				//console.log(data.data[3].codes);
					$rootScope.hospitalCodesList = angular.fromJson(data.data[3].codes);
					$rootScope.primaryConcernDataList = angular.fromJson(data.data[3].codes);
					$rootScope.getSecondaryConcernAPIList = angular.fromJson(data.data[4].codes);
					if(angular.fromJson(data.data[4].codes) != "") {
					$rootScope.scondaryConcernsCodesList = angular.fromJson(data.data[4].codes);
					} else {
						$rootScope.scondaryConcernsCodesList = $rootScope.primaryConcernDataList;
					}
					$rootScope.chronicConditionsCodesList = angular.fromJson(data.data[0].codes);
					$rootScope.currentMedicationsCodesList = angular.fromJson(data.data[1].codes);	
					$rootScope.medicationAllergiesCodesList = angular.fromJson(data.data[2].codes);
                    $rootScope.surgeryYearsList = CustomCalendar.getSurgeryYearsList($rootScope.PatientAge);
					$state.go('tab.patientConcerns');
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
		   $rootScope.PatientPrimaryConcern = "";
			$rootScope.PatientSecondaryConcern = "";
			$rootScope.PatientChronicCondition = "";
			$rootScope.patinentCurrentMedication = "";
			$rootScope.patinentMedicationAllergies = "";
			$rootScope.patientSurgeriess = "";
			$rootScope.MedicationCount == 'undefined'
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
		} else {
		    $scope.ErrorMessage = "You are not currently authorized to request appointments for " + $rootScope.PatientFirstName + ' ' + $rootScope.PatientLastName+'!'; 
            $rootScope.SubmitCardValidation($scope.ErrorMessage);
		}	
	}
	
	$scope.addMinutes = function (inDate, inMinutes) {   
		var newdate = new Date();
		newdate.setTime(inDate.getTime() + inMinutes * 60000);
		return newdate;
	}

        $scope.doGetScheduledConsulatation = function () {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
             $rootScope.scheduledConsultationList = [];
            var params = {
                patientId: $rootScope.primaryPatientId,
                accessToken: $rootScope.accessToken,
                success: function (data) {
					console.log(data);
                    $scope.scheduledConsultationList = data.data;
					if(data != "") {
						$rootScope.scheduledList = [];
						var currentDate = new Date();
						currentDate = $scope.addMinutes(currentDate, -30);
						//var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");
							
												
						angular.forEach($scope.scheduledConsultationList, function(index, item) {							
							if(currentDate < CustomCalendar.getLocalTime(index.scheduledTime)) {
								 $rootScope.scheduledList.push({							
									'id': index.$id,
									'scheduledTime': CustomCalendar.getLocalTime(index.scheduledTime),
									'consultantUserId': index.consultantUserId,
									'consultationId': index.consultationId,
									'patientFirstName': index.patientFirstName,
									'patientLastName': index.patientLastName,	
									'patientId': index.patientId,
									'assignedDoctorName': index.assignedDoctorName,
									'patientName': index.patientName,
									'consultationStatus': index.consultationStatus,
									'scheduledId': index.scheduledId,    
								});
							}	
						});
						
						
						$rootScope.nextAppointmentDisplay = 'none';
						
						var d = new Date();
						d.setHours(d.getHours() + 12);
						var currentUserHomeDate = CustomCalendar.getLocalTime(d);
						
						if($rootScope.scheduledList != '')
						{
							//var getReplaceTime = ($rootScope.scheduledList[0].scheduledTime).replace("T"," ");
							//var currentUserHomeDate = currentUserHomeDate.replace("T"," ");
							var getReplaceTime = $rootScope.scheduledList[0].scheduledTime;
							var currentUserHomeDate = currentUserHomeDate;
							
							if((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
								console.log('scheduledTime <= getTwelveHours UserHome');
								$rootScope.nextAppointmentDisplay = 'block';
								$rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
							}
						}
						 
					}
                },
                error: function (data) {
                   $rootScope.serverErrorMessageValidation();
                }
            };

            LoginService.getScheduledConsulatation(params);
        }
		
	$scope.getScheduledDetails = function (patientId) {
		$rootScope.selectedPatientIdForDetails = patientId;
		$state.go('tab.patientCalendar');
	}
		
		
		$rootScope.PlanDisplay = "inherit";
		$rootScope.verifyPlanDisplay = "none;";
		
	$scope.PlanDetailsValidation = function(model) {
		
		/*if($('#Provider').val() == '' || $('#firstName').val() == '' || $('#lastName').val() == '' || $('#policyNumber').val() == '' || $('#date').val() == '' ){ */
        if($('#Provider').val() == '') {
			$scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
        } else if($('#firstName').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
        } else if($('#lastName').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
		} else if($('#policyNumber').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
		} else if($('#date').val() == '') {
            $scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
		} else {
			$rootScope.verifyPlanDisplay = "inherit";
			$rootScope.PlanDisplay = "none;";	 		
			$scope.doPostNewHealthPlan();	
		}	
	}
	$scope.VerifyPlanDetailsValidation = function(model) {
		
		if($('#firstName').val() == '' || $('#lastName').val() == '' || $('#policyNumber').val() == '' || $('#date').val() == '' ){			
			$scope.ErrorMessage = "Required fields can't be empty";
			$rootScope.Validation($scope.ErrorMessage);
			
		} else {
			$state.go('tab.applyPlan');
		}	
	}
	
	
    $rootScope.SubmitCardValidation = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div id="notifications-top-center" class="notificationError" ><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i>'+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

			//$('#notifications-window-row-button').click(function(){
				$("#notifications-top-center").remove();
				$(".Error_Message").append(top);
				//$("#notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
			//});
	}

	$scope.ReceiptTimeout = function() {
	
		var currentTimeReceipt = new Date();
		
		currentTimeReceipt.setSeconds(currentTimeReceipt.getSeconds() + 10);
		
		$rootScope.ReceiptTime = currentTimeReceipt.getTime();
		
		//setTimeout(function(){ $state.go('tab.waitingRoom');	 }, 10000);
        setTimeout(function(){ $scope.doGetWaitingRoom(); }, 10000);
        
	}
	
    $scope.cardPaymentId = [];	
    $scope.doPostCoPayDetails = function () {		
		
		if($('#addNewCard').val() == 'Choose Your Card' || $('#addNewCard_addCard').val() == 'Choose Your Card' || $('#addNewCard_submitPay').val() == 'Choose Your Card'){			
			$scope.ErrorMessages = "Please select the card to use for payment";
			$rootScope.SubmitCardValidation($scope.ErrorMessages);
			
		} else {
			
			if(typeof $scope.cardPaymentId.addNewCard != 'undefined') {
				$rootScope.paymentProfileId = $scope.cardPaymentId.addNewCard;
			} else if(typeof $scope.cardPaymentId.addNewCard == 'undefined') {
				if(typeof $rootScope.userCardDetails == 'undefined'){
					$scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
					$rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
				}else{
					$rootScope.paymentProfileId = $rootScope.userCardDetails;
				}
			} 
	
			if ($scope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			var params = {
				profileId: parseInt($rootScope.patientprofileID), 
				emailAddress: $rootScope.UserEmail,
				Amount: $rootScope.copayAmount,
				consultationId: $rootScope.consultationId,
				paymentProfileId: parseInt($rootScope.paymentProfileId),
				accessToken: $rootScope.accessToken,
				success: function (data) {
					//To save the last used card for user.
					var cardSelectedText = $('#cardViewport').html();
					$localstorage.set("Card" + $rootScope.UserEmail, $rootScope.paymentProfileId);
					$localstorage.set("CardText" + $rootScope.UserEmail, cardSelectedText);
					$rootScope.paymentConfirmationNumber = data.data[0].confirmationNumber;
					$scope.CreditCardDetails = data;					
					$state.go('tab.receipt');	
					$scope.ReceiptTimeout();						
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			
			LoginService.postCoPayDetails(params);
		}
	}
    
    $scope.GoToPatientDetails = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian,P_Id,P_isAuthorized) {
        if($rootScope.patientSearchKey != '' || typeof $rootScope.patientSearchKey != "undefined"){
            //Removing main patient from the dependant list. If the first depenedant name and patient names are same, removing it. This needs to be changed when actual API given.
		if($rootScope.RelatedPatientProfiles != '') {
			if($rootScope.primaryPatientFullName == $rootScope.RelatedPatientProfiles[0].patientName){
                $rootScope.RelatedPatientProfiles.shift();
                $scope.searched = false;
            }
		}
		$rootScope.providerName = '';
		$rootScope.PolicyNo = '';
		$rootScope.healthPlanID = '';
        $rootScope.NewHealth = '';    
        }
        
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $rootScope.patientId = P_Id;
		$rootScope.P_isAuthorized = P_isAuthorized
        $state.go('tab.patientDetail'); 
    }
    
     $scope.doToPatientCalendar = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $state.go('tab.patientCalendar'); 
    }
	
    $scope.doToAppoimentDetails  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $state.go('tab.appoimentDetails'); 
    }
    
    $scope.enterWaitingRoom  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
        $scope.doGetWaitingRoom();
    }
	
	 $scope.GoToConsultCharge  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
		if($rootScope.insuranceMode == 'on' && $rootScope.paymentMode != 'on') {
			$rootScope.verifyInsuranceSection = "block";
			$rootScope.verifyConsultChargeSection = "none";			
		} else {
			$rootScope.verifyInsuranceSection = "none";
			$rootScope.verifyConsultChargeSection = "block";			
		}	
		$rootScope.consultChargeSection = "block";
		$rootScope.healthPlanSection = "none";	
		$rootScope.doPutConsultationSave();       
    }
	
	
     
     $scope.GoToappoimentDetails = function(scheduledListData) {
		$rootScope.scheduledListDatas = scheduledListData;
		$state.go('tab.appoimentDetails');
     };
	 
	 
	// var dtNow = new Date("2015-06-11T13:58:04.268Z");
	//$rootScope.time = dtNow.getTime();
		
		
	

	   
    $scope.doGetWaitingRoom = function() {
        /*
        var params = {
            accessToken: $rootScope.accessToken,
            consultationID: $rootScope.consultationId,
            eventType: PATIENT_CONSULTATION_EVENT_TYPE_ID,
            event: WAITING_CONSULTATION_EVENT_CODE,
            success: function (data) {
                $state.go('tab.waitingRoom');                  
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.updateConsultationEvent(params);
        */
        $state.go('tab.waitingRoom');				
    }
	
	$rootScope.EnableBackButton = function () {
		$scope.doGetPatientProfiles();	
		$scope.doGetRelatedPatientProfiles();     
        $state.go('tab.userhome');			
    };
   
})

.controller('patientCalendarCtrl', function($scope, $ionicScrollDelegate, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage,StateList, CustomCalendar, CreditCardValidations) {
	
	$scope.addMinutes = function (inDate, inMinutes) {   
		var newdate = new Date();
		newdate.setTime(inDate.getTime() + inMinutes * 60000);
		return newdate;
	}
	
	$rootScope.getIndividualScheduleDetails = $filter('filter')($rootScope.scheduledList, {patientId:$rootScope.selectedPatientIdForDetails});
	
	var d = new Date();
	d.setHours(d.getHours() + 12);
	var currentUserHomeDate = CustomCalendar.getLocalTime(d);
	
	$scope.doRefresh = function() {
		$scope.doGetScheduledConsulatation();
		$timeout( function() {
			$scope.$broadcast('scroll.refreshComplete');
		 }, 1000);
		$scope.$apply();	
	};
	
	$scope.doGetScheduledConsulatation = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		 $rootScope.scheduledConsultationList = [];
		var params = {
			patientId: $rootScope.primaryPatientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {
				console.log(data);
				$scope.scheduledConsultationList = data.data;
				if(data != "") {
					$rootScope.scheduledList = [];
					var currentDate = new Date();
					currentDate = $scope.addMinutes(currentDate, -30);
					//var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");
						
											
					angular.forEach($scope.scheduledConsultationList, function(index, item) {							
						if(currentDate < CustomCalendar.getLocalTime(index.scheduledTime)) {
							 $rootScope.scheduledList.push({							
								'id': index.$id,
								'scheduledTime': CustomCalendar.getLocalTime(index.scheduledTime),
								'consultantUserId': index.consultantUserId,
								'consultationId': index.consultationId,
								'patientFirstName': index.patientFirstName,
								'patientLastName': index.patientLastName,	
								'patientId': index.patientId,
								'assignedDoctorName': index.assignedDoctorName,
								'patientName': index.patientName,
								'consultationStatus': index.consultationStatus,
								'scheduledId': index.scheduledId,    
							});
						}	
					});
					
					
					$rootScope.nextAppointmentDisplay = 'none';
					
					var d = new Date();
					d.setHours(d.getHours() + 12);
					var currentUserHomeDate = CustomCalendar.getLocalTime(d);
					
					if($rootScope.scheduledList != '')
					{
						$rootScope.getIndividualScheduleDetails = $filter('filter')($rootScope.scheduledList, {patientId:$rootScope.selectedPatientIdForDetails});
						
						var getReplaceTime = $rootScope.scheduledList[0].scheduledTime;
						var currentUserHomeDate = currentUserHomeDate;
						
						if((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
							console.log('scheduledTime <= getTwelveHours UserHome');
							$rootScope.nextAppointmentDisplay = 'block';
							$rootScope.userHomeRecentAppointmentColor = '#E1FCD4';
						}
					}
					 
				}
			},
			error: function (data) {
			   $rootScope.serverErrorMessageValidation();
			}
		};

		LoginService.getScheduledConsulatation(params);
	}

	$scope.GoToappoimentDetails = function(scheduledListData) {
		$rootScope.scheduledListDatas = scheduledListData;
		$state.go('tab.appoimentDetails');
	};
	
	if($rootScope.getIndividualScheduleDetails !='') {		
		var getReplaceTime = $rootScope.getIndividualScheduleDetails[0].scheduledTime;	
		var currentUserHomeDate = currentUserHomeDate;		
		if((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {				
				
			$scope.$on('timer-tick', function (event, args){
				if(args.days == 0) {
					$rootScope.hourDisplay = 'initial';
					$rootScope.daysDisplay = 'none';
					$rootScope.dayDisplay = 'none';		
				} else if(args.days == 1) {
					$rootScope.daysDisplay = 'none';	
					$rootScope.hourDisplay = 'none';
					$rootScope.dayDisplay = 'initial';		
				} else if(args.days > 1) {
					$rootScope.daysDisplay = 'initial';	
					$rootScope.hourDisplay = 'none';
					$rootScope.dayDisplay = 'none';	
				}
				
			
				if(args.millis < 100){
					$rootScope.timeNew = 'none';
				   $rootScope.timeNew1 = 'block';
				}
				else if(args.millis < 600000){
				   $rootScope.timeNew = 'none';
				   $rootScope.timeNew1 = 'block';
				   $rootScope.timerCOlor = '#E1FCD4';
				}else if(args.millis > 600000){
					$rootScope.timeNew = 'block';
				   $rootScope.timeNew1 = 'none';
					$rootScope.timerCOlor = '#FEEFE8';
				}
				
			});
			$rootScope.time = new Date(getReplaceTime).getTime();
			
			 $timeout(function() {   
				document.getElementsByTagName('timer')[0].start();
			}, 10);
			
			var d = new Date();
			
			var currentUserHomeDate = CustomCalendar.getLocalTime(d);
			
			if(getReplaceTime < currentUserHomeDate){
				 $rootScope.timerCOlor = '#E1FCD4';
			}
		} else if((new Date(getReplaceTime).getTime()) >= (new Date(d).getTime())) {
			$rootScope.timerCOlor = 'transparent';
		}	
	}
	
})

.controller('appoimentDetailsCtrl', function($scope, $ionicScrollDelegate, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService,$filter, $timeout,$localStorage,$sessionStorage,StateList, CustomCalendar, CreditCardValidations) {
	//$state.go('tab.appoimentDetails');
	//document.getElementsByTagName('timer')[0].stop();
	$scope.addMinutes = function (inDate, inMinutes) {   
		var newdate = new Date();
		newdate.setTime(inDate.getTime() + inMinutes * 60000);
		return newdate;
	}
	
	$scope.enterWaitingRoom  = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.PatientGuardian = P_Guardian;
		$scope.doGetExistingConsulatation();
        $scope.doGetWaitingRoom();
    }
	$scope.doGetWaitingRoom = function() {
        $state.go('tab.waitingRoom');				
    }
	$rootScope.consultationId = $rootScope.scheduledListDatas.consultationId;
	var getReplaceTime = $rootScope.scheduledListDatas.scheduledTime;
	
	$rootScope.time = new Date(getReplaceTime).getTime();
	
	$scope.$on('timer-tick', function (event, args){
		//$timeout(function(){
		console.log('Timer tick events by Prabin');
		if(args.days == 0) {
			$rootScope.hourDisplay = 'initial';
			$rootScope.daysDisplay = 'none';
			$rootScope.dayDisplay = 'none';		
		} else if(args.days == 1) {
			$rootScope.daysDisplay = 'none';	
			$rootScope.hourDisplay = 'none';
			$rootScope.dayDisplay = 'initial';		
		} else if(args.days > 1) {
			$rootScope.daysDisplay = 'initial';	
			$rootScope.hourDisplay = 'none';
			$rootScope.dayDisplay = 'none';	
		}
		
	
		if(args.millis < 100){

		  $('.AvailableIn').hide();
			$('.enterAppoinment').show();
		}
		else if(args.millis < 600000){
		   $('.AvailableIn').hide();
			$('.enterAppoinment').show();
		   $rootScope.timerCOlor = '#E1FCD4';
		   
		}else if(args.millis > 600000){
		  $rootScope.timeNew = 'block';
		   $rootScope.timeNew1 = 'none';
			$('.AvailableIn').show();
			$('.enterAppoinment').hide();		   
		}
		//},1000);
	});
	$scope.showEnterWaitingRoomButton = function(){
		$rootScope.timeNew = 'none';
		$rootScope.timeNew1 = 'block';
		$('.AvailableIn').hide();
		$('.enterAppoinment').show();
	};
	$timeout(function() {   
		
	}, 100);
	
	var d = new Date();
	//d.setHours(d.getHours() + 12);
	
	var currentUserHomeDate = CustomCalendar.getLocalTime(d);
	
	if(getReplaceTime < currentUserHomeDate){
		$rootScope.timeNew = 'none';
		$rootScope.timeNew1 = 'block';
		 $rootScope.timerCOlor = '#E1FCD4';
	}
	
	$scope.doGetExistingConsulatation = function () {
		$rootScope.consultionInformation = '';
		$rootScope.appointmentsPatientFirstName = '';
		$rootScope.appointmentsPatientLastName = '';
		$rootScope.appointmentsPatientDOB = '';
		$rootScope.appointmentsPatientGurdianName = '';
		$rootScope.appointmentsPatientImage = '';
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            consultationId: $rootScope.consultationId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $scope.existingConsultation = data;
			
                $rootScope.consultionInformation = data.data[0].consultationInfo;
				$rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
				if(!angular.isUndefined($rootScope.consultationStatusId)) {
						if($rootScope.consultationStatusId == 71 ) {
							navigator.notification.alert(
								'Your consultation is already started on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 72 ) {
							navigator.notification.alert(
								'Your consultation is already ended.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 79 ) {
							navigator.notification.alert(
								'Your consultation is cancelled.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						} else if($rootScope.consultationStatusId == 80 ) {
							navigator.notification.alert(
								'Your consultation is in progress on other device.',  // message
								function(){ $state.go('tab.userhome'); return;},
								'Connected Care',            // title
								'Done'                  // buttonName
							);
							return false;
						}
						
				}
				
				
                $rootScope.patientExistInfomation = data.data[0].patientInformation;
				 $rootScope.intakeForm = data.data[0].intakeForm;
				$rootScope.assignedDoctorId = $rootScope.consultionInformation.assignedDoctor.id;
				$rootScope.appointmentsPatientDOB = $rootScope.patientExistInfomation.dob;
				$rootScope.appointmentsPatientGurdianName = $rootScope.patientExistInfomation.guardianName;
				$rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;
				$rootScope.appointmentsPatientImage = $rootScope.APICommonURL + $rootScope.patientExistInfomation.profileImagePath;
				$rootScope.reportScreenPrimaryConcern = $rootScope.intakeForm.concerns[0].customCode.description;
				$rootScope.reportScreenSecondaryConcern = $rootScope.intakeForm.concerns[1].customCode.description;
				if($rootScope.reportScreenSecondaryConcern == "") {
					$rootScope.reportScreenSecondaryConcern = "None Reported";
				}
				if(typeof $rootScope.consultionInformation.note != 'undefined') {
					$rootScope.preConsultantNotes = $rootScope.consultionInformation.note;				
				} else {
					$rootScope.preConsultantNotes = '';
				}
				$scope.doGetExistingPatientName();
				$scope.doGetDoctorDetails();
               
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getExistingConsulatation(params);	
		
	}
	
	$scope.doGetExistingPatientName = function () {
		var params = {
			patientId: $rootScope.appointmentsPatientId,
			accessToken: $rootScope.accessToken,
			success: function (data) {				
				$rootScope.appointmentsPatientFirstName = data.data[0].patientName;	
				$rootScope.appointmentsPatientLastName = data.data[0].lastName;		 
					
			},
			error: function (data) {
				$rootScope.serverErrorMessageValidation();
			}
		};
		
		LoginService.getPrimaryPatientLastName(params);
	}
	
	$scope.doGetDoctorDetails = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            doctorId: $rootScope.assignedDoctorId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
				$rootScope.doctorImage = $rootScope.APICommonURL + data.data[0].profileImagePath;	
				document.getElementsByTagName('timer')[0].stop();
				document.getElementsByTagName('timer')[0].start();
            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
        LoginService.getDoctorDetails(params);	
		
	}
	
	
	$scope.doGetExistingConsulatation();  
	//$scope.doGetExistingConsulatationReport();
	
	
})
.controller('waitingRoomCtrl', function($scope, $ionicPlatform, $localstorage, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists,CountryList,UKStateList, $state, $rootScope, $stateParams, dateFilter, $timeout,SurgeryStocksListService,$filter, $localStorage,$sessionStorage,StateList) {
	window.plugins.insomnia.keepAwake();
	$rootScope.currState = $state;
    
	$ionicPlatform.registerBackButtonAction(function (event, $state) {	
        if ( ($rootScope.currState.$current.name=="tab.waitingRoom") ||
			 ($rootScope.currState.$current.name=="tab.receipt") || 	
             ($rootScope.currState.$current.name=="tab.videoConference") ||
			 ($rootScope.currState.$current.name=="tab.ReportScreen")
            ){ 
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states. 
                // Do nothing here to disable H/W back button.
            } else { 
                // For all other states, the H/W BACK button is enabled
                navigator.app.backHistory(); 
            }
        }, 100); 
    $scope.$storage = $localStorage;
    $scope.ClearRootScope = function() {
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
		 if(deploymentEnv == "Multiple"){
			$state.go('tab.chooseEnvironment');
		}else if(deploymentEnv == "Single"){
			$state.go('tab.loginSingle');
		}else{
			$state.go('tab.login');
		}
	}
   
	
    $scope.isPhysicianStartedConsultaion = false;
    
    /*        
    consultationStatusCheck = $interval(function(){
         if(!$scope.isPhysicianStartedConsultaion){
              $scope.checkIfPhysicianStartedConference();
         }
    }, 5000);
            
    $scope.checkIfPhysicianStartedConference = function(){
        var params = {
            accessToken: $rootScope.accessToken,
            consultationId: $rootScope.consultationId,
            success: function (data) {
                console.log('-------------------------------- ' +  data.data[0].consultationInfo.consultationStatus);
                 if(data.data[0].consultationInfo.consultationStatus == REVIEW_CONSULTATION_STATUS_CODE){
                      $interval.cancel(consultationStatusCheck);
                      $scope.isPhysicianStartedConsultaion = true;
                      $scope.getConferenceKeys();
                      return;
                 }
            },
            error: function (data) {
				$rootScope.serverErrorMessageValidation();
            }
        };
        LoginService.getExistingConsulatation(params);
     };
    */
    
    $scope.waitingMsg="The Clinician will be with you Shortly.";
	var initWaitingRoomHub = function () {
         var connection = $.hubConnection();
         var conHub = connection.createHubProxy('consultationHub');
         connection.url = $rootScope.APICommonURL + "/api/signalR/";
         var consultationWatingId = +$rootScope.consultationId;
         var sound = $rootScope.AndroidDevice ? 'file://sound.mp3' : 'file://beep.caf';
            
           // var conHub = $.connection.consultationHub;
           connection.qs = {
                "Bearer": $rootScope.accessToken,
                "consultationId": consultationWatingId,
                "waitingroom":1,
                "isMobile" : true
            };
            conHub.on("onConsultationReview", function () {
                $scope.waitingMsg = "The clinician is now reviewing the intake form.";
				/*
				cordova.plugins.notification.local.schedule([
					{
						id: 1,
						text: "The clinician is now reviewing the intake form.",
						sound: sound,
					}
				]);
				//navigator.notification.beep(1);
				*/
                $scope.$digest();
            });
            conHub.on("onCustomerDefaultWaitingInformation",function () {
                $scope.waitingMsg = "Please Wait....";
                $scope.$digest();
            });
            conHub.on("onConsultationStarted",function () {
               $scope.waitingMsg = "Please wait...";
			   /*
			   cordova.plugins.notification.local.schedule([
					{
						id: 1,
						text: "The clinician started consultation.",
						sound: sound,
						data: { updated:true }
					}
				]);
				//navigator.notification.beep(2);
				*/
                $scope.$digest();;
                $.connection.hub.stop();
                getConferenceKeys();
            });
         connection.logging = true;
            connection.start({
                withCredentials :false
            }).then(function(){
                $scope.waitingMsg="The Clinician will be with you Shortly.";
                $scope.$digest(); 
            });
    };
    initWaitingRoomHub();
    
    var getConferenceKeys = function(){
        var params = {
            accessToken: $rootScope.accessToken,
            consultationId: $rootScope.consultationId,
            success: function (data) {
                $rootScope.videoSessionId = data.sessionId;
                $rootScope.videoApiKey = data.apiKey;
                $rootScope.videoToken = data.token;
                if($rootScope.videoSessionId != "" && $rootScope.videoToken != ""){
                    $state.go('tab.videoConference');
                }

            },
            error: function (data) {
               $rootScope.serverErrorMessageValidation(); 
            }
        };
        LoginService.getVideoConferenceKeys(params);
    };
    
})

// Controller to be used by all intake forms
.controller('IntakeFormsCtrl', function($scope,$interval,$ionicSideMenuDelegate, replaceCardNumber, $ionicModal,$ionicPopup,$ionicHistory, $filter, $rootScope, $state,SurgeryStocksListService, LoginService, $timeout, CustomCalendar,CustomCalendarMonth) {
    $rootScope.currState = $state;
    $rootScope.monthsList = CustomCalendar.getMonthsList();
    $rootScope.ccYearsList = CustomCalendar.getCCYearsList();
    $rootScope.limit = 4;
	$rootScope.Concernlimit = 1;
    $rootScope.checkedPrimary = 0;
    
	
	$scope.ClearRootScope = function() {
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
		if(deploymentEnv == "Multiple"){
			$state.go('tab.chooseEnvironment');
		}else if(deploymentEnv == "Single"){
			$state.go('tab.loginSingle');
		}else{
			$state.go('tab.login');
		}
	}
     
    $scope.doGetExistingConsulatation = function () {
		if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = { 
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $scope.existingConsultation = data;
			
                $rootScope.consultionInformation = data.data[0].consultationInfo;
               // $rootScope.patientInfomation = data.data.patientInformation;	
               // $rootScope.PatientImage1 = $rootScope.APICommonURL + $rootScope.patientInfomation1.profileImagePath;
                //$rootScope.inTakeForm = data.data[0].intakeForm;
                //Pre Populated //
                $rootScope.inTakeForm = data.data[0].intakeForm;
                $rootScope.inTakeFormCurrentMedication = $rootScope.inTakeForm.takingMedications;
                $rootScope.inTakeFormChronicConditions = $rootScope.inTakeForm.medicalCondition;
                $rootScope.inTakeFormPriorSurgeories = $rootScope.inTakeForm.priorSurgeories;
                $rootScope.inTakeFormMedicationAllergies = $rootScope.inTakeForm.medicationAllergies;
                //Pre Populated //
                $state.go('tab.ChronicCondition');
            },
            error: function (data) {
                $scope.existingConsultation = 'Error getting existing consultation';
                
                 /*   $rootScope.inTakeFormChronicConditions = [{$id: "1", Id: 1,displayOrder: 0, value: "Chronic Rinsoft"},{$id: "2", Id: 2,displayOrder: 0, value: "Chronic Software"}];
                
                 $rootScope.inTakeFormMedicationAllergies = [{$id: "1", Id: 1,displayOrder: 0, value: "Medication AllergiesRinsoft"},{$id: "2", Id: 2,displayOrder: 0, value: "Medication Allergies Software"}];
                
                 $rootScope.inTakeFormCurrentMedication = [{$id: "1", Id: 1,displayOrder: 0, value: "Current Medication Rinsoft"},{$id: "2", Id: 2,displayOrder: 0, value: "Current Medication Software"}];
                
                $rootScope.inTakeFormPriorSurgeories = [{$id: "1", Id: 1,displayOrder: 0, value: "Demo PriorSurgry",month: "Mar",year: "2016"},{$id: "2", Id: 2,displayOrder: 0, value: "Test PriorSurgry",month: "Feb",year: "2015"}]; 
                $state.go('tab.ChronicCondition'); */
                
				console.log(data);
            }
        };
        
        LoginService.getExistingConsulatation(params);
	}
    
  
    $scope.model = null;
	var today = new Date();
			var dd = today.getDate()-1;
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();	
				if(dd<10) {
					dd='0'+dd;
				} 

				if(mm<10) {
					mm='0'+mm;
				} 

			//$rootScope.PreviousDate = yyyy+'-'+mm+'-'+dd; //Previous Date
            $rootScope.PreviousDate = yyyy+'-'+mm+'-'+dd; //Previous Month 2015-06-23
			console.log('dddd',$rootScope.PreviousDate);
    
	/*Primary concern Start here*/
	
	  $rootScope.PopupValidation = function($a){
        function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);
			$rootScope.PrimaryPopup = $rootScope.PrimaryPopup - 1;
			});
			}
			refresh_close();
			$rootScope.PrimaryPopup = $rootScope.PrimaryPopup + 1;
			var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> '+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

			$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".PopupError_Message").append(top);
				//$(".notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
		
	}
	
	
    // Get list of primary concerns lists
    $scope.primaryConcernList = $rootScope.hospitalCodesList;
  
    
      // Open primary concerns popup
    $scope.loadPrimaryConcerns = function() {
		
		if($rootScope.getSecondaryConcernAPIList == "") {
			if(typeof $scope.PatientPrimaryConcernItem != 'undefined') {
				if($rootScope.IsValue != '') {
				$scope.getCheckedPrimaryConcern = $filter('filter')($scope.primaryConcernList, {text:$rootScope.PrimaryConcernText});
				$scope.getCheckedPrimaryConcern[0].checked = true;
				}
			}
			
			if(typeof $scope.PatientSecondaryConcernItem != 'undefined') {
				$scope.getCheckedSecondaryConcern = $filter('filter')($scope.secondaryConcernList, {text:$rootScope.SecondaryConcernText});
				$scope.getCheckedSecondaryConcern[0].checked = false;
			}
		}		
        
        $ionicModal.fromTemplateUrl('templates/tab-ConcernsList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
			backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            
            $scope.modal.show();
        }); 
    };
    
      
   $scope.closePrimaryConcerns = function() {
        $scope.PatientPrimaryConcernItem = $filter('filter')($scope.primaryConcernList, {checked:true});		
		if($scope.PatientPrimaryConcernItem != '') {
			$rootScope.PrimaryConcernText = $scope.PatientPrimaryConcernItem[0].text;		
			$rootScope.codeId = $scope.PatientPrimaryConcernItem[0].codeId;		
			
			//angular.forEach($scope.PatientPrimaryConcernItem, function(item, index) {
			   //$rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
			   if(typeof $rootScope.PatientSecondaryConcern[0] != 'undefined') {
						if($scope.PatientPrimaryConcernItem[0].text == $rootScope.PatientSecondaryConcern[0].text) {			
							$scope.ErrorMessage = "Primary and Secondary Concerns must be different";
							$rootScope.ValidationFunction1($scope.ErrorMessage);
						}
						else {
						$rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
						 $rootScope.IsValue =  $scope.PatientPrimaryConcernItem.length;
						$scope.modal.hide();
					//	$scope.data.searchQuery = '';
						}
				} else {
					$rootScope.PatientPrimaryConcern = $scope.PatientPrimaryConcernItem;
					 $rootScope.IsValue =  $scope.PatientPrimaryConcernItem.length;
					$scope.modal.hide();
				//	$scope.data.searchQuery = '';
				}
		}
		  //});        
       
    };
   
    
    // Onchange of primary concerns
    $scope.OnSelectPatientPrimaryConcern = function(position, primaryConcernList, items) {
      angular.forEach(primaryConcernList, function(item, index) {
         if (item.text == items.text) 
              item.checked = true;
          else item.checked = false; 
          });
       
      if(items.text == "Other (provide details below)")
                $scope.openOtherPrimaryConcernView();
         else  $scope.closePrimaryConcerns();
    
    } 
	$rootScope.PrimaryPopup = 0;
  // Open text view for other primary concern
	$scope.openOtherPrimaryConcernView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
          //template: '<input type="text" ng-model="data.PrimaryConcernOther">',
			template: '<div class="PopupError_Message ErrorMessageDiv" ></div><textarea name="comment" id="comment-textarea" ng-model="data.PrimaryConcernOther" class="textAreaPop">',
            title: 'Enter Primary Concern',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.primaryConcernList, function(item, index) {
                        item.checked = false;
                      });
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.PrimaryConcernOther) {
					if($rootScope.PrimaryPopup == 0) {
						$scope.ErrorMessages = "Please enter a reason for today's visit";
						$rootScope.PopupValidation($scope.ErrorMessages);
					}
						e.preventDefault();
				  } else {
                      angular.forEach($scope.primaryConcernList, function(item, index) {
                        item.checked = false;
                      });
                      var newPrimaryConcernItem = { text: $scope.data.PrimaryConcernOther, checked: true };
                      $scope.primaryConcernList.splice(1, 0, newPrimaryConcernItem);
                      //$scope.primaryConcernList.push({ text: $scope.data.PrimaryConcernOther, checked: true });
						 $scope.closePrimaryConcerns();
					 return $scope.data.PrimaryConcernOther;					 
				  }
				}
			  }
			]
		  });
    };
    
    $scope.removePrimaryConcern = function(index, item){
        //$scope.PatientPrimaryConcern = "";
    $rootScope.PatientPrimaryConcern.splice(index, 1);
    var indexPos = $scope.primaryConcernList.indexOf(item);
    $scope.primaryConcernList[indexPos].checked = false; 	
    $rootScope.IsValue =  $rootScope.PatientPrimaryConcern.length;
      $rootScope.IsValue =    $scope.primaryConcernList;
    $rootScope.IsValue = "";
    }
	//console.log($rootScope.IsValue)
    
	$rootScope.PrimaryNext = 0;
    
    $rootScope.ConcernsValidation = function($a){
        function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);
				$rootScope.PrimaryNext = $rootScope.PrimaryNext - 1;
			});
			
			}
			refresh_close();
			
			$rootScope.PrimaryNext = $rootScope.PrimaryNext + 1;
			
			var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 23px;"></i> '+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

			$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".Error_Message").append(top);
				//$(".notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
		
	}
	
	
    
   $scope.PatientConcernsDirectory = function(ChronicValid){
        $rootScope.ChronicValid = ChronicValid; // pre populated valid value
       if($rootScope.IsValue == 0 || $rootScope.IsValue == undefined) {
			if($rootScope.PrimaryNext == 0) {
				$scope.ErrorMessage = "Primary Concern Can't be Empty";
				$rootScope.ConcernsValidation($scope.ErrorMessage);
			}
        } else { 
			//$scope.doGetHospitalInformation();
			$scope.doPostOnDemandConsultation();			
        }
        
    }
    
	$scope.goToConsentToTreat = function(){
		$scope.doGetHospitalInformation();
		$state.go('tab.ConsentTreat');	
	};
	/*Primary concern End here*/
	
	/*Secondary concern Start here*/
	
    
    $scope.secondaryConcernList = $rootScope.scondaryConcernsCodesList;
    //$rootScope.PatientSecondaryConcern = [];
    
    // Open Secondary concerns popup
    $scope.loadSecondaryConcerns = function() {
		if($rootScope.getSecondaryConcernAPIList == "") {
			//$scope.PatientPrimaryConcernItem = $filter('filter')($scope.primaryConcernList, {checked:true});		
			if($scope.PatientPrimaryConcernItem != '') {
				$scope.getCheckedPrimaryConcern = $filter('filter')($scope.primaryConcernList, {text:$rootScope.PrimaryConcernText});
				$scope.getCheckedPrimaryConcern[0].checked = false;
			}	

			if(typeof $scope.PatientSecondaryConcernItem != 'undefined') {
				if($rootScope.secondaryConcernLength != '') {
				$scope.getCheckedSecondaryConcern = $filter('filter')($scope.secondaryConcernList, {text:$rootScope.SecondaryConcernText});
				$scope.getCheckedSecondaryConcern[0].checked = true;
				}
			}	
		}
	
        $ionicModal.fromTemplateUrl('templates/tab-SecondaryConcernsList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
			backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        }); 
    };

    $scope.closeSecondaryConcerns = function() {
        $scope.PatientSecondaryConcernItem = $filter('filter')($scope.secondaryConcernList, {checked:true});
		if($scope.PatientSecondaryConcernItem != '') {
			$rootScope.SecondaryConcernText = $scope.PatientSecondaryConcernItem[0].text;
			$rootScope.SecondarycodeId = $scope.PatientSecondaryConcernItem[0].codeId;
			
		  //  angular.forEach($scope.PatientSecondaryConcernItem, function(item, index) {
				if(typeof $rootScope.PatientPrimaryConcern[0] != 'undefined') {
						if($scope.PatientSecondaryConcernItem[0].text == $rootScope.PatientPrimaryConcern[0].text) {			
							$scope.ErrorMessage = "Primary and Secondary Concerns must be different";
							$rootScope.ValidationFunction1($scope.ErrorMessage);
						}
						else {
						$rootScope.PatientSecondaryConcern = $scope.PatientSecondaryConcernItem;
						 $scope.modal.hide();
						//$scope.data.searchQuery = '';	
						}
				} else {
					$rootScope.PatientSecondaryConcern = $scope.PatientSecondaryConcernItem;
					 $scope.modal.hide();
					//$scope.data.searchQuery = '';
				}
		}	
       // });
       
    };
    
    
    // Onchange of Secondary concerns
    $scope.OnSelectPatientSecondaryConcern = function(position, secondaryConcernList, items) {
        angular.forEach(secondaryConcernList, function(item, index) {
           /* if (position != index) 
              item.checked = false; */
            if (item.text == items.text) 
              item.checked = true;
            else item.checked = false; 
        });
        if(items.text == "Other (provide details below)"){
            $scope.openOtherSecondaryConcernView();
            item.checked = false;
        } else {
			$scope.closeSecondaryConcerns();
		}
    }
	
    // Open text view for other Secondary concern
	$scope.openOtherSecondaryConcernView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
           template: '<textarea name="comment" id="comment-textarea" ng-model="data.SecondaryConcernOther" class="textAreaPop">',
            title: 'Enter Secondary Concern',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.secondaryConcernList, function(item, index) {
                        item.checked = false;
                      });
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.SecondaryConcernOther) {
					e.preventDefault();
				  } else {
                      angular.forEach($scope.secondaryConcernList, function(item, index) {
                        item.checked = false;
                      });
                     var newSecodaryConcernItem = { text: $scope.data.SecondaryConcernOther, checked: true };
                      $scope.secondaryConcernList.splice(1, 0, newSecodaryConcernItem);
                      
                      // $scope.secondaryConcernList.push({ text: $scope.data.SecondaryConcernOther, checked: true });
						$scope.closeSecondaryConcerns();
					 return $scope.data.SecondaryConcernOther;
				  }
				}
			  }
			]
		  });
    };
    
    $scope.removeSecondaryConcern = function(index, item){
      $rootScope.PatientSecondaryConcern.splice(index, 1);
      var indexPos = $scope.secondaryConcernList.indexOf(item);
      $scope.secondaryConcernList[indexPos].checked = false;
	   $rootScope.secondaryConcernLength =  $rootScope.PatientSecondaryConcern.length;
	   $rootScope.SecondaryConcernText = '';
    }
	
	/*Secondary concern End here*/


	$scope.OnDemandConsultationSaveData ={
											  "concerns": [
												
											  ],											  
											  "patientId": $rootScope.patientId
										}	
										

					if($rootScope.mobilePhone != '') {
						$scope.OnDemandConsultationSaveData["phone"] = $rootScope.mobilePhone;
					} else if($rootScope.mobilePhone == '') {
						$scope.OnDemandConsultationSaveData["phone"] = $rootScope.homePhone;
					}

			
	
	$scope.doPostOnDemandConsultation = function() {

		if(typeof $rootScope.PrimaryConcernText != 'undefined') {
			$scope.primaryFilter = $filter('filter')($scope.OnDemandConsultationSaveData.concerns, {description:$rootScope.PrimaryConcernText});
			if($scope.primaryFilter.length == 0) {
				$scope.OnDemandConsultationSaveData.concerns.push(
					{isPrimary: true, description: $rootScope.PrimaryConcernText}				
				);	
			}	
		}
		if(typeof $rootScope.SecondaryConcernText != 'undefined') {
			$scope.sceondFilter = $filter('filter')($scope.OnDemandConsultationSaveData.concerns, {description:$rootScope.SecondaryConcernText});
			if($scope.sceondFilter.length == 0) {
				$scope.OnDemandConsultationSaveData.concerns.push(				
					{isPrimary: false, description: $rootScope.SecondaryConcernText}
				);	
			}	
		}	

	
				if ($rootScope.accessToken == 'No Token') {
					alert('No token.  Get token first then attempt operation.');
					return;
				}
				 var params = {
					accessToken: $rootScope.accessToken,
					OnDemandConsultationData: $scope.OnDemandConsultationSaveData,
					patientId: $rootScope.patientId,
					success: function (data) {
						$rootScope.OnDemandConsultationSaveResult = data.data[0];
						$rootScope.consultationAmount = $rootScope.OnDemandConsultationSaveResult.consultationAmount;
						$rootScope.copayAmount = $rootScope.OnDemandConsultationSaveResult.consultationAmount;
						$rootScope.consultationId = $rootScope.OnDemandConsultationSaveResult.consultationId;
						console.log(data);
						 $state.go('tab.ChronicCondition');
                        //$scope.doGetExistingConsulatation();
						//$state.go('tab.ChronicCondition');
					},
					error: function (data) {
						$rootScope.serverErrorMessageValidation();
					}
				};
				
				LoginService.postOnDemandConsultation (params);
		};

	
	
	/*Chronic Condition Start here*/
	
    $scope.BackToChronicCondition = function(ChronicValid) {
        $rootScope.ChronicValid = ChronicValid;
        $state.go('tab.ChronicCondition');
    }
    
    // Get list of Chronic Condition lists
   $scope.chronicConditionList = $rootScope.chronicConditionsCodesList;
    
     // Get list of Chronic Condition Pre populated
  /*  if($rootScope.currState.$current.name=="tab.ChronicCondition") { 
        if(typeof $rootScope.ChronicValid == 'undefined' ||  $rootScope.ChronicValid == 0) {
             angular.forEach($rootScope.inTakeFormChronicConditions, function(index, item) { 
               $scope.chronicConditionList.push({
                    $id: index.$id,
                    codeId: index.id,
                    displayOrder: 0,
                    text: index.value,
                    checked: true,
                });

            }); 
    $scope.PatientChronicConditionItem = $filter('filter')($scope.chronicConditionList, {checked:true});
    $rootScope.PatientChronicCondition = $scope.PatientChronicConditionItem;
            if($rootScope.PatientChronicCondition) {
                $rootScope.ChronicCountValidCount = $rootScope.PatientChronicCondition.length; 
            }
        } 
    }
	*/
    $scope.clearSelectionAndRebindSelectionList = function(selectedListItem, mainListItem){
        angular.forEach(mainListItem, function(item, key2) {
               item.checked = false;
           });
        if(!angular.isUndefined(selectedListItem)){
            
           if(selectedListItem.length > 0){
               angular.forEach(selectedListItem, function(value1, key1) {
                   angular.forEach(mainListItem, function(value2, key2) {
                       if (value1.text == value2.text) {
                           value2.checked = true;
                       }   
                   });
               });
           }
       }
    };
   // Open Chronic Condition popup
    $scope.loadChronicCondition = function() {
        $scope.clearSelectionAndRebindSelectionList($scope.PatientChronicConditionsSelected, $scope.chronicConditionList);
		if(typeof $rootScope.ChronicCount == 'undefined') { 
			$rootScope.checkedChronic = 0;
		} else {  
		$rootScope.checkedChronic  = $rootScope.ChronicCount;  
		}
		
        $ionicModal.fromTemplateUrl('templates/tab-ChronicConditionList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
			backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        }); 
    };

    $scope.closeChronicCondition = function() {
        $scope.PatientChronicConditionItem = $filter('filter')($scope.chronicConditionList, {checked:true});
        $scope.PatientChronicConditionsSelected = $filter('filter')($scope.chronicConditionList, {checked:true});
		if($scope.PatientChronicConditionItem != '') {	
			$rootScope.PatientChronicCondition = $scope.PatientChronicConditionItem;
			$rootScope.ChronicCount = $scope.PatientChronicCondition.length;
			console.log($rootScope.ChronicCount);
			console.log($rootScope.PatientChronicCondition);
			$scope.modal.hide(); 
			//$scope.data.searchQuery = ''; 
		}	
    };
      
    
    // Onchange of Chronic Condition
    $scope.OnSelectChronicCondition = function(item) {
       if(item.checked == true) { 
		$rootScope.checkedChronic++; 
	  }  else  { 
	  $rootScope.checkedChronic--; 
	  }
	  /*
        if(item.text == "Other"){
           $scope.openOtherChronicConditionView(item);          
		 } else {
			if($rootScope.checkedChronic == 4) {
				$scope.closeChronicCondition();
			}
		 }
		*/
		if($rootScope.checkedChronic == 4) {
			$scope.closeChronicCondition();
		}
    }
	
   
    // Open text view for other Chronic Condition
	$scope.openOtherChronicConditionView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
            template: '<textarea name="comment" id="comment-textarea" ng-model="data.ChronicCondtionOther" class="textAreaPop">',
            title: 'Enter Concerns',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.chronicConditionList, function(item, index) {
                        if(item.checked) { if(item.text == "Other") item.checked = false; }
                          });
                      $rootScope.checkedChronic--;
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.ChronicCondtionOther) {
					e.preventDefault();
				  } else {
                      angular.forEach($scope.chronicConditionList, function(item, index) {
                        if(item.checked) { 
                            if(item.text == "Other") { item.checked = false; }
                        } 
                        
                       });  
                      
                       var newchronicConditionItem = { text: $scope.data.ChronicCondtionOther, checked: true };
                      $scope.chronicConditionList.splice(1, 0, newchronicConditionItem);
                      
                       //$scope.chronicConditionList.push({ text: $scope.data.ChronicCondtionOther, checked: true });
                       return $scope.data.ChronicCondtionOther;
				  }
				}
			  }
			]
		  });
    };
    
    
    $scope.removeChronicCondition = function(index, item){
          $scope.PatientChronicCondition.splice(index, 1);
          var indexPos = $scope.chronicConditionList.indexOf(item);
          $scope.chronicConditionList[indexPos].checked = false;
          $rootScope.checkedChronic--;
		  $rootScope.ChronicCount = $rootScope.checkedChronic;
          $scope.PatientChronicConditionsSelected = $filter('filter')($scope.chronicConditionList, {checked:true});
    }
	
  
	/*Chronic Condition End here*/
    
    
    
  
    /*Medication Allegies Start here*/
	
    // Get list of Medication Allegies List
    $scope.MedicationAllegiesList = $rootScope.medicationAllergiesCodesList;
    /*
	for(var i=0; i < $scope.MedicationAllegiesList.length; i++){
		if($scope.MedicationAllegiesList[i].text == 'Other'){
			//$scope.MedicationAllegiesList.shift();
			var index = $scope.MedicationAllegiesList.indexOf($scope.MedicationAllegiesList[i]);
  			$scope.MedicationAllegiesList.splice(index, 1); 
		}
	}
	
	for(var i=0; i < $scope.chronicConditionList.length; i++){
		if($scope.chronicConditionList[i].text == 'Other'){
			//$scope.MedicationAllegiesList.shift();
			var index = $scope.chronicConditionList.indexOf($scope.chronicConditionList[i]);
  			$scope.chronicConditionList.splice(index, 1); 
		}
	}
	*/
     // Get list of Medication Allegies Pre populated
  /*  $scope.GoToMedicationAllegies = function(AllegiesCountValid) {
        $rootScope.AllegiesCountValid = AllegiesCountValid;
    if(typeof $rootScope.AllegiesCountValid == 'undefined' ||  $rootScope.AllegiesCountValid == '') { 
        angular.forEach($rootScope.inTakeFormMedicationAllergies, function(index, item) { 
               $scope.MedicationAllegiesList.push({
                    $id: index.$id,
                    codeId: index.id,
                    displayOrder: 0,
                    text: index.value,
                    checked: true,
                });

            }); 
        
      $scope.MedicationAllegiesItem = $filter('filter')($scope.MedicationAllegiesList, {checked:true});
      $rootScope.patinentMedicationAllergies = $scope.MedicationAllegiesItem;
          if($rootScope.patinentMedicationAllergies) {
              $rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length; 
              $rootScope.AllegiesCountValid = $rootScope.AllegiesCount;
         } 
            $state.go('tab.MedicationAllegies');    
        } else { 
            $state.go('tab.MedicationAllegies');
        }
         
    }
	
    console.log('MedicationAllergies: ' + $rootScope.inTakeFormMedicationAllergies); */
    $scope.GoToMedicationAllegies = function(AllegiesCountValid) {
            $state.go('tab.MedicationAllegies');
        }
    // Open Medication Allegies List popup

    $scope.loadMedicationAllegies = function() {
		
		 $scope.clearSelectionAndRebindSelectionList($scope.MedicationAllegiesItem, $scope.MedicationAllegiesList);
        
        if(typeof $rootScope.AllegiesCount == 'undefined') { 
			$rootScope.checkedAllergies = 0;
		} else {  
		$rootScope.checkedAllergies  = $rootScope.AllegiesCount;  
		}
        
        $ionicModal.fromTemplateUrl('templates/tab-MedicationAllegiesList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
			backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            
            $scope.modal.show();
        }); 
    };
	
     $scope.closeMedicationAllegies = function() {
        $scope.MedicationAllegiesItem = $filter('filter')($scope.MedicationAllegiesList, {checked:true});
			if($scope.MedicationAllegiesItem != '') {
				$rootScope.patinentMedicationAllergies = $scope.MedicationAllegiesItem;
				$rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length;
				$scope.modal.hide();
				//$scope.data.searchQuery = ''; 
			}
    };
    
      // Onchange of Medication Alligies
    $scope.OnSelectMedicationAllegies = function(item) {
		if(item.checked == true) { 
			$rootScope.checkedAllergies++; 
		}  else  { 
			$rootScope.checkedAllergies--; 
		}
		if($rootScope.checkedAllergies == 4) {
			$scope.closeMedicationAllegies();
		}
        /*
		if(item.text == "Other"){
            $scope.openOtherMedicationAllgiesView(item);
        } else {
			if($rootScope.checkedAllergies == 4) {
				$scope.closeMedicationAllegies();
			}
		}
		*/
    }
    
    
    
      // Open text view for other Medication Allergies
	$scope.openOtherMedicationAllgiesView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
          template: '<textarea name="comment" id="comment-textarea" ng-model="data.MedicationAllergiesOther" class="textAreaPop">',
            title: 'Enter Concerns',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.MedicationAllegiesList, function(item, index) {
                       if(item.checked) { if(item.text == "Other") item.checked = false; }
                          });
                      $rootScope.checkedAllergies--;
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.MedicationAllergiesOther) {
					e.preventDefault();
				  } else {
                      angular.forEach($scope.MedicationAllegiesList, function(item, index) {
                        if(item.checked) { 
                            if(item.text == "Other") { item.checked = false; }
                        } 
                      });
                     
                       var newMedicationAllegiesItem = { text: $scope.data.MedicationAllergiesOther, checked: true };
                      $scope.MedicationAllegiesList.splice(1, 0, newMedicationAllegiesItem);
        
                      // $scope.MedicationAllegiesList.push({ text: $scope.data.MedicationAllergiesOther, checked: true });
					  $scope.closeMedicationAllegies();
					  return $scope.data.MedicationAllergiesOther;
				  }
				}
			  }
			]
		  });
    };
    
    
    
     $scope.removeMedicationAllegies = function(index, item){
		$scope.patinentMedicationAllergies.splice(index, 1);
		var indexPos = $scope.MedicationAllegiesList.indexOf(item);
		$scope.MedicationAllegiesList[indexPos].checked = false;
		$rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length;
		$rootScope.checkedAllergies--;
		$scope.MedicationAllegiesItem = $filter('filter')($scope.MedicationAllegiesList, {checked:true});
    }
	
    /*Medication Allegies End here*/
    
    
      /*Current Medication Start here*/
	
    // Get list of Current Medication  List
       $scope.CurrentMedicationList = $rootScope.currentMedicationsCodesList;
    
    // Get list of Current Medication Pre populated
 /*   $scope.GoToCurrentMedication = function(MedicationCountValid) { 
        $rootScope.MedicationCountValid = MedicationCountValid;
if(typeof $rootScope.MedicationCountValid == 'undefined' ||  $rootScope.MedicationCountValid == '') { 
    angular.forEach($rootScope.inTakeFormCurrentMedication, function(index, item) { 
               $scope.CurrentMedicationList.push({
                    $id: index.$id,
                    codeId: index.id,
                    displayOrder: 0,
                    text: index.value,
                    checked: true,
                });

            }); 
        
    $scope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {checked:true});
    $rootScope.patinentCurrentMedication = $scope.CurrentMedicationItem;
    if($rootScope.patinentCurrentMedication) {
              $rootScope.MedicationCount = $scope.patinentCurrentMedication.length;
              $rootScope.MedicationCountValid = $rootScope.MedicationCount;
         } 
            $state.go('tab.CurrentMedication');    
        } else { 
           $state.go('tab.CurrentMedication');
        }
         
    }
    console.log('CurrentMedication: ' + $rootScope.inTakeFormCurrentMedication); */
    
    $scope.GoToCurrentMedication = function(MedicationCountValid) {
        $state.go('tab.CurrentMedication');
    }
    
   // Open Current Medication popup
    $scope.loadCurrentMedication = function() {
	 $scope.clearSelectionAndRebindSelectionList($scope.CurrentMedicationItem, $scope.CurrentMedicationList);
        
         if(typeof $rootScope.MedicationCount == 'undefined') { 
			$rootScope.checkedMedication = 0;
		} else {  
		    $rootScope.checkedMedication  = $rootScope.MedicationCount;  
		}
        
        $ionicModal.fromTemplateUrl('templates/tab-CurrentMedicationList.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
			backdropClickToClose: false
        }).then(function(modal) {
            $scope.modal = modal;
            
            $scope.modal.show();
        }); 
    };
	
     $scope.closeCurrentMedication = function() {
        $scope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {checked:true});
			if($scope.CurrentMedicationItem != '') {
				$rootScope.patinentCurrentMedication = $scope.CurrentMedicationItem;
				$rootScope.MedicationCount = $scope.patinentCurrentMedication.length;
				$scope.modal.hide();
				//$scope.data.searchQuery = ''; 
			}
    };
    
      // Onchange of Current Medication
    $scope.OnSelectCurrentMedication = function(item) {
        if(item.checked == true) { 
                $rootScope.checkedMedication++; 
              }  else  { 
                $rootScope.checkedMedication--; 
              }
         
        if(item.text == "Other - (List below)"){
            $scope.openOtherCurrentMedicationView(item);
        } else {
			if($rootScope.checkedMedication == 4) {
				$scope.closeCurrentMedication();
			}
		}
    }
    
    // Open text view for other Current Medication
	$scope.openOtherCurrentMedicationView = function(model) {
	   $scope.data = {}
       $ionicPopup.show({
           template: '<textarea name="comment" id="comment-textarea" ng-model="data.CurrentMedicationOther" class="textAreaPop">',
            title: 'Enter Medication',
			subTitle: '',
			scope: $scope,
			buttons: [
			  { 
                  text: 'Cancel',
                  onTap: function(e) {
                      angular.forEach($scope.CurrentMedicationList, function(item, index) {
                       if(item.checked) { if(item.text == "Other - (List below)") item.checked = false; }
                          });
                      $rootScope.checkedMedication--;
                    }
              },
			  {
				text: '<b>Done</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.CurrentMedicationOther) {
					e.preventDefault();
				  } else {
                      angular.forEach($scope.CurrentMedicationList, function(item, index) {
                        if(item.checked) { 
                            if(item.text == "Other - (List below)") { item.checked = false; }
                        } 
                      });
                     
                          var newCurrentMedicationItem = { text: $scope.data.CurrentMedicationOther, checked: true };
                      $scope.CurrentMedicationList.splice(1, 0, newCurrentMedicationItem);
                      
                      // $scope.CurrentMedicationList.push({ text: $scope.data.CurrentMedicationOther, checked: true });
						if($rootScope.checkedMedication == 4) {
							$scope.closeCurrentMedication();
						}
					 return $scope.data.CurrentMedicationOther;
				  }
				}
			  }
			]
		  });
    };
    
    $scope.removeCurrentMedication = function(index, item){
      $scope.patinentCurrentMedication.splice(index, 1);
      var indexPos = $scope.CurrentMedicationList.indexOf(item);
      $scope.CurrentMedicationList[indexPos].checked = false;
      $rootScope.MedicationCount = $scope.patinentCurrentMedication.length;    
      $rootScope.checkedMedication--;
	   $scope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {checked:true});
    }
	
   /*Current Medication End here*/
    
    
    /* Prior Surgery page START */
    
    // Prior Surgery pre-populated
   /* $scope.GoTopriorSurgery = function(PriorSurgeryValid) {
        if(typeof PriorSurgeryValid == 'undefined' || PriorSurgeryValid == '') {
              angular.forEach($rootScope.inTakeFormPriorSurgeories, function (Priorvalue, index) {
                  var surgeryMonthName = CustomCalendarMonth.getMonthName(Priorvalue.month);
                  var PriorSurgeryDate = new Date(Priorvalue.year, surgeryMonthName-1, 01);
                  var dateString = PriorSurgeryDate;
                  var surgeryName = Priorvalue.value;
                  var stockSurgery = SurgeryStocksListService.addSurgery(surgeryName, dateString);
                 $rootScope.patientSurgeriess = SurgeryStocksListService.SurgeriesList;
                 $rootScope.IsToPriorCount = $rootScope.patientSurgeriess.length;
             });
               $rootScope.PriorSurgeryValidCount = $rootScope.IsToPriorCount ;
               $state.go('tab.priorSurgeries');
         
        } else { 
            $state.go('tab.priorSurgeries');
        }
    } */
    
    
$scope.GoTopriorSurgery = function(PriorSurgeryValid) {
    $state.go('tab.priorSurgeries');
 }
	
   $scope.getSurgeryPopup = function() {
		$rootScope.LastName1 = '';
		$rootScope.datestr = '';
      
        $ionicModal.fromTemplateUrl('templates/surgeryPopup.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: false,
			backdropClickToClose: false
        }).then(function(modal) {		
			
            $scope.modal = modal;
            $scope.surgery.name = '';
            $scope.surgery.dateString = '';
            $scope.surgery.dateStringMonth = '';
            $scope.surgery.dateStringYear = '';
            $scope.modal.show();
            $timeout(function(){
                $('option').filter(function() {
                    return this.value.indexOf('?') >= 0;
                }).remove();
            }, 100);
        }); 
    };
	
	
	$rootScope.ValidationFunction1 = function($a){
		function refresh_close(){
			$('.close').click(function(){$(this).parent().fadeOut(200);});
			}
			refresh_close();
			
			var top = '<div class="notifications-top-center notificationError"><div class="ErrorContent"> <i class="ion-alert-circled" style="font-size: 22px;"></i> '+ $a+'! </div><div id="notifications-top-center-close" class="close NoticationClose"><span class="ion-ios-close-outline" ></span></div></div>';

			 
				$("#notifications-top-center").remove();
				//$( ".ppp" ).prepend( top );				
				$(".ErrorMessage").append(top);
				//$(".notifications-top-center").addClass('animated ' + 'bounce');
				refresh_close();
		
	}
	
	
    
    $scope.surgery = {};
    
    $scope.closeSurgeryPopup = function(model) {
         $scope.surgery.name;
		/*$rootScope.LastName1 = $('#name').val();
		$rootScope.datestr = $('#dateString').val(); */
        $scope.surgery.dateString;
		/*if($scope.surgery.name == '' || $scope.surgery.dateString == ''){
            $scope.ErrorMessage = "Please provide a name/description for this surgery!";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if(($scope.surgery.name == undefined || $scope.surgery.dateString == undefined)) {
             $scope.ErrorMessage = "Please provide a name/description for this surgery!";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } */
        
        var selectedSurgeryDate = new Date($scope.surgery.dateStringYear, $scope.surgery.dateStringMonth-1, 01);
        $scope.surgery.dateString = selectedSurgeryDate;
        var patientBirthDateStr = new Date($rootScope.PatientAge);
        
        var isSurgeryDateValid = true;
        if(selectedSurgeryDate < patientBirthDateStr){
            isSurgeryDateValid = false;
        }
		var today = new Date();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		var isSurgeryDateIsFuture = true;
		if($scope.surgery.dateStringYear == yyyy) {
			if($scope.surgery.dateStringMonth > mm) {
				var isSurgeryDateIsFuture = false;
			}
		}
		
        if($scope.surgery.name == '' || $scope.surgery.name == undefined){
            $scope.ErrorMessage = "Please provide a name/description for this surgery";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if(($scope.surgery.dateStringMonth == '' || $scope.surgery.dateStringMonth == undefined || $scope.surgery.dateStringYear == '' || $scope.surgery.dateStringYear == undefined)) {
             $scope.ErrorMessage = "Please enter the date as MM/YYYY";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        }else if(!isSurgeryDateValid){
            $scope.ErrorMessage = "Sugery date should not be before your birthdate";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        }else if(!isSurgeryDateIsFuture){
            $scope.ErrorMessage = "Sugery date should not be the future Date";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        }else {
            SurgeryStocksListService.addSurgery($scope.surgery.name, $scope.surgery.dateString);
            $rootScope.patientSurgeriess = SurgeryStocksListService.SurgeriesList;
            $rootScope.IsToPriorCount = $rootScope.patientSurgeriess.length;
            $scope.modal.hide();
		}
    }
	
	 $scope.RemoveSurgeryPopup = function(model) {
        $scope.modal.hide();
 };
     $scope.removePriorSurgeries = function(index, item){
      $scope.patientSurgeriess.splice(index, 1);
      var indexPos = $scope.patientSurgeriess.indexOf(item);
      $rootScope.IsToPriorCount--;
      //console.log($rootScope.IsToPriorCount--);
    }
	
	$scope.doGetHospitalInformation = function () {
			if ($rootScope.accessToken == 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}			
			var params = {
				accessToken: $rootScope.accessToken,
				success: function (data) {
					$rootScope.getDetails = data.enabledModules;
					if($rootScope.getDetails != '') {
						for (var i = 0; i < $rootScope.getDetails.length; i++) {
							if ($rootScope.getDetails[i] == 'InsuranceVerification') {
								$rootScope.insuranceMode = 'on';
									/*for (var i = 0; i < $rootScope.getDetails.length; i++) {
										if ($rootScope.getDetails[i] == 'PaymentPageBeforeWaitingRoom') {
											$rootScope.paymentMode = 'on';
										}
									}*/
							}
							//if ($rootScope.getDetails[i] == 'PaymentPageBeforeWaitingRoom') {
							if ($rootScope.getDetails[i] == 'ECommerce') {
								$rootScope.paymentMode = 'on';
							}
						}
					}
					
					
				},
				error: function (data) {
					$rootScope.serverErrorMessageValidation();
				}
			};
			LoginService.getHospitalInfo(params);		
    }
    
	
	/* Prior Surgery page END */

	
	$scope.ConsultationSaveData = 	{
									  "medicationAllergies": [
									  ],
									  "surgeries": [
									  ],
									  "medicalConditions": [
									  ],
									  "medications": [
									  ],
									  "infantData": {
										"patientAgeUnderOneYear": "",
										"fullTerm": "",
										"vaginalBirth": "",
										"dischargedWithMother": "",
										"vaccinationsCurrent": ""
									  },
									  "concerns": [													
										]
									};
		

      $rootScope.doPutConsultationSave = function () {
	  
			for (var i = 0; i < $rootScope.AllegiesCount; i++) {
				$scope.medFilter = $filter('filter')($scope.ConsultationSaveData.medicationAllergies, {code:$rootScope.patinentMedicationAllergies[i].codeId});
				if($scope.medFilter.length == 0) {
					$scope.ConsultationSaveData.medicationAllergies.push(
						{code: $rootScope.patinentMedicationAllergies[i].codeId, description: $rootScope.patinentMedicationAllergies[i].text}
					);
				}
			}
			
			for (var i = 0; i < $rootScope.IsToPriorCount; i++) {
				
				date1 = new Date ($rootScope.patientSurgeriess[i].Date );		 
				year = date1.getFullYear();
				month = (date1.getMonth()) + 1;
				
				$scope.surgeryFilter = $filter('filter')($scope.ConsultationSaveData.surgeries, {description:$rootScope.patientSurgeriess[i].Name});
				if($scope.surgeryFilter.length == 0) {				
					$scope.ConsultationSaveData.surgeries.push(
						{description: $rootScope.patientSurgeriess[i].Name, month: month, year: year}
					);
				}	
			}	

			for (var i = 0; i < $rootScope.ChronicCount; i++) {
				$scope.chronicFilter = $filter('filter')($scope.ConsultationSaveData.medicalConditions, {code:$rootScope.PatientChronicCondition[i].codeId});
				if($scope.chronicFilter.length == 0) {
					$scope.ConsultationSaveData.medicalConditions.push(
						{code: $rootScope.PatientChronicCondition[i].codeId, description: $rootScope.PatientChronicCondition[i].text}
					);
				}
			}	

			for (var i = 0; i < $rootScope.MedicationCount; i++) {
				$scope.medicationFilter = $filter('filter')($scope.ConsultationSaveData.medications, {code:$rootScope.patinentCurrentMedication[i].codeId});
				if($scope.medicationFilter.length == 0) {
					$scope.ConsultationSaveData.medications.push(
						{code: $rootScope.patinentCurrentMedication[i].codeId, description: $rootScope.patinentCurrentMedication[i].text}
					);
				}	
			}	
	  
	  
			/*$scope.ConsultationSaveData.concerns.push(
				{isPrimary: true, description: $rootScope.PrimaryConcernText},
				{isPrimary: false, description: $rootScope.SecondaryConcernText}
			);*/

			if(typeof $rootScope.PrimaryConcernText != 'undefined') {
				$scope.primaryFilter = $filter('filter')($scope.ConsultationSaveData.concerns, {description:$rootScope.PrimaryConcernText});
				if($scope.primaryFilter.length == 0) {
					$scope.ConsultationSaveData.concerns.push(
						{isPrimary: true, description: $rootScope.PrimaryConcernText, customCode: {code: $rootScope.codeId, description: $rootScope.PrimaryConcernText}}				
					);
				}
			}
			if(typeof $rootScope.SecondaryConcernText != 'undefined') {
				$scope.sceondFilter = $filter('filter')($scope.ConsultationSaveData.concerns, {description:$rootScope.SecondaryConcernText});
				if($scope.sceondFilter.length == 0) {
					$scope.ConsultationSaveData.concerns.push(		
						{isPrimary: false, description: $rootScope.SecondaryConcernText, customCode: {code: $rootScope.SecondarycodeId, description: $rootScope.SecondaryConcernText}}
					);	
				}
			}	
				
			

			//console.log($rootScope.patientSurgeriess);
			//console.log($rootScope.IsToPriorCount);
		
		console.log($scope.ConsultationSaveData);
	  
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
				ConsultationSaveData: $scope.ConsultationSaveData,
                success: function (data) {                    
					$scope.ConsultationSave = "success";
					$rootScope.doGetPatientPaymentProfiles();
					$rootScope.enableInsuranceVerificationSuccess = "none";					
					if($rootScope.insuranceMode != 'on' && $rootScope.paymentMode != 'on') {
						$rootScope.enablePaymentSuccess = "none";
						$state.go('tab.receipt'); 
							$scope.ReceiptTimeout();
					} else if($rootScope.insuranceMode == 'on' && $rootScope.paymentMode != 'on'){
						$rootScope.verifyInsuranceSection = "none";
						$rootScope.openAddHealthPlanSection();
						$state.go('tab.consultCharge'); 
					}else {
						if($rootScope.consultationAmount > 0)	{
							if($rootScope.insuranceMode != 'on' && $rootScope.paymentMode == 'on') {
								$rootScope.consultChargeSection = "none";
								$rootScope.healthPlanSection = "block";
								$rootScope.healthPlanPage = "none";
								$rootScope.consultChargeNoPlanPage = "block";
							}	
							$state.go('tab.consultCharge'); 
							if(typeof $rootScope.userDefaultPaymentProfile == "undefined"){
								$('#addNewCard').val() == 'Choose Your Card';
								$('#addNewCard_addCard').val() == 'Choose Your Card';
								$('#addNewCard_submitPay').val() == 'Choose Your Card';
								$rootScope.userDefaultPaymentProfileText = 'undefined';
							}else{
								$('#addNewCard').val($rootScope.userDefaultPaymentProfile);
								$('#addNewCard_addCard').val($rootScope.userDefaultPaymentProfile);
								$('#addNewCard_submitPay').val($rootScope.userDefaultPaymentProfile);
								$rootScope.paymentProfileId = $rootScope.userDefaultPaymentProfile;
								$scope.cardPaymentId.addNewCard = $rootScope.userDefaultPaymentProfile;
							}						
						} else {
							$rootScope.enablePaymentSuccess = "none";
							$state.go('tab.receipt'); 
							$scope.ReceiptTimeout();
						}
					}	
                },
                error: function (data) {
                   $rootScope.serverErrorMessageValidation();
				   //$rootScope.doGetPatientPaymentProfiles();	
				  // $state.go('tab.consultCharge'); 
                }
            };

            LoginService.putConsultationSave(params);
        }

    $scope.ReceiptTimeout = function() {
	
		var currentTimeReceipt = new Date();
		
		currentTimeReceipt.setSeconds(currentTimeReceipt.getSeconds() + 10);
		
		$rootScope.ReceiptTime = currentTimeReceipt.getTime();
		
		//setTimeout(function(){ $state.go('tab.waitingRoom');	 }, 10000);
        setTimeout(function(){ $state.go('tab.waitingRoom'); }, 10000);
        
	}
    
    
    
     $scope.clearRootScopeConce = function(model) {
		navigator.notification.confirm(
			'Are you sure that you want to cancel this consultation?',
			 function(index){
				if(index == 1){					
					
				}else if(index == 2){
					$rootScope.PatientPrimaryConcern = "";
					$rootScope.PatientSecondaryConcern = "";
					$rootScope.PatientChronicCondition = "";
					$rootScope.patinentCurrentMedication = "";
					$rootScope.patinentMedicationAllergies = "";
					$rootScope.patientSurgeriess = "";
					$rootScope.MedicationCount == 'undefined'
					$rootScope.checkedChronic = 0;  
					$rootScope.ChronicCount = "";
					$rootScope.AllegiesCount = "";
					$rootScope.checkedAllergies = 0;
					$rootScope.MedicationCount = ""; 
					$rootScope.checkedMedication = 0; 
					$rootScope.IsValue = "";
					$rootScope.IsToPriorCount = "";
					$rootScope.ChronicCountValidCount = "";
					$rootScope.PriorSurgeryValidCount = ""; 
					$rootScope.AllegiesCountValid = "";
					$rootScope.MedicationCountValid = ""; 
					SurgeryStocksListService.ClearSurgery();
					$state.go('tab.userhome');
				}
			 },
			'Confirmation:',
			['No','Yes']     
		);
	 
     };
    
    //Side Menu
    var checkAndChangeMenuIcon;
    $interval.cancel(checkAndChangeMenuIcon);
    
    $rootScope.checkAndChangeMenuIcon = function(){
        if (!$ionicSideMenuDelegate.isOpen(true)){
          if($('#BackButtonIcon').hasClass("ion-close")){
            $('#BackButtonIcon').removeClass("ion-close");
            $('#BackButtonIcon').addClass("ion-navicon-round"); 
          }
        }else{
            if($('#BackButtonIcon').hasClass("ion-navicon-round")){
            $('#BackButtonIcon').removeClass("ion-navicon-round");
            $('#BackButtonIcon').addClass("ion-close"); 
          }
        }
    } 
    
 $scope.toggleLeft = function() {
  $ionicSideMenuDelegate.toggleLeft();
        $rootScope.checkAndChangeMenuIcon();
        if(checkAndChangeMenuIcon){
            $interval.cancel(checkAndChangeMenuIcon);
        }
		if($state.current.name != "tab.login" || $state.current.name != "tab.loginSingle"){
			checkAndChangeMenuIcon = $interval(function(){
				$rootScope.checkAndChangeMenuIcon();
			}, 300);
		}
 };
    
    
	
})






.controller('ConferenceCtrl', function($scope, ageFilter, $timeout, $window, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $ionicHistory, $filter, $rootScope, $state, SurgeryStocksListService, LoginService) {
    
	$scope.ClearRootScope = function() {
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
		if(deploymentEnv == "Multiple"){
			$state.go('tab.chooseEnvironment');
		}else if(deploymentEnv == "Single"){
			$state.go('tab.loginSingle');
		}else{
			$state.go('tab.login');
		}
	}
    
	
    var initConferenceRoomHub = function () {
         var connection = $.hubConnection();
         //debugger;
         var conHub = connection.createHubProxy('consultationHub');
         connection.url = $rootScope.APICommonURL + "/api/signalR/";
         var consultationWatingId = +$rootScope.consultationId;
         
           // var conHub = $.connection.consultationHub;
           connection.qs = {
                "Bearer": $rootScope.accessToken,
                "consultationId": consultationWatingId,
                "isMobile" : true
            };
            conHub.on("onConsultationReview", function () {
                $rootScope.waitingMsg = "The clinician is now reviewing the intake form.";
            });
            conHub.on("onCustomerDefaultWaitingInformation",function () {
                $rootScope.waitingMsg = "Please Wait....";
            });
            conHub.on("onConsultationStarted",function () {
               $rootScope.waitingMsg = "Please wait...";
            });
            connection.logging = true;
            connection.start({
                withCredentials :false
            }).then(function(){
                $rootScope.waitingMsg="The Clinician will be with you Shortly.";
            });
            conHub.on("onConsultationEnded",function () {
                $scope.disconnectConference();
            });
    };
    initConferenceRoomHub();
    
	$rootScope.clinicianVideoHeight = $window.innerHeight - 38;
    $rootScope.clinicianVideoWidth = $window.innerWidth;
	
	$rootScope.clinicianVideoHeightScreen = ($window.innerWidth / 16) * 9;
			
    $rootScope.patientVideoTop = $window.innerHeight - 150;
    $rootScope.controlsStyle = false;
    
    $rootScope.cameraPosition = "front";
    $rootScope.publishAudio = true;
    
    
    $rootScope.muteIconClass = 'ion-ios-mic callIcons';
    $rootScope.cameraIconClass = 'ion-ios-reverse-camera callIcons';
	
    var apiKey = $rootScope.videoApiKey;
    var sessionId = $rootScope.videoSessionId;
    var token = $rootScope.videoToken;
	/*
    var apiKey = "45191172";
    var sessionId = "1_MX40NTE5MTE3Mn5-MTQzOTQ2MDk3ODA4OH5wSEpoU091NXJkK01sZzFoUDV4aXhVWWh-fg";
    var token = "T1==cGFydG5lcl9pZD00NTE5MTE3MiZzaWc9MzAyOTYzMTExMGJkYTJhYmI3MDMwNTNiM2Q4MWM5ZjU1ZWZkNjlkODpzZXNzaW9uX2lkPTFfTVg0ME5URTVNVEUzTW41LU1UUXpPVFEyTURrM09EQTRPSDV3U0Vwb1UwOTFOWEprSzAxc1p6Rm9VRFY0YVhoVldXaC1mZyZjcmVhdGVfdGltZT0xNDM5NDYwOTc1Jm5vbmNlPTcwNDQzJnJvbGU9UFVCTElTSEVS";
    */
    var session = OT.initSession(apiKey, sessionId);
    var publisher;
	
			   
    session.on('streamCreated', function(event) { 		
		//alert('stream created from type: ' + event.stream.videoType);
		
		if(ionic.Platform.isIOS()){
			if(event.stream.videoType == 1){
				$("#subscriber").width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeight);	
			} else if(event.stream.videoType == 2){			
				$('#subscriber .OT_video-container').remove();
				
				var screenHeight = $rootScope.clinicianVideoHeight / 2;			
				var divHeight = $rootScope.clinicianVideoHeightScreen / 2;
				var totalHeight = screenHeight - divHeight;
				
				$("#subscriber").css('top',  totalHeight);
				$("#subscriber").width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeightScreen);			
			}
		}
		session.subscribe(event.stream, 'subscriber', {
			insertMode: 'append',
			subscribeToAudio: true,
			subscribeToVideo: true
		});			
       
        OT.updateViews();
    });
	
	session.on('streamDestroyed', function(event) { 					
			//$("#subscriberScreen").hide();
			//$("#subscriber").show();				
			$("#subscriber").width($rootScope.clinicianVideoWidth).height($rootScope.clinicianVideoHeight);	
			event.preventDefault(); 
    });

    // Handler for sessionDisconnected event
    session.on('sessionDisconnected', function(event) {
        console.log('You were disconnected from the session.', event.reason);
    });
	
    // Connect to the Session
    session.connect(token, function(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            publisher = OT.initPublisher('publisher', {
				insertMode: 'append',
				publishAudio: true,
				publishVideo: true
            });
            $timeout(function(){
                $scope.controlsStyle = true;
            }, 100);
            session.publish(publisher);
            OT.updateViews();

        } else {
            alert('There was an error connecting to the session: ' + error.message);
        }

    });
    $scope.toggleCamera = function(){
        if($scope.cameraPosition == "front"){
            $rootScope.newCamPosition = "back";
            $rootScope.cameraIconClass = 'ion-ios-reverse-camera-outline callIcons';
        }else{
            $rootScope.newCamPosition = "front";
            $rootScope.cameraIconClass = 'ion-ios-reverse-camera callIcons';
        }
        $scope.cameraPosition = $scope.newCamPosition;
        publisher.setCameraPosition($scope.newCamPosition);
        OT.updateViews();
    };
    
    $scope.toggleMute = function(){
        if($scope.publishAudio){
            $rootScope.newPublishAudio = false;
            $rootScope.muteIconClass = 'ion-ios-mic-off callIcons activeCallIcon';
        }else{
            $rootScope.newPublishAudio = true;
            $rootScope.muteIconClass = 'ion-ios-mic callIcons';
        }
        $rootScope.publishAudio = $rootScope.newPublishAudio;
        publisher.publishAudio($rootScope.newPublishAudio);
        //OT.updateViews();
    };
    
    $scope.toggleSpeaker = function(){
        
    };
    
    $scope.turnOffCamera = function(){
        
    };
	
	$scope.doGetExistingConsulatationReport = function () {	
		
			
		 if ($scope.accessToken == 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		
		var params = {
            consultationId: $rootScope.consultationId, 
            accessToken: $rootScope.accessToken,
            success: function (data) {
                $rootScope.existingConsultationReport = data.data[0].details[0]	;
				$rootScope.ReportHospitalImage = $rootScope.APICommonURL + $rootScope.existingConsultationReport.hospitalImage;					
				$rootScope.reportScreenPrimaryConcern = $rootScope.existingConsultationReport.primaryConcern;
				if(typeof $rootScope.reportScreenPrimaryConcern != 'undefined') {
					var n = $rootScope.reportScreenPrimaryConcern.indexOf("?");
					if(n < 0) {
						$rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern;
					} else {
						$rootScope.reportScreenPrimaryConcern1 = $rootScope.reportScreenPrimaryConcern.split("?");
						$rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern1[1];
					}
				} else {
					$rootScope.reportScreenPrimaryConcern = "";
				}
				$rootScope.reportScreenSecondaryConcern = $rootScope.existingConsultationReport.secondaryConcern;
				if(typeof $rootScope.reportScreenSecondaryConcern != 'undefined') {
					var n = $rootScope.reportScreenSecondaryConcern.indexOf("?");
					if(n < 0) {
						$rootScope.reportScreenSecondaryConcern = $rootScope.reportScreenSecondaryConcern;
					} else {
						$rootScope.reportScreenSecondaryConcern1 = $rootScope.reportScreenSecondaryConcern.split("?");
						$rootScope.reportScreenSecondaryConcern = $rootScope.reportScreenSecondaryConcern1[1];
					}
				} else {
					$rootScope.reportScreenSecondaryConcern = "None Reported";
				}
				$rootScope.intake = $rootScope.existingConsultationReport.intake;
				
				$rootScope.fullTerm = $rootScope.intake.infantData.fullTerm;
					if($rootScope.fullTerm == 'N') { $rootScope.fullTerm = 'No'; } else if($rootScope.fullTerm == 'T') { $rootScope.fullTerm = 'True'; } 
				
				$rootScope.vaginalBirth = $rootScope.intake.infantData.vaginalBirth;
					if($rootScope.vaginalBirth == 'N') { $rootScope.vaginalBirth = 'No'; } else if($rootScope.vaginalBirth == 'T') { $rootScope.vaginalBirth = 'True'; } 
				
				$rootScope.dischargedWithMother = $rootScope.intake.infantData.dischargedWithMother;
					if($rootScope.dischargedWithMother == 'N') { $rootScope.dischargedWithMother = 'No'; } else if($rootScope.dischargedWithMother == 'T') { $rootScope.dischargedWithMother = 'True'; } 
				
				$rootScope.vaccinationsCurrent = $rootScope.intake.infantData.vaccinationsCurrent;
					if($rootScope.vaccinationsCurrent == 'N') { $rootScope.vaccinationsCurrent = 'No'; } else if($rootScope.vaccinationsCurrent == 'T') { $rootScope.vaccinationsCurrent = 'True'; } 
				
				var usDOB = ageFilter.getDateFilter($rootScope.existingConsultationReport.dob);
				$rootScope.userReportDOB = usDOB.search("y");
								
				
				$rootScope.gender = data.data[0].details[0].gender;
				if($rootScope.gender == 'M') { $rootScope.gender = 'Male'; } else if($rootScope.gender == 'F') { $rootScope.gender = 'Female'; } 
				
				
					$rootScope.ReportMedicalConditions = [];
					angular.forEach($rootScope.intake.medicalConditions, function(index, item) {	
						$rootScope.ReportMedicalConditions.push({	
							'Number':item + 1,
							'id': index.$id,
							'code': index.code,
							'description': index.description,
						});
					});	
					
					$rootScope.ReportMedicationAllergies = [];
					angular.forEach($rootScope.intake.medicationAllergies, function(index, item) {	
						$rootScope.ReportMedicationAllergies.push({	
							'Number':item + 1,
							'id': index.$id,
							'code': index.code,
							'description': index.description,
						});
					});	
					
					$rootScope.ReportMedications = [];
					angular.forEach($rootScope.intake.medications, function(index, item) {	
						$rootScope.ReportMedications.push({	
							'Number':item + 1,
							'id': index.$id,
							'code': index.code,
							'description': index.description,
						});
					});
					
					$rootScope.ReportSurgeries = [];
					angular.forEach($rootScope.intake.surgeries, function(index, item) {	
						$rootScope.ReportSurgeries.push({	
							'Number':item + 1,
							'id': index.$id,
							'description': index.description,
							'month': index.month,
							'year': index.year,
						});
					});
					
					
				
				$state.go('tab.ReportScreen');
		   },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };
        
		LoginService.getConsultationFinalReport(params);
	}
	
	$scope.doGetPatientsSoapNotes = function() {
			if ($rootScope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
			 var params = {
                consultationId: $rootScope.consultationId, 
                accessToken: $rootScope.accessToken,
                success: function (data) {
                    $rootScope.SoapNote = data.data;
                },
                error: function (data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };
			
			LoginService.getPatientsSoapNotes(params);
		}
	
    
    $scope.disconnectConference = function(){
        session.unpublish(publisher)
        //publisher.destroy();
        session.disconnect();
		navigator.notification.alert(
			'Consultation ended successfully!',  // message
			consultationEndedAlertDismissed,         // callback
			'Connected Care',            // title
			'Done'                  // buttonName
		);
		//alert('Consultation ended successfully!');
		
    };
    
	function consultationEndedAlertDismissed(){
		$scope.doGetPatientsSoapNotes();
		$scope.doGetExistingConsulatationReport(); 
		window.plugins.insomnia.allowSleepAgain();	
	}
})


.directive('inputMaxLengthNumber', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ngModelCtrl) {
      function fromUser(text) {
        var maxlength = Number(attrs.maxlength);
        if (String(text).length >= maxlength) {
        var newString = String(text).substr(0, maxlength);
          ngModelCtrl.$setViewValue(newString);
          ngModelCtrl.$render();
          return ngModelCtrl.$modelValue;
        }
        return text;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
})



.directive('creditCardExpirationEntry', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ngModelCtrl) {
      function fromUser(text) {
        var newVal = String(text);
        if(typeof oldLength != "undefined"){
            if(oldLength != 3 && String(text).length == 2){
                //newVal = newVal.substr(0,2) + "/" + newVal.substr(2, newVal.length);// 
                newVal = String(text) + "/";
            }
        }
        if(String(text).length == 1){
            oldLength = 7;
        }else{
            oldLength = String(text).length;
        }
        ngModelCtrl.$setViewValue(newVal);
        ngModelCtrl.$render();
        return newVal;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
})


.filter('ageFilter', function() {
    function getAge(dateString) {
	  var now = new Date();
	  var today = new Date(now.getYear(),now.getMonth(),now.getDate());

	  var yearNow = now.getYear();
	  var monthNow = now.getMonth();
	  var dateNow = now.getDate();

	  var dob = new Date(dateString.substring(6,10),
						 dateString.substring(0,2)-1,                   
						 dateString.substring(3,5)                  
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
		var monthAge = 12 + monthNow -monthDob;
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
		  
		 yearString = "y"; 
		 monthString = "m";

	  /*if ( age.years < 10 ) years = '0' + age.years;
	  else years = age.years;
	  if ( age.months < 10 ) month = '0' + age.months;
	  else month = age.months;
	  if ( age.days > 1 ) dayString = " days";
	  else dayString = " day";

	  
	   if(age.years == 0 ) {  
			if(age.days <= 15) {
				return ageString =  age.months + monthString; 
			} else if (age.days > 15) {
				 var ageMonth =  (age.months + 1); 
				 if ( ageMonth < 10 ) return ageString = '0' + ageMonth + monthString;
				else return ageString = ageMonth + monthString;
			}
	   }
		if (age.years > 0) {
			if(age.days <= 15) {
				var month =  month + monthString; 
			} else if (age.days > 15) {
				//var month =  (month + 1) + monthString; 
				var ageMonth =  (age.months + 1); 
				 if ( ageMonth < 10 ) var month = '0' + ageMonth + monthString;
				else var month = ageMonth + monthString;
			}
			return ageString = age.years + yearString +'/'+ month; }
		*/
			
		if(age.years == 0 ) {  
			if(age.days <= 15) {
				return ageString = age.months + monthString;; 
			} else if (age.days > 15) {
				 return ageString = (age.months + 1) + monthString;; 
			}
	   }
		if (age.years > 0) {
			if(age.days <= 15) {
				 var month = age.months + monthString;; 
			} else if (age.days > 15) {
				  var month = (age.months + 1) + monthString;; 
			}
		return ageString = age.years + yearString +'/'+ month; }	
			

	  
	}

     return function(birthdate) {
			var BirthDate = new Date(birthdate);

			var year = BirthDate.getFullYear();
			var month = BirthDate.getMonth() + 1;
			if(month < 10) { month = '0' + month; } else { month = month; }
			var date = BirthDate.getDate();
			if(date < 10) { date = '0' + date; } else { date = date; }
			
			var newDate = month + '/' + date + '/' + year;

           var age = getAge(newDate);
		   return age;
     }; 
})

 .directive('googlePlaces', function(){
                return {
                    restrict:'E',
                    replace:true,
                    // transclude:true,
                    scope: {location:'='},
                    template: '<input id="google_places_ac" name="google_places_ac" ng-model="google_places_ac" type="text" class="input-block-level" required  />',
                    link: function($scope, elm, attrs){
                var input = document.getElementById('google_places_ac');        
                var autocomplete = new google.maps.places.Autocomplete(input, {types: ['(regions)'],componentRestrictions: { country: "US" }});
                        google.maps.event.addListener(autocomplete, 'place_changed', function() {
                            var place  = autocomplete.getPlace();
                            $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                            $scope.$apply();
                        });
                    }
                }
})

// Array Of Countries Filter
.filter('arrayContries', function() {
  return function(items,reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    if(reverse) filtered.reverse();
     return filtered;
  };
})


.filter('truncate', function () {
    return function (input, characters) {
        if (input.length > characters) {
            return input.substr(0, characters) + '...';
        }

        return input;
    };
}) 
// Special Charctor Remove Filter //
.filter('filterHtmlChars', function(){
  return function(html) {
    var filtered = angular.element('<div>').html(html).text(); 
   return filtered;
  }
})

.directive('siteHeader', function () {
    return {
        restrict: 'E',
        template: '<a class="button_new icon ion-chevron-left"><span>{{back}}</span></a>',
        scope: {
            back: '@back',           
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });          
        }
    };
})

.directive('siteHeader1', function () {
    return {
        restrict: 'E',
        template: '<a class="button_new icon ion-chevron-left calendarBack"><span style="margin-left: 3px;">{{back}}</span></a>',
        scope: {
            back: '@back',           
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });          
        }
    };
})

.directive('siteHeaderIos', function () {
    return {
        restrict: 'E',
        template: '<a class="button_new icon ion-chevron-left calendarBack" style="top: 13px !important;"><span style="margin-left: 3px;">{{back}}</span></a>',
        scope: {
            back: '@back',           
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });          
        }
    };
})
.directive('siteHeader2', function () {
    return {
        restrict: 'E',
        template: '<a class="button_new icon PlanCancel" ><span>{{back}}</span></a>',
        scope: {
            back: '@back',           
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });          
        }
    };
})

