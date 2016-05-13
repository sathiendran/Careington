angular.module('starter.controllers')
.controller('addnewdependentController', function($scope,$ionicPlatform, $interval, $ionicSideMenuDelegate,$timeout, $rootScope, $state, LoginService,$stateParams,$location) {
  

 // $scope.myForm.firstname.$error.required=true;
 // $scope.myForm.firstname.$error.required=false;
  
   $('input').blur(function () {                        
                $(this).val(
                    $.trim($(this).val())
                );
            });
   var countUp = function() {
      $scope.tempfooter= true;
      $scope.permfooter= true;
    }
    $timeout(countUp, 2000);
     
 
   var minDate = new Date();
   var maxDate=minDate.getDay();
   var maxMonth=minDate.getMonth()+1;
   var maxYear=minDate.getFullYear();
   if(maxDate<10){
       var maxD="0"+maxDate;
   }
   if(maxMonth<10){
       var maxM="0"+maxMonth;
   }
   var maxDay=maxYear+"-"+maxM+"-"+maxD;
   var mDate="2016-05-04";
     $scope.maxDate1 = mDate;
     $scope.minimum ="1950-01-01";
     
    
  
	$('input.firstname').blur(function(){
		var value=$.trim($(this).val());
		$(this).val(value);
	});
    
    
    $("#homephone").blur(function () { 
        
      if (!this.value.match(/^[0-9]{1,18}$/)) {
          this.value = this.value.replace(/^[0-9]{1,18}$/g, '');
          alert("fail");
      }
    });
    $("#mobile").blur(function () { 
        
      if (!this.value.match(/^[0-9]{1,18}$/)) {
          this.value = this.value.replace(/^[0-9]{1,18}$/g, '');
          alert("fail");
      }
    });
    
    
    $scope.postDependentDetails=function(){
           $scope.firstName=$("#firstname").val();
           $scope.lastName=$("#lastname").val();
           $scope.email= $("#email").val();
           $scope.dob= $("#dob").val();
           $scope.relation= $("#relation").val();
           $scope.gender=$("input[name='depgender']:checked").val();
           $scope.height= $("#height").val();
           $scope.weight= $("#weight").val();
           $scope.homephone= $("#homephone").val();
           $scope.mobile= $("#mobile").val();
           $scope.homeaddress= $("#homeadd").val();
           $scope.organization= $("#organization").val();
           $scope.location= $("#location").val();
           $scope.organization= $("#organization").val();
           $scope.hairColor= $("#hairColor").val().split("@").slice(0,1);
           $scope.getHairColorId =_.first($scope.hairColor);
           $scope.eyeColor= $("#eyeColor").val().split("@").slice(0,1);
           $scope.getEyeColorId =_.first($scope.eyeColor);  
           $scope.ethnicity= $("#ethnicity").val().split("@").slice(0,1);
           $scope.getEthnicityId =_.first($scope.ethnicity); 
           $scope.heightunit= $("#heightunit").val().split("@").slice(0,1);
           $scope.getHeightunit =_.first($scope.heightunit); 
           $scope.weightunit= $("#weightunit").val().split("@").slice(0,1);
           $scope.getWeightunit =_.first($scope.weightunit);
            $scope.bloodtype= $("#bloodtype").val().split("@").slice(0,1);
           $scope.getBloodtypeid =_.first($scope.bloodtype); 
          // $scope.ethnicity= $("#ethnicity").val().split("@").slice(0,1);;
         
       if(  (typeof $scope.firstName === 'undefined' || $scope.firstName === '')  &&
            (typeof $scope.lastName === 'undefined' || $scope.lastName === '')  &&
             (typeof $scope.email === 'undefined' || $scope.email === '')  &&
             (typeof $scope.dob === 'undefined' || $scope.dob === '')  &&
             (typeof $scope.gender === 'undefined' || $scope.gender === '')  &&
             (typeof $scope.height === 'undefined' || $scope.height === '')  &&
             (typeof $scope.weight === 'undefined' || $scope.weight === '')  && 
             (typeof $scope.hairColor === 'undefined' || $scope.hairColor === '')  && 
             (typeof $scope.eyeColor === 'undefined' || $scope.eyeColor === '')  && 
             (typeof $scope.ethnicity === 'undefined' || $scope.ethnicity === '')  
        ) {
        //  $scope.ErrorMessage = "Please Enter All Required Fields";
            alert("Please Enter All Required Fields");  
       }
       else{
          // alert("fail");
           $scope.doPostNewDependentuser();
       }
       
    }
       $scope.doPostNewDependentuser = function() {
           var params = {					
						accessToken: $scope.accessToken,
						EmailAddress: $scope.email,						
						PatientProfileData: {
							patientId: $rootScope.patientId,
							patientName: $scope.firstName,
							lastName:  $scope.lastName,
							dob: $scope.dob,
							bloodType:  $scope.getBloodtypeid,
							eyeColor:  $scope.getEyeColorId,
							gender:  $scope.gender,
							enthicity: $scope.getEthnicityId,
							hairColor: $scope.getHairColorId,
							homePhone:  $scope.homephone,
							mobilePhone: $scope.mobile,
							schoolName: "",
							schoolContact: "",
							primaryPhysician: null,
							primaryPhysicianContact: null,
							physicianSpecialist: null,
							physicianSpecialistContact: null,
							preferedPharmacy: null,
							pharmacyContact: null,
							address:   $scope.homeaddress,
							profileImagePath: "/images/Patient-Male.gif",
							height: $scope.height,
							weight: $scope.weight,
							heightUnit: $scope.getHeightunit,
							weightUnit: $scope.getWeightunit,
							organization: "sample string 19",
							location: "sample string 20",
							organizationId: "",
							locationId: "",
							country: "+1"
						},
						TimeZoneId: 2,
						PatientProfileFieldsTracing: {
							ethnicity: true,
							address: true,
							bloodType: true,
							hairColor: true,
							eyeColor: true,
							country: true,
							height: true,
							heightUnit: true,
							weight: true,
							weightUnit: true,
							patientName: true,
							dob: true,
							gender: true,
							mobilePhone: true,
							lastName: true,
							email: true,
							timeZone: true
						},
						PatientMedicalHistoryData: {
							patientId: $scope.patientId,							
						},					
					
                        success: function (data) {
                           
                               $('#dependentuserform')[0].reset();
                               $('select').prop('selectedIndex', 0);
                               $state.go('tab.relatedusers');
                            console.log(data);
                        },
                          error: function (data) {
                            $rootScope.serverErrorMessageValidation();
                        }
            };
            LoginService.postNewDependentuser(params);
           
       }
    
    
    $scope.canceldependent=function(){
          $('#dependentuserform')[0].reset();
           $('select').prop('selectedIndex', 0);
           $state.go('tab.relatedusers');
    }
    
});