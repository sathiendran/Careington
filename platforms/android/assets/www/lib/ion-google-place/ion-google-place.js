angular.module('ion-google-place', [])
    .directive('ionGooglePlace', [
        '$ionicTemplateLoader',
        '$ionicBackdrop',
        '$q',
        '$timeout',
        '$rootScope',
        '$document',
        function($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $document) {
            return {
                require: '?ngModel',
                restrict: 'E',
                template: '<input type="text" readonly="readonly" class="ion-google-place" autocomplete="off">',
                replace: true,
                link: function(scope, element, attrs, ngModel) {
                    scope.locations = [];
                    var geocoder = new google.maps.Geocoder();
                    var searchEventTimeout = undefined;
					if($rootScope.currState.$current.name==="tab.registerStep1")  {
            var POPUP_TPL = [
							'<div class="ion-google-place-container" id="googleContainerId">',
								'<div style=" {{BackgroundColorGoogle}}">',
								 '<div class="bar bar-header item-input-inset" style="{{GoogleSearchStyle}}">',
									'<label class="item-input-wrapper">',
										'<i class="icon ion-ios7-search placeholder-icon"></i>',
										'<input class="google-place-search placeHolderCountrySearch localizejs" type="search" ng-model="gPlaceSearchQuery" placeholder="Enter your Address" autofocus>',
									'</label>',
									'<button class="button button-clear localizejs">',
										'Cancel',
									'</button>',
								 '</div>',
							   '</div>',
								'<ion-content class="has-header has-header" style="{{GoogleSearchContent}}">',
									'<ion-list>',
										'<ion-item ng-repeat="location in locations" style="{{CountrySearchItem}}" type="item-text-wrap" ng-click="selectLocationForRegister(location)">',
											'{{location.formatted_address}}',
										'</ion-item>',
									'</ion-list>',
								'</ion-content>',
							'</div>'
						].join('');

						var popupPromise = $ionicTemplateLoader.compile({
							template: POPUP_TPL,
							scope: scope,
							appendTo: $document[0].body
						});

          } else if($rootScope.currState.$current.name==="tab.healthinfo")  {
            var POPUP_TPL = [
							'<div class="ion-google-place-container" id="googleContainerId">',
								'<div style=" {{BackgroundColorGoogle}}">',
								 '<div class="bar bar-header item-input-inset" style="{{GoogleSearchStyle}}">',
									'<label class="item-input-wrapper">',
										'<i class="icon ion-ios7-search placeholder-icon"></i>',
										'<input class="google-place-search placeHolderCountrySearch localizejs" type="search" ng-model="gPlaceSearchQuery" placeholder="Enter your Address" autofocus>',
									'</label>',
									'<button class="button button-clear localizejs">',
										'Cancel',
									'</button>',
								 '</div>',
							   '</div>',
								'<ion-content class="has-header has-header" style="{{GoogleSearchContent}}">',
									'<ion-list>',
										'<ion-item ng-repeat="location in locations" style="{{CountrySearchItem}}" type="item-text-wrap" ng-click="selectLocationForUserAccount(location)">',
											'{{location.formatted_address}}',
										'</ion-item>',
									'</ion-list>',
								'</ion-content>',
							'</div>'
						].join('');

						var popupPromise = $ionicTemplateLoader.compile({
							template: POPUP_TPL,
							scope: scope,
							appendTo: $document[0].body
						});

          } else if($rootScope.currState.$current.name==="tab.addUser")  {
            var POPUP_TPL = [
              '<div class="ion-google-place-container" id="googleContainerId">',
                '<div style=" {{BackgroundColorGoogle}}">',
                 '<div class="bar bar-header item-input-inset" style="{{GoogleSearchStyle}}">',
                  '<label class="item-input-wrapper">',
                    '<i class="icon ion-ios7-search placeholder-icon"></i>',
                    '<input class="google-place-search placeHolderCountrySearch localizejs" type="search" ng-model="gPlaceSearchQuery" placeholder="Enter your Address" autofocus>',
                  '</label>',
                  '<button class="button button-clear localizejs">',
                    'Cancel',
                  '</button>',
                 '</div>',
                 '</div>',
                '<ion-content class="has-header has-header" style="{{GoogleSearchContent}}">',
                  '<ion-list>',
                    '<ion-item ng-repeat="location in locations" style="{{CountrySearchItem}}" type="item-text-wrap" ng-click="selectLocationForCoUser(location)">',
                      '{{location.formatted_address}}',
                    '</ion-item>',
                  '</ion-list>',
                '</ion-content>',
              '</div>'
            ].join('');

            var popupPromise = $ionicTemplateLoader.compile({
              template: POPUP_TPL,
              scope: scope,
              appendTo: $document[0].body
            });

          } else if($rootScope.currState.$current.name==="tab.addnewdependent")  {
            var POPUP_TPL = [
              '<div class="ion-google-place-container" id="googleContainerId">',
                '<div style=" {{BackgroundColorGoogle}}">',
                 '<div class="bar bar-header item-input-inset" style="{{GoogleSearchStyle}}">',
                  '<label class="item-input-wrapper">',
                    '<i class="icon ion-ios7-search placeholder-icon"></i>',
                    '<input class="google-place-search placeHolderCountrySearch localizejs" type="search" ng-model="gPlaceSearchQuery" placeholder="Enter your Address" autofocus>',
                  '</label>',
                  '<button class="button button-clear localizejs">',
                    'Cancel',
                  '</button>',
                 '</div>',
                 '</div>',
                '<ion-content class="has-header has-header" style="{{GoogleSearchContent}}">',
                  '<ion-list>',
                    '<ion-item ng-repeat="location in locations" style="{{CountrySearchItem}}" type="item-text-wrap" ng-click="selectLocationForUserDependent(location)">',
                      '{{location.formatted_address}}',
                    '</ion-item>',
                  '</ion-list>',
                '</ion-content>',
              '</div>'
            ].join('');

            var popupPromise = $ionicTemplateLoader.compile({
              template: POPUP_TPL,
              scope: scope,
              appendTo: $document[0].body
            });
          } else if($rootScope.currState.$current.name==="tab.cardeditDetails")  {
            var POPUP_TPL = [
              '<div class="ion-google-place-container" id="googleContainerId">',
                '<div style=" {{BackgroundColorGoogle}}">',
                 '<div class="bar bar-header item-input-inset" style="{{GoogleSearchStyle}}">',
                  '<label class="item-input-wrapper">',
                    '<i class="icon ion-ios7-search placeholder-icon"></i>',
                    '<input class="google-place-search placeHolderCountrySearch localizejs" type="search" ng-model="gPlaceSearchQuery" placeholder="Enter a City or ZIP" autofocus>',
                  '</label>',
                  '<button class="button button-clear localizejs">',
                    'Cancel',
                  '</button>',
                 '</div>',
                 '</div>',
                '<ion-content class="has-header has-header" style="{{GoogleSearchContent}}">',
                  '<ion-list>',
                    '<ion-item ng-repeat="location in locations" style="{{CountrySearchItem}}" type="item-text-wrap" ng-click="selectLocationForEditCardDetails(location)">',
                      '{{location.formatted_address}}',
                    '</ion-item>',
                  '</ion-list>',
                '</ion-content>',
              '</div>'
            ].join('');

            var popupPromise = $ionicTemplateLoader.compile({
              template: POPUP_TPL,
              scope: scope,
              appendTo: $document[0].body
            });
					} else {
            var POPUP_TPL = [
							'<div class="ion-google-place-container" id="googleContainerId">',
								'<div style=" {{BackgroundColorGoogle}}">',
								 '<div class="bar bar-header item-input-inset" style="{{GoogleSearchStyle}}">',
									'<label class="item-input-wrapper">',
										'<i class="icon ion-ios7-search placeholder-icon"></i>',
										'<input class="google-place-search placeHolderCountrySearch localizejs" type="search" ng-model="gPlaceSearchQuery" placeholder="Enter a City or ZIP">',
									'</label>',
									'<button class="button button-clear localizejs">',
										'Cancel',
									'</button>',
								 '</div>',
							   '</div>',
								'<ion-content class="has-header has-header" style="{{GoogleSearchContent}}">',
									'<ion-list>',
										'<ion-item ng-repeat="location in locations" style="{{CountrySearchItem}}" type="item-text-wrap" ng-click="selectLocation(location)">',
											'{{location.formatted_address}}',
										'</ion-item>',
									'</ion-list>',
								'</ion-content>',
							'</div>'
						].join('');

						var popupPromise = $ionicTemplateLoader.compile({
							template: POPUP_TPL,
							scope: scope,
							appendTo: $document[0].body
						});
					}
                    popupPromise.then(function(el){
                        var searchInputElement = angular.element(el.element.find('input'));

                        scope.selectLocation = function(location){
                            scope.address_components = location.address_components;
                            for(var k = 0; k < location.address_components.length; k++){
                                if(location.address_components[k].types.indexOf("postal_code") >= 0){
                                    scope.getCardDetails.CardZipCode = Number(location.address_components[k].long_name);
                                }
                                if(location.address_components[k].types.indexOf("administrative_area_level_1") >= 0){
                                    scope.getCardDetails.State = location.address_components[k].short_name;
                                }
                                if(location.address_components[k].types.indexOf("country") >= 0){
                                    scope.getCardDetails.Country = location.address_components[k].short_name;
                                    scope.getCardDetails.CountryFullName = location.address_components[k].long_name;
                                }
                                if(location.address_components[k].types.indexOf("locality") >= 0){
                                    scope.getCardDetails.City = location.address_components[k].long_name;
                                }

                            }
                            ngModel.$setViewValue(scope.getCardDetails.City);
                            ngModel.$render();
                            el.element.css('display', 'none');
                            $ionicBackdrop.release();
                        };

                         scope.selectLocationForEditCardDetails = function(location){
                            scope.address_components = location.address_components;
                            for(var k = 0; k < location.address_components.length; k++){
                                if(location.address_components[k].types.indexOf("postal_code") >= 0){
                                    scope.editCardDetails.cardEditZip = Number(location.address_components[k].long_name);
                                }
                                if(location.address_components[k].types.indexOf("administrative_area_level_1") >= 0){
                                    scope.editCardDetails.cardEditState = location.address_components[k].short_name;
                                }
                                if(location.address_components[k].types.indexOf("country") >= 0){
                                    scope.editCardDetails.cardEditCountry = location.address_components[k].long_name;
                                }
                                if(location.address_components[k].types.indexOf("locality") >= 0){
                                    scope.editCardDetails.cardEditCity = location.address_components[k].long_name;
                                }

                            }
                            ngModel.$setViewValue(scope.editCardDetails.cardEditCity);
                            ngModel.$render();
                            el.element.css('display', 'none');
                            $ionicBackdrop.release();
                        };

						 scope.selectLocationForRegister = function(location){
                            scope.regStep1.address = location.formatted_address;
                            ngModel.$setViewValue(scope.regStep1.address);
                            ngModel.$render();
                            el.element.css('display', 'none');
                            $ionicBackdrop.release();
                        };

            scope.selectLocationForUserAccount = function(location){

                    //  scope.userAddress = location.address_components;
                      for(var k = 0; k < location.address_components.length; k++){
                          if(location.address_components[k].types.indexOf("postal_code") >= 0){
                              var postCode = Number(location.address_components[k].long_name);
                          }
                          if(location.address_components[k].types.indexOf("administrative_area_level_1") >= 0){
                              var state = location.address_components[k].short_name;
                          }
                          if(location.address_components[k].types.indexOf("country") >= 0){
                              var country = location.address_components[k].long_name;
                          }
                          if(location.address_components[k].types.indexOf("locality") >= 0){
                              var city = location.address_components[k].long_name;
                          }

                      }
                    /*  if(typeof postCode == "undefined" || typeof state == "undefined" || typeof country =="undefined" || typeof city =="undefined") {
                      //  alert("City or State or Country or Zipcode is empty. Please Select Valid address!");
                        navigator.notification.alert(
                            'Address is invalid! Please select an address with Zip Code!', // message
                            function() {
                                //$state.go('tab.userhome');
                                return;
                            },
                            $rootScope.alertMsgName, // title
                            'Done' // buttonName
                        );
                      } else {*/
                           scope.healthInfoModel.address = location.formatted_address;
                           ngModel.$setViewValue(scope.healthInfoModel.address);
                           ngModel.$render();
                           el.element.css('display', 'none');
                           $ionicBackdrop.release();
                        // }
                       };

                       scope.selectLocationForCoUser = function(location){

                               //  scope.userAddress = location.address_components;
                                 for(var k = 0; k < location.address_components.length; k++){
                                     if(location.address_components[k].types.indexOf("postal_code") >= 0){
                                         var postCode = Number(location.address_components[k].long_name);
                                     }
                                     if(location.address_components[k].types.indexOf("administrative_area_level_1") >= 0){
                                         var state = location.address_components[k].short_name;
                                     }
                                     if(location.address_components[k].types.indexOf("country") >= 0){
                                         var country = location.address_components[k].long_name;
                                     }
                                     if(location.address_components[k].types.indexOf("locality") >= 0){
                                         var city = location.address_components[k].long_name;
                                     }

                                 }
                              /*   if(typeof postCode == "undefined" || typeof state == "undefined" || typeof country =="undefined" || typeof city =="undefined") {
                                 //  alert("City or State or Country or Zipcode is empty. Please Select Valid address!");
                                   navigator.notification.alert(
                                       'Address is invalid! Please select an address with Zip Code!', // message
                                       function() {
                                           //$state.go('tab.userhome');
                                           return;
                                       },
                                       $rootScope.alertMsgName, // title
                                       'Done' // buttonName
                                   );
                                 } else {*/
                                      scope.newUSer.address = location.formatted_address;
                                      ngModel.$setViewValue(scope.newUSer.address);
                                      ngModel.$render();
                                      el.element.css('display', 'none');
                                      $ionicBackdrop.release();
                                    //}
                                  };

                                  scope.selectLocationForUserDependent = function(location){

                                          //  scope.userAddress = location.address_components;
                                            for(var k = 0; k < location.address_components.length; k++){
                                                if(location.address_components[k].types.indexOf("postal_code") >= 0){
                                                    var postCode = Number(location.address_components[k].long_name);
                                                }
                                                if(location.address_components[k].types.indexOf("administrative_area_level_1") >= 0){
                                                    var state = location.address_components[k].short_name;
                                                }
                                                if(location.address_components[k].types.indexOf("country") >= 0){
                                                    var country = location.address_components[k].long_name;
                                                }
                                                if(location.address_components[k].types.indexOf("locality") >= 0){
                                                    var city = location.address_components[k].long_name;
                                                }

                                            }
                                          /*  if(typeof postCode == "undefined" || typeof state == "undefined" || typeof country =="undefined" || typeof city =="undefined") {
                                            //  alert("City or State or Country or Zipcode is empty. Please Select Valid address!");
                                              navigator.notification.alert(
                                                  'Address is invalid! Please select an address with Zip Code!', // message
                                                  function() {
                                                      //$state.go('tab.userhome');
                                                      return;
                                                  },
                                                  $rootScope.alertMsgName, // title
                                                  'Done' // buttonName
                                              );
                                            } else {*/
                                                 scope.addNewDependent.homeadd = location.formatted_address;
                                                 ngModel.$setViewValue(scope.addNewDependent.homeadd);
                                                 ngModel.$render();
                                                 el.element.css('display', 'none');
                                                 $ionicBackdrop.release();
                                               //}
                                             };

                        scope.$watch('gPlaceSearchQuery', function(query){
                            if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                            searchEventTimeout = $timeout(function() {
                                if(!query) return;
                                if(query.length < 3);
                                geocoder.geocode({ address: query }, function(results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        scope.$apply(function(){
                                            scope.locations = results;
                                        });
                                    } else {
                                        // @TODO: Figure out what to do when the geocoding fails
                                    }
                                });
                            }, 350); // we're throttling the input by 350ms to be nice to google's API
                        });

                        var onClick = function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            $ionicBackdrop.retain();
                            el.element.css('display', 'block');
                            searchInputElement[0].focus();
                            setTimeout(function(){
                                searchInputElement[0].focus();
                            },0);
                        };

                        var onCancel = function(e){
                            scope.gPlaceSearchQuery = '';
                           $ionicBackdrop.release();
                           el.element.css('display', 'none');
                        };

                        element.bind('click', onClick);
                        element.bind('touchend', onClick);

                        el.element.find('button').bind('click', onCancel);
                    });

                    if(attrs.placeholder){
                        element.attr('placeholder', attrs.placeholder);
                    }


                    ngModel.$formatters.unshift(function (modelValue) {
                        if (!modelValue) return '';
                        return modelValue;
                    });

                    ngModel.$parsers.unshift(function (viewValue) {
                        return viewValue;
                    });

                    ngModel.$render = function(){
                        if(!ngModel.$viewValue){
                            element.val('');
                        } else {
                            element.val(ngModel.$viewValue);
                        }
                    };
                }
            };
        }
    ]);
