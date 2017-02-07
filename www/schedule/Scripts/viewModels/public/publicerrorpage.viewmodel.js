(function ($, snap) {
   

    snap.namespace("snap.shared")
        .using(["snap.enums.ErrorTypeEnum"])
	    .define("ErrorPageService", function ($errorTypeEnum) {
	       this.ErrorTypeEnum = {

	       }
	       this.errorContent = {
	       };

            var defaultMessage = 'Something went wrong and the error occurred!';
	        try {
                var errorGuid = sessionStorage.getItem('lastErrorId');
                sessionStorage.removeItem('lastErrorId');
                if (errorGuid)
                    defaultMessage += ' Id of this error record is ' + errorGuid;
	        } catch (exp) {
                console.error(exp);
            }

	       this.errorContent[$errorTypeEnum.Default] = {
	           errorMessage: defaultMessage
	       };

	       this.errorContent[$errorTypeEnum.EmailAlreadyInUse_Admin] = {
	           errorMessage: 'This Email has already been used',
	           actionOptions: [
                   {
                       optionRichText: "Please ask your system administrator to send you a new invitation <br /> or",
                       optionClass: "optionPlain",
                       onOptionClick: function (e) {
                           e.preventDefault();
                       },

                   },
                   {
                       optionRichText: " Go to the login screen",
                       optionClass: "optionLink",
                       onOptionClick: function (e) {
                           e.preventDefault();
                           window.location.href = '/Admin/Login';
                       }
                   }
	           ]

	       };
	       this.errorContent[$errorTypeEnum.TokenExpired_Admin] = {
	           errorMessage: 'The supplied token is expired or invalid',
	           actionOptions: [
                  {
                      optionRichText: "Please ask your system administrator to send you a new invitation <br /> or",
                      optionClass: "optionPlain",
                      onOptionClick: function (e) {
                          e.preventDefault();
                      },

                  },
                  {
                      optionRichText: " Go to the login screen",
                      optionClass: "optionLink",
                      onOptionClick: function (e) {
                          e.preventDefault();
                          window.location.href = '/Admin/Login'
                      },

                  }
	           ]
	       };
	       this.errorContent[$errorTypeEnum.EmailAlreadyInUse_Customer] = {
	           errorMessage: 'This Email has already been used',
	           actionOptions: [
                   {
                       optionRichText: " Go to the login screen",
                       optionClass: "optionLink",
                       onOptionClick: function (e) {
                           e.preventDefault();
                           window.location.href = snap.patientLogin();
                       },

                   }
	           ]

	       };
	       this.errorContent[$errorTypeEnum.TokenExpired_Customer] = {
	           errorMessage: 'The supplied token is expired or invalid',
	           actionOptions: [
                  {
                      optionRichText: " Go to the login screen",
                      optionClass: "optionLink",
                      onOptionClick: function (e) {
                          e.preventDefault();
                          window.location.href = snap.patientLogin();
                      },

                  }
	           ]
	       };
	      

	       this.errorContent[$errorTypeEnum.TokenInvalid_Invitation] = {
	           errorMessage: 'The supplied guest token is expired or invalid',
	           actionOptions: [
                  {
                      optionRichText: " Go to the login screen",
                      optionClass: "optionLink",
                      onOptionClick: function (e) {
                          e.preventDefault();
                          window.location.href = snap.patientLogin();
                      }

                  }
	           ]
	       };

	    }).singleton();

    snap.namespace("snap.shared")
        .extend(kendo.observable)
        .use(["snap.shared.ErrorPageService"])
	    .define("ErrorPage", function ($errorPageService) {

	        var $scope = this;
	        this.errorMessage = "";
	        this.actionOptions = [];
	      

	        this.resetViewModelData = function (errorType) {
	            
	            var errorData = $errorPageService.errorContent[errorType];
	          
	            $scope.set("errorMessage", errorData.errorMessage);
	            $scope.set("actionOptions", errorData.actionOptions);
	        }



	    });


})(jQuery, snap);