var snap = snap || {};
snap.model = snap.model || {};
snap.model.Common = snap.model.Common || {};

(function () {
    snap.model.Common.ComboList = kendo.data.Model.define({
        id: "id",
        fields: {
            "id": {
                type: "number"
            },
            "name": {
                type: "string"
            },
        }
    });

    snap.model.Common.userList = kendo.data.Model.define({
        id: "userID",
        fields: {
            "userID": {
                type: "number"
            },
            "lastName": {
                type: "string"
            },
            "fullName": {
                type: "string"
            },
            "profileImagePath": {
                type: "string",
                nullable: false,
                defaultValue: "images/Patient-Male.gif"
            }
        }
    });

    snap.model.Common.schedulePatient = kendo.data.Model.define({
        id: "id",
        fields: {
            "id": {
                type: 'number'
            },
            "primaryPhysician": {
                type: 'string'
            },
            "name": {
                type: "string"
            },
            "address": {
                type: 'string'
            },
            "city": {
                type: 'string'
            },
            "zipCode": {
                type: 'string'
            },
            "gender": {
                type: 'string'
            },
            "dob": {
                type: 'date'
            }
        }
    });

    snap.model.Common.scheduleConsultation = kendo.data.Model.define({
        id: "id",
        fields: {
            "id": {
                type: 'number'
            },
            "consultantId": {
                type: 'number',
                nullable: true
            },
            "assignedDoctorId": {
                type: "number",
                nullable: true
            },
            "consultantUserId": {
                type: 'number',
                nullable: true
            },
            "isNoCharge": {
                type: 'boolean',
                defaultValue: false
            },
            "scheduledTime": {
                type: "date",
                nullable: true
            },
            "scheduledDate": {
                type: "date",
                nullable: true
            },
            "schedulingReasonType": {
                type: "number",
                nullable: true
            },

            "primaryConsernId": {
                type: "string"
            },
            "primaryConsern": {
                type: "string"
            },
            "secondaryConsernId": {
                type: "string"
            },
            "secondaryConsern": {
                type: "string"
            },
            "secondaryConsernNone": {
                type: 'boolean',
                defaultValue: true
            },
            "note": {
                type: "string"
            },
            "assignedDateTime": {
                type: "date"
            },
            "conferenceKey": {
                type: 'string'
            },
            "isScheduled": {
                type: "string"
            },
            "patientId": {
                type: "number",
                nullable: true
            }
        }
    });


}());
