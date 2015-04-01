var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
	  if (i in this && this[i] === item) return i;
	}
	return -1;
}


angular.module('starter.controllers', [])

/*.controller('LoginCtrl', function($scope) {})*/
.controller('LoginCtrl', ['$scope', '$ionicModal', function ($scope, $ionicModal) {	


$scope.name ='';
    $scope.chosen = {};
    $scope.colors = [{Id: 'R', Name : 'Red'},{Id: 'G', Name : 'Green'},{Id: 'B', Name: 'Blue'}];

	$scope.patientList = [
		{ text: "This is a patient concern", checked: false },
		{ text: "This is a patient concern", checked: false },
		{ text: "This is a patient concern", checked: false },
		{ text: "This is a patient concern", checked: false },
		{ text: "This is a patient concern", checked: false },
		{ text: "This is a patient concern", checked: false },
		{ text: "This is a patient concern", checked: false }
	  ];

 $scope.chronicList = [
    { text: "This is a chronic condition", checked: false },
    { text: "This is a chronic condition", checked: false },
    { text: "This is a chronic condition", checked: false },
	{ text: "This is a chronic condition", checked: false },
	{ text: "This is a chronic condition", checked: false },
	{ text: "This is a chronic condition", checked: false },
	{ text: "This is a chronic condition", checked: false }
  ];
  
  $scope.medicationList = [
    { text: "This is a medication allergies", checked: false },
    { text: "This is a medication allergies", checked: false },
    { text: "This is a medication allergies", checked: false },
	{ text: "This is a medication allergies", checked: false },
	{ text: "This is a medication allergies", checked: false },
	{ text: "This is a medication allergies", checked: false },
	{ text: "This is a medication allergies", checked: false }
  ];
  
  $scope.currentList = [
    { text: "This is a current medication", checked: false },
    { text: "This is a current medication", checked: false },
    { text: "This is a current medication", checked: false },
	{ text: "This is a current medication", checked: false },
	{ text: "This is a current medication", checked: false },
	{ text: "This is a current medication", checked: false },
	{ text: "This is a current medication", checked: false }
  ];
  
  
  $scope.validate = function(){
  var numChecked = $filter($scope.devList, function(device) {
    return device.checked
  }).length;
  $scope.devList.length == numChecked;
  console.log($scope.devList.length);
}

  /*$scope.pushNotificationChange = function() {
    console.log('Push Notification Change', $scope.pushNotification.checked);
  };
  
  $scope.pushNotification = { checked: true };
  $scope.emailNotification = 'Subscribed';*/


	$scope.model = null;
	$scope.rightButtons = [
        { 
			type: 'button-positive',  
			content: '<i class="icon ion-navicon"></i>',
			tap: function(e) {
				$scope.date = null;
				$scope.modal.scope.model = {description :"",amount :""};
				$scope.openModal();
				  
			}
        }
    ]

    $ionicModal.fromTemplateUrl('templates/modal.html', 
        function(modal) {
            $scope.modal = modal;
		},
        {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope, 
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'

        }
    );
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function(model) {
        $scope.modal.hide();
    };

    $ionicModal.fromTemplateUrl('templates/datemodal.html', 
        function(modal) {
            $scope.datemodal = modal;
		},
		{
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope, 
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'

        }
    );
    $scope.opendateModal = function() {
        $scope.datemodal.show();
	};
    $scope.closedateModal = function(model) {
		$scope.datemodal.hide();
        $scope.date = model;
    };

    $scope.save =  function(model){
        alert("Date :"+$scope.date+" Description: "+model.amount+ " Amount: "+model.amount);
        $scope.closeModal();
    };
}])


.directive('pickadate', ['$locale', 'pickadateUtils', 'dateFilter', function($locale, dateUtils, dateFilter) {
      return {
        require: 'ngModel',
        scope: {
          date: '=ngModel',
          minDate: '=',
          maxDate: '=',
          disabledDates: '='
        },
        template:
          '<div class="pickadate">' +
            '<div class="pickadate-header">' +
              '<div class="pickadate-controls">' +
                '<a href="" class="pickadate-prev" ng-click="changeMonth(-1)" ng-show="allowPrevMonth">prev</a>' +
                '<a href="" class="pickadate-next" ng-click="changeMonth(1)" ng-show="allowNextMonth">next</a>' +
              '</div>'+
              '<h3 class="pickadate-centered-heading">' +
                '{{currentDate | date:"MMMM yyyy"}}' +
              '</h3>' +
            '</div>' +
            '<div class="pickadate-body">' +
              '<div class="pickadate-main">' +
                '<ul class="pickadate-cell">' +
                  '<li class="pickadate-head" ng-repeat="dayName in dayNames">' +
                    '{{dayName}}' +
                  '</li>' +
                '</ul>' +
                '<ul class="pickadate-cell">' +
                  '<li ng-repeat="d in dates" ng-click="setDate(d)" class="{{d.className}}" ng-class="{\'pickadate-active\': date == d.date}">' +
                    '{{d.date | date:"d"}}' +
                  '</li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>',

        link: function(scope, element, attrs, ngModel)  {
          var minDate       = scope.minDate && dateUtils.stringToDate(scope.minDate),
              maxDate       = scope.maxDate && dateUtils.stringToDate(scope.maxDate),
              disabledDates = scope.disabledDates || [],
              currentDate   = new Date();

          scope.dayNames    = $locale.DATETIME_FORMATS['SHORTDAY'];
          scope.currentDate = currentDate;

          scope.render = function(initialDate) {
            initialDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1, 3);

            var currentMonth    = initialDate.getMonth() + 1,
              dayCount          = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0, 3).getDate(),
              prevDates         = dateUtils.dateRange(-initialDate.getDay(), 0, initialDate),
              currentMonthDates = dateUtils.dateRange(0, dayCount, initialDate),
              lastDate          = dateUtils.stringToDate(currentMonthDates[currentMonthDates.length - 1]),
              nextMonthDates    = dateUtils.dateRange(1, 7 - lastDate.getDay(), lastDate),
              allDates          = prevDates.concat(currentMonthDates, nextMonthDates),
              dates             = [],
              today             = dateFilter(new Date(), 'yyyy-MM-dd');

            // Add an extra row if needed to make the calendar to have 6 rows
            if (allDates.length / 7 < 6) {
              allDates = allDates.concat(dateUtils.dateRange(1, 8, allDates[allDates.length - 1]));
            }

            var nextMonthInitialDate = new Date(initialDate);
            nextMonthInitialDate.setMonth(currentMonth);

            scope.allowPrevMonth = !minDate || initialDate > minDate;
            scope.allowNextMonth = !maxDate || nextMonthInitialDate < maxDate;

            for (var i = 0; i < allDates.length; i++) {
              var className = "", date = allDates[i];

              if (date < scope.minDate || date > scope.maxDate || dateFilter(date, 'M') !== currentMonth.toString()) {
                className = 'pickadate-disabled';
              } else if (indexOf.call(disabledDates, date) >= 0) {
                className = 'pickadate-disabled pickadate-unavailable';
              } else {
                className = 'pickadate-enabled';
              }

              if (date === today) {
                className += ' pickadate-today';
              }

              dates.push({date: date, className: className});
            }

            scope.dates = dates;
          };

          scope.setDate = function(dateObj) {
            if (isDateDisabled(dateObj)) return;
            ngModel.$setViewValue(dateObj.date);
          };

          ngModel.$render = function () {
            if ((date = ngModel.$modelValue) && (indexOf.call(disabledDates, date) === -1)) {
              scope.currentDate = currentDate = dateUtils.stringToDate(date);
            } else if (date) {
              // if the initial date set by the user is in the disabled dates list, unset it
              scope.setDate({});
            }
            scope.render(currentDate);
          };

          scope.changeMonth = function (offset) {
            // If the current date is January 31th, setting the month to date.getMonth() + 1
            // sets the date to March the 3rd, since the date object adds 30 days to the current
            // date. Settings the date to the 2nd day of the month is a workaround to prevent this
            // behaviour
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() + offset);
            scope.render(currentDate);
          };

          function isDateDisabled(dateObj) {
            return (/pickadate-disabled/.test(dateObj.className));
          }
        }
      };
}])


.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
