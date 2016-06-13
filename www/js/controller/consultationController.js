angular.module('starter.controllers')
.controller('consultationController', function($scope,$ionicSideMenuDelegate, $ionicPlatform, $interval,  $rootScope, $state, LoginService,$stateParams,$location,$ionicScrollDelegate,$log, $ionicPopup,ageFilter,$window, $filter) {
  $ionicPlatform.registerBackButtonAction(function (event, $state) {
        if ( ($rootScope.currState.$current.name=="tab.userhome") ||
			  ($rootScope.currState.$current.name=="tab.addCard") ||
			  ($rootScope.currState.$current.name=="tab.submitPayment") ||
			  ($rootScope.currState.$current.name=="tab.waitingRoom") ||
			 ($rootScope.currState.$current.name=="tab.receipt") ||
             ($rootScope.currState.$current.name=="tab.videoConference") ||
			  ($rootScope.currState.$current.name=="tab.connectionLost") ||
			 ($rootScope.currState.$current.name=="tab.ReportScreen")
            ){
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states.
                // Do nothing here to disable H/W back button.
            }else if($rootScope.currState.$current.name=="tab.login"){
                navigator.app.exitApp();
			}else if($rootScope.currState.$current.name=="tab.loginSingle"){
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

  $scope.pastshow=true;
  $scope.missedshow=false;
  $scope.droppedshow=false;
  $scope.isdiplay = false;
  $scope.showsearch = function() {
  $scope.isdiplay = !$scope.isdiplay;

  }
  $rootScope.passedsearchconsult=function(){
   $rootScope.passededconsultants();
    var myEl = angular.element(document.querySelector('#passed'));
    myEl.removeClass('btnextcolor');
    myEl.addClass('btcolor');
    var myEl = angular.element(document.querySelector('#missed'));
    myEl.removeClass('btcolor').css('color', '#11c1f3');
    myEl.addClass('btnextcolor');
    var myEl = angular.element(document.querySelector('#dropped'));
    myEl.removeClass('btcolor').css('color', '#11c1f3');
    myEl.addClass('btnextcolor');
/*
    var params = {
        accessToken: $rootScope.accessToken,
       patientId: $rootScope.patientId
       statusId : 72,
                success: function(data) {
                  $scope.listOfConsultations = JSON.stringify(data, null, 2);
                },
                error: function(data) {
                  $scope.listOfConsultations = 'Error getting List Of Consultations';
                }
              };
              LoginService.getListOfPassedconsultations(params);
*/


    $scope.pastshow=true;
    $scope.missedshow=false;
    $scope.droppedshow=false;
  }
  $rootScope.missedconsult=function(){

     var now = new Date();
     var duedate = new Date(now);
     var stdate=duedate.setDate(now.getDate() - 365);
     var start= new Date(stdate);
     var day=start.getDate();
     var mnth=start.getMonth()+1;
  //   var year=start.getFullYear();
  var year=2000;
     /*if(mnth<10){
        var smonth="0"+mnth;
      }
      else{
        var smonth=mnth;
      }
      if(day<10){
        var sdate="0"+day;
      }
      else{
        var sdate=day;
      }*/
      var smonth="0"+"2";
      var sdate="0"+"1";
   $scope.startDate=year+"-"+smonth+"-"+sdate+"T"+"00"+":"+"00"+":"+"00.000";
  //  $scope.startDate=2000-02-01T00:00:00.000;
      var eddate=duedate.setDate(now.getDate());

      var end= new Date(eddate);
      var eday=end.getDate();
      var emnth=end.getMonth()+1;
      //var eyear=end.getFullYear();
        var eyear=2016;
          var emonth="0"+"6";
          var edate="0"+"9";
      var time=end.getHours();
      var mints=end.getMinutes();
      var sec=end.getMilliseconds();
    /*  if(emnth<10){
        var emonth="0"+emnth;
      }
      else{
        var emonth=emnth;
      }
      if(eday<10){
        var edate="0"+eday;
      }
      else{
        var edate=eday;
      }*/
    //  $scope.endDate=eyear+"-"+emonth+"-"+edate+"T"+time+":"+mints+":"+sec;
        $scope.endDate=eyear+"-"+emonth+"-"+edate+"T"+"09"+":"+"03"+":"+"07.000";
    //  $scope.endDate=2016-06-09T09:03:07.000,
    var params = {

       accessToken: $rootScope.accessToken,
       startDate:$scope.startDate,
       endDate:$scope.endDate,
       appointmentStatusCodes :1,
        success: function (data) {
        $rootScope.Missedconsultations= data.data;
 var missedconsultsdata=$rootScope.Missedconsultations;


        var totval=_.uniq(_.pluck(missedconsultsdata,'patientId'));

        _.each(totval,function(patientId){

				 $rootScope.totlist=[];
				var paiddetail =_.where(missedconsultsdata,{patientId:patientId});
        var now = new Date();
        var start= new Date(now );
         var day=start.getDate();
         var mnth=start.getMonth()+1;
         var year=start.getFullYear();
        if(mnth<10){
                var smonth="0"+mnth;
              }
              else{
                var smonth=mnth;
              }
              if(day<10){
                var sdate="0"+day;
              }
              else{
                var sdate=day;
              }
        var today=year+"-"+smonth+"-"+sdate;
        var packed={};
        _.each(missedconsultsdata,function(allendtime){
          var edtime=allendtime.endTime;
          var asd=edtime.split('T');
          var enddate=asd[0];
					if(enddate<today){

              var astime=asd[1].split('+');
              var newt=astime[0].split(':');
              var time=newt[0]+":"+newt[1];
              var asds=allendtime.participants;
              var patientdata=_.where(asds,{participantTypeCode:1});
              var drdata=_.where(asds,{participantTypeCode:2});
              var patimg=patientdata[0].person;
              var photo=_.pick(patimg,'photoUrl');
              var patphoto= _.values(photo);
              if(drdata.length>0){
                var drlist=drdata[0].person.name;
                var nlist=_.pick(drlist,'given');
                var drname=_.values(nlist);
              }
               else{
                 var drname="";
               }
               packed.photo=patphoto;
               packed.namelist=drname;
               packed.enddate=enddate;
               packed.time=time;
					}

              $rootScope.totlist.push(packed);
				});

        return $rootScope.totlist;
});

    /*  var filtered = [];
          angular.forEach(missedconsultsdata[0], function (sdates) {
        var end=sdates.endTime;
        var asd=end.split('T');
        var enddate=asd[0];
                    if (enddate == today) {
                      filtered.push(sdates);
        }
      });*/



        },
        error: function (data) {
        $scope.listOfConsultations = 'Error getting List Of Consultations';
        }
    };
   LoginService.getListOfMissedConsultation(params);









    var myEl = angular.element( document.querySelector( '#missed' ) );
    myEl.addClass('btcolor');
    myEl.removeClass('btnextcolor');
    var myEl = angular.element( document.querySelector( '#passed' ) );
    myEl.removeClass('btcolor').css('color','#11c1f3');
    myEl.addClass('btnextcolor');
    var myEl = angular.element(document.querySelector('#dropped'));
    myEl.removeClass('btcolor').css('color', '#11c1f3');
    myEl.addClass('btnextcolor');
    $scope.pastshow=false;
    $scope.missedshow=true;
    $scope.droppedshow=false;
  }
  $rootScope.droppedconsult=function(){

    if ($rootScope.accessToken == 'No Token') {
   alert('No token.  Get token first then attempt operation.');
   return;
 }
    var params = {
       patientId: $rootScope.patientId,
       accessToken: $rootScope.accessToken,
       statusId :81,
        success: function (data) {
        $rootScope.Droppedconsultations= data.data;

        },
        error: function (data) {
        $scope.listOfConsultations = 'Error getting List Of Consultations';
        }
    };
   LoginService.getListOfDroppedConsultations(params);


    var myEl = angular.element( document.querySelector( '#dropped' ) );
    myEl.addClass('btcolor');
    myEl.removeClass('btnextcolor');
    var myEl = angular.element( document.querySelector( '#passed' ) );
    myEl.removeClass('btcolor').css('color','#11c1f3');
    myEl.addClass('btnextcolor');
    var myEl = angular.element(document.querySelector('#missed'));
    myEl.removeClass('btcolor').css('color', '#11c1f3');
    myEl.addClass('btnextcolor');
    $scope.pastshow=false;
    $scope.missedshow=false;
    $scope.droppedshow=true;
  }
  $scope.consultsearch=function(){
    $rootScope.passedsearchconsult();
    $state.go('tab.consultationSearch');
  }
});
