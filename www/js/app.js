

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
/*var handleOpenURL = function(url) {
    console.log("received url: " + url);
    //window.localstorage.setItem('ASA', url);
}*/


// Sandbox -  https://sandbox.connectedcare.md
// Production - https://connectedcare.md
// QA - https://snap-qa.com
// Multiple - https://sandbox.connectedcare.md and https://snap.qa.com this will let the user to choose env first

var deploymentEnv = 'Single'; //Production //Multiple //Single //Demo
var deploymentEnvLogout = 'Single'; // same as above var deploymentEnvForProduction = 'Production';
var appStoreTestUserEmail = '';
var deploymentEnvForProduction = '';  //'Production'; // Set 'Production' Only for Single Production - For Apple testing purpose
var loginPageEnv = 'Single';



if(deploymentEnv == 'Single') {
	appStoreTestUserEmail = 'itunesmobiletester@gmail.com';
	//deploymentEnvForProduction = 'Production';  //'Production'; //Enable only for production. Set 'Production' Only for Single Production - For Apple testing purpose
    
    var singleStagingHospitalId;
    var singleHospitalId;	
    var brandColor;
    var logo;
    var Hospital;
    var HospitalTag;
    
	var cobrandApp = 'DYW';
    
    if(cobrandApp == 'EpicMD'){
        singleStagingHospitalId = 155;
        singleHospitalId = 190;	
        brandColor = '#66c3b0';
        logo= 'img/epicmd_logotypebg.png';
        Hospital = 'EpicMD';
        HospitalTag = 'Virtual Care Concierge';
    } else if(cobrandApp == 'TelehealthOne'){
        singleStagingHospitalId = 142;
        singleHospitalId = 142;	
        brandColor = '#5ec4fe';
        logo= 'img/teleLogo.png';
        Hospital = 'telehealthONE';
        HospitalTag = 'Virtual Care Concierge';
    } else if(cobrandApp == 'Dokita'){
        singleStagingHospitalId = 156;
        singleHospitalId = 184;	
        brandColor = '#ff0000';
        logo= 'img/dokita.png';
        Hospital = 'Dokita247';
        HospitalTag = 'Virtual Care Concierge';
    } else if(cobrandApp == 'DYW'){
        singleStagingHospitalId = 156;
        singleHospitalId = 168;	
        brandColor = '#22508b';
        logo= 'img/dyw.jpg';
        Hospital = "DocYourWay's Global Care Management";
        HospitalTag = 'Virtual Care Concierge';
    }

    
}

var handleOpenURL = function (url) {
   setTimeout(function(){
        window.localStorage.setItem("external_load", null);
        window.localStorage.setItem("external_load", url);
               
    }, 0);
}

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $state, $rootScope,  LoginService, $ionicPopup, $window) {
  $ionicPlatform.ready(function() {
  
  // Check for network connection
   /* if(window.Connection) {	
      if(navigator.connection.type == Connection.NONE) { 
		navigator.notification.confirm(
			'Sorry, Please Check Your Network Connection.',
			 function(index){
				if(index == 1){					
					
				}else if(index == 2){
					// navigator.app.exitApp();				
				}
			 },
			'Network Problem:',
			['Cancel','Ok']     
		);
		
      }
	 }*/
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
		if(window.localStorage.getItem("app_load") == "yes") {
			setTimeout(function() {
				navigator.splashscreen.hide();
			}, 500);
		} else { 
			//setTimeout(function() {
				window.localStorage.setItem("app_load", "yes");
				//navigator.splashscreen.hide();
			//}, 10000);
		 }
		if (window.cordova && window.cordova.plugins.Keyboard) {
		   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
		   cordova.plugins.Keyboard.disableScroll(true);
		}
		
		var initialScreenSize = window.innerHeight;
		window.addEventListener("resize", function() {
			if(window.innerHeight < initialScreenSize){
				$(".has-footer").css({"bottom": 0});	
				$(".footer").hide();
			}
			else{
				$(".footer").show();
			}
		});
		
        
		if (window.StatusBar) {
		  StatusBar.styleDefault();
		}
    
		setTimeout(function() {		
			document.addEventListener("offline", onOffline, false);
			document.addEventListener("online", onOnline, false);
        }, 100);
	
        function onOffline(){	
            
        navigator.notification.alert(
            'Please make sure that you have network connection.',  // message
            null,
            'No Internet Connection',            // title
            'Ok'                  // buttonName
            ); 
			return false;
            if($window.localStorage.get('ChkVideoConferencePage') == "videoConference") { 
              $state.go('tab.connectionLost');
            } 
        }
        function onOnline() {		
            if($window.localStorage.get('ChkVideoConferencePage') == "videoConference") { 
           $state.go('tab.videoConference');
            }		
        }
        
        cordova.plugins.backgroundMode.setDefaults({ text: $rootScope.alertMsgName});
        cordova.plugins.backgroundMode.enable();
  
        setTimeout(function() {
            if(window.localStorage.getItem("external_load") != null && window.localStorage.getItem("external_load") != ""){
            var EXTRA = {};
            var extQuery = window.localStorage.getItem("external_load").split('?')
            var extQueryOnly = extQuery[1];
            
            var query = extQueryOnly.split("&");
            
            for (var i = 0, max = query.length; i < max; i++)
            {
                if (query[i] === "") // check for trailing & with no param
                    continue;
                
                var param = query[i].split("=");
                EXTRA[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
            }
            window.localStorage.setItem("external_load", null);
			if(deploymentEnv != 'Single') {
				if(EXTRA['env'] != ""){
					var dEnv = EXTRA['env'];
					if(dEnv.toUpperCase() == "SANDBOX"){
						deploymentEnv = "Sandbox";
						apiCommonURL = 'https://sandbox.connectedcare.md';
					}else if(dEnv.toUpperCase() == "QA"){
						deploymentEnv = "QA";
						apiCommonURL = 'https://snap-qa.com';
					}else if(dEnv.toUpperCase() == "PRODUCTION"){
						deploymentEnv = "Production";
						apiCommonURL = 'https://connectedcare.md';
					}else if(dEnv.toUpperCase() == "STAGE"){
						deploymentEnv = "Staging";
						apiCommonURL = 'https://snap-stage.com';
					}else if(dEnv.toUpperCase() == "DEMO"){
						deploymentEnv = "Demo";
						apiCommonURL = 'https://demo.connectedcare.md';
					}
				}
			}
            if(EXTRA['token'] != "" && EXTRA['env'] != ""){
                $state.go('tab.interimpage', { token: EXTRA['token'], hospitalId: EXTRA['hospitalId'], consultationId: EXTRA['consultationId'] });
            }else if(EXTRA['env'] != "" && loginPageEnv != 'Single'){
                $state.go('tab.login');
            }/*else if(EXTRA['env'] != "" && loginPageEnv == 'Single'){
                $state.go('tab.singleTheme');
            }*/
            }
        }, 2000);
        $ionicPlatform.on('resume', function(){
            setTimeout(function() {
            if(window.localStorage.getItem("external_load") != null && window.localStorage.getItem("external_load") != ""){
                var EXTRA = {};
                var extQuery = window.localStorage.getItem("external_load").split('?')
                var extQueryOnly = extQuery[1];
                
                var query = extQueryOnly.split("&");
                
                for (var i = 0, max = query.length; i < max; i++)
                {
                    if (query[i] === "") // check for trailing & with no param
                        continue;
                
                    var param = query[i].split("=");
                    EXTRA[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
                }
                window.localStorage.setItem("external_load", null);
				if(deploymentEnv != 'Single') {
					if(EXTRA['env'] != ""){
						var dEnv = EXTRA['env'];
						if(dEnv.toUpperCase() == "SANDBOX"){
							deploymentEnv = "Sandbox";
							apiCommonURL = 'https://sandbox.connectedcare.md';
						}else if(dEnv.toUpperCase() == "QA"){
							deploymentEnv = "QA";
							apiCommonURL = 'https://snap-qa.com';
						}else if(dEnv.toUpperCase() == "PRODUCTION"){
							deploymentEnv = "Production";
							apiCommonURL = 'https://connectedcare.md';
						}else if(dEnv.toUpperCase() == "STAGE"){
							deploymentEnv = "Staging";
							apiCommonURL = 'https://snap-stage.com';
						}else if(dEnv.toUpperCase() == "DEMO"){
							deploymentEnv = "Demo";
							apiCommonURL = 'https://demo.connectedcare.md';
						}
					}
				}
                if(EXTRA['token'] != "" && EXTRA['env'] != ""){
                $state.go('tab.interimpage', { token: EXTRA['token'], hospitalId: EXTRA['hospitalId'], consultationId: EXTRA['consultationId'] });
                }else if(EXTRA['env'] != "" && loginPageEnv != 'Single'){
                    $state.go('tab.login');
                } /*else if(EXTRA['env'] != "" && loginPageEnv == 'Single'){
                    $state.go('tab.singleTheme');
                }*/
            }
            }, 2000);
        });    
        
        });
})




.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $stateProvider
   
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.login', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
  .state('tab.loginSingle', {
    url: '/loginSingle',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-loginSingle.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('tab.provider', {
    url: '/provider',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-provider.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
  .state('tab.terms', {
    url: '/terms',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-terms.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('tab.password', {
    url: '/password',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-password.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('tab.resetPassword', {
    url: '/resetPassword',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-resetPassword.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
  .state('tab.userhome', {
    url: '/userhome',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-userhome.html',
        controller: 'LoginCtrl'
      }
    }
  })
  

  
  
  .state('tab.patientDetail', {
    url: '/patientDetail',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-patientDetail.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
    .state('tab.patientCalendar', {
    url: '/patientCalendar',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-patientCalendar.html',
        controller: 'patientCalendarCtrl'
      }
    }
  })
  
  .state('tab.appoimentDetails', {
    url: '/appoimentDetails',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-appoimentDetails.html',
        controller: 'appoimentDetailsCtrl'
      }
    }
  })
  
   
  
   .state('tab.patientConcerns', {
    url: '/patientConcerns',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-patientConcerns.html',
        controller: 'IntakeFormsCtrl'
      }
    }
  })
  
    .state('tab.ChronicCondition', {
    url: '/ChronicCondition',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-ChronicCondition.html',
        controller: 'IntakeFormsCtrl'
      }
    }
  })
  
   .state('tab.priorSurgeries', {
    url: '/priorSurgeries',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-priorSurgeries.html',
        controller: 'IntakeFormsCtrl'
      }
    }
  })

 .state('tab.CurrentMedication', {
    url: '/CurrentMedication',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-CurrentMedication.html',
        controller: 'IntakeFormsCtrl'
      }
    }
  })
  
 .state('tab.MedicationAllegies', {
    url: '/MedicationAllegies',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-MedicationAllegies.html',
        controller: 'IntakeFormsCtrl'
      }
    }
  })
   .state('tab.ConsentTreat', {
    url: '/ConsentTreat',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-ConsentTreat.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
  .state('tab.consultCharge', {
    url: '/consultCharge',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-consultCharge.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('tab.addHealthPlan', {
    url: '/addHealthPlan',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-addHealthPlan.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
    .state('tab.planDetails', {
    url: '/planDetails',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-planDetails.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
  
  
    .state('tab.applyPlan', {
    url: '/applyPlan',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-applyPlan.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('tab.addCard', {
    url: '/addCard',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-addCard.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('tab.consultChargeNoPlan', {
    url: '/consultChargeNoPlan',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-consultChargeNoPlan.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('tab.cardDetails', {
    url: '/cardDetails',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-cardDetails.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
 
  .state('tab.submitPayment', {
    url: '/submitPayment',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-submitPayment.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
  .state('tab.receipt', {
    url: '/receipt',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-receipt.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('tab.waitingRoom', {
    url: '/waitingRoom',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-waitingRoom.html',
        controller: 'waitingRoomCtrl'
      }
    }
  })  
  
  .state('tab.videoConference', {
    url: '/videoConference',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-videoConference.html',
        controller: 'ConferenceCtrl'
      }
    }
  })  
  
  .state('tab.connectionLost', {
    url: '/connectionLost',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-connectionLost.html',
        controller: 'connectionLostCtrl'
      }
    }
  })
  
   .state('tab.ReportScreen', {
    url: '/ReportScreen',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-ReportScreen.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('tab.interimpage', {
    url: '/interimpage/:token/:hospitalId/:consultationId',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-interimpage.html',
        controller: 'InterimController'
      }
    }
  })
  .state('tab.chooseEnvironment', {
    url: '/chooseEnvironment',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-chooseEnvironment.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('tab.singleTerms', {
    url: '/singleTerms',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-singleTerms.html',
        controller: 'LoginCtrl'
      }
    }
  })
.state('tab.singleTheme', {
    url: '/singleTheme',
    views: {
      'tab-login': {
        controller: 'singleHospitalThemeCtrl',
      }
    }
  })
  
  .state('tab.searchprovider', {
    url: '/searchprovider',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-searchprovider.html',
        controller: 'searchProviderController'
      }
    }
  })
  
  .state('tab.registerStep1', {
    url: '/registerStep1',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-registerStep1.html',
        controller: 'registerStep1Controller'
      }
    }
  })
  .state('tab.registerStep2', {
    url: '/registerStep2',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-registerStep2.html',
        controller: 'registerStep2Controller'
      }
    }
  })
  .state('tab.registerSuccess', {
    url: '/registerSuccess',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-registerSuccess.html',
        controller: 'registerStep2Controller'
      }
    }
  })
  .state('tab.registerTerms', {
    url: '/registerTerms',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-registerTerms.html',
        controller: 'registerStep2Controller'
      }
    }
  })


  
  // if none of the above states are matched, use this as the fallback tab-chooseEnvironment
  if(deploymentEnv == "Multiple"){
    $urlRouterProvider.otherwise('/tab/chooseEnvironment');
  }else if(deploymentEnv == "Single"){
    //$urlRouterProvider.otherwise('/tab/singleTheme');
    $urlRouterProvider.otherwise('/tab/loginSingle');
  }else{
    $urlRouterProvider.otherwise('/tab/login');
  }
  
});

//snapmdconnectedcare://?token=RXC5PBj-uQbrKcsoQv3i6EY-uxfWrQ-X5RzSX13WPYqmaqdwbLBs2WdsbCZFCf_5jrykzkpuEKKdf32bpU4YJCvi2XQdYymvrjZQHiAb52G-tIYwTQZ9IFwXCjf-PRst7A9Iu70zoQgPrJR0CJMxtngVf6bbGP86AF2kiomBPuIsR00NISp2Kd0I13-LYRqgfngvUXJzVf703bq2Jv1ixBl_DRUlWkmdyMacfV0J5itYR4mXpnjfdPpeRMywajNJX6fAVTP0l5KStKZ3-ufXIKk6l5iRi6DtNfxIyT2zvd_Wp8x2nOQezJSvwtrepb34quIr5jSB_s3_cv9XE6Sg3Rtl9qbeKQB2gfU20WlJMnOVAoyjYq36neTRb0tdq6WeWo1uqzmuuYlepxl2Tw5BaQ&hospitalId=126&consultationId=