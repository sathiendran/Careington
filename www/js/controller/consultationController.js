
angular.module('starter.controllers')
    .controller('consultationController', function($scope, $ionicSideMenuDelegate, $ionicPlatform, $interval, $rootScope, $state, LoginService, $stateParams, $location, $ionicScrollDelegate, $log, $ionicPopup, ageFilter, $window, $filter, htmlEscapeValue, $ionicModal) {
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

        $scope.pastshow = true;
        $scope.missedshow = false;
        $scope.droppedshow = false;
        $scope.isdiplay = false;
        $scope.showsearch = function() {
            $scope.isdiplay = !$scope.isdiplay;

        }
        $rootScope.passedconsult = function() {
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

            $scope.pastshow = true;
            $scope.missedshow = false;
            $scope.droppedshow = false;
        }

        $rootScope.missedconsult = function() {


            var now = new Date();
            var duedate = new Date(now);
            var stdate = duedate.setDate(now.getDate() - 365);
            var start = new Date(stdate);
            var day = start.getDate();
            var mnth = start.getMonth() + 1;
            var year = start.getFullYear();
            //  var year=2000;
            if (mnth < 10) {
                var smonth = "0" + mnth;
            } else {
                var smonth = mnth;
            }
            if (day < 10) {
                var sdate = "0" + day;
            } else {
                var sdate = day;
            }
            //  var smonth="0"+"2";
            //  var sdate="0"+"1";
            $scope.startDate = year + "-" + smonth + "-" + sdate + "T" + "00" + ":" + "00" + ":" + "00.000";
            var eddate = duedate.setDate(now.getDate());

            var end = new Date(eddate);
            var eday = end.getDate();
            var emnth = end.getMonth() + 1;
            var eyear = end.getFullYear();

            var time = end.getHours();
            var mints = end.getMinutes();
            var sec = end.getMilliseconds();
            if (emnth < 10) {
                var emonth = "0" + emnth;
            } else {
                var emonth = emnth;
            }
            if (eday < 10) {
                var edate = "0" + eday;
            } else {
                var edate = eday;
            }
            $scope.endDate = eyear + "-" + emonth + "-" + edate + "T" + time + ":" + mints + ":" + sec;

            var params = {

                accessToken: $rootScope.accessToken,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                patientId: $rootScope.patientId,
                appointmentStatusCodes: 1,
                success: function(data) {
                    $scope.Missedconsultations = data.data;
                    $rootScope.missedlist = [];     $rootScope.missedlistReport = [];
                    angular.forEach($scope.Missedconsultations, function(item, index) {
                        var nowDateTime = new Date();
                        var nowDateTimeEightHours = new Date(nowDateTime);
                        nowDateTimeEightHours.setMinutes(nowDateTime.getMinutes() + 15);
                        var todaydatetime = nowDateTimeEightHours.getTime();
                        var patientId=item.patientId;
                        var consultationId=item.consultationId;
                        var edtime = item.endTime;
                        var endtimeEightHours = new Date(edtime);
                        var enddatetime = endtimeEightHours.setMinutes(endtimeEightHours.getMinutes() + 15);
         if($rootScope.patientId==patientId){


                        if (enddatetime < todaydatetime) {
                            var asd = edtime.split('T');
                            var enddate = asd[0];

                            var astime = asd[1].split('+');
                            var newt = astime[0].split(':');
                            var time = newt[0] + ":" + newt[1];
                            var timeString = time;
                            var hourEnd = timeString.indexOf(":");
                            var H = +timeString.substr(0, hourEnd);
                            var h = H % 12 || 12;
                            var ampm = H < 12 ? "AM" : "PM";
                            timeString = h + timeString.substr(hourEnd, 3) + ampm;
                            var missedtime=timeString;
                            var asds = item.participants;
                            var patientdata = _.where(asds, {
                                participantTypeCode: 1
                            });
                            var drdata = _.where(asds, {
                                participantTypeCode: 2
                            });
                            var patimg = patientdata[0].person;
                            var photo = _.pick(patimg, 'photoUrl');
                            var patphoto = _.values(photo);
                            if (drdata.length > 0) {
                                var drlist = drdata[0].person.name;
                                var nlist = _.pick(drlist, 'given');
                                var drname = _.values(nlist);
                                var docname = drname.join();
                            } else {
                                var drname = "";
                            }


                            $rootScope.missedlist.push({
                                'time': missedtime,
                                'docname': docname,
                                'enddate': enddate,
                                'consultationId':consultationId,
                            });

                        }
                      }
   if($rootScope.patientId==patientId && $rootScope.consultationId==consultationId){
     if (enddatetime < todaydatetime) {
         var asd = edtime.split('T');
         var enddate = asd[0];

         var astime = asd[1].split('+');
         var newt = astime[0].split(':');
         var time = newt[0] + ":" + newt[1];
         var asds = item.participants;
         var patientdata = _.where(asds, {
             participantTypeCode: 1
         });
         var drdata = _.where(asds, {
             participantTypeCode: 2
         });
         var patimg = patientdata[0].person;
         var photo = _.pick(patimg, 'photoUrl');
         var patphoto = _.values(photo);
         if (drdata.length > 0) {
             var drlist = drdata[0].person.name;
             var nlist = _.pick(drlist, 'given');
             var drname = _.values(nlist);
             var docname = drname.join();
         } else {
             var drname = "";
         }


         $rootScope.missedlistReport.push({
             'reptime': time,
             'repdocname': docname,
             'rependdate': enddate,
             'repconsultationId':consultationId,
             'repimage':patphoto,
         });

     }
   }





                    });

                },
                error: function(data) {
                    $scope.listOfConsultations = 'Error getting List Of Consultations';
                }
            };
            LoginService.getListOfMissedConsultation(params);

            var myEl = angular.element(document.querySelector('#missed'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#passed'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#dropped'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.pastshow = false;
            $scope.missedshow = true;
            $scope.droppedshow = false;
        }
        $rootScope.droppedconsult = function() {

            if ($rootScope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                patientId: $rootScope.patientId,
                accessToken: $rootScope.accessToken,
                statusId: 81,
                success: function(data) {
                    $rootScope.Droppedconsultations = data.data;

                },
                error: function(data) {
                    $scope.listOfConsultations = 'Error getting List Of Consultations';
                }
            };
            LoginService.getListOfDroppedConsultations(params);


            var myEl = angular.element(document.querySelector('#dropped'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#passed'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#missed'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.pastshow = false;
            $scope.missedshow = false;
            $scope.droppedshow = true;
        }
        $scope.consultsearch = function() {
            $scope.passededconsultants();
            $state.go('tab.consultationSearch');
        }

        $rootScope.doGetExistingConsulatationReport = function() {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }

            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    $rootScope.attachmentLength = '';
                    $rootScope.existingConsultationReport = data.data[0].details[0];
                    if ($rootScope.existingConsultationReport.height != '' && typeof $rootScope.existingConsultationReport.height != 'undefined') {
                        $rootScope.reportHeight = $rootScope.existingConsultationReport.height + " " + $rootScope.existingConsultationReport.heightUnit;
                    } else {
                        $rootScope.reportHeight = 'NA';
                    }
                    if ($rootScope.existingConsultationReport.weight != '' && typeof $rootScope.existingConsultationReport.weight != 'undefined') {
                        $rootScope.reportWeight = $rootScope.existingConsultationReport.weight + " " + $rootScope.existingConsultationReport.weightUnit;
                    } else {
                        $rootScope.reportWeight = 'NA';
                    }
                    $rootScope.reportPatientName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientName);
                    $rootScope.reportLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.lastName);

                    if ($rootScope.existingConsultationReport.patientAddress != '' && typeof $rootScope.existingConsultationReport.patientAddress != 'undefined') {
                        $rootScope.reportPatientAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientAddress);
                    } else {
                        $rootScope.reportPatientAddress = 'None Reported';
                    }

                    if ($rootScope.existingConsultationReport.homePhone != '' && typeof $rootScope.existingConsultationReport.homePhone != 'undefined') {
                        $rootScope.reportHomePhone = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.homePhone);
                    } else {
                        $rootScope.reportHomePhone = 'NA';
                    }

                    if ($rootScope.existingConsultationReport.hospitalAddress != '' && typeof $rootScope.existingConsultationReport.hospitalAddress != 'undefined') {
                        $rootScope.reportHospitalAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.hospitalAddress);
                    } else {
                        $rootScope.reportHospitalAddress = 'None Reported';
                    }

                    if ($rootScope.existingConsultationReport.doctorFirstName != '' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined') {
                        $rootScope.reportDoctorFirstName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorFirstName);
                    } else {
                        $rootScope.reportDoctorFirstName = 'None Reported';
                    }
                    if ($rootScope.existingConsultationReport.medicalSpeciality !== '' && typeof $rootScope.existingConsultationReport.medicalSpeciality !== 'undefined') {
                        $rootScope.reportMedicalSpeciality = ', ' + htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.medicalSpeciality);
                    } else {
                        $rootScope.reportMedicalSpeciality = '';
                    }

                    if ($rootScope.existingConsultationReport.doctorFirstName != '' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined') {
                        $rootScope.reportDoctorLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorLastName);
                    } else {
                        $rootScope.reportDoctorLastName = 'None Reported';
                    }

                    if ($rootScope.existingConsultationReport.rx != '' && typeof $rootScope.existingConsultationReport.rx != 'undefined') {
                        $rootScope.reportrx = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.rx);
                    } else {
                        $rootScope.reportrx = 'None Reported';
                    }

                    var startTimeISOString = $rootScope.existingConsultationReport.consultationDate;
                    var startTime = new Date(startTimeISOString);
                    $rootScope.consultationDate = new Date(startTime.getTime() + (startTime.getTimezoneOffset() * 60000));

                    if ($rootScope.existingConsultationReport.consultationDuration != 0 && typeof $rootScope.existingConsultationReport.consultationDuration != 'undefined') {
                        $rootScope.displayCOnsultationDuration = "display";
                        var consultationMinutes = Math.floor($rootScope.existingConsultationReport.consultationDuration / 60);
                        var consultationSeconds = $rootScope.existingConsultationReport.consultationDuration - (consultationMinutes * 60);
                        if (consultationMinutes === 0) {
                            $rootScope.consultDurationMinutes = '00';
                        } else if (consultationMinutes < 10) {
                            $rootScope.consultDurationMinutes = '0' + consultationMinutes;
                        } else {
                            $rootScope.consultDurationMinutes = consultationMinutes;
                        }

                        if (consultationSeconds == 0) {
                            $rootScope.consultDurationSeconds = '00';
                        } else if (consultationSeconds < 10) {
                            $rootScope.consultDurationSeconds = '0' + consultationSeconds;
                        } else {
                            $rootScope.consultDurationSeconds = consultationSeconds;
                        }
                    } else {
                        $rootScope.displayCOnsultationDuration = "none";
                    }

                    $rootScope.ReportHospitalImage = $rootScope.APICommonURL + $rootScope.existingConsultationReport.hospitalImage;
                    $rootScope.reportScreenPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.primaryConcern);
                    if (typeof $rootScope.reportScreenPrimaryConcern !== 'undefined') {
                        var n = $rootScope.reportScreenPrimaryConcern.indexOf("?");
                        if (n < 0) {
                            $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern;
                        } else {
                            $rootScope.reportScreenPrimaryConcern1 = $rootScope.reportScreenPrimaryConcern.split("?");
                            $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern1[1];
                        }
                    } else {
                        $rootScope.reportScreenPrimaryConcern = "";
                    }
                    $rootScope.reportScreenSecondaryConcern = $rootScope.existingConsultationReport.secondaryConcern;
                    if (typeof $rootScope.reportScreenSecondaryConcern !== 'undefined') {
                        var n = $rootScope.reportScreenSecondaryConcern.indexOf("?");
                        if (n < 0) {
                            $rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern);
                        } else {
                            $rootScope.reportScreenSecondaryConcern1 = $rootScope.reportScreenSecondaryConcern.split("?");
                            $rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern1[1]);
                        }
                    } else {
                        $rootScope.reportScreenSecondaryConcern = "None Reported";
                    }
                    $rootScope.intake = $rootScope.existingConsultationReport.intake;

                    $rootScope.fullTerm = $rootScope.intake.infantData.fullTerm;

                    if ($rootScope.fullTerm == 'N') {
                        $rootScope.fullTerm = 'No';
                    } else if ($rootScope.fullTerm == 'T') {
                        $rootScope.fullTerm = 'True';
                    }

                    $rootScope.vaginalBirth = $rootScope.intake.infantData.vaginalBirth;
                    if ($rootScope.vaginalBirth == 'N') {
                        $rootScope.vaginalBirth = 'No';
                    } else if ($rootScope.vaginalBirth == 'T') {
                        $rootScope.vaginalBirth = 'True';
                    }

                    $rootScope.dischargedWithMother = $rootScope.intake.infantData.dischargedWithMother;
                    if ($rootScope.dischargedWithMother == 'N') {
                        $rootScope.dischargedWithMother = 'No';
                    } else if ($rootScope.dischargedWithMother == 'T') {
                        $rootScope.dischargedWithMother = 'True';
                    }

                    $rootScope.vaccinationsCurrent = $rootScope.intake.infantData.vaccinationsCurrent;
                    if ($rootScope.vaccinationsCurrent == 'N') {
                        $rootScope.vaccinationsCurrent = 'No';
                    } else if ($rootScope.vaccinationsCurrent == 'T') {
                        $rootScope.vaccinationsCurrent = 'True';
                    }

                    var usDOB = ageFilter.getDateFilter($rootScope.existingConsultationReport.dob);

                    if (typeof usDOB != 'undefined' && usDOB != '') {
                        $rootScope.userReportDOB = usDOB.search("y");
                    } else {
                        $rootScope.userReportDOB = 'None Reported';
                    }
                    if (typeof data.data[0].details[0].hospitalImage != 'undefined' && data.data[0].details[0].hospitalImage != '') {
                        var hosImage = data.data[0].details[0].hospitalImage;
                        if (hosImage.indexOf(apiCommonURL) >= 0) {
                            $rootScope.hospitalImage = hosImage;
                        } else {
                            $rootScope.hospitalImage = apiCommonURL + hosImage;
                        }
                    } else {
                        $rootScope.hospitalImage = '';
                    }

                    $rootScope.gender = data.data[0].details[0].gender;
                    if (data.data[0].details[0].gender !== '' && typeof data.data[0].details[0].gender !== 'undefined') {

                        if ($rootScope.gender == 'M') {
                            $rootScope.gender = 'Male';
                        } else if ($rootScope.gender == 'F') {
                            $rootScope.gender = 'Female';
                        }
                    } else {
                        $rootScope.gender = 'NA';
                    }

                    $rootScope.ReportMedicalConditions = [];
                    angular.forEach($rootScope.intake.medicalConditions, function(index, item) {
                        $rootScope.ReportMedicalConditions.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'code': index.code,
                            'description': index.description,
                        });
                    });

                    $rootScope.ReportMedicationAllergies = [];
                    angular.forEach($rootScope.intake.medicationAllergies, function(index, item) {
                        $rootScope.ReportMedicationAllergies.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'code': index.code,
                            'description': index.description,
                        });
                    });

                    $rootScope.ReportMedications = [];
                    angular.forEach($rootScope.intake.medications, function(index, item) {
                        $rootScope.ReportMedications.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'code': index.code,
                            'description': index.description,
                        });
                    });

                    $rootScope.ReportSurgeries = [];
                    angular.forEach($rootScope.intake.surgeries, function(index, item) {
                        $rootScope.ReportSurgeries.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'description': index.description,
                            'month': index.month,
                            'year': index.year,
                        });
                    });

                    $rootScope.reportMedicalCodeDetails = [];

                    if ($rootScope.existingConsultationReport.medicalCodeDetails != '' && typeof $rootScope.existingConsultationReport.medicalCodeDetails != 'undefined') {
                        angular.forEach($rootScope.existingConsultationReport.medicalCodeDetails, function(index, item) {
                            $rootScope.reportMedicalCodeDetails.push({
                                'Number': item + 1,
                                'shortDescription': index.shortDescription,
                                'medicalCodingSystem': index.medicalCodingSystem
                            });
                        });
                        $rootScope.reportMediCPT = $filter('filter')($scope.reportMedicalCodeDetails, {
                            medicalCodingSystem: 'CPT'
                        });
                        $rootScope.reportMediICD = $filter('filter')($scope.reportMedicalCodeDetails, {
                            medicalCodingSystem: 'ICD-10-DX'
                        });

                    } else {
                        $rootScope.reportMedicalCodeDetails = '';
                    }
                    session = null;
                    $scope.getSoapNotes();
                    $scope.doGetAttachmentList();
                    $ionicModal.fromTemplateUrl('templates/tab-reports.html', {
                        scope: $scope,
                        animation: 'slide-in-up',
                        focusFirstInput: false,
                        backdropClickToClose: false
                    }).then(function(modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
                },
                error: function(data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };

            LoginService.getConsultationFinalReport(params);
        }

        $scope.doGetAttachmentList = function() {
            if ($rootScope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }
            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    $scope.getSoapNotes();
                    $rootScope.getAttachmentList = []

                    angular.forEach(data.data[0].snapFile.files, function(index, item) {
                        var attachImage = index.name.split(".");
                        $rootScope.getAttachmentList.push({
                            'id': index.id,
                            'name': index.name,
                            'image': attachImage[attachImage.length - 1]
                        });
                        //$scope.doGetAttachmentURL(index.id, index.name);

                    });

                    if (data.data[0].snapFile.files.length > 0) {
                        angular.forEach(data.data[0].snapFile.files, function(index, item) {
                            var attachImage = index.name.split(".");
                            $rootScope.getAttachmentList.push({
                                'id': index.id,
                                'name': index.name,
                                'image': attachImage[attachImage.length - 1]
                            });
                            //$scope.doGetAttachmentURL(index.id, index.name);

                        });
                    }

                    $rootScope.attachmentLength = $rootScope.getAttachmentList.length;
                    $ionicModal.fromTemplateUrl('templates/tab-reports.html', {
                        scope: $scope,
                        animation: 'slide-in-up',
                        focusFirstInput: false,
                        backdropClickToClose: false
                    }).then(function(modal) {
                        $rootScope.reportModal = modal;
                        $rootScope.reportModal.show();

                    });
                },
                error: function(data) {
                    $ionicModal.fromTemplateUrl('templates/tab-reports.html', {
                        scope: $scope,
                        animation: 'slide-in-up',
                        focusFirstInput: false,
                        backdropClickToClose: false
                    }).then(function(modal) {

                        //    $scope.modal = modal;
                        //  $scope.modal.show();
                        $rootScope.reportModal = modal;
                        $rootScope.reportModal.show();

                    });
                    //$rootScope.serverErrorMessageValidation();
                }
            };
            LoginService.getAttachmentList(params);
        }

        $scope.getSoapNotes = function() {
            $("#reportSubjective").html($rootScope.existingConsultationReport.subjective);
            $("#reportObjective").html($rootScope.existingConsultationReport.objective);
            $("#reportAssessment").html($rootScope.existingConsultationReport.assessment);
            $("#reportPlan").html($rootScope.existingConsultationReport.plan);
            if ($rootScope.existingConsultationReport.subjective != '' && typeof $rootScope.existingConsultationReport.subjective != 'undefined') {
                $rootScope.reportSubjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.subjective);
            } else {
                $rootScope.reportSubjective = 'None Reported';
            }

            if ($rootScope.existingConsultationReport.objective != '' && typeof $rootScope.existingConsultationReport.objective != 'undefined') {
                $rootScope.reportObjective = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.objective);
            } else {
                $rootScope.reportObjective = 'None Reported';
            }

            if ($rootScope.existingConsultationReport.assessment != '' && typeof $rootScope.existingConsultationReport.assessment != 'undefined') {
                $rootScope.reportAssessment = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.assessment);
            } else {
                $rootScope.reportAssessment = 'None Reported';
            }

            if ($rootScope.existingConsultationReport.plan != '' && typeof $rootScope.existingConsultationReport.plan != 'undefined') {
                $rootScope.reportPlan = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.plan);
            } else {
                $rootScope.reportPlan = 'None Reported';
            }
            $('#soapReport').find('a').each(function() {
                var aLink = angular.element(this).attr('href');
                var onClickLink = "window.open('" + aLink + "', '_system', 'location=yes'); return false;";
                angular.element(this).removeAttr('href', '');
                angular.element(this).attr('href', 'javascript:void(0);');
                angular.element(this).attr('onclick', onClickLink);
            });
        }
        $rootScope.showReportView = function(consultation) {
            $rootScope.consultationId = consultation.consultationId;
            $rootScope.doGetExistingConsulatationReport();
        }

        $scope.closeReportView = function() {
            $rootScope.reportModal.hide();
            $('.modal-backdrop').hide();
        }





        $rootScope.doGetMissedConsulatationReport = function() {
            if ($scope.accessToken == 'No Token') {
                alert('No token.  Get token first then attempt operation.');
                return;
            }

            var params = {
                consultationId: $rootScope.consultationId,
                accessToken: $rootScope.accessToken,
                success: function(data) {
                    $rootScope.attachmentLength = '';
                    $rootScope.existingConsultationReport = data.data[0].details[0];
                    if ($rootScope.existingConsultationReport.height != '' && typeof $rootScope.existingConsultationReport.height != 'undefined') {
                        $rootScope.reportHeight = $rootScope.existingConsultationReport.height + " " + $rootScope.existingConsultationReport.heightUnit;
                    } else {
                        $rootScope.reportHeight = 'NA';
                    }
                    if ($rootScope.existingConsultationReport.weight != '' && typeof $rootScope.existingConsultationReport.weight != 'undefined') {
                        $rootScope.reportWeight = $rootScope.existingConsultationReport.weight + " " + $rootScope.existingConsultationReport.weightUnit;
                    } else {
                        $rootScope.reportWeight = 'NA';
                    }
                    $rootScope.reportPatientName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientName);
                    $rootScope.reportLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.lastName);

                    if ($rootScope.existingConsultationReport.patientAddress != '' && typeof $rootScope.existingConsultationReport.patientAddress != 'undefined') {
                        $rootScope.reportPatientAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.patientAddress);
                    } else {
                        $rootScope.reportPatientAddress = 'None Reported';
                    }

                    if ($rootScope.existingConsultationReport.homePhone != '' && typeof $rootScope.existingConsultationReport.homePhone != 'undefined') {
                        $rootScope.reportHomePhone = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.homePhone);
                    } else {
                        $rootScope.reportHomePhone = 'NA';
                    }

                    if ($rootScope.existingConsultationReport.hospitalAddress != '' && typeof $rootScope.existingConsultationReport.hospitalAddress != 'undefined') {
                        $rootScope.reportHospitalAddress = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.hospitalAddress);
                    } else {
                        $rootScope.reportHospitalAddress = 'None Reported';
                    }

                    if ($rootScope.existingConsultationReport.doctorFirstName != '' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined') {
                        $rootScope.reportDoctorFirstName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorFirstName);
                    } else {
                        $rootScope.reportDoctorFirstName = 'None Reported';
                    }
                    if ($rootScope.existingConsultationReport.medicalSpeciality !== '' && typeof $rootScope.existingConsultationReport.medicalSpeciality !== 'undefined') {
                        $rootScope.reportMedicalSpeciality = ', ' + htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.medicalSpeciality);
                    } else {
                        $rootScope.reportMedicalSpeciality = '';
                    }

                    if ($rootScope.existingConsultationReport.doctorFirstName != '' && typeof $rootScope.existingConsultationReport.doctorFirstName != 'undefined') {
                        $rootScope.reportDoctorLastName = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.doctorLastName);
                    } else {
                        $rootScope.reportDoctorLastName = 'None Reported';
                    }

                    if ($rootScope.existingConsultationReport.rx != '' && typeof $rootScope.existingConsultationReport.rx != 'undefined') {
                        $rootScope.reportrx = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.rx);
                    } else {
                        $rootScope.reportrx = 'None Reported';
                    }

                    var startTimeISOString = $rootScope.existingConsultationReport.consultationDate;
                    var startTime = new Date(startTimeISOString);
                    $rootScope.comsultationTime=new Date(startTimeISOString);
                    $rootScope.consultationDate = new Date(startTime.getTime() + (startTime.getTimezoneOffset() * 60000));

                    if ($rootScope.existingConsultationReport.consultationDuration != 0 && typeof $rootScope.existingConsultationReport.consultationDuration != 'undefined') {
                        $rootScope.displayCOnsultationDuration = "display";
                        var consultationMinutes = Math.floor($rootScope.existingConsultationReport.consultationDuration / 60);
                        var consultationSeconds = $rootScope.existingConsultationReport.consultationDuration - (consultationMinutes * 60);
                        if (consultationMinutes === 0) {
                            $rootScope.consultDurationMinutes = '00';
                        } else if (consultationMinutes < 10) {
                            $rootScope.consultDurationMinutes = '0' + consultationMinutes;
                        } else {
                            $rootScope.consultDurationMinutes = consultationMinutes;
                        }

                        if (consultationSeconds == 0) {
                            $rootScope.consultDurationSeconds = '00';
                        } else if (consultationSeconds < 10) {
                            $rootScope.consultDurationSeconds = '0' + consultationSeconds;
                        } else {
                            $rootScope.consultDurationSeconds = consultationSeconds;
                        }
                    } else {
                        $rootScope.displayCOnsultationDuration = "none";
                    }


                    $rootScope.reportScreenPrimaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.existingConsultationReport.primaryConcern);
                    if (typeof $rootScope.reportScreenPrimaryConcern !== 'undefined') {
                        var n = $rootScope.reportScreenPrimaryConcern.indexOf("?");
                        if (n < 0) {
                            $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern;
                        } else {
                            $rootScope.reportScreenPrimaryConcern1 = $rootScope.reportScreenPrimaryConcern.split("?");
                            $rootScope.reportScreenPrimaryConcern = $rootScope.reportScreenPrimaryConcern1[1];
                        }
                    } else {
                        $rootScope.reportScreenPrimaryConcern = "";
                    }
                    $rootScope.reportScreenSecondaryConcern = $rootScope.existingConsultationReport.secondaryConcern;
                    if (typeof $rootScope.reportScreenSecondaryConcern !== 'undefined') {
                        var n = $rootScope.reportScreenSecondaryConcern.indexOf("?");
                        if (n < 0) {
                            $rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern);
                        } else {
                            $rootScope.reportScreenSecondaryConcern1 = $rootScope.reportScreenSecondaryConcern.split("?");
                            $rootScope.reportScreenSecondaryConcern = htmlEscapeValue.getHtmlEscapeValue($rootScope.reportScreenSecondaryConcern1[1]);
                        }
                    } else {
                        $rootScope.reportScreenSecondaryConcern = "None Reported";
                    }
                    $rootScope.intake = $rootScope.existingConsultationReport.intake;

                    $rootScope.fullTerm = $rootScope.intake.infantData.fullTerm;

                    if ($rootScope.fullTerm == 'N') {
                        $rootScope.fullTerm = 'No';
                    } else if ($rootScope.fullTerm == 'T') {
                        $rootScope.fullTerm = 'True';
                    }

                    $rootScope.vaginalBirth = $rootScope.intake.infantData.vaginalBirth;
                    if ($rootScope.vaginalBirth == 'N') {
                        $rootScope.vaginalBirth = 'No';
                    } else if ($rootScope.vaginalBirth == 'T') {
                        $rootScope.vaginalBirth = 'True';
                    }

                    $rootScope.dischargedWithMother = $rootScope.intake.infantData.dischargedWithMother;
                    if ($rootScope.dischargedWithMother == 'N') {
                        $rootScope.dischargedWithMother = 'No';
                    } else if ($rootScope.dischargedWithMother == 'T') {
                        $rootScope.dischargedWithMother = 'True';
                    }

                    $rootScope.vaccinationsCurrent = $rootScope.intake.infantData.vaccinationsCurrent;
                    if ($rootScope.vaccinationsCurrent == 'N') {
                        $rootScope.vaccinationsCurrent = 'No';
                    } else if ($rootScope.vaccinationsCurrent == 'T') {
                        $rootScope.vaccinationsCurrent = 'True';
                    }

                    var usDOB = ageFilter.getDateFilter($rootScope.existingConsultationReport.dob);

                    if (typeof usDOB != 'undefined' && usDOB != '') {
                        $rootScope.userReportDOB = usDOB.search("y");
                    } else {
                        $rootScope.userReportDOB = 'None Reported';
                    }
                    if (typeof data.data[0].details[0].hospitalImage != 'undefined' && data.data[0].details[0].hospitalImage != '') {
                        var hosImage = data.data[0].details[0].hospitalImage;
                        if (hosImage.indexOf(apiCommonURL) >= 0) {
                            $rootScope.hospitalImage = hosImage;
                        } else {
                            $rootScope.hospitalImage = apiCommonURL + hosImage;
                        }
                    } else {
                        $rootScope.hospitalImage = '';
                    }

                    $rootScope.gender = data.data[0].details[0].gender;
                    if (data.data[0].details[0].gender !== '' && typeof data.data[0].details[0].gender !== 'undefined') {

                        if ($rootScope.gender == 'M') {
                            $rootScope.gender = 'Male';
                        } else if ($rootScope.gender == 'F') {
                            $rootScope.gender = 'Female';
                        }
                    } else {
                        $rootScope.gender = 'NA';
                    }

                    $rootScope.ReportMedicalConditions = [];
                    angular.forEach($rootScope.intake.medicalConditions, function(index, item) {
                        $rootScope.ReportMedicalConditions.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'code': index.code,
                            'description': index.description,
                        });
                    });

                    $rootScope.ReportMedicationAllergies = [];
                    angular.forEach($rootScope.intake.medicationAllergies, function(index, item) {
                        $rootScope.ReportMedicationAllergies.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'code': index.code,
                            'description': index.description,
                        });
                    });

                    $rootScope.ReportMedications = [];
                    angular.forEach($rootScope.intake.medications, function(index, item) {
                        $rootScope.ReportMedications.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'code': index.code,
                            'description': index.description,
                        });
                    });

                    $rootScope.ReportSurgeries = [];
                    angular.forEach($rootScope.intake.surgeries, function(index, item) {
                        $rootScope.ReportSurgeries.push({
                            'Number': item + 1,
                            'id': index.$id,
                            'description': index.description,
                            'month': index.month,
                            'year': index.year,
                        });
                    });

                    $rootScope.reportMedicalCodeDetails = [];

                    if ($rootScope.existingConsultationReport.medicalCodeDetails != '' && typeof $rootScope.existingConsultationReport.medicalCodeDetails != 'undefined') {
                        angular.forEach($rootScope.existingConsultationReport.medicalCodeDetails, function(index, item) {
                            $rootScope.reportMedicalCodeDetails.push({
                                'Number': item + 1,
                                'shortDescription': index.shortDescription,
                                'medicalCodingSystem': index.medicalCodingSystem
                            });
                        });
                        $rootScope.reportMediCPT = $filter('filter')($scope.reportMedicalCodeDetails, {
                            medicalCodingSystem: 'CPT'
                        });
                        $rootScope.reportMediICD = $filter('filter')($scope.reportMedicalCodeDetails, {
                            medicalCodingSystem: 'ICD-10-DX'
                        });

                    } else {
                        $rootScope.reportMedicalCodeDetails = '';
                    }
                    session = null;
                  //  $scope.getSoapNotes();
                  //  $scope.doGetAttachmentList();

                            },
                error: function(data) {
                    $rootScope.serverErrorMessageValidation();
                }
            };

            LoginService.getConsultationFinalReport(params);
        }














        $rootScope.showmissedReportView = function(consultation) {
            $rootScope.consultationId = consultation.consultationId;

            $ionicModal.fromTemplateUrl('templates/tab-missedreport.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: false,
                backdropClickToClose: false
            }).then(function(modal) {
                $rootScope.missedmodal = modal;
                $rootScope.missedmodal.show();
            });
            //  $scope.doGetMissedConsulatationReport();
             $rootScope.doGetExistingConsulatationReport();
        }
        $scope.closeMissedView = function() {
            $rootScope.missedmodal.hide();
            $('.modal-backdrop').hide();
        }


        <!-- Consultation search -->
        $scope.passedsearchshow = true;
        $scope.missedsearchshow = false;
        $scope.droppedsearcshow = false;

        $rootScope.passedsearchconsult = function() {
            $scope.passededconsultants();
            var myEl = angular.element(document.querySelector('#passedsearch'));
            myEl.removeClass('btnextcolor');
            myEl.addClass('btcolor');
            var myEl = angular.element(document.querySelector('#missedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#droppedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.passedsearchshow = true;
            $scope.missedsearchshow = false;
            $scope.droppedsearchshow = false;
        }
        $scope.missedsearchconsult = function() {
            $scope.missedconsult();
            var myEl = angular.element(document.querySelector('#missedsearch'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#passedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#droppedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.missedsearchshow = true;
            $scope.passedsearchshow = false;
            $scope.droppedsearchshow = false;
        }
        $scope.droppedsearchconsult = function() {
            $scope.droppedconsult();
            var myEl = angular.element(document.querySelector('#droppedsearch'));
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#passedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            var myEl = angular.element(document.querySelector('#missedsearch'));
            myEl.removeClass('btcolor').css('color', '#11c1f3');
            myEl.addClass('btnextcolor');
            $scope.passedsearchshow = false;
            $scope.missedsearchshow = false;
            $scope.droppedsearchshow = true;
        }


    });
