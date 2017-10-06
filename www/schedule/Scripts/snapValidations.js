function validateEmail(email) {
    return _testInput(email, snap.regExMail); 
}

function validatePassword(pwd) {
    return _testInput(pwd, /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s\n\r]{8,20})$/);
}

function _testInput(text, regExp) {
    try {
        return regExp.test(text);
    }
    catch (err) {
        snap.util.logToConsole(err);
    };
    return false;
}

function snapValidateHealthPlanDOBByDate(date) {
    var errMsg = snap.dateValidation.validateDOB(date);
    var testdate = new Date(date);

    if ((errMsg == "") && (testdate > snap.dateLimits.getHealthPlanMaxDate())) {
            errMsg = "Subscriber should be at least 13 years old";
    }
    return errMsg;
}

function PreventIvalidSymbolsInPasswordOrEmail($input) {
    $input.on({
        keydown: function(e) {
            return e.which !== 32; // 32 is the ASCII value for a space
        },
        change: function() {
            this.value = this.value.replace(/\s/g, "");
        }
    });
}

var validationMessages = {
    passwordInvaild: "Your Password must be between 8 and 20 characters,<br >contain at least one upper and lower case letter and at least one number,<br>and must not contain any spaces.<br/>",
    emailInvalid: "Please enter a valid email address <br/>",
    zipInvalid: "Zip/Postal Code must be between 3 and 10 characters"
};

var isValidFolderName = function (str) {
    var regex = /^[^\\/?%*:|"<>]+$/;
    return regex.test(str);
};

function isValidName(str) {
    if ((str != null) && (str.length > 0 && str.length < 50)) {
            return true;
    }
    return false;
}
function IsContactNumberValid() {
    var textBoxContactNumber = $.trim($("#phone-field").val());
    if (textBoxContactNumber.length < 5 || textBoxContactNumber.length > 20) {
        snapError("Contact Number must be minimum 5 & maximum 20 digits.");
        return false;
    }
    return true;
}
function ValidatePhone(phoneNumber, fieldForError, isRequired) {
    try {
        if ($.trim(phoneNumber) != "") {
            var fullNumber = "" + phoneNumber;
            // max allowed phone number length is 15
            if (fullNumber.length < 5) {
                return fieldForError + " length must be greater than 4";
            } else if (fullNumber.length > 15) {
                return fieldForError + " length must not be greater than 15";
            }
        }
        else {
            if (isRequired) {
                return "Please enter a " + fieldForError;
            }
        }
        return "";
    }
    catch (err) {
        logError("ValidatePhone()", "Error", err, "While validating the phone format this error may occured.");
    }
}
