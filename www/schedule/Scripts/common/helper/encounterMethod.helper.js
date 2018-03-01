//@ sourceURL=encounterMethod.helper.js
;
(function($, snap) {
    "use strict";
    snap.namespace("snap.helper")
        .use([
            "snap.common.schedule.ScheduleCommon"
        ])
        .define("encounterMethodHelper", function(
            $scheduleCommon
        ) {
            var adminEncounterMap = {},
                patientEncounterMap = {},
                onDemandEncounterMap = {},
                encounterNameMap = {},
                $encounterTypeCode = snap.enums.EncounterTypeCode;

            adminEncounterMap[$encounterTypeCode.Video] = snap.hospitalSettings.enableAdminScheduleVideoConsultation;
            adminEncounterMap[$encounterTypeCode.Phone] = snap.hospitalSettings.enableAdminSchedulePhoneConsultation;
            adminEncounterMap[$encounterTypeCode.Text] = snap.hospitalSettings.enableAdminScheduleChatConsultation;
            adminEncounterMap[$encounterTypeCode.InPerson] = snap.hospitalSettings.enableAdminScheduleInPersonConsultation;

            patientEncounterMap[$encounterTypeCode.Video] = snap.hospitalSettings.enableSelfScheduleVideoConsultation;
            patientEncounterMap[$encounterTypeCode.Phone] = snap.hospitalSettings.enableSelfSchedulePhoneConsultation;
            patientEncounterMap[$encounterTypeCode.Text] = snap.hospitalSettings.enableSelfScheduleChatConsultation;
            patientEncounterMap[$encounterTypeCode.InPerson] = snap.hospitalSettings.enableSelfScheduleInPersonConsultation;

            onDemandEncounterMap[$encounterTypeCode.Video] = snap.hospitalSettings.enableOnDemandVideoConsultation;
            onDemandEncounterMap[$encounterTypeCode.Phone] = snap.hospitalSettings.enableOnDemandPhoneConsultation;
            onDemandEncounterMap[$encounterTypeCode.Text] = snap.hospitalSettings.enableOnDemandChatConsultation;

            this.vm_isVideoEnabled = snap.hospitalSettings.enableOnDemandVideoConsultation;
            this.vm_isPhoneEnabled = snap.hospitalSettings.enableOnDemandPhoneConsultation;
            this.vm_isChatEnabled = snap.hospitalSettings.enableOnDemandChatConsultation;

            encounterNameMap[$encounterTypeCode.Video] = "Video";
            encounterNameMap[$encounterTypeCode.Phone] = "Phone";
            encounterNameMap[$encounterTypeCode.Text] = "Chat";
            encounterNameMap[$encounterTypeCode.InPerson] = "In Person";

            this.getEncounterTypeName = function (typeCode) {
                return encounterNameMap[typeCode] || "None Reported";
            };

            this.getFirstEnabledEncounterMethod = function(appointmentTypeCode) {
                var encounterMap;
                if (appointmentTypeCode === $scheduleCommon.appointmentTypeCode.patientScheduled) {
                    encounterMap = patientEncounterMap;
                } else if (appointmentTypeCode === $scheduleCommon.appointmentTypeCode.onDemand) {
                    encounterMap = onDemandEncounterMap;
                } else {
                    encounterMap = adminEncounterMap;
                }
                if (encounterMap[$encounterTypeCode.Video]) {
                    return $encounterTypeCode.Video;
                } else if (encounterMap[$encounterTypeCode.Phone]) {
                    return $encounterTypeCode.Phone;
                } else if (encounterMap[$encounterTypeCode.Text]) {
                    return $encounterTypeCode.Text;
                } else if (encounterMap[$encounterTypeCode.InPerson]) {
                    return $encounterTypeCode.InPerson;
                }
                return $encounterTypeCode.None;
            };

            this.isEncounterMethodEnabled = function(encounterType, appointmentTypeCode) {
                if (appointmentTypeCode === $scheduleCommon.appointmentTypeCode.patientScheduled) {
                    return patientEncounterMap[encounterType] || false;
                } else if (appointmentTypeCode === $scheduleCommon.appointmentTypeCode.onDemand) {
                    return onDemandEncounterMap[encounterType] || false;
                }
                return adminEncounterMap[encounterType] || false;
            };
            
        });

}(jQuery, snap));
