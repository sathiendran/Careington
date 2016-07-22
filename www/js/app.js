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
var deploymentEnv = 'Multiple'; //Production //Multiple //Single //Demo
var deploymentEnvLogout = 'Multiple'; // same as above var deploymentEnvForProduction = 'Production';
var appStoreTestUserEmail = 'itunesmobiletester@gmail.com';
var deploymentEnvForProduction = ''; //'Production'; // Set 'Production' Only for Single Production - For Apple testing purpose
var loginPageEnv = 'Single';
var xApiKey = 'c69fe0477e08cb4352e07c502ddd2d146b316112'; // For Photo Upload
var xDeveloperId = '84f6101ff82d494f8fcc5c0e54005895'; // For Photo Upload



if (deploymentEnv == 'Single') {
    appStoreTestUserEmail = 'itunesmobiletester@gmail.com';
    deploymentEnvForProduction = 'QA'; //'Production', 'Staging', 'QA', 'Sandbox'; // Set 'Production' Only for Single Production - For Apple testing purpose

    var singleStagingHospitalId;
    var singleHospitalId;
    var brandColor;
    var logo;
    var Hospital;
    var HospitalTag;


    var cobrandApp = 'DYW';

    if (cobrandApp == 'EpicMD') {
        singleStagingHospitalId = 155;
        singleHospitalId = 190;
        singleQAHospitalId = '';
        singleSandboxHospitalId = '';
        brandColor = '#66c3b0';
        logo = 'img/epicmd_logotypebg.png';
        Hospital = 'EpicMD';
        HospitalTag = 'Virtual Care Concierge';
        ssoURL = "";
    } else if (cobrandApp == 'TelehealthOne') {
        singleStagingHospitalId = 142;
        singleHospitalId = 142;
        singleQAHospitalId = '';
        singleSandboxHospitalId = '';
        brandColor = '#5ec4fe';
        logo = 'img/teleLogo.png';
        Hospital = 'telehealthONE';
        HospitalTag = 'Virtual Care Concierge';
        ssoURL = "";
    } else if (cobrandApp == 'Dokita') {
        singleStagingHospitalId = 156;
        singleHospitalId = 184;
        singleQAHospitalId = '';
        singleSandboxHospitalId = '';
        brandColor = '#ff0000';
        logo = 'img/dokita.png';
        Hospital = 'Dokita247';
        HospitalTag = 'Virtual Care Concierge';
        ssoURL = "";
    } else if (cobrandApp == 'DYW') {
        singleStagingHospitalId = 157;
        singleHospitalId = 168;
        singleQAHospitalId = 156;
        singleSandboxHospitalId = '';
        brandColor = '#22508b';
        logo = 'img/dyw.jpg';
        Hospital = "DocYourWay's Global Care Management";
        HospitalTag = 'Virtual Care Concierge';
        ssoURL = "";
    } else if (cobrandApp == 'Hello420') {
        singleStagingHospitalId = 160;
        singleHospitalId = 197;
        singleQAHospitalId = '';
        singleSandboxHospitalId = 142;
        brandColor = '#000080';
        logo = 'img/hello420.png';
        logo = 'https://connectedcare.md/api/v2.1/images/91e9aff7-4236-415e-aff5-17434a17c17b';
        Hospital = "Hello420";
        HospitalTag = 'Medical marijuana cards, quickly';
        ssoURL = "http://52.34.151.119/hello420/login/";
    }


}

var handleOpenURL = function(url) {
    setTimeout(function() {
        window.localStorage.setItem("external_load", null);
        window.localStorage.setItem("external_load", url);

    }, 0);
}

angular.module('starter', ['ionic', 'ngTouch', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $state, $rootScope, LoginService, $ionicPopup, $window) {
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
        if (window.localStorage.getItem("app_load") == "yes") {
            setTimeout(function() {
                navigator.splashscreen.hide();
            }, 500);
        } else {
            //setTimeout(function() {
            window.localStorage.setItem("app_load", "yes");
            //navigator.splashscreen.hide();
            //}, 10000);
        }
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
           cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
           cordova.plugins.Keyboard.disableScroll(true);
         }
         if(window.StatusBar) {
            StatusBar.styleDefault();
          }

        var initialScreenSize = window.innerHeight;
        window.addEventListener("resize", function() {
            if (window.innerHeight < initialScreenSize) {
                $(".has-footer").css({
                    "bottom": 0
                });
                $(".footer").hide();
            } else {
                $(".footer").show();
            }
        });

        setTimeout(function() {
            document.addEventListener("offline", onOffline, false);
            document.addEventListener("online", onOnline, false);
        }, 100);

        function onOffline() {

            navigator.notification.alert(
                'Please make sure that you have network connection.', // message
                null,
                'No Internet Connection', // title
                'Ok' // buttonName
            );
            return false;
            if ($window.localStorage.get('ChkVideoConferencePage') == "videoConference") {
                $state.go('tab.connectionLost');
            }
        }

        function onOnline() {
            if ($window.localStorage.get('ChkVideoConferencePage') == "videoConference") {
                $state.go('tab.videoConference');
            }
        }

        cordova.plugins.backgroundMode.setDefaults({
            text: $rootScope.alertMsgName
        });
        cordova.plugins.backgroundMode.enable();

        setTimeout(function() {
            if (window.localStorage.getItem("external_load") != null && window.localStorage.getItem("external_load") != "") {
                var EXTRA = {};
                var extQuery = window.localStorage.getItem("external_load").split('?')
                var extQueryOnly = extQuery[1];

                var query = extQueryOnly.split("&");

                for (var i = 0, max = query.length; i < max; i++) {
                    if (query[i] === "") // check for trailing & with no param
                        continue;

                    var param = query[i].split("=");
                    EXTRA[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
                }
                window.localStorage.setItem("external_load", null);
                if (deploymentEnv != 'Single') {
                    if (EXTRA['env'] != "") {
                        var dEnv = EXTRA['env'];
                        if (dEnv.toUpperCase() == "SANDBOX") {
                            deploymentEnv = "Sandbox";
                            apiCommonURL = 'https://sandbox.connectedcare.md';
                        } else if (dEnv.toUpperCase() == "QA") {
                            deploymentEnv = "QA";
                            apiCommonURL = 'https://snap-qa.com';
                        } else if (dEnv.toUpperCase() == "PRODUCTION") {
                            deploymentEnv = "Production";
                            apiCommonURL = 'https://connectedcare.md';
                        } else if (dEnv.toUpperCase() == "STAGE") {
                            deploymentEnv = "Staging";
                            apiCommonURL = 'https://snap-stage.com';
                        } else if (dEnv.toUpperCase() == "DEMO") {
                            deploymentEnv = "Demo";
                            apiCommonURL = 'https://demo.connectedcare.md';
                        }
                    }
                }
                if (EXTRA['token'] != "" && EXTRA['env'] != "") {
                    $state.go('tab.interimpage', {
                        token: EXTRA['token'],
                        hospitalId: EXTRA['hospitalId'],
                        consultationId: EXTRA['consultationId']
                    });
                } else if (EXTRA['env'] != "" && loginPageEnv != 'Single') {
                    $state.go('tab.login');
                }
                /*else if(EXTRA['env'] != "" && loginPageEnv == 'Single'){
                                $state.go('tab.singleTheme');
                            }*/
            }
        }, 2000);
        $ionicPlatform.on('resume', function() {
            setTimeout(function() {
                if (window.localStorage.getItem("external_load") != null && window.localStorage.getItem("external_load") != "") {
                    var EXTRA = {};
                    var extQuery = window.localStorage.getItem("external_load").split('?')
                    var extQueryOnly = extQuery[1];

                    var query = extQueryOnly.split("&");

                    for (var i = 0, max = query.length; i < max; i++) {
                        if (query[i] === "") // check for trailing & with no param
                            continue;

                        var param = query[i].split("=");
                        EXTRA[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
                    }
                    window.localStorage.setItem("external_load", null);
                    if (deploymentEnv != 'Single') {
                        if (EXTRA['env'] != "") {
                            var dEnv = EXTRA['env'];
                            if (dEnv.toUpperCase() == "SANDBOX") {
                                deploymentEnv = "Sandbox";
                                apiCommonURL = 'https://sandbox.connectedcare.md';
                            } else if (dEnv.toUpperCase() == "QA") {
                                deploymentEnv = "QA";
                                apiCommonURL = 'https://snap-qa.com';
                            } else if (dEnv.toUpperCase() == "PRODUCTION") {
                                deploymentEnv = "Production";
                                apiCommonURL = 'https://connectedcare.md';
                            } else if (dEnv.toUpperCase() == "STAGE") {
                                deploymentEnv = "Staging";
                                apiCommonURL = 'https://snap-stage.com';
                            } else if (dEnv.toUpperCase() == "DEMO") {
                                deploymentEnv = "Demo";
                                apiCommonURL = 'https://demo.connectedcare.md';
                            }
                        }
                    }
                    if (EXTRA['token'] != "" && EXTRA['env'] != "") {
                        $state.go('tab.interimpage', {
                            token: EXTRA['token'],
                            hospitalId: EXTRA['hospitalId'],
                            consultationId: EXTRA['consultationId']
                        });
                    } else if (EXTRA['env'] != "" && loginPageEnv != 'Single') {
                        $state.go('tab.login');
                    }
                    /*else if(EXTRA['env'] != "" && loginPageEnv == 'Single'){
                                       $state.go('tab.singleTheme');
                                   }*/
                }
            }, 2000);
        });
/*
 $ionicPlatform.registerBackButtonAction(function (e) {
              if ($ionicHistory.backView()) {
                   $ionicHistory.goBack();
               } else {
                   navigator.app.exitApp();
                 }
               e.preventDefault();
               return false;
           }, 101);*/

    //    });




    });

})




.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
   // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content):/);
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
                    templateUrl: 'templates/tab-singleTheme.html',
                    controller: 'singleHospitalThemeCtrl'
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

    .state('tab.userAccount', {
        url: '/userAccount',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-userAccount.html',
                controller: 'userAccountCtrl'
            }
        }
    })

    .state('tab.healthinfo', {
        url: '/healthinfo',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-healthinfo.html',
                controller: 'healthinfoController'
            }
        }
    })

    .state('tab.userAppointment', {
            url: '/userAppointment',
            views: {
                'tab-login': {
                    templateUrl: 'templates/tab-userAppointment.html',
                    controller: ''
                }
            }
        })
    /*
     .state('tab.relateduseroptions', {
            url: '/relateduseroptions',
            views: {
                'tab-login': {
                    templateUrl: 'templates/tab-relateduseroptions.html',
                    controller: ''
                }
            }
        })*/
        .state('tab.addUser', {
            url: '/addUser',
            views: {
                'tab-login': {
                    templateUrl: 'templates/tab-addUser.html',
                    controller: 'newuserController'
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


    .state('tab.relatedusers', {
        url: '/relatedusers',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-relatedusers.html',
                controller: 'relateduserController'
            }
        }
    })

/*    .state('tab.removerelatedUsers', {
        url: '/removerelatedUsers',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-removerelatedUsers.html',
                controller: 'removeuserController'
            }
        }
    })*/

    .state('tab.appointmentpatientdetails', {
        url: '/appointmentpatientdetails',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-appointmentpatientdetails.html',
                controller: 'patientCalendarCtrl'
            }
        }
    })

    .state('tab.profileoption', {
        url: '/profileoption',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-profileoption.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('tab.consultations', {
        url: '/consultations',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-consultations.html',
                controller: 'consultationController'
            }
        }
    })

    .state('tab.reports', {
        url: '/reports',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-reports.html',
                controller: 'consultationController'
            }
        }
    })

    .state('tab.missedConsultAppoint', {
        url: '/missedConsultAppoint',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-missedConsultAppoint.html',
                controller: 'consultationController'
            }
        }
    })

    .state('tab.addnewuser', {
        url: '/addnewuser',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-addnewuser.html',
                controller: 'addnewuserController'
            }
        }
    })

    .state('tab.addnewdependent', {
        url: '/addnewdependent',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-addnewdependent.html',
                controller: 'addnewdependentController'
            }
        }
    })


    .state('tab.consultationSearch', {
        url: '/consultationSearch',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-consultationSearch.html',
                controller: 'consultationController'

            }
        }
    })

    /*.state('tab.patientappointmentdetails', {
       url: '/patientappointmentdetails',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-patientappointmentdetails.html',
        controller: ''
      }
      }
  })*/


    .state('tab.currentmedicationsearch', {
        url: '/currentmedicationsearch',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-currentmedicationsearch.html',
                controller: 'healthinfocontroller'
            }
        }
    })

  /*  .state('tab.check', {
        url: '/check',
        views: {
            'tab-login': {
                templateUrl: 'templates/tab-check.html',
                controller: 'checkController'
            }
        }
    })
*/


    // if none of the above states are matched, use this as the fallback tab-chooseEnvironment

    if (deploymentEnv == "Multiple") {
        $urlRouterProvider.otherwise('/tab/chooseEnvironment');
    } else if (deploymentEnv == "Single") {
        $urlRouterProvider.otherwise('/tab/singleTheme');
        // if(cobrandApp == 'Hello420')
        // 	$urlRouterProvider.otherwise('/tab/singleTheme');
        // else
        // 	$urlRouterProvider.otherwise('/tab/loginSingle');
    } else {
        $urlRouterProvider.otherwise('/tab/login');
    }

});

function generateTextImage(text, bgcolor){
    if(!bgcolor){
        bgcolor = 'f54f2b';
    }
    bgcolor = bgcolor.replace('#', '');
    return "https://placeholdit.imgix.net/~text?txtsize=120&txtclr=ffffff&w=200&h=200&bg=" + bgcolor + "&txt=" + text;
}

function getInitialForName(name){
    var initial = "";
    if(name){
        name = name.replace('  ', ' ');
        name = name.trim()
        var names = name.split(' ');
        initial = initial + names[0].substring(0, 1);
        if(names[1])
            initial = initial + names[1].substring(0, 1);
    }
    return initial;
}

function getOnlyPhoneNumber(phoneNumber){
    return phoneNumber.substring(phoneNumber.length-10, phoneNumber.length);
}

function formatHeightVal(height){
    var h = height.split('.');
    var hv = h[0] + "|";
    if(h[1])
        hv = hv + h[1];
    else
        hv = hv + "0";
    return hv;
}
//snapmdconnectedcare://?token=RXC5PBj-uQbrKcsoQv3i6EY-uxfWrQ-X5RzSX13WPYqmaqdwbLBs2WdsbCZFCf_5jrykzkpuEKKdf32bpU4YJCvi2XQdYymvrjZQHiAb52G-tIYwTQZ9IFwXCjf-PRst7A9Iu70zoQgPrJR0CJMxtngVf6bbGP86AF2kiomBPuIsR00NISp2Kd0I13-LYRqgfngvUXJzVf703bq2Jv1ixBl_DRUlWkmdyMacfV0J5itYR4mXpnjfdPpeRMywajNJX6fAVTP0l5KStKZ3-ufXIKk6l5iRi6DtNfxIyT2zvd_Wp8x2nOQezJSvwtrepb34quIr5jSB_s3_cv9XE6Sg3Rtl9qbeKQB2gfU20WlJMnOVAoyjYq36neTRb0tdq6WeWo1uqzmuuYlepxl2Tw5BaQ&hospitalId=126&consultationId=
