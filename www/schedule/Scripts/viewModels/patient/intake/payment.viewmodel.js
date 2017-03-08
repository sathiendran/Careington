snap.namespace("Snap.Patient")
    .extend(kendo.observable)
    .define("PaymentSubmitButton", function () {
        this.enable = function () {
            this.enabled = true;
            this.trigger("change", { field: "enabled" });
        }

        this.disable = function () {
            this.enabled = false;
            this.trigger("change", { field: "enabled" });
        }

        this.subscribeToEnabledChanged = function (func) {
            this.bind("change", function (e) {
                if (e.field !== "enabled") {
                    return;
                }

                func(e.sender.get("enabled"));
            });
        }
    });

snap.namespace("Snap.Patient").use(["snapNotification", "snapHttp", "snapLoader", "snap.DataService.customerDataService", "Snap.Patient.PaymentProfileControl", "Snap.Patient.PaymentSubmitButton"])
       .extend(kendo.observable)
      .define("PatientPaymentViewModel", function ($snapNotification, $snapHttp, $snapLoader, $service, $paymentProfileControl, $paymentSubmitButton) {
          var vm = this;
          var paymentStatusEnum = {
              NotStarted: 1,
              DialogOpened: 2,
              InProgress: 3,
              Done: 4
          };

          this.paymentStatus = paymentStatusEnum.NotStarted;

          var proceedPaymentState = $.Deferred();
          this.cards = [];
          this.selectedProfileId = 0;

          this.coPayAmount = 0;
          this.consultationCharge = 0;
          this.insuranceConfirmed = false;
          this.insuranceCompany = '';
          this.insurancePolicyNumber = '';
          this.consultationCharge = 0;
          this.cardSelectionMode = false;
          this.pageVisible = false;

          if (isEmpty(snap.consultationSession)) { }
          else {
              this.set("coPayAmount", snap.consultationSession.copayAmount);
              this.set("consultationCharge", snap.consultationSession.consultationAmount);
              this.set("insuranceConfirmed", snap.consultationSession.insuranceConfirmed);
              this.set("insuranceCompany", snap.consultationSession.insuranceCompany);
              this.set("insurancePolicyNumber", snap.consultationSession.policyNumber);
          }
          this.insuranceNotConfirmed = !this.insuranceConfirmed;

          this.cardsText = function () {
              return this.get("cards").length ? "Credit Cards on File" : "No Card on File. Please Add a Card and Submit Payment.";
          };
          this.cardsListClass = function () {
              var cls = "edit";
              return (cls + (this.get("showAllCards") ? " active" : ""));
          };
          this.isCardExist = function () {
              return !!this.get("cards").length;
          };


          this.selectedCard = {};
          this.getSelectedCard = function (id) {
              this.set("selectedProfileId", id);
              this.selectCard();
              this.set("cardSelectionMode", !this.get("showAllCards"));
              this.set("showAllCards", !this.get("showAllCards"));
          };
          this.selectCard = function () {
              if (this.selectedProfileId == 0 && this.cards.length) {
                  this.set("selectedProfileId", this.cards[0].profileId);
              }
              for (var i = 0; i < this.cards.length; i++) {
                  if (this.cards[i].profileId == this.selectedProfileId) {
                      this.cards[i].cardClass = "selected";
                      this.set("selectedCard", this.cards[i]);
                  } else {
                      this.cards[i].cardClass = "";
                  }
              }

              //  this.set("cards", this.cards);
              this.trigger("change", { field: "cards" });
          };
          this.wrapCardsDetails = function (cards) {
              var arr = [];
              for (var i = 0; i < cards.length; i++) {
                  arr.push(kendo.observable({
                      cardNumber: (cards[i].cardNumber ? ("xxxx-xxxx-xxxx-" + cards[i].cardNumber.substr(cards[i].cardNumber.length - 4)) : ""),
                      cardName: cards[i].cardType ? cards[i].cardType : "",
                      exp: cards[i].cardExpiration ? "Exp. " + cards[i].cardExpiration : "",
                      cardClass: (this.selectedProfileId == 0 && i == 0 || this.selectedProfileId == cards[i].profileId) ? "selected" : "",
                      profileId: cards[i].profileID,
                      customerProfileId: vm.customerProfileId,
                      firstName: cards[i].billingAddress.first,
                      lastName: cards[i].billingAddress.last,
                      billingAddress: {
                          address: cards[i].billingAddress.street,
                          city: cards[i].billingAddress.city,
                          state: cards[i].billingAddress.state,
                          zip: cards[i].billingAddress.zip,
                          country: cards[i].billingAddress.country
                      },
                      month: cards[i].cardExpiration.substring(0, 2),
                      year: cards[i].cardExpiration.substring(2, 4),
                      GetSelectedCard: function (e) {
                          vm.getSelectedCard(e.data.profileId);
                      }
                  }));
              }
              return arr;
          };

          this.refresh = function (profileId) {
              if (profileId) {
                  vm.set("selectedProfileId", profileId);
              }
              $paymentProfileControl.hide();
              $snapLoader.showLoader();
              vm.loadData().always(function () { $snapLoader.hideLoader(); });
          };

          this.loadData = function () {
              var def = $.Deferred();
              if (!snap.page) {
                  snap.page = {
                      selectedPaymentId: 0
                  };
              }
              $paymentProfileControl.hide();
              function PrefillCardDetails() {
                  var path = "/api/v2/patients/payments";
                  $.ajax({
                      type: "GET",
                      url: path,
                      contentType: "application/json; charset=utf-8",
                      dataType: "json",
                      success: function (response) {
                          var data = response.data[0];
                          vm.set("customerProfileId", data.profileID);
                          vm.set("customerEmail", data.email);
                          var profiles = data.paymentProfiles;
                          if (profiles) {
                              vm.set("cards", vm.wrapCardsDetails(profiles));
                              vm.selectCard();
                          }
                          vm.set("pageVisible", true);
                          def.resolve();
                          $paymentSubmitButton.enable();
                      },
                      error: function (xhr, status, error) {
                          // 401 expected if no payment profile, but this is called on "edit", which implies an existing profile
                          if (xhr.status == 401) {
                              sessionStorage.setItem("snap_logoutError", "Credit card failure");
                              window.location = snap.patientLogin();
                          }
                          if (!snap.userAborted(xhr) && !xhr.status == 404) {
                              snapError(error);
                          }
                          else {
                              vm.set("pageVisible", true);
                          }
                          def.reject();
                      }
                  });


              }

              if (!snap.consultationSession)
                  PrefillCardDetails();
              else {
                  if (snap.consultationHelper.isPaymentRequired()) {
                      //check payment required, check if paid, check for credit, check to make sure it ok agian
                      $service.checkPaymentStatus(snap.consultationSession.consultationId).done(function (responsePayment) {

                          if (!responsePayment.data[0]) {

                              $service.getPatientCredits(snap.profileSession.profileId).done(function (responseCredits) {
                                  if (responseCredits.total > 0) {
                                      $service.useExistingCreditForConsultation(snap.consultationSession.patientId, snap.consultationSession.consultationId).done(function (responseUseExistingCredit) {
                                          // because of possible race condition, check the payment status instead of responseUseExistingCredit.total
                                          $service.checkPaymentStatus(snap.consultationSession.consultationId).done(function (responsePayment2) {
                                              //double checking that it went through
                                              if (!responsePayment2.data[0]) {
                                                  snapInfo("Couldn't transfer exiting credit");
                                                  setTimeout(PrefillCardDetails(), 4000);
                                              }
                                              else {
                                                  var data = {
                                                      tranferedCredit: true
                                                  };
                                                  snap.updateSnapConsultationSessionMultipleValues(data);
                                                  goToPaymentSuccess();
                                              }

                                          });

                                      });
                                  }
                                  else {
                                      PrefillCardDetails();
                                  }
                              });

                          } else {
                              goToPaymentSuccess();
                          }

                      });

                  }
                  else {
                      window.location = "/Customer/PaymentSuccessful";
                  }
              };
              function goToPaymentSuccess() {
                  snap.updateSnapConsultationSessionValue("confirmationNumber", 'no-payment');
                  window.location = "/Customer/PaymentSuccessful";
              };
              function onShow(e) {
                  if (!$("." + e.sender._guid)[1]) {
                      var element = e.element.parent(),
                          eWidth = element.width(),
                          eHeight = element.height(),
                          wWidth = $(window).width(),
                          wHeight = $(window).height();

                      var newLeft = Math.floor(wWidth / 2 - eWidth / 2);
                      var newTop = Math.floor(wHeight / 2.5 - eHeight / 2);

                      e.element.parent().css({ top: newTop, left: newLeft });
                  }
              };

              vm.paymentNotification = $("#paymentNotification").kendoNotification({
                  hideOnClick: false,
                  autoHideAfter: 0,
                  width: 400,
                  height: 207,
                  show: onShow,
                  templates: [{
                      type: "paymentInfo",
                      template: $("#paymentInfoTemplate").html()
                  }]
              }).data("kendoNotification");
              $(document).on("click", "#btnProceedCancel", function () {
                  if (vm.paymentStatus === paymentStatusEnum.DialogOpened) {
                      var $patientIntake = Snap.Patient.PatientIntakeViewModel().footerObjects[2].viewModel;
                      $patientIntake.showLoader = false;
                      $patientIntake.trigger("change", { field: "showLoader" });
                      vm.paymentStatus = paymentStatusEnum.NotStarted;
                      vm.paymentNotification.hide();
                      proceedPaymentState.reject();
                  }
              });
              $(document).on("click", "#aProceedPayDis", vm.proceedPayment);


              return def.promise();
          };

          this.proceedPayment = function () {
              $("#aProceedPayDis").addClass("is-loading");

              if (vm.paymentStatus === paymentStatusEnum.DialogOpened) {
                  vm.paymentStatus = paymentStatusEnum.InProgress;
                  var data = {
                      amount: typeof (snap.consultationSession.copayAmount) !== "undefined" ? snap.consultationSession.copayAmount : snap.consultationSession.consultationAmount,
                      consultationId: snap.consultationSession.consultationId,
                      email: vm.customerEmail,
                      paymentProfileId: vm.selectedCard.profileId,
                      profileId: vm.customerProfileId
                  };

                  $.ajax({
                      url: [snap.baseUrl, "/api/v2/patients/copay"].join(""),
                      type: "POST",
                      data: JSON.stringify(data),
                      contentType: "application/json; charset=utf-8",
                      dataType: "json"
                  }).done(function (resp) {
                      snap.updateSnapConsultationSessionValue("confirmationNumber", resp.data[0].confirmationNumber);
                      proceedPaymentState.resolve();
                      vm.paymentStatus = paymentStatusEnum.Done;
                  }).fail(function (resp) {
                      if ((resp.status == 400) && (resp.responseText.indexOf("has already been made") > -1)) {
                          proceedPaymentState.resolve();
                          vm.paymentStatus = paymentStatusEnum.Done;
                      }
                      else {
                          snapError(resp.status + " - " + resp.statusText + "  " + resp.responseText);
                          proceedPaymentState.reject();
                          vm.paymentStatus = paymentStatusEnum.NotStarted;
                      }
                  }).always(function () {
                      vm.paymentNotification.hide();
                      $("#aProceedPayDis").removeClass("is-loading");
                  });
              }
          };

          this.submitPayment = function () {
              if (vm.cardSelectionMode || vm.selectedProfileId == 0) {
                  $snapNotification.error("You should select a Credit Card to submit payment");
                  proceedPaymentState.reject();
                  return proceedPaymentState.promise();
              }
              if (vm.paymentStatus == paymentStatusEnum.NotStarted) {
                  vm.paymentStatus = paymentStatusEnum.DialogOpened;
                  proceedPaymentState = $.Deferred();

                  vm.paymentNotification.show({
                      title: "Please Note",
                      message: "By Choosing to proceed, you are agreeing to have any charges for today's visit, and any balance due after insurance has processed this claim, applied to your card. This could include co-payments, deductibles, and other charges not covered by your insurance."
                  }, "paymentInfo");
              }
              else if (vm.paymentStatus == paymentStatusEnum.Done) {
                  $snapNotification.info("Payment already done");
              }
              else if (vm.paymentStatus == paymentStatusEnum.InProgress) {
                  $snapNotification.info("Payment is in proggress");
              }


              return proceedPaymentState.promise();
          };

          this.editCard = function (e) {
              e.preventDefault();
              var control = $paymentProfileControl.loadControl(".patient-form", this.refresh, this.customerProfileId, this.customerEmail, this.selectedCard);
              $paymentProfileControl.show();
          };
          this.addCard = function (e) {
              e.preventDefault();
              var control = $paymentProfileControl.loadControl(".patient-form", this.refresh, this.customerProfileId, this.customerEmail);
              $paymentProfileControl.show();
          };
          this.deleteCard = function (e) {
              e.stopPropagation();
              var that = this;
              $snapNotification.confirmationWithCallbacks("Are you sure that you want to delete this payment method?",
                  function () {
                      var path = '/api/patients/payments/' + that.selectedCard.customerProfileId + '/' + that.selectedCard.profileId;
                      $.ajax({
                          type: "DELETE",
                          url: path,
                          contentType: "application/json; charset=utf-8",
                          dataType: "json",
                          success: function (response) {
                              if (response.success == true) {
                                  $snapNotification.success("Payment method has been deleted successfully.");
                                  that.set("selectedProfileId", 0);
                                  that.refresh(0);
                              }
                              else {
                                  $snapNotification.error('Delete failed: ' + response.d);
                              }
                          },
                          error: function (xhr, status, error) {
                              if (!snap.userAborted(xhr)) {
                                  notification.show("Service error: " + error, "error");
                              }
                          }

                      });

                  });
          };
      });