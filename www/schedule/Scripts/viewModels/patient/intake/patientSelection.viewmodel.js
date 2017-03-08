
(function (global, $, snap) {
    var patientSelectionViewModel,
        util = snap.util,
        app = global.app = global.app || {};

    patientSelectionViewModel = kendo.data.ObservableObject.extend({

        patientDependentRelation: [],
        currentPatient: null,
        isDependentAuthorizationDialogVisibile: false,
        isDependentAuthorizationConfirmationVisibile: false,
        dependentAuthorizationSelectedCode: null,

        showDependentAuthorizationSelectDialog: function (relationCode) {
            var that = this;
            that.set('isDependentAuthorizationDialogVisibile', true);
            that.set('dependentAuthorizationSelectedCode', relationCode);
        },

        showDependentAuthorizationConfirmationDialog: function () {
            var that = this;
            that.set('isDependentAuthorizationDialogVisibile', false);
            that.set('isDependentAuthorizationConfirmationVisibile', true);
        },

        closeDependentAuthorization: function () {
            var that = this;
            that.set('isDependentAuthorizationDialogVisibile', false);
            that.set('isDependentAuthorizationConfirmationVisibile', false);
        },

        patientSelected: function (patientProfile) {
            if (patientProfile !== null) {
                app.patientSelectionService.viewModel.set('currentPatient', patientProfile);

                if (!patientProfile.isAuthorized) {
                    app.patientSelectionService.viewModel.showDependentAuthorizationSelectDialog(patientProfile.relationCode);
                }
                else {
                    app.patientSelectionService.viewModel.SelectPatientProfile(patientProfile.patientId);
                }
            }
        },

        cancelConsultation : function (e) {
            snapConfirm("Are you sure that you want to cancel this consultation?");
            $("#btnConfirmYes").click(function () {
                $(".k-notification-confirmation").parent().remove();
                Snap.Patient.ApplyInsurancePlanViewModel().clearPlan();                    
                location.href = "/Customer/Main/#/home";
            });
            $("#btnConfirmNo").click(function () {
                $(".k-notification-confirmation").parent().remove();
            });
            e.preventDefault();
        },
        authorize: function () {
            var that = this;
            that.closeDependentAuthorization();

            if (that.currentPatient !== null) {
                if (that.dependentAuthorizationSelectedCode.id) {
                    that.UpdateDependentAuthorizationStatus(that.currentPatient.patientId, that.dependentAuthorizationSelectedCode.id, 'Y');
                }
                else {
                    that.UpdateDependentAuthorizationStatus(that.currentPatient.patientId, that.dependentAuthorizationSelectedCode, 'Y');
                }
            }
        },

        SelectPatientProfile: function (patientID) {
            snap.setSnapConsultationSessionData({ consultationId: 0, isScheduled: false, currentStep: 1, totalSteps: 8, patientId: patientID, patientName: '', guardianName: '' });
            global.location.href = "/Customer/Intake/#/IntakeStep/1";
            //global.location.href = "/Customer/Intake/#/CommunicationMethod";
        },

        LoadViewModel: function () {
            var that = this;

            that.patientSelectionComponent = Snap.Patient.PatientSelectGaleryControl().loadControl("#patientsGalery", this.patientSelected, [], true, true);
            util.apiAjaxRequest('/api/patientDependentRelation', 'GET').done(function (data) {
                that.set("patientDependentRelation", data);
            });
        },

        UpdateDependentAuthorizationStatus: function (patientID, relationCode, Isauthorize) {
            var that = this;
            var data = {
                relationCodeId: relationCode,
                isAuthorized: Isauthorize
            };
            if (relationCode == "94" || relationCode == "") {
                snapError("Please choose a relationship.");
                return;
            }
            util.apiAjaxRequest([snap.baseUrl, "/api/v2/patients/familygroup/", patientID, "/relationship"].join(""), 'PUT', data).done(function (data) {
                var Result = data.d;
                if (Result == "Success") {
                    that.SelectPatientProfile(patientID);
                }

            });
        },

        addDependentProfile: function () {
            location.href = "/Customer/AddDependent";
        }
    });

    app.patientSelectionService = {
        viewModel: new patientSelectionViewModel()
    };


}(window, jQuery, snap));

