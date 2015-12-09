

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

var deploymentEnv = 'Multiple'; //Production //Multiple //Single 
if(deploymentEnv == 'Single') {
	var singleHospitalId = 156;
	var brandColor = '#22508b';
	var logo= 'img/docYourWay.png';
	var Hopital = 'DocYourWay';
}

var handleOpenURL = function (url) {
   setTimeout(function(){
        window.localStorage.setItem("external_load", null);
        window.localStorage.setItem("external_load", url);
               
    }, 0);
}

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $state, $rootScope, $localstorage) {
  $ionicPlatform.ready(function() {
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
		if (window.StatusBar) {
		  // org.apache.cordova.statusbar required
		  StatusBar.styleDefault();
		}
    
		setTimeout(function() {		
			document.addEventListener("offline", onOffline, false);
			document.addEventListener("online", onOnline, false);
	 }, 1000);
	
	function onOffline(){
		if($localstorage.get('ChkVideoConferencePage') == "videoConference") { 
			$state.go('tab.connectionLost');
		} 
      navigator.notification.alert(
          'Please make sure that you have network connection.',  // message
          null,
          'No Internet Connection',            // title
          'Ok'                  // buttonName
        );
		/*navigator.notification.alert(
			'Please make sure that you have network connection.',  // message
			function(){ 
				if($localstorage.get('ChkVideoConferencePage') == "videoConference") { 
					$state.go('tab.testPage'); return;} },
			'No Internet Connection',            // title
			'Done'                  // buttonName
		);
		return false;*/
		
    }
	function onOnline() {		
		if($localstorage.get('ChkVideoConferencePage') == "videoConference") { 			
			$state.go('tab.videoConference');
		}		
	}
    
	/*$ionicPlatform.on('resume', function(){
		 setTimeout(function() {		
			document.addEventListener("offline", onOffline, false);
			function onOffline() {
				// Handle the offline event				
				//$(".networkDiv").show();
				var networkConnection = 'off';
				alert('offline2');
			}
			document.addEventListener("online", onOnline, false);
			function onOnline() {
				// Handle the online event				
				//$(".networkDiv").hide();
				var networkConnection = 'on';
				alert('online2');
			}
		 }, 1000);
	});  
		*/
	
    cordova.plugins.backgroundMode.setDefaults({ text:'Connected Care'});
      // Enable background mode
      cordova.plugins.backgroundMode.enable();
  
      // Called when background mode has been activated
      cordova.plugins.backgroundMode.onactivate = function () {
          /*
          setTimeout(function () {
              // Modify the currently displayed notification
              cordova.plugins.backgroundMode.configure({
                  text:'Running in background for more than 5s now.'
              });
          }, 5000);
          */
      };
      setTimeout(function() {
        //alert('external: ' + window.localStorage.getItem("external_load"));
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
          if(EXTRA['env'] != ""){
            var dEnv = EXTRA['env'];
            if(dEnv.toUpperCase() == "SANDBOX"){
              deploymentEnv = "Sandbox";
            }else if(dEnv.toUpperCase() == "QA"){
              deploymentEnv = "QA";
            }else if(dEnv.toUpperCase() == "PRODUCTION"){
              deploymentEnv = "Production";
            }
          }
          if(EXTRA['token'] != "" && EXTRA['env'] != ""){
            $state.go('tab.interimpage', { token: EXTRA['token'], hospitalId: EXTRA['hospitalId'], consultationId: EXTRA['consultationId'] });
          }else if(EXTRA['env'] != ""){
            $state.go('tab.login');
          }
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
            if(EXTRA['env'] != ""){
              var dEnv = EXTRA['env'];
              if(dEnv.toUpperCase() == "SANDBOX"){
                deploymentEnv = "Sandbox";
              }else if(dEnv.toUpperCase() == "QA"){
                deploymentEnv = "QA";
              }else if(dEnv.toUpperCase() == "PRODUCTION"){
                deploymentEnv = "Production";
              }
            }
            if(EXTRA['token'] != "" && EXTRA['env'] != ""){
              $state.go('tab.interimpage', { token: EXTRA['token'], hospitalId: EXTRA['hospitalId'], consultationId: EXTRA['consultationId'] });
            }else if(EXTRA['env'] != ""){
              $state.go('tab.login');
            }
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
        controller: 'ConferenceCtrl'
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

  
  // if none of the above states are matched, use this as the fallback
  if(deploymentEnv == "Multiple"){
    $urlRouterProvider.otherwise('/tab/chooseEnvironment');
  }else if(deploymentEnv == "Single"){
    $urlRouterProvider.otherwise('/tab/loginSingle');
  }else{
    $urlRouterProvider.otherwise('/tab/login');
  }
  
});

//snapmdconnectedcare://?token=RXC5PBj-uQbrKcsoQv3i6EY-uxfWrQ-X5RzSX13WPYqmaqdwbLBs2WdsbCZFCf_5jrykzkpuEKKdf32bpU4YJCvi2XQdYymvrjZQHiAb52G-tIYwTQZ9IFwXCjf-PRst7A9Iu70zoQgPrJR0CJMxtngVf6bbGP86AF2kiomBPuIsR00NISp2Kd0I13-LYRqgfngvUXJzVf703bq2Jv1ixBl_DRUlWkmdyMacfV0J5itYR4mXpnjfdPpeRMywajNJX6fAVTP0l5KStKZ3-ufXIKk6l5iRi6DtNfxIyT2zvd_Wp8x2nOQezJSvwtrepb34quIr5jSB_s3_cv9XE6Sg3Rtl9qbeKQB2gfU20WlJMnOVAoyjYq36neTRb0tdq6WeWo1uqzmuuYlepxl2Tw5BaQ&hospitalId=126&consultationId=