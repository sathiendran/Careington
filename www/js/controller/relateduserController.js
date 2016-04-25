angular.module('starter.controllers')
.controller('relateduserController', function($scope, $ionicPlatform, $interval, $ionicSideMenuDelegate, $rootScope, $state, LoginService,$stateParams,$location,$ionicScrollDelegate,$log, $ionicPopup,ageFilter) {
  $ionicPlatform.registerBackButtonAction(function(event, $state) {
      if (($rootScope.currState.$current.name === "tab.userhome") ||
          ($rootScope.currState.$current.name === "tab.addCard") ||
          ($rootScope.currState.$current.name === "tab.submitPayment") ||
          ($rootScope.currState.$current.name === "tab.waitingRoom") ||
          ($rootScope.currState.$current.name === "tab.receipt") ||
          ($rootScope.currState.$current.name === "tab.videoConference") ||
          ($rootScope.currState.$current.name === "tab.connectionLost") ||
          ($rootScope.currState.$current.name === "tab.ReportScreen")
      ) {
          // H/W BACK button is disabled for these states (these views)
          // Do not go to the previous state (or view) for these states.
          // Do nothing here to disable H/W back button.
      } else if ($rootScope.currState.$current.name === "tab.login") {
          navigator.app.exitApp();
      } else if ($rootScope.currState.$current.name === "tab.loginSingle") {
          navigator.app.exitApp();
      } else if ($rootScope.currState.$current.name === "tab.cardDetails") {
          var gSearchLength = $('.ion-google-place-container').length;
          if (($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) === 'block') {
              $ionicBackdrop.release();
              $(".ion-google-place-container").css({
                  "display": "none"
              });
          } else {
              $(".ion-google-place-container").css({
                  "display": "none"
              });
              navigator.app.backHistory();
          }
      } else {
          navigator.app.backHistory();
      }
  }, 100);

  var checkAndChangeMenuIcon;
  $interval.cancel(checkAndChangeMenuIcon);
  $rootScope.checkAndChangeMenuIcon = function() {
          if (!$ionicSideMenuDelegate.isOpen(true)) {
              if ($('#BackButtonIcon').hasClass("ion-close")) {
                  $('#BackButtonIcon').removeClass("ion-close");
                  $('#BackButtonIcon').addClass("ion-navicon-round");
              }
          } else {
              if ($('#BackButtonIcon').hasClass("ion-navicon-round")) {
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
      if (checkAndChangeMenuIcon) {
          $interval.cancel(checkAndChangeMenuIcon);
      }
      if ($state.current.name !== "tab.login" && $state.current.name !== "tab.loginSingle") {
          checkAndChangeMenuIcon = $interval(function() {
              $rootScope.checkAndChangeMenuIcon();
          }, 300);
      }
  };



     $scope.showdetails = true;

     $scope.showarchieve=false;
     $scope.allval=true;
     $scope.userdata=false;
     $scope.dependentshide=true;
     $scope.tabview=false;
     $scope.moretab=false;
     $scope.viewunauthorized=false;
     $scope.authorizedview=false;
     $scope.moredetails = function() {
     $scope.showdetails = false;
     $scope.showarchieve = true;
     $scope.usersearchinfocontent=false;
     $scope.userinfoshow=false;
     $scope.userdone=false;
     $scope.useradd=false;
     $scope.userinfosubheader=false;
     $scope.usersearchsubheader=false;
     $scope.usertab=false;
    };

      $scope.userdetails = function() {
          $scope.tabview=false;
           $scope.newarchieve = true;
    };
    $scope.archievedetails=function(){
          $scope.showarchieve=false;
          $scope.showdetails = true;
    };

    $scope.archieve=function(){
          $scope.newarchieve=true;
        //  $scope.showdnewetails = false;



          var confirmPopup = $ionicPopup.show({

     title: "<a class='item-avatar'>  <img src='img/patient.png'><span><span class='fname'><b>Sarah</b></span> <span class='sname'>Pradesh</span></span></a> ",
     subTitle:"<p class='fontcolor'>Female.16 Step-Daughter</p>",
  //   template:'<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
     templateUrl: 'templates/archiveTemplate.html',

     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Archieve</b>',
         type: 'button-assertive',
       },
     ],
      });
     confirmPopup.then(function(res) {
       if(res) {

       } else {
         $scope.showdnewetails=false;
          $scope.allval=false;
       }


   });

    };
    $scope.showtab=function(tabview){
         $scope.tabView = true;
         $scope.moretab = false;
        $scope.tabWithPatientId = tabview;
        if(typeof $scope.tabview === 'undefined') {
          $scope.tabview = false;
        }
         $scope.tabview = $scope.tabview === false ? true: false;

    };

    $scope.moreclickval=function(tabview){
         $scope.tabView = false;
         $scope.tabWithPatientId = tabview;
         $scope.moretab=true;
    }

    $scope.hidemoretab=function(){
       $scope.moretab = false;
       $scope.tabView = true;
    }
   $scope.authorizeduser=function(){
    var myEl = angular.element( document.querySelector( '#authorizeddiv' ));
     myEl.removeClass('fadediv');
    //  $scope.viewunauthorized = $scope.viewunauthorized === false ? true: false;

     $scope.viewunauthorized=true;
     $scope.authorizedview=false;
   }


    $scope.addauthorized=function(){
        $scope.viewunauthorized=false;
        $scope.authorizedview=true;
    }


     $scope.showPopup = function() {

   $scope.data = {}

   var myPopup = $ionicPopup.show({

     title: "<a class='item-avatar'>  <img src='img/patient.png'><span><span class='fname'><b>Sarah</b></span> <span class='sname'>Pradesh</span></span></a> ",
     subTitle:"<p class='fontcolor'>Female.16 Step-Daughter</p>",
  //   template:'<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
     templateUrl: 'templates/popupTemplate.html',
     scope: $scope,
     buttons: [
       { text: '<b class="fonttype">Cancel</b>' },
       {
         text: '<b class="fonttype">Confirm</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.Confirm) {
                $scope.authorizedview=false;
                 myPopup.close();
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {

           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });

  };

    $scope.userslist=function(){

         var myEl = angular.element( document.querySelector( '#users' ) );
             myEl.addClass('btcolor');
             myEl.removeClass('btnextcolor');
         var myEl = angular.element( document.querySelector( '#dependents' ) );
             myEl.removeClass('btcolor').css('color','#11c1f3');
             myEl.addClass('btnextcolor');

             var myEl = angular.element( document.querySelector( '#couserlist' ) );
          myEl.addClass('couses');
          myEl.removeClass('dependusers');

           var myEl = angular.element( document.querySelector( '#dependuserlist' ) );
            myEl.removeClass('couses');
            myEl.addClass('dependusers');
    };


    $scope.dependentslist=function(){
        var myEl = angular.element( document.querySelector( '#dependents' ) );
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
        var myEl = angular.element( document.querySelector( '#users' ) );
            myEl.removeClass('btcolor').css('color','#11c1f3');
            myEl.addClass('btnextcolor');
          var myEl = angular.element( document.querySelector( '#dependuserlist' ) );
          myEl.addClass('couses');
          myEl.removeClass('dependusers');

           var myEl = angular.element( document.querySelector( '#couserlist' ) );
            myEl.removeClass('couses');
            myEl.addClass('dependusers');
            $scope.doGetAccountDependentDetails();
    }


    $scope.doGetAccountDependentDetails = function() {
      var params = {
            accessToken: $rootScope.accessToken,
           success: function(data) {
            // $scope.listOfDependents = JSON.stringify(data, null, 2);
             $rootScope.listOfAccountDependents = [];
             angular.forEach(data.data, function(index, item) {
               $rootScope.listOfAccountDependents.push({
                 'addresses': index.addresses,
                 'profileImagePath': $rootScope.APICommonURL + index.profileImagePath,
                 'birthdate': ageFilter.getDateFilter(index.birthdate),
                 'guardianFirstName': index.guardianFirstName,
                 'guardianLastName': index.guardianLastName,
                 'guardianName': index.guardianName,
                 'isAuthorized': index.isAuthorized,
                 'patientFirstName': index.patientFirstName,
                 'patientId': index.patientId,
                 'tabPatientId': 'tab' + index.patientId,
                 'patientLastName': index.patientLastName,
                 'patientName': index.patientName,
                 'personId': index.personId,
                 'relationCode': index.relationCode
               });
             });
           },
           error: function(data) {
             $rootScope.serverErrorMessageValidation();
           }
         };
         LoginService.getAccountDependentDetails(params);
    }


});

    /* Relationship Search */
 $scope.alphabet = iterateAlphabet();
      var tmp={};
     function iterateAlphabet()
  {
     var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     var numbers = new Array();
     for(var i=0; i<str.length; i++)
     {
        var nextChar = str.charAt(i);
        numbers.push(nextChar);
     }
     return numbers;
  }
  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
  /* Seach Done*/

    $scope.selectrelation=function(){
       $scope.useradd=true;
       $scope.userdone=true;
       $scope.userinfosubheader=true;
       $scope.usersearchsubheader=true;
       $scope.userinfoshow=true;
       $scope.usersearchinfocontent=true;
       $scope.usertab=true;
    }

    $scope.usersearchdone=function(){
       $scope.useradd=false;
       $scope.userdone=false;
       $scope.userinfosubheader=false;
       $scope.usersearchsubheader=false;
       $scope.userinfoshow=false;
       $scope.usersearchinfocontent=false;
       $scope.usertab=false;
    }

});
