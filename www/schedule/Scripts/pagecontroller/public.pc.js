/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snap.controller.js" />


; (function ($, $snap) {
    
    var hospitalId;

    var promise = null;

    var getHospitalIdPromise = function () {
        if (promise != null) {
            return promise;
        }
        var path = '/GlobalFunctionality/GlobalSynchronousMethods.aspx/GetHospitalIdWithKeys';
        promise = $.ajax({
            url: path,
            async: false,
            type: 'POST',
            dataType: 'json',
            // data: "{ 'url': 'test'}",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var hospInfo = response.d.split("|");
                hospitalId = hospInfo[0];
                snap.hospitalId = hospitalId; //to load some items faster before session
                if (parseInt(hospitalId) === 0) {
                    window.location = "/404";
                }
                snap.apiDeveloperId = hospInfo[1];
                snap.apiKey = hospInfo[2];
            },
            error: function () {
                snapError("Hospital ID Failure");
            }
        });

        return promise;

    };

    var publicController = new snap.Controller({
        layout: {
            url: '/content/public/publicLayout.html?svp=snapversion',
            container: 'layoutMain',
            header: {
                templateUrl: '/content/public/publicHeader.html?svp=snapversion',
                viewModel: {
                    vm: "snap.public.PublicHeaderViewModel",
                    url: "/Scripts/viewModels/public/publicheader.viewmodel.js?svp=snapversion"
                }
            }
        }
    });

    publicController.on("onheaderready", function (vm) {
        getHospitalIdPromise().done(function () {
            vm.getClientInfo(hospitalId).done(function () {
                if (UnBlockContainer) {
                    UnBlockContainer();
                }
            });
        });
    });
    publicController.on("onBeforePageChange", function () {
        snap.clearPage();
        snap.publicPage = true;
    });
    publicController.addAction({
        name: "patientSignup",
        routeUrl: "/patientSignup",
        templateUrl: '/content/public/patient/patientSignup.html?svp=snapversion',
        region: "viewcontainer",
        require: [
            "/Scripts/viewModels/public/publicheader.viewmodel.js?svp=snapversion"
        ],
        viewModel: {
            vm: "snap.public.RegisterPatientPageViewModel",
            url: "/Scripts/viewModels/public/patientregister.viewmodel.js?svp=snapversion"
        }
    }).then(function (routerParam, viewObject) {
        snap.patientPage = true;

        if (viewObject && viewObject.viewmodel) {
            viewObject.viewmodel.initData();
        }
        snap.datepickers.initializeDatePickerPlaceholders();
    });

    publicController.addAction({
        name: "patientSignupConfirm",
        routeUrl: "/patientSignupConfirm",
        templateUrl: '/content/public/patient/patientSignupConfirm.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: null,
    }).then(function () {
        snap.patientPage = true;
    });

    publicController.addAction({
        name: "Error",
        routeUrl: "/error/(:errorType)",
        templateUrl: '/content/public/error.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.shared.ErrorPage",
            url: "/Scripts/viewModels/public/publicerrorpage.viewmodel.js?svp=snapversion"
        },
    }).then(function (routerParam, viewObject) {
        snap.patientPage = true;

        var errorType = routerParam[0] || 0;
        
        if (viewObject && viewObject.viewmodel) {
            viewObject.viewmodel.resetViewModelData(errorType);
        }
    });

    publicController.addAction({
        name: "registerCoUser",
        routeUrl: "/registerCoUser/:tokenParam",
        templateUrl: '/content/public/coRegister.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.CoUserRegisterViewModel",
            url: "/Scripts/viewModels/public/coUserRegister.viewmodel.js?svp=snapversion"
        }
    }).then(function (routerParam, viewObject) {
        snap.patientPage = true;
        if (viewObject && viewObject.viewmodel) {
            var token = routerParam[0];
            viewObject.viewmodel.initViewAndModel(token, function () {
            }, function (errorType) {
                var rUrl = "/error/" + errorType;
                publicController.navigate(rUrl);
            });

        }
        snap.datepickers.initializeDatePickerPlaceholders();
    });


    publicController.addAction({
        name: "patientActivate",
        routeUrl: "/patientActivate/:tokenParam",
        templateUrl: '/Content/public/patient/patientAccountActivation.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.Patient.AccountActivationViewModel",
            url: "/Scripts/viewModels/public/patientActivateAccount.viewmodel.js?svp=snapversion"
        }
    }).then(function (routerParam, viewObject) {
        snap.patientPage = true;

        if (viewObject && viewObject.viewmodel) {
            var token = routerParam[0];
            viewObject.viewmodel.initViewModel(token, function () {
            }, function (errorType) {
                var rUrl = "/error/" + errorType;
                publicController.navigate(rUrl);
            });

        }
    });

    publicController.addAction({
        name: "patientCreatePassword",
        routeUrl: "/patientCreatePassword/:tokenParam",
        templateUrl: '/content/public/adminSignup.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.admin.RegisterViewModel",
            url: "/Scripts/viewModels/public/adminInvitePatient.viewmodel.js?svp=snapversion"
        }
    }).then(function (routerParam, viewObject) {
        snap.patientPage = true;
        
        if (viewObject && viewObject.viewmodel) {
            // viewObject.viewmodel.setServiceType(2);
            var token = routerParam[0];
            viewObject.viewmodel.initData(token, function () {
            }, function (errorType) {
                var rUrl = "/error/" + errorType;
                publicController.navigate(rUrl);
            });

        }
    });

    publicController.addAction({
        name: "patientForgotPassword",
        routeUrl: "/customer/forgotpassword",
        templateUrl: '/content/public/forgotPassword.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.Patient.ForgotPasswordViewModel",
            url: "/Scripts/viewModels/public/forgotPassword.viewmodel.js?svp=snapversion"
        }
    }).then(function (routerParam, viewObject) {
        snap.patientPage = true;
        if (viewObject && viewObject.viewmodel) {
            viewObject.viewmodel.initViewModel(hospitalId);
        }
        $('#divNeedAccount').show();
    });

    publicController.addAction({
        name: "adminForgotPassword",
        routeUrl: "/admin/forgotpassword",
        templateUrl: '/content/public/forgotPassword.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.Patient.ForgotPasswordViewModel",
            url: "/Scripts/viewModels/public/forgotPassword.viewmodel.js?svp=snapversion"
        }
    }).then(function (routerParam, viewObject) {
        snap.patientPage = false;
        snap.adminPage = true;
        snap.clinicianPage = false;
        if (viewObject && viewObject.viewmodel) {
            viewObject.viewmodel.initViewModel(hospitalId);
        }
    });

    publicController.addAction({
        name: "clinicianForgotPassword",
        routeUrl: "/physician/forgotpassword",
        templateUrl: '/content/public/forgotPassword.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.Patient.ForgotPasswordViewModel",
            url: "/Scripts/viewModels/public/forgotPassword.viewmodel.js?svp=snapversion"
        }
    }).then(function (routerParam, viewObject) {
        snap.patientPage = false;
        snap.clinicianPage = true;
        snap.adminPage = false;
        if (viewObject && viewObject.viewmodel) {
            viewObject.viewmodel.initViewModel(hospitalId);
        }
    });

    publicController.addAction({
        name: "patientResetPassword",
        routeUrl: "/patientResetPassword/:tokenParam",
        templateUrl: '/content/public/setPassword.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.Patient.ResetAccountPasswordViewModel",
            url: "/Scripts/viewModels/public/patientResetPassword.viewmodel.js?svp=snapversion"
        }
    }).then(function (routerParam, viewObject) {
        snap.patientPage = true;

        if (viewObject && viewObject.viewmodel) {
            viewObject.viewmodel.setServiceType(1);
            var token = routerParam[0];
            viewObject.viewmodel.initViewModel(token, function () {
            }, function (errorType) {
                var rUrl = "/error/" + errorType;
                publicController.navigate(rUrl);
            });

        }
    });

    publicController.addAction({
        name: "adminRegisterCoUser",
        routeUrl: "/adminRegisterCoUser/:tokenParam",
        templateUrl: '/content/public/coRegister.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.admin.adminRegisterViewModel",
            url: "/Scripts/viewModels/public/adminregister.viewmodel.js"
        }
    }).then(function (routerParam, viewObject) {
        snap.loadSyncScript("/Scripts/snap.filesharing.js?svp=snapversion");
        if (viewObject && viewObject.viewmodel) {
            var token = routerParam[0];
            viewObject.viewmodel.initData(token, function () {
            }, function (errorType) {
                var rUrl = "/error/" + errorType;
                publicController.navigate(rUrl);
            });

        }
        snap.datepickers.initializeDatePickerPlaceholders();
    });

    publicController.addAction({
        name: "adminResetPassword",
        routeUrl: "/adminResetPassword/:tokenParam",
        templateUrl: '/content/public/setPassword.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.Admin.ResetAccountPasswordViewModel",
            url: "/Scripts/viewModels/public/adminResetPassword.viewmodel.js?svp=snapversion"
        }
    }).then(function (routerParam, viewObject) {
        $(".snapmd").show();
        
        if (viewObject && viewObject.viewmodel) {
            var token = routerParam[0];
            viewObject.viewmodel.initViewModel(token, hospitalId, function () {
            }, function (errorType) {
                var rUrl = "/error/" + errorType;
                publicController.navigate(rUrl);
            });

        }
    });

    // User Terms page 

    function ShowUserTerms( pdfFileLink ) {
        snap.publicPage = true;
        function getHospitalDocText(id, hospitalId) {
            var apiPath = "/api/v2/publicdocuments";
            var data = "documentType=" + id + "&hospitalId=" + hospitalId;
            return $.ajax({
                url: apiPath,
                type: 'GET',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: data
            });
        }
        getHospitalIdPromise().then(function () {
            getHospitalDocText(1, hospitalId).success(function () {
                function htmlDecode(value) {

                    if (value != null)
                        return $('<div/>').html(value).text();

                    return value;
                }

                var termsText = htmlDecode(arguments[0].data[0].documentText);
                termsText = termsText.replace(/%PDFLINK%/g, pdfFileLink),

                $('.terms-container').html(termsText);
            });

        });
    }

    publicController.addAction({
        name: "UserTerms",
        routeUrl: "/userTerms",
        templateUrl: '/content/public/userTerms.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: null
    }).then(function () {
        ShowUserTerms("/content/EUA-Patient-Consumer.pdf");
    });

    publicController.addAction({
        name: "UserTermsProvider",
        routeUrl: "/userTermsProvider",
        templateUrl: '/content/public/userTerms.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: null
    }).then(function () {
        ShowUserTerms("/content/EUA-Customer-Provider.pdf");
    });

    //Join
   
    publicController.addAction({
        name: "join",
        routeUrl: "/join/:joinKet",
        templateUrl: '/content/public/guest/joinpage.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.Encounter.guestViewModel",
            url: "/Scripts/viewModels/public/guestjoin.viewmodel.js?svp=snapversion"
        }
    }).then(function ($routeParam, $viewInfo) {
        sessionStorage.setItem("homePageUrl", "/Public/#/joindisconnect");
        var joinToken = $routeParam[0];
        var params = $routeParam[1] || {};

        var viewModel = $viewInfo.viewmodel;
        
        //tony.y: function for callback after token been exchanged.
        var goodWay = function (response) {
            joinToken = response.data[0];
            var consulationType = 1;
            var participantId = null;
            var senderParticipantId = null;
            var senderUserId = 0;
            if ($.isPlainObject(params) && params.userId) {
                consulationType = params.consultationtype;
                participantId = params.participantId;
                senderParticipantId = params.senderParticipantId;
                senderUserId = params.userId;
            }
            if (consulationType !== 1) {
                consulationType = +consulationType;
            }

            if (viewModel) {
                //tony.y: maybe can fix #8983
                try {
                    window.snap = snap || {};
                    snap.userSession = snap.userSession || { token: joinToken };
                    snap.userSession.apiDeveloperId = snap.apiDeveloperId;
                    snap.userSession.apiKey = snap.apiKey;
                    snap.updateSnapUserSessionValue("isGuest", true);

                } finally {
                    viewModel.initJoinPage(joinToken, consulationType, participantId, senderParticipantId, senderUserId);
                }
            }
        }

        var badWay = function () {
            var rUrl = "/error/" + snap.enums.ErrorTypeEnum().TokenInvalid_Invitation;
            publicController.navigate(rUrl);
        };

        viewModel.exchangeToken(joinToken).then(goodWay, badWay);
    });
    
    publicController.addAction({
        name: "decline",
        routeUrl: "/decline(/)(:joinKet)",
        templateUrl: '/content/public/guest/declinepage.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: {
            vm: "snap.Encounter.guestViewModel",
            url: "/Scripts/viewModels/public/guestjoin.viewmodel.js?svp=snapversion"
        }
    }).then(function ($routeParam, $viewInfo) {
        var joinToken = $routeParam[0];
        var params = $routeParam[1] || {};
        var consulationType = 1;
        var participantId = null;
        var senderParticipantId = null;
        var senderUserId = 0;
        if ($.isPlainObject(params) && (params.userId ||  params.consultationtype)) {
            consulationType = params.consultationtype;
            participantId = params.participantId;
            senderParticipantId = params.senderParticipantId;
            senderUserId = params.userId;
        }
        if (consulationType !== 1) {
            consulationType = +consulationType;
        }
        var viewModel = $viewInfo.viewmodel;
        if (viewModel && joinToken) {
            if (consulationType == 1) {
                viewModel.initJoinPage(joinToken, consulationType, participantId, senderParticipantId, senderUserId).then(function () {
                    viewModel.declineConsultation(joinToken);
                }, function () {
                    snapError("Error occurred while decline token");
                });
            } else {
                viewModel.exchangeToken(joinToken);
            }
        }
    });

    publicController.addAction({
        name: "join disconnect",
        routeUrl: "/joindisconnect",
        templateUrl: '/content/public/guest/joindisconnect.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: null
    }).then(function () {
    });
    publicController.addAction({
        name: "join exit",
        routeUrl: "/joinexit",
        templateUrl: '/content/public/guest/joinexitpage.html?svp=snapversion',
        region: "viewcontainer",
        viewModel: null
    }).then(function () {
    });
    publicController.start();

}(jQuery, snap));
