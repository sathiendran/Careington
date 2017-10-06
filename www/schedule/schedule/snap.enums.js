var snap = snap || {};
snap.enums = snap.enums || {};
snap.enums.addressInputs = { "default": 0, "addressHintText": 1, "addressPlaceholder": 2 };

(function ($, snap) {
    snap.namespace("snap.enums")
       .define("ErrorTypeEnum", function () {
            this.Default = 0;
            this.TokenExpired_Admin = 1;
            this.EmailAlreadyInUse_Admin = 2;
            this.TokenExpired_Customer = 3;
            this.EmailAlreadyInUse_Customer = 4;
            this.TokenInvalid_Invitation = 5;
            this.EPrescriptionError = 6;
            this.Empty_Hospital = 7;

        }).singleton();

    snap.namespace("snap.enums")
        .define("SnapEvents", function() {
            this.GetClientInfo = "GetClientInfo";
        }).singleton();

    snap.namespace("snap.enums")
        .define("PhoneTypes", function () {
            this.home = 0;
            this.mobile = 1;
            this.other = 3;
        }).singleton();

    snap.namespace("snap.enums")
        .define("consultationStatus", function () {
            this.unknown = 0;
            this.paymentDone = 68;
            this.doctorAssigned = 69;
            this.doctorInitiatedConsultation = 70;
            this.startedConsultation = 71;
            this.endedConsultation = 72;
            this.cancelConsultaion = 79;
            this.inProgress = 80;
            this.droppedConsultation = 81;
            this.customerInWaiting = 82;
            this.doctorReviewConsultation = 154;
            this.dismissed = 163;
            this.patientEndConsultation = 73;
            this.disconnectedConsultation = 83;
        }).singleton();

    snap.namespace("snap.enums")
        .define("consultationCollectionStatuses", function () {
            // this statuses are used for consultations listings
            this.scheduled = "Scheduled",
            this.past = "Past",
            this.dropped = "Dropped",
            this.dna = "DNA",
            this.active = "Active"
        }).singleton();

    snap.namespace("snap.enums")
        .define("userTypes", function () {
            this.admin = 0;
            this.clinician = 1; // todo: rename to provider
            this.patient = 2;
        }).singleton();

    snap.namespace("snap.enums")
        .define("GlobalStatusCodes", function () {
            this.none = 0;
            this.active = 1;
            this.deleted = 2;
            this.suspended = 3;
            this.inactive = 4;
        }).singleton();

    snap.namespace("snap.enums")
        .define("PatientConnectionStatusCodes", function () {
            this.patientInactive = 0;
            this.patientInWaitingRoom = 1;
            this.patientInConsultationRoom = 2;
            this.patientDisconnected = 3;
            this.patientEndedConsultation = 4;
            this.patientMarkConsultationAsFullfill = 5;
            this.patientRemovedByProvider = 6;
            this.patientDroppedByProvider = 7;
        }).singleton();  

    snap.namespace("snap.enums")
        .define("ParticipantStatusCodes", function () {
            this.none = 0;
            this.active = 1;
            this.dismissed = 2;
            this.disconnected = 3;
            this.inactive = 4;
            this.declined = 5;
            this.left = 6;
            this.pending = 7;
            this.isJoining = 8;
            this.dropped = 9;
            this.ended = 10;
        }).singleton();

    snap.namespace("snap.enums")
        .define("ParticipantTypeCodes", function () {
            this.none = 0;
            this.patient = 1;
            this.provider = 2; // original name is 'Practicioner'
            this.guest = 3; // original name is 'RelatedPerson'
        }).singleton();      

    snap.namespace("snap.enums")
        .define("screenTypes", function () {
            this.provider = 1;
            this.patient = 2;
            this.guest = 3;
        }).singleton();

    snap.namespace("snap.enums")
        .define("profileFilter", function () {
            this.patient = 1;
            this.provider = 2;
            this.admin = 4;
        }).singleton();

    snap.namespace("snap.enums")
        .define("appointmentTypeCode", function () {
            this.none = 0;
            this.clinicianScheduled = 1;
            this.onDemand = 2;
            this.patientScheduled = 3;
        }).singleton();

    snap.namespace("snap.enums")
        .define("codingSystems", function () {
            this.icd10 = "ICD-10-DX";
            this.icd9 = "ICD-9-DX";
            this.snomed = "SNOMED-CT";
        }).singleton();

    snap.namespace("snap.enums")
        .define("meetingTypeCodes", function () {
            this.none = 0;
            this.doctorToPatientPreConsultation = 1;
            this.doctorToPatientConsultation = 2;
            this.doctorToDoctor = 3;
            this.openConsultation = 4;
        }).singleton();

    snap.namespace("snap.enums")
        .define("codingSystems", function () {
            this.icd10 = "ICD-10-DX";
            this.icd9 = "ICD-9-DX";
            this.snomed = "SNOMED-CT";
        }).singleton();

    snap.enums.EncounterTypeCode = snap.enums.EncounterTypeCode || {
        None: 0,
        Text: 1,
        Phone: 2,
        Video: 3,
        InPerson: 4
    };

})(jQuery, snap);
