snap.namespace("snap.participant")
     .use(["eventaggregator"])
    .extend(kendo.observable).define("ParticipantHeaderViewModel", function ($eventaggregator) {
        var $scope = this;
        this.brandName = snap.hospitalSession.brandName;
        this.clientName = snap.hospitalSession.clientName;
        this.clientImage = snap.hospitalSession.hospitalLogo;
        this.altImage = "";
        this.profileName = "";

        this.user = snap.profileSession;
        $.extend(this.user, {
            age: snap.getAgeString(this.user)
        });
        this.fullName = function () {
            return snap.profileSession.fullName;
        }
        this.onNavClick = function (e) {
            e.preventDefault();
            $('body').toggleClass('is-main-nav');
        };
        var isWaitingRoom = function () {
            
            if (location.hash.toLowerCase().indexOf("#/waiting") > -1) {
                return true;
            }
            return false;
        }
        this.goToMyAccount = function () {
            if (isWaitingRoom()) {
                return false;
            }
            location.href = "/Customer/Users";
            return false;
        };
        this.goToHome = function () {
            if (isWaitingRoom()) {
                return false;
            }
         
            location.href = snap.getPatientHome();
            return false;
        }
        this.gotoProvider = function () {
            if (isWaitingRoom()) {
                return false;
            }
            location.href = "#/providers";
            return false;
        };
        this.gotoAccountSettings = function () {
            if (isWaitingRoom()) {
                return false;
            }
            location.href = "/Customer/AccountSettings";
            return false;
        };
        this.gotToTC = function () {
            if (isWaitingRoom()) {
                return false;
            }
            location.href = "#/t&C";
            return false;
        };
        this.logout=function()
        {
            if (isWaitingRoom()) {
                return false;
            }
            location.href = snap.patientLogin();
            return false;

        }
        this.goToHelp = function () {
            if (isWaitingRoom()) {
                return false;
            }
            location.href = snap.openHelp('patient');
            return false;

        }
        
        this.openConnectivity = function () {
            
            window.open('http://tokbox.com/tools/connectivity/');
            return false;

        }

        
        this.preventDefaultAction = function () {
            return false;
        }

        
}).singleton();