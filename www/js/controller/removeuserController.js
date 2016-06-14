angular.module('starter.controllers')
    .controller('removeuserController', function($scope) {
        $scope.removeitem = function() {
            var iEl = angular.element(document.querySelector('#removevalue'));
            iEl.remove();
        }
    });
