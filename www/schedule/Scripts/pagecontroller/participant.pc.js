/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snap.controller.js" />


; (function ($, $snap) {

    var participantController = new snap.Controller({
        layout: {
            url: '/content/participant/participantlayout.html',
            container: 'layoutMain',
            header: {
                templateUrl: '/content/participant/participantheader.html',
                container: ".wrapper",
                viewModel: {
                    vm: "snap.participant.ParticipantHeaderViewModel",
                    url: "/Scripts/viewModels/participant/participantheader.viewmodel.js"
                }
            },
            sideBar: null,
            require: [
                    "//static.opentok.com/v2.10.0/js/opentok.min.js",
                    "/Scripts/hubs/chatHub.js?svp=snapversion",
                    "/Scripts/services/messenger.service.js?svp=snapversion",
                    "/Scripts/hubs/messengerHub.js?svp=snapversion"
            ]
        }
    });

    participantController.on("onheaderready", function () {
        snap.utility.PageStyle().applyStyleV3().then(function () {
            if (UnBlockContainer) {
                UnBlockContainer();
            }
        });
    });

    participantController.on("onBeforePageChange", function (from, to) {
        snap.clearPage();
        var fromName = from.name;

        if (fromName == "default") {
            try{
                var $tokboxViewModel = snap.resolveObject("snap.shared.TokboxViewModel");
                if ($tokboxViewModel && $tokboxViewModel.session) {
                    $tokboxViewModel.session.disconnect();
                }
            }
            catch(err){}
        
        }
    });
    participantController.addAction({
        name: "default",
        routeUrl: "/",
        templateUrl: '/content/participant/participantconsultation.html',
        region: "viewcontainer",
        require: [
           "//static.opentok.com/v2.10.0/js/opentok.min.js",
          "/Scripts/min/consultationCommon.min.js",
          "/Scripts/services/guestConsultationService.js",
          "/Scripts/viewModels/consultation/participantConsultationChat.js",
          "/Scripts/pagevm/participant/participant.js",
          "/Scripts/hubs/chatHub.js"

        ],
        viewModel: null
    }).then(function () {
        snap.consultationSession = snap.consultationSession || {};
        snap.consultationSession.consultationId = sessionStorage.getItem("consultationId");
        snap.consultationSession.meetingId = sessionStorage.getItem("meetingId");
        snap.ParticipantPage = true;
        $('body').addClass("appointment-rm");
        snap.cachedGetHtml("/content/shared/consultationBody.html").done(function (data) {
            $(".consulationcontainer").html(data);
            $('#chatCont').addClass('chat--patient chat--guest');
          
            $(function () {
                var pageVm = new snap.patient.PatientAppointmentViewModel();
                if (pageVm) {
                    pageVm.appointmentId = snap.consultationSession.consultationId;
                    pageVm.init();
                }
            });

        });
    });
    




    participantController.addAction({
        name: "openconsultation",
        routeUrl: "/openconsultation",
        templateUrl: '/content/shared/openclinicianconsultation.html',
        region: "viewcontainer",
        require: [
           "/Scripts/min/consultationCommon.min.js",
           "/Scripts/tokbox/tokboxModule.js",
           "/Scripts/viewmodels/shared/openconsultation.viewmodel.js",
           "/Scripts/pagevm/sharedvm/openconsultation.js"
        ],
        viewModel: null
    }).then(function () {
        snap.ConsultationPage = true;
        snap.publicPage = true;

        $('body').addClass("appointment-rm");

        snap.getSnapConsultationSession();
        var detailsObj = {
            isMenuToggleVisible: false
        };
        snap.cachedGetHtml("/content/shared/openconsultationbody.html").done(function (data) {
            $(".consulationcontainer").html(data);
            $('#chatCont').addClass('chat--admin');
            var pageVm = new snap.physician.OpenAppointmentViewModel();
            if (pageVm) {
                pageVm.init();
            }
        });
    });
    participantController.start();

}(jQuery, snap));
