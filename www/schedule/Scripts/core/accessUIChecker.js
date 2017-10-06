; (function ($, snap) {
    var snapAccessModule = {
        canLoginClinician: function () {
            return snap.hasAllPermission(snap.security.conduct_virtual_consultations);
        },
        canLoginAdmin: function () {
            var sec = snap.security;
            return snap.hasAnyPermission(
                sec.view_staff_accounts, //11
                sec.edit_staff_accounts, //12
                sec.edit_public_facing_profile_details_others, //14
                sec.create_staff_accounts, //15
                sec.create_new_admin_user, //16
                sec.create_reports, //17
                sec.view_reports, //18
                sec.assign_roles, //19
                sec.create_roles, //20
                sec.delete_roles, //21
                sec.disable_roles, //22
                sec.view_edit_admin_preferences, //23

                sec.view_tags, //32
                sec.create_tags, //33
                sec.delete_tags, //34
                sec.assign_tags, //35
                sec.view_roles, //36
                sec.view_patients_accounts, //37
                sec.edit_patients_accounts, //38
                sec.view_admin_dashboard, //39
                sec.can_manage_staff_files, //40
                sec.create_groups, //41
                sec.remove_groups, //42
                sec.modify_groups, //43
                sec.manage_staff_schedule, //44
                sec.view_workflows, //45
                sec.edit_workflows, //46
                sec.view_admin_patient_queue); //49
        },
        canScheduleConsultation: function(userId) {
            return (snap.hasAllPermission(snap.security.manage_staff_schedule) //manage_staff_schedule permission grants a full access to the appointment scheduling
                || ((typeof userId === "undefined" || userId === snap.profileSession.userId ) //if user type is not provided we consider that we'll restrict a list of available providers to a user himself/herself
                && snap.hasAllPermission(snap.security.conduct_virtual_consultations, snap.security.manage_personal_schedule))); // for user himself/herself a combination of conduct_virtual_consultations and manage_personal_schedule grants access to create/edit appointments
        },
        canManageStaffSchedule: function() {
            return snap.hasAllPermission(snap.security.manage_staff_schedule);
        },
        canRecordConsultation: function() {
            return snap.hasAllPermission(snap.security.conduct_virtual_consultations);
        },
        isProviderChatEnabled: function() {
            return !snap.hospitalSettings.hideDrToDrChat && snap.hasAllPermission(snap.security.provider_chat);
        },
        isAdminPatientQueueEnabled: function () {
           return snap.hasAllPermission(snap.security.view_admin_patient_queue);
        },
        isAdminProviderMyFilesEnabled: function() {
            return snap.hospitalSettings.fileSharing && snap.hasAllPermission(snap.security.can_access_my_files);
        },
        isOpenConsultationDirectAccessEnabled: function() { // open consultation access from "hamburger" menu
            return !snap.hospitalSettings.hideOpenConsultation && snap.hasAllPermission(snap.security.open_consultation);
        },
        isOpenConsultationFromProviderChatEnabled: function() { // open consultation access from P2P chat call, "full screen" button
            return snap.hasAllPermission(snap.security.open_consultation);
        },
        isEPrescriptionsEnabled: function() {
            return snap.hasAllPermission(snap.security.e_prescription_authorization) && snap.hospitalSettings.ePrescriptions;
        }, 
        isRXNTEnabled: function() {
            return snap.hasAllPermission(snap.security.e_prescription_authorization) && 
                (snap.hospitalSettings.ePrescriptions || snap.hospitalSettings.rxNTPM || snap.hospitalSettings.rxNTEHR) ;
        },
		canAccessPatientProfile: function() {
			return snap.hasAnyPermission(snap.security.view_patients_accounts, snap.security.edit_patients_accounts);
		}
		
    };

    $.extend(snap, snapAccessModule);
}(jQuery, window.snap = window.snap || {}));