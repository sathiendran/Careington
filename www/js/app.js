

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})




.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $ionicConfigProvider.views.maxCache(0);
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
  
  .state('tab.uersearch', {
    url: '/uersearch',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-uersearch.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
  .state('tab.PatientConcernsSelect', {
    url: '/PatientConcernsSelect',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-PatientConcernsSelect.html',
        controller: 'PatientConcernsSelectCtrl'
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
        controller: 'LoginCtrl'
      }
    }
  })
  
  .state('tab.appoimentDetails', {
    url: '/appoimentDetails',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-appoimentDetails.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
   .state('tab.appoimentDetails_wait', {
    url: '/appoimentDetails_wait',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-appoimentDetails_wait.html',
        controller: 'LoginCtrl'
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
        controller: 'ConsentTreatCtrl'
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
        controller: 'addHealthPlanCtrl'
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
  
  .state('tab.verifyPlan', {
    url: '/verifyPlan',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-verifyPlan.html',
        controller: 'LoginCtrl'
      }
    }
  })
  
    .state('tab.applyPlan', {
    url: '/applyPlan',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-applyPlan.html',
        controller: 'applyPlanCtrl'
      }
    }
  })
  
   .state('tab.addCard', {
    url: '/addCard',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-addCard.html',
        controller: 'addCardCtrl'
      }
    }
  })
  
   .state('tab.consultChargeNoPlan', {
    url: '/consultChargeNoPlan',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-consultChargeNoPlan.html',
        controller: 'consultChargeNoPlanCtrl'
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
  
  .state('tab.verifyCard', {
    url: '/verifyCard',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-verifyCard.html',
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


  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');

});
