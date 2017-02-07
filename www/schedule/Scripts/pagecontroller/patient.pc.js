/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snap.controller.js" />


; (function ($, snap) {
    "use strict";

    var patientController = new snap.Controller({
        layout: {
            url: '/content/patient/patientLayout.html',
            container: 'layoutMain',
            header: {
                templateUrl: '/content/patient/patientheader.html',
                container: ".wrapper",
                viewModel: {
                    vm: "snap.patient.PatientHeaderViewModel",
                    url: "/Scripts/viewModels/patient/patientheader.viewmodel.js"
                }
            },
            sideBar: {
                templateUrl: '/content/patient/patientsidebar.html',
                container: "body",
                viewModel: {
                    vm: "snap.patient.PatientHeaderViewModel",
                    url: "/Scripts/viewModels/patient/patientheader.viewmodel.js"
                }
            }
        }
    });

  var headerLoaded = $.Deferred();
    patientController.on("onheaderready", function () {
        snap.patient.PatientHeaderViewModel().isProviderAvailable().done(function () {
            headerLoaded.resolve();
        });

        snap.utility.PageStyle().applyStyleV3().then(function () {
                if (UnBlockContainer) {
                    UnBlockContainer();
                }
        });
      
    });

    patientController.addAction({
        name: "home",
        routeUrl: "/home",
        templateUrl: '/content/patient/patienthome.html',
        region: "viewcontainer",
        require: [
            "//static.opentok.com/v2.10.0/js/opentok.min.js",
            "/Scripts/min/patientHome.min.js",
            "/Scripts/viewModels/Admin/PatientRules/rulesService.js?svp=snapversion",
            "/Scripts/viewModels/patient/patientResponseAddressDialog.viewmodel.js"
        ],
        viewModel: {
            vm: "Snap.Patient.PatientHomeNewViewModel",
            url: "/Scripts/viewModels/patient/customerhome.new.viewmodel.js"
        }
    }).then(function (routerParam, viewObject) {
        snap.patient.PatientHeaderViewModel().set("isHideSubHeader", true);

        $('.wrapper').addClass('wrapper--patient-home');

        if (viewObject && viewObject.viewmodel) {
            viewObject.viewmodel.loadData();
            //viewObject.viewmodel.IsOpenForBusiness();
            $.when( headerLoaded).done(function () {
                viewObject.viewmodel.isProviderAvailable();
            });
            if (snap.hospitalSettings.eCommerce) {
                viewObject.viewmodel.checkForCredits();
            }
            viewObject.viewmodel.checkForReEntryConsultation();
        }
        $(function () {
            if (!isMobile.any()) {
                var helper = new snap.Helper();
                helper.checkTokboxBrowserRequirement();
            }

        });

    });

    patientController.addAction({
        name: "selfScheduling",
        routeUrl: "/selfScheduling(/:viewMode)",
        templateUrl: '/content/patient/schedule/providerSearch.html',
        region: "viewcontainer",
        require: [
          "/Scripts/min/patientHome.min.js",
          "/Scripts/slick.min.js",
          "/Scripts/viewModels/patient/overlay.viewmodel.js",
          "/Scripts/min/patientSelfSchedule.min.js"
        ],
        viewModel: {
            vm: "snap.patient.schedule.providerSearch",
            url: "/Scripts/viewModels/patient/Schedule/providerSearch.viewmodel.js"
        }
    }).then(function (routerParam, viewObject) {
        snap.patient.PatientHeaderViewModel().set("isHideSubHeader", false);
        snap.patient.PatientHeaderViewModel().set("isConsultHeader", false);
        $('.wrapper').removeClass('wrapper--patient-home');
        $('.header').addClass("header__patient-ss");

        var viewMode = routerParam[0] ? routerParam[0] : "all";

        if (viewObject && viewObject.viewmodel) {
            if (!viewObject.viewmodel.isDataInit) {
                viewObject.viewmodel.load();
            }
            viewObject.viewmodel.setViewMode(viewMode);
        }

        snap.patient.PatientHeaderViewModel().setSubHeader({ viewMode: viewMode, module: "Provider", subModule: viewMode === "all" ? "All providers" : "My providers" });
    });

    patientController.addAction({
        name: "patientScheduler",
        routeUrl: "/patientScheduler",
        templateUrl: '/content/patient/patientScheduler.html',
        region: "viewcontainer",
        viewModel: null
    }).then(function () {
    });
    var disconnectHubAndRemoveConsulationInfo = function () {
        var $mainHub = snap.resolveObject("snap.hub.mainHub");
        if ($mainHub) {
            $mainHub.stop();
            //extra event added to solve pre-page navigate
            delete $.connection.hub.qs["consultationId"];
        }
    };

    patientController.on("onBeforePageChange", function (from, to) {
        snap.clearPage();
        snap.patientPage = true;
        var fromName = from.name;
        var toName = to.name;
        if (fromName == "consultation" && toName != "consultation") {
            var $tokboxViewModel = snap.resolveObject("snap.shared.TokboxViewModel");
            if ($tokboxViewModel && $tokboxViewModel.session) {
                $tokboxViewModel.session.disconnect();
            }
            disconnectHubAndRemoveConsulationInfo();
            
        } else if (fromName == "patientwaiting" && toName != "patientwaiting") {
            disconnectHubAndRemoveConsulationInfo();
            if ($.connection.hub.qs["waitingroom"]) {
                delete $.connection.hub.qs["waitingroom"];
            }
        }
    });
    patientController.on("onPageChange", function (from, to) {
        var toName = to.name;
        if (toName != "patientwaiting" && toName != "consultation") {
            var headerViewModel = new snap.patient.PatientHeaderViewModel();
            if (headerViewModel) {
                headerViewModel.set("isConsultHeader", false);
            }
        }
    });


    patientController.addAction({
        name: "patientwaiting",
        routeUrl: "/waiting",
        templateUrl: '/content/patient/waitingbody.html',
        region: "viewcontainer",
        require: ["/Scripts/hubs/consultationHub.js",
            "/Scripts/snap.consultationHelper.js", "/Scripts/viewModels/common/helper.js", "/Scripts/hubs/chatHub.js",
            "/Scripts/services/messenger.service.js?svp=snapversion",
            "/Scripts/viewModels/common/timeUtils.js?svp=snapversion",
            "/Scripts/hubs/messengerHub.js?svp=snapversion",
            "/Scripts/hubs/snapWaitingRoomConsultationsHub.js",
            "/Scripts/viewModels/common/chatBase.js",
            "/Scripts/viewModels/common/preConsultationChatBase.js",
            "/Scripts/viewModels/clinician/patientQueue/doctorToPatientPreConsultationChat.viewmodel.js",
            "/Scripts/viewModels/common/contentLoader.js?svp=snapversion"],
        viewModel: {
            vm: "snap.patient.WaitingRoomViewModel",
            url: "/Scripts/pagevm/patient/patientwaitingroom.js"
        }

    }).then(function (routerParam, viewObject) {
        if (!snap.isUserLoggedIn()) {
            window.Location = snap.patientLogin();
        }
        if (!sessionStorage.getItem("snap_consultation_session")) {
            window.Location = snap.getPatientHome();
        }

        snap.isWaitingRoom = true;
        var vm = viewObject.viewmodel;
        if (vm) {
            kendo.bind($('.chat--patient-waiting'), vm);
            vm.checkPayment().done(function () {
                vm.start();
            }).fail(function () {
                window.console.log("get payment failure");
                window.location.href = snap.getPatientHome();
            });

            if (snap.patient.PatientHeaderViewModel) {
                snap.patient.PatientHeaderViewModel().set("isHideSubHeader", true);
                snap.patient.PatientHeaderViewModel().set("isConsultHeader", true);
            }

        }
        //remove back
        history.pushState(null, null, $(location).attr('href'));
        window.addEventListener('popstate', function () {
            history.pushState(null, null, $(location).attr('href'));
        });
    });
    
    patientController.addAction({
        name: "consultation",
        routeUrl: "/consultation",
        templateUrl: '/content/patient/patientconsultation.html',
        region: "viewcontainer",
        require: [
           "//static.opentok.com/v2.10.0/js/opentok.min.js",
          "/Scripts/min/consultationCommon.min.js",
          "/Scripts/pagevm/patient/patientAppointment.js",
          "/Scripts/viewModels/consultation/userConsultationChat.js"
        ],
        viewModel: null
    }).then(function (routerParam) {
        var param = routerParam[0];
        if (param && param.reload == 1) {
            //using replace so that we dont have two history for the consulation during re-enter
            location.replace("/Customer/Main/#/consultation");
            return;
        }
        snap.ConsultationPage = true;
        if (!snap.isUserLoggedIn()) {
            window.location = '/Customer/Login';
        }

        if (snap.patient.PatientHeaderViewModel) {
            snap.patient.PatientHeaderViewModel().set("isHideSubHeader", true);
            snap.patient.PatientHeaderViewModel().set("isConsultHeader", true);
        }
        $('body').addClass("appointment-rm");
        snap.getSnapConsultationSession();
        snap.cachedGetHtml("/content/shared/consultationBody.html").done(function (data) {
            $(".consulationcontainer").html(data);
            $('#chatCont').addClass('chat--patient');
            var pageVm = new snap.patient.PatientAppointmentViewModel();
            if (pageVm) {
                pageVm.appointmentId = snap.consultationSession.consultationId;
                pageVm.init();
            }

        });
    });


    patientController.start();

}(jQuery, snap));
