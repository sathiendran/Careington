// snap.eprescription.js
// Provides application api calls for eprescription
// Dependencies: jQuery
// Append version querystring as ?v=1.7.1.0

var snap = snap || {};

function getEPrescriptionCredentials() {
	var path = '/api/v2/clinicians/eprescription';


	return $.ajax({
		url: path,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + snap.token);
			xhr.setRequestHeader("X-Developer-Id", snap.apiDeveloperId);
			xhr.setRequestHeader("X-Api-Key", snap.apiKey);
		},
		success: function (data) {
		    if (data != null && data.data[0] != null) {
		        if (data.data[0].rxntUserName == null || data.data[0].rxntUserName === "" || data.data[0].rxntPassword == null || data.data[0].rxntPassword === "") {
					snapInfo("The ePrescription credentials have not been set. Please add the correct credentials on your Account Settings.");
				}
			}
		}
	});
}

