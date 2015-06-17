'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ionic','pickadate'])
.controller('AppCtrl', ['$scope', '$ionicModal', function ($scope, $ionicModal) {

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


        $ionicModal.fromTemplateUrl('modal.html', 
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

        $ionicModal.fromTemplateUrl('datemodal.html', 
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
}]);

