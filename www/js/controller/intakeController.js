
angular.module('starter.controllers')



// Controller to be used by all intake forms
.controller('IntakeFormsCtrl', function($scope,$ionicPlatform, htmlEscapeValue, $interval,$ionicSideMenuDelegate, replaceCardNumber, $ionicModal,$ionicPopup,$ionicHistory, $filter, $rootScope, $state,SurgeryStocksListService, LoginService, $timeout, CustomCalendar,CustomCalendarMonth) {

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
            }else if($rootScope.currState.$current.name==="tab.login"){
                navigator.app.exitApp();
			}else if($rootScope.currState.$current.name==="tab.loginSingle"){
                navigator.app.exitApp();
            }else if($rootScope.currState.$current.name==="tab.cardDetails"){
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


	$rootScope.currState = $state;
    $rootScope.monthsList = CustomCalendar.getMonthsList();
    $rootScope.ccYearsList = CustomCalendar.getCCYearsList();
    $rootScope.limit = 4;
	$rootScope.Concernlimit = 1;
    $rootScope.checkedPrimary = 0;


	$scope.ClearRootScope = function() {
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
		if(deploymentEnvLogout === "Multiple"){
			$state.go('tab.chooseEnvironment');
		}else if(deploymentEnvLogout === "Single"){
			$state.go('tab.loginSingle');
		}else{
			$state.go('tab.login');
		}
	}


    $scope.checkPreLoadDataAndSelectionAndRebindSelectionList = function(selectedListItem, mainListItem){
        angular.forEach(mainListItem, function(item, key2) {
               item.checked = false;
           });
        if(!angular.isUndefined(selectedListItem)){

           if(selectedListItem.length > 0){
               angular.forEach(selectedListItem, function(value1, key1) {
                   angular.forEach(mainListItem, function(value2, key2) {
                       if (value1.description === value2.text) {
                           value2.checked = true;
                       }
                   });
               });
           }
       }
    };

    $scope.doGetExistingConsulatation = function () {
		if ($scope.accessToken === 'No Token') {
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
                $rootScope.inTakeFormCurrentMedication = $rootScope.inTakeForm.medications;
				if(!angular.isUndefined($rootScope.inTakeFormCurrentMedication)){
					$rootScope.MedicationCountValid = $rootScope.inTakeFormCurrentMedication.length;
					if(typeof $rootScope.MedicationCountValid !== 'undefined' &&  $rootScope.MedicationCountValid !== '') {
						$scope.checkPreLoadDataAndSelectionAndRebindSelectionList($rootScope.inTakeFormCurrentMedication, $rootScope.CurrentMedicationList);
						$rootScope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {checked:true});
						$rootScope.patinentCurrentMedication = $rootScope.CurrentMedicationItem;
						if($rootScope.patinentCurrentMedication) {
								  $rootScope.MedicationCount = $scope.patinentCurrentMedication.length;
								  $rootScope.MedicationCountValid = $rootScope.MedicationCount;
							 }

					}
				}



				$rootScope.inTakeFormChronicConditions = $rootScope.inTakeForm.medicalConditions;
				if(!angular.isUndefined($rootScope.inTakeFormChronicConditions)){
					$rootScope.ChronicValid = $rootScope.inTakeFormChronicConditions.length;
					$rootScope.ChronicCount = $rootScope.inTakeFormChronicConditions.length;
					if(typeof $rootScope.ChronicValid !== 'undefined' &&  $rootScope.ChronicValid !== '') {
						$scope.checkPreLoadDataAndSelectionAndRebindSelectionList($rootScope.inTakeFormChronicConditions, $rootScope.chronicConditionList);

						$rootScope.PatientChronicConditionItem = $filter('filter')($rootScope.chronicConditionList, {checked:true});
						$rootScope.PatientChronicCondition = $rootScope.PatientChronicConditionItem;
						$rootScope.PatientChronicConditionsSelected = $rootScope.PatientChronicConditionItem;
						if($rootScope.PatientChronicCondition) {
							$rootScope.ChronicCountValidCount = $rootScope.PatientChronicCondition.length;
							$rootScope.ChronicCount = $rootScope.inTakeFormChronicConditions.length;
						}
					}
				}

                $rootScope.inTakeFormPriorSurgeories = $rootScope.inTakeForm.surgeries;
				if(!angular.isUndefined($rootScope.inTakeFormPriorSurgeories)){
					$rootScope.PriorSurgeryValid = $rootScope.inTakeFormPriorSurgeories.length;
					if(typeof $rootScope.PriorSurgeryValid !== 'undefined' && $rootScope.PriorSurgeryValid !== '') {
							SurgeryStocksListService.ClearSurgery();
						  angular.forEach($rootScope.inTakeFormPriorSurgeories, function (Priorvalue, index) {
							  var surgeryMonthName = Priorvalue.month;
							  var PriorSurgeryDate = new Date(Priorvalue.year, surgeryMonthName-1, 01);
							  var dateString = PriorSurgeryDate;
							  var surgeryName = Priorvalue.description;
							  var stockSurgery = SurgeryStocksListService.addSurgery(surgeryName, dateString);
							 $rootScope.patientSurgeriess = SurgeryStocksListService.SurgeriesList;
							 $rootScope.IsToPriorCount = $rootScope.patientSurgeriess.length;
						 });
						   $rootScope.PriorSurgeryValidCount = $rootScope.IsToPriorCount ;
					}
				}





			   //MedicationAllegies pre-populated
			    $rootScope.inTakeFormMedicationAllergies = $rootScope.inTakeForm.medicationAllergies;
				if(!angular.isUndefined($rootScope.inTakeFormMedicationAllergies)){
					$rootScope.AllegiesCountValid = $rootScope.inTakeFormMedicationAllergies.length;
					if(typeof $rootScope.AllegiesCountValid !== 'undefined' &&  $rootScope.AllegiesCountValid !== '') {
						$scope.checkPreLoadDataAndSelectionAndRebindSelectionList($rootScope.inTakeFormMedicationAllergies, $rootScope.MedicationAllegiesList);
						$rootScope.MedicationAllegiesItem = $filter('filter')($rootScope.MedicationAllegiesList, {checked:true});
						$rootScope.patinentMedicationAllergies = $rootScope.MedicationAllegiesItem;
						if($rootScope.patinentMedicationAllergies) {
							  $rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length;
							  $rootScope.AllegiesCountValid = $rootScope.AllegiesCount;
						}
					}
				}

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
			var dd = today.getDate();
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
					if($rootScope.PrimaryPopup === 0) {
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
       if($rootScope.IsValue === 0 || $rootScope.IsValue === undefined) {
			if($rootScope.PrimaryNext === 0) {
				$scope.ErrorMessage = "Primary Concern Can't be Empty";
				$rootScope.ConcernsValidation($scope.ErrorMessage);
			}
        } else {
			//$scope.doGetHospitalInformation();
			$scope.doPostOnDemandConsultation();
        }

    }

	$scope.doGetConcentToTreat = function () {
		if ($scope.accessToken === 'No Token') {
			alert('No token.  Get token first then attempt operation.');
			return;
		}
		var params = {
            documentType: 2,
			hospitalId: $rootScope.hospitalId,
            success: function (data) {
				$rootScope.concentToTreatContent = htmlEscapeValue.getHtmlEscapeValue(data.data[0].documentText);
				$state.go('tab.ConsentTreat');

            },
            error: function (data) {
                $rootScope.serverErrorMessageValidation();
            }
        };

		LoginService.getConcentToTreat(params);
	}

	$scope.goToConsentToTreat = function(){
		$rootScope.appointmentsPage = false;
		$scope.doGetConcentToTreat();
		//$scope.doGetHospitalInformation();
		//$state.go('tab.ConsentTreat');
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

			if(typeof $scope.PatientSecondaryConcernItem !== 'undefined') {
				if($rootScope.secondaryConcernLength !== '') {
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
		if($scope.PatientSecondaryConcernItem !== '') {
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
        if(items.text === "Other (provide details below)"){
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
					if($rootScope.mobilePhone !== '') {
						$scope.OnDemandConsultationSaveData["phone"] = $rootScope.mobilePhone;
					} else if($rootScope.mobilePhone === '') {
						$scope.OnDemandConsultationSaveData["phone"] = $rootScope.homePhone;
					}



	$scope.doPostOnDemandConsultation = function() {

		if(typeof $rootScope.PrimaryConcernText !== 'undefined') {
			$scope.primaryFilter = $filter('filter')($scope.OnDemandConsultationSaveData.concerns, {description:$rootScope.PrimaryConcernText});
			if($scope.primaryFilter.length === 0) {
				$scope.OnDemandConsultationSaveData.concerns.push(
					{isPrimary: true, description: $rootScope.PrimaryConcernText}
				);
			}
		}

		if(typeof $rootScope.SecondaryConcernText !== 'undefined' && $rootScope.SecondaryConcernText !=="" ) {
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
						// $state.go('tab.ChronicCondition');
                        $scope.doGetExistingConsulatation();
						//$state.go('tab.ChronicCondition');
					},
					error: function (data) {
						$rootScope.serverErrorMessageValidation();
					}
				};

				LoginService.postOnDemandConsultation (params);
		};

	 $scope.clearSelectionAndRebindSelectionList = function(selectedListItem, mainListItem){
        angular.forEach(mainListItem, function(item, key2) {
               item.checked = false;
           });
        if(!angular.isUndefined(selectedListItem)){

           if(selectedListItem.length > 0){
               angular.forEach(selectedListItem, function(value1, key1) {
                   angular.forEach(mainListItem, function(value2, key2) {
                       if (value1.text === value2.text) {
                           value2.checked = true;
                       }
                   });
               });
           }
       }
    };


	/*Chronic Condition Start here*/

    $scope.BackToChronicCondition = function(ChronicValid) {
        $rootScope.ChronicValid = ChronicValid;
        $state.go('tab.ChronicCondition');
    }

    // Get list of Chronic Condition lists
  // $scope.chronicConditionList = $rootScope.chronicConditionsCodesList;

     // Get list of Chronic Condition Pre populated
   /*if($rootScope.currState.$current.name=="tab.ChronicCondition") {
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
    }*/

   // Open Chronic Condition popup
    $scope.loadChronicCondition = function() {
        $scope.clearSelectionAndRebindSelectionList($rootScope.PatientChronicConditionsSelected, $rootScope.chronicConditionList);
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
        $rootScope.PatientChronicConditionItem = $filter('filter')($scope.chronicConditionList, {checked:true});
        $rootScope.PatientChronicConditionsSelected = $filter('filter')($scope.chronicConditionList, {checked:true});
		if($scope.PatientChronicConditionItem != '') {
			$rootScope.PatientChronicCondition = $rootScope.PatientChronicConditionItem;
			$rootScope.ChronicCount = $rootScope.PatientChronicCondition.length;
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
			if($rootScope.checkedChronic === 4) {
				$scope.closeChronicCondition();
			}
		 }
		*/
		if($rootScope.checkedChronic === 4) {
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
                        if(item.checked) { if(item.text === "Other") item.checked = false; }
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
                      $rootScope.chronicConditionList.splice(1, 0, newchronicConditionItem);

                       //$scope.chronicConditionList.push({ text: $scope.data.ChronicCondtionOther, checked: true });
                       return $scope.data.ChronicCondtionOther;
				  }
				}
			  }
			]
		  });
    };


    $scope.removeChronicCondition = function(index, item){
          $rootScope.PatientChronicCondition.splice(index, 1);
          var indexPos = $rootScope.chronicConditionList.indexOf(item);
          $rootScope.chronicConditionList[indexPos].checked = false;
		  $rootScope.ChronicCount = $rootScope.PatientChronicCondition.length;
          $rootScope.checkedChronic--;
          $rootScope.PatientChronicConditionsSelected = $filter('filter')($scope.chronicConditionList, {checked:true});
    }


	/*Chronic Condition End here*/




    /*Medication Allegies Start here*/

    // Get list of Medication Allegies List
   // $scope.MedicationAllegiesList = $rootScope.medicationAllergiesCodesList;
    /*
	for(var i=0; i < $scope.MedicationAllegiesList.length; i++){
		if($scope.MedicationAllegiesList[i].text === 'Other'){
			//$scope.MedicationAllegiesList.shift();
			var index = $scope.MedicationAllegiesList.indexOf($scope.MedicationAllegiesList[i]);
  			$scope.MedicationAllegiesList.splice(index, 1);
		}
	}

	for(var i=0; i < $scope.chronicConditionList.length; i++){
		if($scope.chronicConditionList[i].text === 'Other'){
			//$scope.MedicationAllegiesList.shift();
			var index = $scope.chronicConditionList.indexOf($scope.chronicConditionList[i]);
  			$scope.chronicConditionList.splice(index, 1);
		}
	}
	*/
     // Get list of Medication Allegies Pre populated
  /* $scope.GoToMedicationAllegies = function(AllegiesCountValid) {
        $rootScope.AllegiesCountValid = AllegiesCountValid;
		if(typeof $rootScope.AllegiesCountValid != 'undefined' ||  $rootScope.AllegiesCountValid != '') {
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

		 $scope.clearSelectionAndRebindSelectionList($rootScope.MedicationAllegiesItem, $rootScope.MedicationAllegiesList);

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
        $rootScope.MedicationAllegiesItem = $filter('filter')($scope.MedicationAllegiesList, {checked:true});
			if($rootScope.MedicationAllegiesItem !== '') {
				$rootScope.patinentMedicationAllergies = $rootScope.MedicationAllegiesItem;
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
		if($rootScope.checkedAllergies === 4) {
			$scope.closeMedicationAllegies();
		}
        /*
		if(item.text === "Other"){
            $scope.openOtherMedicationAllgiesView(item);
        } else {
			if($rootScope.checkedAllergies === 4) {
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
                       if(item.checked) { if(item.text === "Other") item.checked = false; }
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
                      $rootScope.MedicationAllegiesList.splice(1, 0, newMedicationAllegiesItem);

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
		var indexPos = $rootScope.MedicationAllegiesList.indexOf(item);
		$rootScope.MedicationAllegiesList[indexPos].checked = false;
		$rootScope.AllegiesCount = $scope.patinentMedicationAllergies.length;
		$rootScope.checkedAllergies--;
		$rootScope.MedicationAllegiesItem = $filter('filter')($scope.MedicationAllegiesList, {checked:true});
    }

    /*Medication Allegies End here*/


      /*Current Medication Start here*/

    // Get list of Current Medication  List
      // $scope.CurrentMedicationList = $rootScope.currentMedicationsCodesList;

    // Get list of Current Medication Pre populated
   /* $scope.GoToCurrentMedication = function(MedicationCountValid) {
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
	 $scope.clearSelectionAndRebindSelectionList($rootScope.CurrentMedicationItem, $rootScope.CurrentMedicationList);

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
        $rootScope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {checked:true});
			if($rootScope.CurrentMedicationItem !== '') {
				$rootScope.patinentCurrentMedication = $rootScope.CurrentMedicationItem;
				$rootScope.MedicationCount = $scope.patinentCurrentMedication.length;
				$scope.modal.hide();
				//$scope.data.searchQuery = '';
			}
    };

      // Onchange of Current Medication
        if(item.checked == true) {
	        $rootScope.checkedMedication++;
      	}  else  {
	        $rootScope.checkedMedication--;
      	}

        if(item.text == "Other - (List below)"){
            $scope.openOtherCurrentMedicationView(item);
        } else {
			if($rootScope.checkedMedication === 4) {
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
                       if(item.checked) { if(item.text === "Other - (List below)") item.checked = false; }
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
                      $rootScope.CurrentMedicationList.splice(1, 0, newCurrentMedicationItem);

                      // $scope.CurrentMedicationList.push({ text: $scope.data.CurrentMedicationOther, checked: true });
						if($rootScope.checkedMedication === 4) {
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
      var indexPos = $rootScope.CurrentMedicationList.indexOf(item);
      $rootScope.CurrentMedicationList[indexPos].checked = false;
      $rootScope.MedicationCount = $scope.patinentCurrentMedication.length;
      $rootScope.checkedMedication--;
	   $rootScope.CurrentMedicationItem = $filter('filter')($scope.CurrentMedicationList, {checked:true});
    }

   /*Current Medication End here*/


    /* Prior Surgery page START */

    // Prior Surgery pre-populated
   /* $scope.GoTopriorSurgery = function(PriorSurgeryValid) {
        if(typeof PriorSurgeryValid === 'undefined' || PriorSurgeryValid === '') {
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
		/*if($scope.surgery.name === '' || $scope.surgery.dateString === ''){
            $scope.ErrorMessage = "Please provide a name/description for this surgery!";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if(($scope.surgery.name === undefined || $scope.surgery.dateString === undefined)) {
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
		if($scope.surgery.dateStringYear === yyyy) {
			if($scope.surgery.dateStringMonth > mm) {
				var isSurgeryDateIsFuture = false;
			}
		}

        if($scope.surgery.name == '' || $scope.surgery.name == undefined){
            $scope.ErrorMessage = "Please provide a name/description for this surgery";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
        } else if(($scope.surgery.dateStringMonth === '' || $scope.surgery.dateStringMonth === undefined || $scope.surgery.dateStringYear === '' || $scope.surgery.dateStringYear === undefined)) {
             $scope.ErrorMessage = "Please enter the date as MM/YYYY";
			$rootScope.ValidationFunction1($scope.ErrorMessage);
       /* }else if(!isSurgeryDateValid){
            $scope.ErrorMessage = "Surgery date should not be before your birthdate";
			$rootScope.ValidationFunction1($scope.ErrorMessage);*/
        }else if(!isSurgeryDateIsFuture){
            $scope.ErrorMessage = "Surgery date should not be the future Date";
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
      $rootScope.patientSurgeriess.splice(index, 1);
      var indexPos = $rootScope.patientSurgeriess.indexOf(item);
      $rootScope.IsToPriorCount--;
      //console.log($rootScope.IsToPriorCount--);
    }

	/*$scope.doGetHospitalInformation = function () {
			if ($rootScope.accessToken === 'No Token') {
				alert('No token.  Get token first then attempt operation.');
				return;
			}
			var params = {
				accessToken: $rootScope.accessToken,
				success: function (data) {
					$rootScope.getDetails = data.enabledModules;
					if($rootScope.getDetails !== '') {
						for (var i = 0; i < $rootScope.getDetails.length; i++) {
							if ($rootScope.getDetails[i] == 'InsuranceVerification') {
								$rootScope.insuranceMode = 'on';
							}
							//if ($rootScope.getDetails[i] === 'PaymentPageBeforeWaitingRoom') {
							if ($rootScope.getDetails[i] === 'ECommerce') {
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
    }*/


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
				if($scope.medFilter.length === 0) {
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
				if($scope.chronicFilter.length === 0) {
					$scope.ConsultationSaveData.medicalConditions.push(
						{code: $rootScope.PatientChronicCondition[i].codeId, description: $rootScope.PatientChronicCondition[i].text}
					);
				}
			}

			for (var i = 0; i < $rootScope.MedicationCount; i++) {
				$scope.medicationFilter = $filter('filter')($scope.ConsultationSaveData.medications, {code:$rootScope.patinentCurrentMedication[i].codeId});
				if($scope.medicationFilter.length === 0) {
					$scope.ConsultationSaveData.medications.push(
						{code: $rootScope.patinentCurrentMedication[i].codeId, description: $rootScope.patinentCurrentMedication[i].text}
					);
				}
			}


			/*$scope.ConsultationSaveData.concerns.push(
				{isPrimary: true, description: $rootScope.PrimaryConcernText},
				{isPrimary: false, description: $rootScope.SecondaryConcernText}
			);*/

			if(typeof $rootScope.PrimaryConcernText !== 'undefined') {
				$scope.primaryFilter = $filter('filter')($scope.ConsultationSaveData.concerns, {description:$rootScope.PrimaryConcernText});
				if($scope.primaryFilter.length === 0) {
					$scope.ConsultationSaveData.concerns.push(
						{isPrimary: true, description: $rootScope.PrimaryConcernText, customCode: {code: $rootScope.codeId, description: $rootScope.PrimaryConcernText}}
					);
				}
			}
			if(typeof $rootScope.SecondaryConcernText !== 'undefined') {
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
					if($rootScope.paymentMode === 'on' && $rootScope.consultationAmount !== 0) {
						$rootScope.doGetPatientPaymentProfiles();
					}
					$rootScope.enableInsuranceVerificationSuccess = "none";
					$rootScope.healthPlanPage = "none";
					if($rootScope.insuranceMode != 'on' && $rootScope.paymentMode != 'on') {
						$rootScope.enablePaymentSuccess = "none";
						$state.go('tab.receipt');
							$scope.ReceiptTimeout();
					} else if($rootScope.insuranceMode === 'on' && $rootScope.paymentMode !== 'on'){
						$rootScope.verifyInsuranceSection = "none";
						$rootScope.openAddHealthPlanSection();
						$state.go('tab.consultCharge');
					}else {
						if($rootScope.consultationAmount > 0)	{
							if($rootScope.insuranceMode !== 'on' && $rootScope.paymentMode === 'on') {
								$rootScope.consultChargeSection = "none";
								$rootScope.healthPlanSection = "block";
								$rootScope.healthPlanPage = "none";
								$rootScope.consultChargeNoPlanPage = "block";
							}
							$state.go('tab.consultCharge');
							if(typeof $rootScope.userDefaultPaymentProfile == "undefined"){
								$('#addNewCard').val('Choose Your Card');
								$('#addNewCard_addCard').val('Choose Your Card');
								$('#addNewCard_submitPay').val('Choose Your Card');
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
					$rootScope.MedicationCount == 'undefined';
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
		if($state.current.name !== "tab.login" || $state.current.name !== "tab.loginSingle"){
			checkAndChangeMenuIcon = $interval(function(){
				$rootScope.checkAndChangeMenuIcon();
			}, 300);
		}
 };



})
