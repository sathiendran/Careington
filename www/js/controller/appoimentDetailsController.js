angular.module('starter.controllers')


.controller('appoimentDetailsCtrl', function($scope, $ionicScrollDelegate, htmlEscapeValue, $location, $window, ageFilter, replaceCardNumber, $ionicBackdrop, $ionicPlatform, $interval, $locale, $ionicLoading, $http, $ionicModal, $ionicSideMenuDelegate, $ionicHistory, LoginService, StateLists, CountryList, UKStateList, $state, $rootScope, $stateParams, dateFilter, SurgeryStocksListService, $filter, $timeout, StateList, CustomCalendar, CreditCardValidations) {
    //$state.go('tab.appoimentDetails');

    $ionicPlatform.registerBackButtonAction(function(event, $state) {
        if (($rootScope.currState.$current.name == "tab.userhome") ||
            ($rootScope.currState.$current.name == "tab.addCard") ||
            ($rootScope.currState.$current.name == "tab.submitPayment") ||
            ($rootScope.currState.$current.name == "tab.waitingRoom") ||
            ($rootScope.currState.$current.name == "tab.receipt") ||
            ($rootScope.currState.$current.name == "tab.videoConference") ||
            ($rootScope.currState.$current.name == "tab.connectionLost") ||
            ($rootScope.currState.$current.name == "tab.ReportScreen")
        ) {
            // H/W BACK button is disabled for these states (these views)
            // Do not go to the previous state (or view) for these states.
            // Do nothing here to disable H/W back button.
        } else if ($rootScope.currState.$current.name == "tab.login") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name == "tab.loginSingle") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name === "tab.chooseEnvironment") {
            navigator.app.exitApp();
        } else if ($rootScope.currState.$current.name == "tab.cardDetails") {
            var gSearchLength = $('.ion-google-place-container').length;
            if (($('.ion-google-place-container').eq(gSearchLength - 1).css('display')) == 'block') {
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

  //  document.getElementsByTagName('timer')[0].stop();
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

    $scope.addMinutes = function(inDate, inMinutes) {
        var newdate = new Date();
        newdate.setTime(inDate.getTime() + inMinutes * 60000);
        return newdate;
    }

    $scope.enterWaitingRoom = function(P_img, P_Fname, P_Lname, P_Age, P_Guardian) {
        $rootScope.PatientImageSelectUser = P_img;
        $rootScope.PatientFirstName = P_Fname;
        $rootScope.PatientLastName = P_Lname;
        $rootScope.PatientAge = P_Age;
        $rootScope.appointPatientGuardian = P_Guardian;
        $rootScope.appointmentsPage = true;
        $scope.doCheckExistingConsulatationStatus();
        //$scope.doGetWaitingRoom();
    }
    $scope.doGetWaitingRoom = function() {
        $state.go('tab.waitingRoom');
    }
    if ($rootScope.appointmentDisplay == "test") {
      $timeout(function() {
          document.getElementsByTagName('timer')[0].stop();
          document.getElementsByTagName('timer')[0].start();
      }, 10);
        $("#appointNotes").html($rootScope.appointNotes);
        $rootScope.consultationId = $rootScope.consultationId;
        var getReplaceTime1 = $rootScope.scheduledListDatas.scheduledTime;

        var getReplaceTime = $scope.addMinutes(getReplaceTime1, -30);

        $rootScope.time = new Date(getReplaceTime).getTime();

        $scope.$on('timer-tick', function(event, args) {
            //$timeout(function(){
            if (args.days == 0) {
                $rootScope.hourDisplay = 'initial';
                $rootScope.daysDisplay = 'none';
                $rootScope.dayDisplay = 'none';
            } else if (args.days == 1) {
                $rootScope.daysDisplay = 'none';
                $rootScope.hourDisplay = 'none';
                $rootScope.dayDisplay = 'initial';
            } else if (args.days > 1) {
                $rootScope.daysDisplay = 'initial';
                $rootScope.hourDisplay = 'none';
                $rootScope.dayDisplay = 'none';
            }

            //console.log(args.millis);
            if (args.millis < 600) {
                $rootScope.timeNew = 'none';
                $rootScope.timeNew1 = 'block';
                $('.AvailableIn').hide();
                $('.enterAppoinment').show();
                //$rootScope.timerCOlor = '#E1FCD4';
            } else if (args.millis > 600) {
                $('.AvailableIn').show();
                $('.enterAppoinment').hide();
            }
            /*else if(args.millis < 1800000){
               $('.AvailableIn').hide();
            	$('.enterAppoinment').show();
               $rootScope.timerCOlor = '#E1FCD4';

            }else if(args.millis > 1800000){
              $rootScope.timeNew = 'block';
               $rootScope.timeNew1 = 'none';
            	$('.AvailableIn').show();
            	$('.enterAppoinment').hide();
            }*/
            //},1000);
        });

        $timeout(function() {
              document.getElementsByTagName('timer')[0].stop();
              document.getElementsByTagName('timer')[0].start();
        }, 100);
    }

    var d = new Date();
    //d.setHours(d.getHours() + 12);

    var currentUserHomeDate = CustomCalendar.getLocalTime(d);

    if (getReplaceTime < currentUserHomeDate) {
        $rootScope.timeNew = 'none';
        $rootScope.timeNew1 = 'block';
        $('.AvailableIn').hide();
        $('.enterAppoinment').show();
        $rootScope.timerCOlor = '#E1FCD4';
    } else {
        $rootScope.timeNew = 'block';
        $rootScope.timeNew1 = 'none';
        $('.AvailableIn').show();
        $('.enterAppoinment').hide();
        $rootScope.timerCOlor = '#FEEFE8';
    }

    $scope.showEnterWaitingRoomButton = function() {
        $rootScope.timeNew = 'none';
        $rootScope.timeNew1 = 'block';
        $('.AvailableIn').hide();
        $('.enterAppoinment').show();
    };

    $scope.doGetConcentToTreat = function() {
        if ($scope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        var params = {
            documentType: 2,
            hospitalId: $rootScope.hospitalId,
            success: function(data) {
                $rootScope.concentToTreatPreviousPage = "tab.appoimentDetails";
                $rootScope.concentToTreatContent = htmlEscapeValue.getHtmlEscapeValue(data.data[0].documentText);
                $state.go('tab.ConsentTreat');

            },
            error: function(data) {
                $rootScope.serverErrorMessageValidation();
            }
        };

        LoginService.getConcentToTreat(params);
    }

    $scope.doCheckExistingConsulatationStatus = function() {

        if ($scope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }

        var params = {
            consultationId: $rootScope.consultationId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $scope.existingConsultation = data;
                $rootScope.consultionInformation = data.data[0].consultationInfo;
                //Get Hospital Information
                $rootScope.patientId = $rootScope.appointmentsPatientId;

                if ($rootScope.primaryPatientId != $rootScope.patientId) {
                    $rootScope.PatientGuardian = $rootScope.appointPatientGuardian;
                }

                //alert($rootScope.patientId);
                $rootScope.consultationAmount = $rootScope.consultionInformation.consultationAmount;
                $rootScope.copayAmount = $rootScope.consultationAmount;

                $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                if (!angular.isUndefined($rootScope.consultationStatusId)) {
                    if ($rootScope.consultationStatusId == 71) {
                      $rootScope.doGetScheduledConsulatation();
                        navigator.notification.alert(
                            'Your consultation is already started on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId == 72) {
                      $rootScope.doGetScheduledConsulatation();
                        navigator.notification.alert(
                            'Your consultation is already ended.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId == 79) {
                      $rootScope.doGetScheduledConsulatation();
                        navigator.notification.alert(
                            'Your consultation is cancelled.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId == 80) {
                      $rootScope.doGetScheduledConsulatation();
                        navigator.notification.alert(
                            'Your consultation is in progress on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else {
                        //$state.go('tab.ConsentTreat');
                        //$scope.doGetWaitingRoom();
                        $scope.doGetConcentToTreat();

                    }

                }


            },
            error: function(data) {
                $rootScope.serverErrorMessageValidation();
            }
        };

        LoginService.getExistingConsulatation(params);

    }

    $scope.$on("callAppointmentConsultation", function(event, args) {
        //$scope.errorMsg = args.errorMsg;
        //$rootScope.Validation( $scope.errorMsg);
        $scope.doGeAppointmentExistingConsulatation();
    });

    $rootScope.doGetIndividualScheduledDetails = function() {
        if ($rootScope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        $rootScope.appointmentPatientId = '';
        $rootScope.individualScheduledConsultationList = [];
        var params = {
            patientId: $rootScope.patientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                if (data != "") {
                    $scope.individualScheduledConsultationList = data.data[0];
                    if ($rootScope.patientId == $rootScope.primaryPatientId) {
                        $rootScope.P_isAuthorized = true;
                    } else {
                        if (data.data[0].account.isAuthorized == "T" || data.data[0].account.isAuthorized == true || data.data[0].account.isAuthorized == "Y") {
                            $rootScope.P_isAuthorized = true;
                            //  }else if(P_isAuthorized == "F" || P_isAuthorized == false) {
                        } else {
                            $rootScope.P_isAuthorized = false;
                        }
                    }

                    var date = new Date($scope.individualScheduledConsultationList.dob);
                    //$rootScope.userDOB = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                    $rootScope.userDOB = $filter('date')(date, "yyyy-MM-dd");

                    if ($rootScope.userDOB !== "" && !angular.isUndefined($rootScope.userDOB)) {
                        var ageDifMs = Date.now() - new Date($rootScope.userDOB).getTime(); // parse string to date
                        var ageDate = new Date(ageDifMs); // miliseconds from epoch
                        $scope.userAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                        if ($scope.userAge === 0) {
                            $rootScope.concentToTreatPreviousPage = "tab.intakeBornHistory";
                            $rootScope.userAgeForIntake = 8;
                        } else {
                            $rootScope.concentToTreatPreviousPage = "tab.CurrentMedication";
                            $rootScope.userAgeForIntake = 7;
                        }
                        if ($scope.individualScheduledConsultationList.account.patientId !== $rootScope.primaryPatientId) {
                          if($rootScope.userDOB.indexOf('T') == -1) {
                            $rootScope.PatientAge = $rootScope.userDOB + "T00:00:00Z";
                          }
                        }
                    }
                    if ($scope.individualScheduledConsultationList.gender == 'M' || $scope.individualScheduledConsultationList.gender == 'Male') {
                        $rootScope.userGender = "Male";
                        $rootScope.isCheckedMale = true;
                    } else if ($scope.individualScheduledConsultationList.gender == 'F' || $scope.individualScheduledConsultationList.gender == 'Female') {
                        $rootScope.userGender = "Female";
                        $rootScope.isCheckedFemale = true;
                    } else {
                      $rootScope.userGender = '';
                      $rootScope.isCheckedFemale = '';
                    }


                    if($scope.individualScheduledConsultationList.account.patientId !== $rootScope.primaryPatientId) {
                      if (!angular.isUndefined($scope.individualScheduledConsultationList.account.relationship)) {
                          $rootScope.patRelationShip =  $scope.individualScheduledConsultationList.account.relationship;
                      } else {
                          $rootScope.patRelationShip = '';
                      }
                    } else {
                        $rootScope.patRelationShip = '';
                    }

                    $rootScope.getIndividualScheduledList = [];
                    $rootScope.individualScheduleParticipants = [];
                    var currentDate = new Date();
                    currentDate = $scope.addMinutes(currentDate, -30);
                    //var getDateFormat = $filter('date')(currentDate, "yyyy-MM-ddTHH:mm:ss");


                    angular.forEach($scope.individualScheduledConsultationList.appointments, function(index, item) {
                        if (currentDate < CustomCalendar.getLocalTime(index.startTime)) {


                          var apptdate=index.startTime
                            var dataw=Date.parse(apptdate);
                            var newda=new Date(dataw);
                            var splitmnth=newda.getMonth()+1;
                            var splitdate=newda.getDate();
                            var splityear=newda.getFullYear();
                            var Aptdate=splityear+"/"+splitmnth+"/"+splitdate;
                            $scope.formatscheduleddate = moment(Aptdate, 'YYYY/MM/DD').format('MMM D');
                            $rootScope.getIndividualScheduledList.push({
                                'scheduledTime': CustomCalendar.getLocalTime(index.startTime),
                                'appointmentId': index.appointmentId,
                                'appointmentStatusCode': index.appointmentStatusCode,
                                'appointmentTypeCode': index.appointmentTypeCode,
                                'availabilityBlockId': index.availabilityBlockId,
                                'endTime': index.endTime,
                                'intakeMetadata': angular.fromJson(index.intakeMetadata),
                                'participants': angular.fromJson(index.participants),
                                'waiveFee': index.waiveFee,
                                'scheduledDate':$scope.formatscheduleddate
                            });
                            angular.forEach(index.participants, function(index, item) {
                                $rootScope.individualScheduleParticipants.push({
                                    'appointmentId': index.appointmentId,
                                    'attendenceCode': index.attendenceCode,
                                    'participantId': index.participantId,
                                    'participantTypeCode': index.participantTypeCode,
                                    'person': angular.fromJson(index.person),
                                    'referenceType': index.referenceType,
                                    'status': index.status
                                });
                            })
                        }
                    });

                    $rootScope.individualScheduledList = $filter('filter')($filter('orderBy')($rootScope.getIndividualScheduledList, "scheduledTime"), "a");

                    $rootScope.getIndividualScheduleDetails = $rootScope.individualScheduledList;
                    $rootScope.doGetScheduledConsulatation();
                    if($rootScope.getIndividualScheduleDetails.length==0){
                      navigator.notification.alert(
                          'Your appointment is no longer available.', // message
                          function() {
                              $state.go('tab.userhome');
                              return;
                          },
                          $rootScope.alertMsgName, // title
                          'Done' // buttonName
                      );
                    }

                    var d = new Date();
                    d.setHours(d.getHours() + 12);
                    var currentUserHomeDate = CustomCalendar.getLocalTime(d);
                    $rootScope.individualNextAppointmentDisplay = 'none';
                    $rootScope.individualwithoutAppointmentDisplay = 'block';
                    $rootScope.accountClinicianFooter = 'block';
                    $rootScope.accountStyle = "";
                    $rootScope.userAccContent = "";
                    if ($rootScope.individualScheduledList != '') {
                        //var getReplaceTime = ($rootScope.scheduledList[0].scheduledTime).replace("T"," ");
                        //var currentUserHomeDate = currentUserHomeDate.replace("T"," ");
                        $scope.getScheduledList = $rootScope.individualScheduledList[0];
                         $rootScope.GoToappoimentDetailsFromUserHome($scope.getScheduledList,"AppointmentPage");
                        var getReplaceTime = $rootScope.individualScheduledList[0].scheduledTime;
                        var currentUserHomeDate = currentUserHomeDate;


                        if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {
                            console.log('scheduledTime <= getTwelveHours UserHome');
                             $("#appointNotes").html($rootScope.appointNotes);
                            //$rootScope.nextAppointmentDisplay = 'block';
                            //  $rootScope.userHomeRecentAppointmentColor = '#FEEFE8';
                            $rootScope.accountClinicianFooter = 'none';
                            $rootScope.individualNextAppointmentDisplay = 'block';
                            $rootScope.individualwithoutAppointmentDisplay = 'none';
                            //$rootScope.accountStyle = "AppointDisplay" + $rootScope.deviceName;
                            $rootScope.accountStyle = "AppointNone" + $rootScope.deviceName;
                            $rootScope.userAccContent = "userAccContent" + $rootScope.deviceName;
                            $rootScope.appointmentPatientId = $rootScope.patientId;
                            var beforAppointmentTime = getReplaceTime;
                            var doGetAppointmentTime = $scope.addMinutes(beforAppointmentTime, -30);


                            if ((new Date(doGetAppointmentTime).getTime()) <= (new Date().getTime())) {

                            }
                        }

                        var getReplaceTime1 = $rootScope.individualScheduledList[0].scheduledTime;
                        var getReplaceTime = $scope.addMinutes(getReplaceTime1, -30);
                        var currentUserHomeDate = currentUserHomeDate;
                        if ((new Date(getReplaceTime).getTime()) <= (new Date(currentUserHomeDate).getTime())) {

                            $rootScope.time = new Date(getReplaceTime).getTime();

                            $timeout(function() {
                                document.getElementsByTagName('timer')[0].stop();
                                document.getElementsByTagName('timer')[0].start();
                            }, 10);

                            $scope.$on('timer-tick', function(event, args) {
                                if (args.days == 0) {
                                    $rootScope.hourDisplay = 'initial';
                                    $rootScope.daysDisplay = 'none';
                                    $rootScope.dayDisplay = 'none';
                                } else if (args.days == 1) {
                                    $rootScope.daysDisplay = 'none';
                                    $rootScope.hourDisplay = 'none';
                                    $rootScope.dayDisplay = 'initial';
                                } else if (args.days > 1) {
                                    $rootScope.daysDisplay = 'initial';
                                    $rootScope.hourDisplay = 'none';
                                    $rootScope.dayDisplay = 'none';
                                }


                                if (args.millis < 600) {
                                    $rootScope.timeNew = 'none';
                                    $rootScope.timeNew1 = 'block';
                                    $rootScope.timerCOlor = '#E1FCD4';
                                    $('.AvailableIn').hide();
                                    $('.enterAppoinment').show();
                                } else if (args.millis > 600) {
                                    $rootScope.timeNew = 'block';
                                    $rootScope.timeNew1 = 'none';
                                    $rootScope.timerCOlor = '#FDD8C5';
                                    $('.AvailableIn').show();
                                    $('.enterAppoinment').hide();
                                }
                            });
                            $rootScope.time = new Date(getReplaceTime).getTime();

                            var d = new Date();

                            var currentUserHomeDate = CustomCalendar.getLocalTime(d);

                            if (getReplaceTime < currentUserHomeDate) {
                                $rootScope.timerCOlor = '#E1FCD4';
                                $('.AvailableIn').hide();
                                $('.enterAppoinment').show();
                            }
                        } else if ((new Date(getReplaceTime).getTime()) >= (new Date(d).getTime())) {
                            $rootScope.timerCOlor = 'transparent';
                        }
                    }
                }
            },
            error: function(data) {
                $rootScope.serverErrorMessageValidation();
            }
        };

        LoginService.getIndividualScheduledConsulatation(params);
    }





 $scope.doRefreshAccountdetails= function() {
    $rootScope.doGetIndividualScheduledDetails();
        $timeout(function() {
          $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
        $scope.$apply();
    };



    $scope.doGeAppointmentExistingConsulatation = function() {
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
            success: function(data) {
                $scope.existingConsultation = data;
                //$rootScope.doGetIndividualScheduledConsulatation();
                $rootScope.consultionInformation = data.data[0].consultationInfo;
                $rootScope.consultationStatusId = $rootScope.consultionInformation.consultationStatus;
                if (!angular.isUndefined($rootScope.consultationStatusId)) {
                    if ($rootScope.consultationStatusId == 71) {
                          $rootScope.doGetScheduledConsulatation();
                        navigator.notification.alert(
                            'Your consultation is already started on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId == 72) {
                        $rootScope.doGetScheduledConsulatation();
                        navigator.notification.alert(
                            'Your consultation is already ended.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId == 79) {
                        $rootScope.doGetScheduledConsulatation();
                        navigator.notification.alert(
                            'Your consultation is cancelled.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    } else if ($rootScope.consultationStatusId == 80) {
                        $rootScope.doGetScheduledConsulatation();
                        navigator.notification.alert(
                            'Your consultation is in progress on other device.', // message
                            function() {
                                $state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                        return false;
                    }

                }


                $rootScope.patientExistInfomation = data.data[0].patientInformation;
                $rootScope.intakeForm = data.data[0].intakeForm;
                $rootScope.assignedDoctorId = $rootScope.consultionInformation.assignedDoctor.id;
                $rootScope.appointmentsPatientDOB = $rootScope.patientExistInfomation.dob;
                $rootScope.appointmentsPatientGurdianName = htmlEscapeValue.getHtmlEscapeValue($rootScope.patientExistInfomation.guardianName);
                $rootScope.appointmentsPatientId = $rootScope.consultionInformation.patient.id;
                $rootScope.appointmentsPatientImage = $rootScope.patientExistInfomation.profileImagePath;
                /*$rootScope.reportScreenPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.intakeForm.concerns[0].customCode.description);
                if(typeof $rootScope.intakeForm.concerns[1] != 'undefined') {
                	$rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.intakeForm.concerns[1].customCode.description);
                } else {
                	$rootScope.reportScreenSecondaryConcern = "None Reported";
                }
                if(typeof $rootScope.consultionInformation.note != 'undefined') {
                	$rootScope.preConsultantNotes = htmlEscapeValue.getHtmlEscapeValue($rootScope.consultionInformation.note);
                } else {
                	$rootScope.preConsultantNotes = '';
                }*/
                $scope.doGetExistingPatientName();
                $rootScope.doGetDoctorDetails();

            },
            error: function(data) {
                $rootScope.serverErrorMessageValidation();
            }
        };

        LoginService.getExistingConsulatation(params);

    }

    $scope.doGetExistingPatientName = function() {
        var params = {
            patientId: $rootScope.appointmentsPatientId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                $rootScope.appointmentsPatientFirstName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].patientName);
                $rootScope.appointmentsPatientLastName = htmlEscapeValue.getHtmlEscapeValue(data.data[0].lastName);
                /*if(data.data[0].profileImagePath === '/images/default-user.jpg' || data.data[0].profileImagePath === '/images/Patient-Male.gif') {
                  var ptInitial = getInitialForName($rootScope.appointmentsPatientFirstName + ' ' + $rootScope.appointmentsPatientLastName);
                  $rootScope.appointmentsPatientImage = generateTextImage(ptInitial, $rootScope.brandColor);
                }else {
                  $rootScope.appointmentsPatientImage = data.data[0].profileImagePath;
                }*/

                if (typeof data.data[0].profileImagePath != 'undefined' && data.data[0].profileImagePath != '') {
                    var hosImage = data.data[0].profileImagePath;
                    if (hosImage.indexOf("http") >= 0) {
                        $rootScope.appointmentsPatientImage = hosImage;
                    } else {
                        $rootScope.appointmentsPatientImage = apiCommonURL + hosImage;
                    }
                } else {
                    var ptInitial = getInitialForName($rootScope.appointmentsPatientFirstName + ' ' + $rootScope.appointmentsPatientLastName);
                    $rootScope.appointmentsPatientImage = generateTextImage(ptInitial, $rootScope.brandColor);
                }

            },
            error: function(data) {
                $rootScope.serverErrorMessageValidation();
            }
        };

        LoginService.getPrimaryPatientLastName(params);
    }

    $rootScope.doGetDoctorDetails = function() {
        $rootScope.doctorGender = '';
        if ($scope.accessToken == 'No Token') {
            alert('No token.  Get token first then attempt operation.');
            return;
        }
        $rootScope.scheduledDoctorDetails = [];
        var params = {
            doctorId: $rootScope.assignedDoctorId,
            accessToken: $rootScope.accessToken,
            success: function(data) {
                //$rootScope.doctorImage = $rootScope.APICommonURL + data.data[0].profileImagePath;
                angular.forEach(data.data, function(index, item) {
                  if (index.gender === 'M') {
                      var docGender = "Male";
                  } else if (index.gender === 'F') {
                      var docGender = "Female";
                  }
                  if (data.data[0].profileImagePath !== '' && typeof data.data[0].profileImagePath!== 'undefined') {
                             $rootScope.DoctorImage = data.data[0].profileImagePath;
                         } else {
                             $rootScope.DoctorImage = apiCommonURL + '/images/default-user.jpg';
                             var ptInitial = getInitialForName(data.data[0].firstName + ' ' + data.data[0].lastName);
                             $rootScope.DoctorImage = generateTextImage(ptInitial, $rootScope.brandColor);
                         }

                    $rootScope.scheduledDoctorDetails.push({
                        /*'businessAddress': index.businessAddress,
                        'firstName': index.firstName,
                        'fullName': index.fullName,
                        'gender': index.gender,
                        'hospitalId': index.hospitalId,
                        'lastName': index.lastName,
                        'medicalLicense': index.medicalLicense,
                        'medicalSpeciality': index.medicalSpeciality,
                        'medicalSchool': index.medicalSchool,
                        'profileImage': index.profileImage,
                        'profileImagePath': index.profileImagePath,
                        'statesLicenced': index.statesLicenced,
                        'subSpeciality': index.subSpeciality*/

                        'dob': index.dob,
                        'firstName': index.firstName,
                        'fullName': index.fullName,
                        'gender': docGender,
                        'profileImagePath': $rootScope.DoctorImage
                    });
                });
                //document.getElementsByTagName('timer')[0].stop();
                //document.getElementsByTagName('timer')[0].start();
                /*if ($rootScope.scheduledDoctorDetails[0].gender === 'M') {
                    $rootScope.doctorGender = "Male";
                } else if ($rootScope.scheduledDoctorDetails[0].gender === 'F') {
                    $rootScope.doctorGender = "Female";
                }*/
                $state.go('tab.appoimentDetails');
            },
            error: function(data) {
                $rootScope.serverErrorMessageValidation();
            }
        };

        LoginService.getDoctorDetails(params);

    }

    if($rootScope.AppointScheduleTime != '') {
      setTimeout(function () {
        $rootScope.timeNew = 'none';
        $rootScope.timeNew1 = 'none';
        $('.AvailableIn').hide();
        $('.enterAppoinment').hide();
        $('.enterAppoinment2').show();
        $(".enterAppoinment2").css("display","block");
      }, $rootScope.AppointScheduleTime);
    } else {
      $rootScope.timeNew = 'none';
      $rootScope.timeNew1 = 'none';
      $('.AvailableIn').hide();
      $('.enterAppoinment').hide();
      $('.enterAppoinment2').show();
      $(".enterAppoinment2").css("display","block");
    }

    //$scope.doGeAppointmentExistingConsulatation();


})
