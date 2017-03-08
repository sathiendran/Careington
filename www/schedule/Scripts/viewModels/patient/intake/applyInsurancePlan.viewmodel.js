snap.namespace("Snap.Patient").use(["snapNotification", "snapHttp", "snapLoader", "snap.DataService.healthPlanDataService", "Snap.Patient.HealthPlanControl"])
       .extend(kendo.observable)
      .define("ApplyInsurancePlanViewModel", function ($snapNotification, $snapHttp, $snapLoader, $service, $healthPlanControl) {
          var vm = this;          
          this.consultationCharge = snap.consultationSession==undefined ? 0 : snap.consultationSession.consultationAmount;
          this.showPlanError = false;
          this.applyPlanText = function () {
              return this.get("planExists") ? "Apply your Health Plan?" : "No health plans for this patien. Please add one.";
          };
          this.plans = [];
          this.selectedPlan = null;
          this.getSelectedPlanId = function() {
              if (this.selectedPlan) {
                  return this.selectedPlan.healthPlanId;
              }
              return null;
          };
          this.showAllPlans = false;
          this.planApplicationAllowed = function () {
              return this.get("planExists") && (snap.consultationHelper == undefined ? true : snap.consultationHelper.isPaymentRequired());
          };
          this.planSkipAllowed = function () {
              return this.get("showPlanError") && (snap.consultationHelper == undefined ? false : !snap.consultationHelper.isPaymentRequired());
          };
          this.insuranceDone = function () {

          };
          this.planSaved = function (response) {
              var healthPlanId = response.healthPlanID;
              $healthPlanControl.hide();
              vm.loadPlans().done(function () {
                  vm.set("showAllPlans", true);
                  vm.getSelectedPlan(healthPlanId);
              });
          };
          this.planExists = function () {
              return !!this.get("plans").length;
          };
          this.clearPlan = function () {
              $service.clearHealthPlan({ consultationId: snap.consultationSession.consultationId });
          };
          this.applyPlan = function () {

              if (this.selectedPlan == null || this.selectedPlan.healthPlanId == null) {
                  snapInfo("No Health Plan was Selected. Please Select a Health Plan or Click Add New Plan to Add Your Insurance Details.");
                  return;
              }

              if (this.selectedPlan) {
                  $snapLoader.showLoader();
                  $service.applyHealthPlan(this.selectedPlan.healthPlanId,
                      {
                          insuranceCompanyName: this.selectedPlan.insuranceCompany,
                          policyNumber: this.selectedPlan.policyNumber,
                          consultationId: snap.consultationSession.consultationId
                      }).done(function (resp) {
                          snap.updateSnapConsultationSessionMultipleValues({
                              insuranceConfirmed: true,
                              copayAmount: resp.copayAmount,
                              insuranceCompany: resp.insuranceCompany,
                              policyNumber: resp.policyNumber
                          });
                          var currency = typeof snap.labels["currency"] === "undefined" ? "$" : snap.labels["currency"];
                          if (resp.serviceCode != null && resp.serviceCode != "") {
                              $snapNotification.success($('<textarea />').html(["Health Plan applied successfully.\n Your Co-Pay Amount = ", currency, snap.consultationSession.copayAmount, "\n Your ICD-10 Code is ", resp.serviceCode].join("")).text());
                          } else {
                              $snapNotification.success($('<textarea />').html(["Health Plan applied successfully.\n Your Co-Pay Amount = ", currency, snap.consultationSession.copayAmount].join("")).text());
                          }
                          vm.insuranceDone(); //don't check for admin settings
                      }).fail(function (xhr, status, error) {
                          vm.set("showPlanError", true);
                          if (xhr.status == 401) {
                              sessionStorage.setItem("snap_logoutError", "health plan failure");
                              window.location = snap.patientLogin();
                          }
                          else if (xhr.status === 400) {
                              if (xhr.message != null) {
                                  snapError("Health Plan Inquiry Failed.  " + xhr.message);
                              }
                              else if (xhr.responseText != null) {
                                  var errorMessage;
                                  if (JSON.parse(xhr.responseText) != null) {
                                      errorMessage = JSON.parse(xhr.responseText).message;
                                  } else {
                                      errorMessage = xhr.responseText;
                                  }
                                  snapError("Health Plan Inquiry Failed  " + errorMessage);
                                  vm.set("showPlanError", true);
                              }
                              
                          }
                          else if (!snap.userAborted(xhr)) {
                              snapError("Health Plan Inquiry Failed  " + error);
                             
                          }
                      }).always(function () {
                          $snapLoader.hideLoader();
                      });
              }
          };
          this.editPlan = function (e) {
              e.preventDefault();
              e.stopPropagation();

              if (!this.selectedPlan) {
                  snapInfo("Please select a Health Plan.");
                  return;
              }

              $healthPlanControl.loadControl("#healthPlanForm", this.planSaved, this.selectedPlan.policyNumber, this.getSelectedPlanId());
              $healthPlanControl.show();
          };
          this.addPlan = function (e) {
              e.preventDefault();
              e.stopPropagation();

              $healthPlanControl.loadControl("#healthPlanForm", this.planSaved);
              $healthPlanControl.show();
          };
          this.deletePlan = function (e) {
              e.preventDefault();
              e.stopPropagation();

              var that = this;
              $snapNotification.confirmationWithCallbacks("Are you sure that you want to delete this health plan?",
                  function () {
                      var path = '/api/healthplan/' + e.data.healthPlanId;
                      $.ajax({
                          type: "DELETE",
                          url: path,
                          contentType: "application/json; charset=utf-8",
                          dataType: "json",
                          success: function (response) {
                              if (response.healthPlanID != null) {
                                  $snapNotification.success("Health plan method has been deleted successfully.");
                                  that.selectedPlan = null;
                                  that.loadPlans(true);
                              } else {
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

          this.plansBoxClass = function () {
              var cls = "applyPlans PlansList";
              return (cls + (this.get("showAllPlans") ? "  form-content-expand" : ""));
          };

          this.plansListClass = function () {
              var cls = "edit plans ";
              return (cls + (this.get("showAllPlans") ? "active" : ""));
          };
          this.isPlanExist = function () {
              return !!this.get("plans").length;
          };
          this.skipPlan = function (e) {
              e.preventDefault();
              $snapLoader.showLoader();
              $service.skipHealthPlan(this.getSelectedPlanId(), {
                  insuranceCompanyName: this.selectedPlan.insuranceCompany,
                  policyNumber: this.selectedPlan.policyNumber,
                  consultationId: snap.consultationSession.consultationId
              }).done(function (resp) {
                  if (resp) {
                      vm.insuranceDone();
                  } else {
                      snapError("Unable to skip health plan verification");
                  }
              }).fail(function (xhr, status, error) {
                  if (xhr.status == 401) {
                      sessionStorage.setItem("snap_logoutError", "health plan failure");
                      window.location = snap.patientLogin();
                  }
                  if (!snap.userAborted(xhr)) {
                      snapError("Failed to skip plan " + error);
                      vm.set("showPlanError", true);
                  }
              }).always(function () {
                  $snapLoader.hideLoader();
              });
          };
          this.getSelectedPlan = function (id) {
              snap.updateSnapConsultationSessionValue("insuranceConfirmed", false);

              var showAllPlans = this.get("showAllPlans");
              if (showAllPlans) {
                  this.selectPlan(id);
              } else {
                  this.set("selectedPlan", null);
              }

              this.set("showAllPlans", !showAllPlans);
          };

          this.selectPlan = function (planId) {
              for (var i = 0; i < this.plans.length; i++) {
                  if ((planId && this.plans[i].healthPlanId === planId) || (!planId && this.plans[i].isDefaultPlan === "Y")) {
                      this.plans[i].isSelected = true;
                      this.set("selectedPlan", this.plans[i]);
                  } else {
                      this.plans[i].isSelected = false;
                  }
              }
              if (!this.selectedPlan && this.plans.length > 0) {
                  this.plans[0].isSelected = true;
                  this.set("selectedPlan", this.plans[0]);
              }

              this.trigger("change", { field: "plans" });
              this.set("showPlanError", false);
          };
          this.wrapPlanDetails = function (plans) {
              var arr = [];
              for (var i = 0; i < plans.length; i++) {
                  arr.push(kendo.observable({
                      healthPlanId: plans[i].healthPlanId,
                      insuranceCompany: plans[i].insuranceCompany,
                      isDefaultPlan: plans[i].isDefaultPlan,
                      insuranceCompanyPhone: plans[i].insuranceCompanyPhone,
                      memberName: plans[i].memberName,
                      subsciberId: plans[i].subsciberId,
                      policyNumberText: 'Subscriber ID: ' + plans[i].policyNumber,
                      policyNumber: plans[i].policyNumber,
                      payerId: plans[i].payerId,
                      isSelected: plans[i].isDefaultPlan === "Y",
                      onPlanSelected: function (e) {
                          vm.getSelectedPlan(e.data.healthPlanId);
                      }
                  }));
              }
              return arr;
          };
          this.loadPlans = function (selectDefault) {
              selectDefault = typeof(selectDefault) === "undefined" ? true : selectDefault;

              var def = $.Deferred();
              var patientId = snap.consultationSession == undefined ? snap.profileSession.profileId : snap.consultationSession.patientId;
              $service.getHealthPlans(patientId).done(function (resp) {
                  vm.set("plans", vm.wrapPlanDetails(resp.data));
                  vm.trigger("change", { field: "plans" });

                  if (!vm.getSelectedPlanId() && selectDefault) {
                      vm.selectPlan();
                  }

                  def.resolve();
              }).fail(function () { def.reject(); });
              return def.promise();
          };
      });