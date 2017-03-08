var snap = snap || {};

$.extend(snap,
{
    consultationHelper: {}
});

$.extend(snap.consultationHelper,
{

        isPaymentRequired: function () {
            if (snap.hospitalSettings.eCommerce && (snap.consultationSession.consultationAmount > 0 || snap.consultationSession.copayAmount > 0) && ((snap.consultationSession.isScheduled && !snap.hospitalSettings.hidePaymentPageBeforeWaitingRoom) || !snap.consultationSession.isScheduled)) {
                return true;
            }
            else {
                return false;
            }
        }
    


});