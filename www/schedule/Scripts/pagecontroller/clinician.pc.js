//@ sourceURL=clinician.pc.js

/// <reference path="../../jquery-2.1.3.intellisense.js" />
/// <reference path="../../core/snap.core.js" />
/// <reference path="../../core/snap.controller.js" />


; (function ($, $snap) {
    snap.utility.PageStyle().applyStyleV3().then(function () {
        var providerController = new snap.Controller({
            layout: {
                url: '/content/clinician/clinicianlayout.html',
                container: 'layoutMain',
                header: {
                    templateUrl: '/content/clinician/clinicianHeadertemplate.html',
                    container: ".wrapper",
                    viewModel: {
                        vm: "snap.clinician.ClinicianHeaderViewModel",
                        url: "/Scripts/viewModels/clinician/clinicianHeader.viewmodel.js"
                    }
                },
                sideBar: {
                    templateUrl: '/content/clinician/cliniciansidebar.html', //todo
                    container: "body",
                    viewModel: {
                        vm: "snap.clinician.ClinicianHeaderViewModel",
                        url: "/Scripts/viewModels/clinician/clinicianHeader.viewmodel.js"
                    }
                },
                require: [
                    "//static.opentok.com/v2.10.0/js/opentok.min.js",
                    "/Scripts/hubs/hubModel.js?svp=snapversion",
                    "/Scripts/min/consultationCommon.min.js",
                    "/Scripts/hubs/chatHub.js?svp=snapversion",
                    "/Scripts/hubs/mainHub.js?svp=snapversion",
                    "/Scripts/hubs/snapWaitingRoomConsultationsHub.js?svp=snapversion",
                    "/Scripts/viewModels/common/contentLoader.js",
                    "/Scripts/services/messenger.service.js",
                    "/Scripts/hubs/messengerHub.js",
                    "/Scripts/viewModels/common/timeUtils.js"
                ]
            }
        });

        providerController.on("onheaderready", function () {
            var clinicianHeaderViewModel = snap.clinician.ClinicianHeaderViewModel();
            clinicianHeaderViewModel.initHubs();

            if (snap.isProviderChatEnabled()) {
                var $contentLoader = snap.common.contentLoader();
                snap.cachedGetScript("/scripts/tokbox/providerChatModule.js").done(function() {
                    var staffChatModule = {
                        vmPath: "/Scripts/viewModels/messenger/messenger.viewmodel.js?svp=snapversion",
                        vmName: "snap.Shared.MessengerViewModel",
                        contentPath: "/content/shared/messenger-template.html?svp=snapversion"
                    }
                    $contentLoader.loadModule(staffChatModule, "#staffChatContainer").done(function(vm) {
                        vm.init();
                        vm.initHeaderViewModel(clinicianHeaderViewModel);
                    });
                });
            }
        });
        var recheckOpenConsultionProgress = function () {
            var $appointmentService = snap.resolveObject("snap.service.appointmentService");

            $appointmentService.getPhysicianActiveOpenConsultations().then(function (data) {
                if (data && data.data) {
                    data = data.data[0];
                    if (data && data.createdByUserId > 0) {
                        var $messengerService = snap.resolveObject("snap.Service.MessengerService");

                        $messengerService.getParticipants(data.meetingId).then(function (participants) {
                            if (participants && participants.data && participants.data.length > 0) {
                                $.when($messengerService.getMeeting(data.meetingId), $messengerService.getMeetingSession(data.meetingId))
                                .then(function (meeting, meetingSession) {
                                    meeting = meeting[0].data[0];
                                    meetingSession = meetingSession[0].data[0];
                                    sessionStorage.setItem("meetingdata", JSON.stringify({
                                        meetingdata: meeting,
                                        sessiondata: meetingSession
                                    }));
                                    var $dialogWindow = snap.resolveObject("snap.common.dialogWindow");
                                    var _vm = snap.resolveObject("snap.clinician.patientQueue.reEnterOpenConsultationDialog");
                                    var notifyCinicianDialog = $dialogWindow.createNewDialog({
                                        vm: _vm,
                                        container: "#reEnterPopUpContainer",
                                        contentPath: "/content/clinician/patientQueue/reEnterOpenConsultation.html"
                                    });
                                    notifyCinicianDialog.open({
                                        meetingId: data.meetingId
                                    });
                                });

                            }
                        });
                    } else {
                        sessionStorage.removeItem("meetingdata");
                    }
                }
            });

        };
        providerController.on("onBeforePageChange", function (from, to) {
            snap.clearPage();
            var fromName = from.name;
            var toName = to.name;
            snap.encounterPageType = "none";
            if (fromName == "consultation" && toName != "consultation") {
                snap.ConsultationPage = false;
                var $tokboxViewModel = snap.resolveObject("snap.shared.TokboxViewModel");
                if ($tokboxViewModel && $tokboxViewModel.session) {
                    $tokboxViewModel.session.disconnect();
                }
            }
            if (toName == "patientQueue") {
                snap.ConsultationPage = false;
                var $openConsultationViewModel = snap.resolveObject("snap.shared.OpenConsultationTokboxViewModel");
              
                if ($openConsultationViewModel && $openConsultationViewModel.session) {
                    $openConsultationViewModel.session.disconnect();
                }
                
                var $providerHeader = snap.resolveObject("snap.clinician.ClinicianHeaderViewModel");
                if ($providerHeader) {
                    $providerHeader.set("isHideSubHeader", false);
                    $providerHeader.set("isSessionBtnVisible", false);
                    $providerHeader.set("isConsultHeader", false);
                    $providerHeader.isStarted = false;
                }

            }
            if(fromName == "openconsultation" && toName != "openconsultation" || fromName == "encounter" && toName != "encounter"){
                snap.ConsultationPage = false;
            }


            var $messengerViewModel = snap.resolveObject("snap.Shared.MessengerViewModel");
            if ($messengerViewModel) {
                $messengerViewModel.trigger("change", {field: "isConsultRoom"});
            }
           
            snap.hub.mainHub().register(snap.hub.MeetingHub(), { isVisibleForUsers: snap.isProviderChatEnabled() ? 1 : 0 });
        });
        //patient Queue
        providerController.addAction({
            name: "encounter",
            routeUrl: "/encounter(/:viewMode)",
            templateUrl: '/content/shared/encounter/encounter-rm-container.html',
            region: "viewcontainer",
            require: ["/Scripts/min/consultationCommon.min.js"],
            viewModel: { //todo
                vm: "snap.shared.encounterRoomsHub",
                url: "/Scripts/pagevm/sharedvm/encounter.js"
            }
        }).then(function (routerParam, viewObject) {
            snap.encounterPageType = routerParam[0];
            snap.ConsultationPage = true;
            $(function () {
                var $header = snap.resolveObject("snap.clinician.ClinicianHeaderViewModel");
                if ($header) {
                    $header.set("isHideAvatarBtn", false);
                    $header.set("isHideSubHeader", true);
                    $header.set("isSessionBtnVisible", true);
                    $header.set("isConsultHeader", true);
                }

                var $messengerViewModel = snap.resolveObject("snap.Shared.MessengerViewModel");
                if ($messengerViewModel) {
                    $messengerViewModel.trigger("change", {field: "isConsultRoom"});
                }
            });

            if (viewObject && viewObject.viewmodel) {
                viewObject.viewmodel.initPage(snap.encounterPageType);
                viewObject.viewmodel.loadView();
            }

        });

        providerController.addAction({
            name: "patientQueue",
            routeUrl: "/patientQueue",
            templateUrl: '/content/clinician/patientQueue.html',
            region: "viewcontainer",
            require: [
                "/Scripts/min/schedulerCommon.min.js",
                "/Scripts/min/providerPatientQueue.min.js"
            ],
            viewModel: {
                vm: "snap.clinician.patientQueue.patientQueue",
                url: "/Scripts/viewModels/clinician/patientQueue/patientQueue.viewmodel.js"
            }
        }).then(function (routerParam, viewObject) {
            if (viewObject && viewObject.viewmodel) {
                if (viewObject.viewmodel.isDataInit) {
                    viewObject.viewmodel.refresh();
                } else {
                    viewObject.viewmodel.load();
                }

                viewObject.viewmodel.checkForReEntryConsultation();
            }

            var detailsObj = {
                isMenuToggleVisible: true,
                hideSearchBtn: false,
                subHeaderTitle: "Dashboard",
                subHeaderModuleTitle: "Patient Queue",
                // toggleSearch: function () {
                //     snap.clinician.patientQueue.patientQueue().leftColToggle();
                // },
                hideAvatarBtn: false,
                panelToggle: {
                    action: function (e) {
                        snap.clinician.patientQueue.patientQueue().leftColToggle();
                        $(e.currentTarget).toggleClass('is-active');

                        if(snap.clinician.patientQueue.patientQueue().vm_showProfileDetails){
                            snap.clinician.patientQueue.patientQueue().vm_onProfileDetailsClose(e);
                        }
                    },
                    visible: true
                },
                linkOne: {
                    visible: false
                },
                linkTwo: {
                    visible: false
                },
                linkThree: {
                    visible: false
                },
                addButton: {
                    visible: false
                }
            };
            snap.clinician.ClinicianHeaderViewModel().setSubHeader(detailsObj);
            snap.clinician.ClinicianHeaderViewModel().set("isHideSearchBtn", true);
            snap.clinician.ClinicianHeaderViewModel().checkRxNTCredentials();

            //ToDo: this will be not necessary when we will have action event for page on controller change action.
            $('body').removeClass().addClass("cc-admin");
            recheckOpenConsultionProgress();

        });

        providerController.addAction({
            name: "consultation",
            routeUrl: "/consultation",
            templateUrl: '/content/clinician/clinicianconsultation.html',
            region: "viewcontainer",
            require: [
               "/Scripts/min/consultationCommon.min.js",
               "/Scripts/pagevm/clinician/physicianAppointment.js",
               "/Scripts/viewModels/consultation/userConsultationChat.js"
            ],
            viewModel: null
        }).then(function (routerParam, viewObject) {
            snap.ConsultationPage = true;
            var transport = routerParam[0] || {};
            transport = transport.transport;
            snap.signalTransport = transport;
            if (!$snap.isUserLoggedIn()) {
                window.location = '/Physician/waitingroom';
            }

            $(function () {
                var $header = snap.resolveObject("snap.clinician.ClinicianHeaderViewModel");
                if ($header) {
                    $header.set("isHideAvatarBtn", false);
                    $header.set("isHideSubHeader", true);
                    $header.set("isSessionBtnVisible", true);
                    $header.set("isConsultHeader", true);
                }
            });

            $('body').addClass("appointment-rm");

            snap.getSnapConsultationSession();
            var detailsObj = {
                isMenuToggleVisible: false
            };
            snap.cachedGetHtml("/content/shared/consultationBody.html").done(function (data) {
                $(".consulationcontainer").html(data);
                $('#chatCont').addClass('chat--admin');
                var pageVm = new snap.physician.PhysicianAppointmentViewModel();
                if (pageVm) {
                    pageVm.appointmentId = snap.consultationSession.consultationId;
                    pageVm.init();
                }
            });
        });



        providerController.addAction({
            name: "openconsultation",
            routeUrl: "/openconsultation(/:meetingId)",
            templateUrl: '/content/shared/openclinicianconsultation.html',
            region: "viewcontainer",
            require: [
               "/Scripts/tokbox/tokboxModule.js",
               "/Scripts/viewmodels/shared/openconsultation.viewmodel.js",
               "/Scripts/pagevm/sharedvm/openconsultation.js"
            ],
            viewModel: null
        }).then(function (routerParam, viewObject) {
            var meetingId = routerParam[0] || 0;
            sessionStorage.setItem("homePageUrl", "#/patientQueue");
            snap.ConsultationPage = true;
            if (!$snap.isUserLoggedIn()) {
                window.location = '/Physician/waitingroom';
            }

            $(function () {
                var $header = snap.resolveObject("snap.clinician.ClinicianHeaderViewModel");
                if ($header) {
                    $header.set("isHideAvatarBtn", false);
                    $header.set("isHideSubHeader", true);
                    $header.set("isSessionBtnVisible", true);
                    $header.set("isConsultHeader", true);
                }

                var $messengerViewModel = snap.resolveObject("snap.Shared.MessengerViewModel");
                if ($messengerViewModel) {
                    $messengerViewModel.trigger("change", {field: "isConsultRoom"});
                }
            });

            $('body').addClass("appointment-rm");

            snap.getSnapConsultationSession();
            var detailsObj = {
                isMenuToggleVisible: false
            };
            snap.cachedGetHtml("/content/shared/openconsultationbody.html").done(function (data) {
                $(".consulationcontainer").html(data);
                $('#chatCont').addClass('chat--open-consult');
                var pageVm = new snap.physician.OpenAppointmentViewModel();
                if (pageVm) {
                    pageVm.init(meetingId);
                }
            });
        });
        //  

        providerController.addAction({
            name: "scheduler",
            routeUrl: "/scheduler(/:viewMode)",
            templateUrl: '/content/admin/scheduler.html',
            region: "viewcontainer",
            require: [
                "/scripts/min/schedulerCommon.min.js?svp=snapversion",
                "/Scripts/viewModels/Admin/Schedule/coverageSchedulerLeftBar.viewmodel.js?svp=snapversion"
            ],
            viewModel: {
                vm: "snap.admin.AdminSchedulerPageViewModel",
                url: "/Scripts/viewModels/Admin/Schedule/adminScheduler.viewmodel.js"
            }
            //viewModel: null
        }).then(function (routerParam, viewObject) {
            snap.patientPage = false;
            //This configuration object is actually required by AdminHeaderViewModel, not by ClinicianHeaderViewModel
            var detailsObj = {
                isMenuToggleVisible: true,
                subHeaderTitle: "Scheduler",
                hideSearchBtn: false,
                toggleSearch: function () { snap.admin.AdminSchedulerPageViewModel().leftColToggle(); },
                hideAvatarBtn: false,
                addButton: {
                    action: function () { snap.admin.AdminSchedulerPageViewModel().vm_addNewEventClick(); },
                    visible: true,
                },
                panelToggle: {
                    action: function () { snap.admin.AdminSchedulerPageViewModel().leftColToggle(); },
                    visible: true,
                },
                linkOne: {
                    visible: false
                },
                linkTwo: {
                    visible: true,
                    active: typeof (routerParam[0]) === "undefined" || routerParam[0] === "availabilities",
                    path: "#/scheduler/availabilities",
                    title: "Availability"
                },
                linkThree: {
                    visible: true,
                    active: routerParam[0] === "appointments",
                    path: "#/scheduler/appointments",
                    title: "Appointments"
                }
            };


            $('body').addClass('cc-scheduling');

            if (typeof (routerParam[0]) === "undefined" || routerParam[0] === "availabilities") {
                $('body').hasClass('appointments') ? $('body').removeClass('appointments') : null;
                $('body').addClass('availability');
            } else {
                $('body').hasClass('availability') ? $('body').removeClass('availability') : null;
                $('body').addClass('appointments');
            }

            if (viewObject && viewObject.viewmodel) {
                if (!viewObject.viewmodel.isDataInit) {
                    viewObject.viewmodel.initData(snap.common.schedule.ScheduleCommon().userType.clinician);
                }
                viewObject.viewmodel.setViewMode(routerParam[0]);
            }
            var headerVM = snap.resolveObject("snap.clinician.ClinicianHeaderViewModel");
            if (headerVM != null) {
                headerVM.setSubHeader(detailsObj);
                headerVM.set("isHideSubHeader", false);
            }
        });

        providerController.addAction({
            name: "default",
            routeUrl: "/",
            templateUrl: '/content/public/defaultview.html',
            region: "viewcontainer",
            viewModel: null,
        }).then(function (routerParam, viewObject) {

            //Note. In release 1.21 we hide Rules Scheduler. Redirect to home page.

            if (viewObject && viewObject.viewmodel) {
                viewObject.viewmodel.initData();
            }

        }).back(function () {

        });
        providerController.start();
        if (UnBlockContainer) {
            UnBlockContainer();
        }
    });

}(jQuery, snap));
