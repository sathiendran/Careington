angular.module('starter.controllers')
.controller('relateduserController', function($scope,$ionicPopup) {
    
     $scope.showdetails = true;
     $scope.showdnewetails=true;
     $scope.showarchieve=false;
     $scope.newarchieve=false;
     $scope.userdata=false;
     $scope.dependentshide=true;
     $scope.tabview=false;
     $scope.moretab=false;
     $scope.viewunauthorized=false;
      $scope.authorizedview=false;
      $scope.moredetails = function() {
        $scope.showdetails = false;
        $scope.showarchieve = true;
      
    };
    
      $scope.userdetails = function() {
          $scope.tabview=false;
                $scope.newarchieve = true;
         
        $scope.showdnewetails = false;
      
       
    };
    $scope.archievedetails=function(){
          $scope.showarchieve=false;
          $scope.showdetails = true;
    };
    
    $scope.archieve=function(){
          $scope.newarchieve=true;
          $scope.showdnewetails = false;
          
          
          
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
         $scope.showdnewetails=true;
          $scope.newarchieve=false;
       }
    
     
   });
          
          
          
    }; 
    $scope.showtab=function(){
          $scope.tabview=true;
    };
    
    $scope.moreclickval=function(){
        $scope.moretab=true;
        $scope.tabview=false;
    }
    
    $scope.hidemoretab=function(){
         $scope.moretab=false;
         $scope.tabview=true;
    }
    $scope.authorizeduser=function(){
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
       { text: 'Cancel' },
       {
         text: '<b>Confirm</b>',
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
        $scope.userdata=false;
    $scope.dependentshide=true;
    };
    $scope.dependentslist=function(){
        
        var myEl = angular.element( document.querySelector( '#dependents' ) );
            myEl.addClass('btcolor');
            myEl.removeClass('btnextcolor');
        var myEl = angular.element( document.querySelector( '#users' ) );
            myEl.removeClass('btcolor').css('color','#11c1f3');
            myEl.addClass('btnextcolor');
      $scope.userdata=true;
     $scope.dependentshide=false;
    }
});
	