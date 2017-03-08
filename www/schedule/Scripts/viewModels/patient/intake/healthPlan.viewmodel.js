(function (global, $) {
    
    function ValidatePhone(phoneNumber, fieldForError, isRequired) {

        if (phoneNumber != "") {
            if (phoneNumber.length < 5 && phoneNumber.length > 15) {
                return fieldForError + " length must be greater than 4 and less than 16";
            }
        }
        else {
            if (isRequired == true) {
                return "Please enter a " + fieldForError;
            }
        }
        return "";
    }
    snap.namespace("Snap.Patient").use(["snapNotification", "snapLoader", "snap.DataService.healthPlanDataService", "Snap.Patient.PatientSelectGaleryControl"])
       .extend(kendo.observable)
      .define("HealthPlanViewModel", function ($snapNotification, $snapLoader, $service, $galery) {
          var vm = this;
          this.company = "";
          this.companyName = "";
          this.companiesSrc = [];
          this.healthPlanId = "";
          this.policyNumber = "";
          this.companyPhone = "";
          this.isDefaultPlan = "N";
          this.subscriberFirstName = "";
          this.subscriberLastName = "";
          this.subscriberDOB = new Date();
          this.title = "Edit Plan";
          this.isHideUnauthorizedMember = true,
          this.addUpdatePlanText = function () {
              return this.get("healthPlanId") ? "Update Plan" : "Add Plan";
          };
          this.selectedMembersSrc = [];
          this.addeditMembersText = function () {
              return this.get("selectedMembersSrc").length ? "Edit Members" : "Add Members";
          };
          this.galeryHidden = true;
          this.galeryShowText = function () {
              return this.get("galeryHidden") ? "Add Member" : "Close";
          };
         
          this.galeryVisible = function () {
              return !this.get("galeryHidden");
          };
          this.toggleGalery = function () {
              this.set("galeryHidden", !this.get("galeryHidden"));
              if( !this.get("galeryHidden")){
                  $galery.loadControl("#diveditselectmembers", this.addMember, this.selectedMembersSrc, this.isHideUnauthorizedMember, false);
              }
          };
          
          this.savedCallback = function () { };
         
          this.validation = function () {
              var editValidationMsg = "";
              var arraySubscriberId = [];

              if ($.trim(this.policyNumber) == "") {
                  emsg = "Please enter Subscriber ID";
                  editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
              }
              if (!this.company) {
                  emsg = "Please enter Insurance Company Name";
                  editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
              }
              if (ValidatePhone(this.companyPhone, "Insurance Company Phone", true).length > 0) {
                  emsg = ValidatePhone(this.companyPhone, "Insurance Company Phone", true);
                  editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
              }
              if ($.trim(this.subscriberFirstName) == "") {
                  emsg = "Please enter Subscriber First Name";
                  editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
              }
              if ($.trim(this.subscriberLastName) == "") {
                  emsg = "Please enter Subscriber Last Name";
                  editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
              }
              if (this.subscriberDOB) {
                  editValidationMsg = editValidationMsg + snapValidateHealthPlanDOBByDate(kendo.toString(new Date(this.subscriberDOB), "MMM dd, yyyy"));
              } else {
                  emsg = "Please enter a valid Date of Birth (" + snap.datetimeShortFormatString + ")";
                  editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
              }
              if (editValidationMsg == "") {
                  if (this.selectedMembersSrc.length && this.selectedMembersSrc.length > 0) {
                      for (var j = 0; j < this.selectedMembersSrc.length; j++) {

                          arraySubscriberId.push(this.selectedMembersSrc[j].subscriberId);

                          if (this.selectedMembersSrc[j].memberName == "") {
                              emsg = "Please choose a Member to add to this plan";
                              editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
                          }
                          if (this.selectedMembersSrc[j].subscriberId == "") {
                              emsg = "Please enter Member Subscriber ID";
                              editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
                          }
                          if (this.selectedMembersSrc[j].subscriberId.length > 100) {
                              emsg = "Member Subscriber ID no more than 100 characters";
                              editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
                          }

                          if (this.selectedMembersSrc[j].subscriberId.match(/[^0-9\.]/g)) {
                              emsg = "Member Subscriber ID should be numeric value";
                              editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
                          }

                          if (editValidationMsg != "") {
                              snapError(editValidationMsg);
                              return false;
                          }
                      }
                  }
                  else {
                      snapError("Pleae enter atleast one Member.");
                      return false;
                  }

                  if (this.selectedMembersSrc.length && this.selectedMembersSrc.length > 0) {
                      var that = this;

                      for (var j = 0; j < this.selectedMembersSrc.length; j++) {
                          if (arraySubscriberId.filter(function (x) { return x == that.selectedMembersSrc[j].subscriberId }).length > 1) {
                              emsg = snap.string.formatHtml("Subscriber Id {0} should not be used multiple times, in this health plan.", that.selectedMembersSrc[j].subscriberId);
                              editValidationMsg += snap.string.formatHtml("{0} <br />", emsg);
                          }

                          if (editValidationMsg != "") {
                              snapError(editValidationMsg);
                              return false;
                          }
                      }
                  }


              }
              else {
                  snapError(editValidationMsg);
                  return false;
              }
              return true;
          },

          this.close = function (e) {
              e.preventDefault();
              $(this.control).hide();
          };
          this.updatePlan = function (e) {
              e.preventDefault();
              var validationStatus = this.validation();
              if (validationStatus) {
                  var company;
                  for (var i = 0; i < this.companiesSrc.length; i++) {
                      if ($.trim(this.company).toLowerCase() === $.trim(this.companiesSrc[i].payerId).toLowerCase()) {
                          company = this.companiesSrc[i];
                          break;
                      }
                  }
                  var data = {
                      healthPlanId: this.healthPlanId,
                      patientId: (snap.consultationSession == undefined || snap.consultationSession.patientId == 0) ? snap.profileSession.profileId : snap.consultationSession.patientId,
                      insuranceCompany: company.payerName,
                      insuranceCompanyNameId: company.id,
                      isDefaultPlan: this.isDefaultPlan,
                      insuranceCompanyPhone: this.companyPhone,
                      memberName: (!!this.selectedMembersSrc.length) ? this.selectedMembersSrc[0].memberName : "",
                      subsciberId: (!!this.selectedMembersSrc.length) ? this.selectedMembersSrc[0].subscriberId : "",
                      payerId: this.company,
                      policyNumber: this.policyNumber,
                      subscriberFirstName: this.subscriberFirstName,
                      subscriberLastName: this.subscriberLastName,
                      subscriberDob: (new Date(this.subscriberDOB)).toLocalISO(),
                      isActive: "A",
                      Members: this.selectedMembersSrc
                  };
                  if (this.healthPlanId) {
                      $snapLoader.showLoader();
                      $service.editHealthPlan(this.healthPlanId, data).done(this.savedCallback)
                          .fail(function () {
                              $snapNotification.error("Unable to update Health Plan");
                          }).always(function () {
                              $snapLoader.hideLoader();
                          });
                  } else {
                      $service.addHealthPlan(data).done(this.savedCallback).
                          fail(function () {
                              $snapNotification.error("Unable to add Health Plan ");
                          }).always(function () {
                              $snapLoader.hideLoader();
                          });
                  }
              }

          };
          this.addMember = function (profile) {
              if (!profile.isAuthorized) {
                  $snapNotification.error("Selected member is not authorized.");
                  return;
              }
              vm.selectedMembersSrc.push(kendo.observable({
                  patientId: profile.patientId,
                  profileImagePath: profile.profileImagePath || getDefaultProfileImageForPatient(),
                  memberName: profile.patientName,
                  subscriberId: "",
                  removeMember: function () {
                      vm.removeMember(this.patientId);
                  }
              }));
              vm.trigger("change", { field: "selectedMembersSrc" });
              vm.toggleGalery();
          };
          this.removeMember = function (patientId) {
              $snapNotification.confirmationWithCallbacks("Are you sure that you want to delete this Member?", function () {
                  if (patientId.data != undefined)
                      patientId = patientId.data.patientId;
                  vm.set("selectedMembersSrc",
                  vm.selectedMembersSrc.filter(function (element) {
                      return element.patientId !== patientId;
                  }));
              });
          };
      });

    snap.namespace("Snap.Patient").use(["snapNotification", "Snap.Patient.HealthPlanViewModel", "snap.DataService.healthPlanDataService"])
     .define("HealthPlanControl", function ($snapNotification, $viewmodel, $service) {
         var formLoaded = $.Deferred();
         var dataLoaded = $.Deferred();
         var that = this;

         function emptyViewModel() {
             $viewmodel.set("company", 0);
             $viewmodel.set("companyPhone", "");
             $viewmodel.set("subscriberFirstName", "");
             $viewmodel.set("subscriberLastName", "");
             $viewmodel.set("subscriberDOB", "");
             $viewmodel.set("policyNumber", "");
             $viewmodel.set("selectedMembersSrc", []);
         }

         this.loadControl = function (containerId, savedCallback, policyNumber, healthPlanId) {

             emptyViewModel();

             $viewmodel.set("title", policyNumber ? "Edit Plan" : "Add Plan");
             $viewmodel.set("savedCallback", savedCallback);
             $viewmodel.set("healthPlanId", healthPlanId);
             if (!this.control) {
                 $.get("/content/patient/healthPlan.html" + snap.addVersion).done(function (html) {
                     var control = $('<div></div>');
                     control.html(html);
                     $viewmodel.control = $(control[0]);
                     $(containerId).append(control[0]);
                     that.control = $(control[0]);
                     kendo.bind(that.control, $viewmodel);
                     $service.getHealthPlanProviders().done(function (resp) {
                         $viewmodel.set("companiesSrc", resp.data);

                         formLoaded.resolve();
                     });
                 });
             }

             if (policyNumber && $viewmodel.policyGroup != policyNumber) {
                 $service.getHealthPlanDetails(policyNumber, (snap.consultationSession == undefined || snap.consultationSession.patientId == 0) ? snap.profileSession.profileId : snap.consultationSession.patientId).done(function (resp) {
                     $viewmodel.set("companyName", resp.insuranceCompany);
                     $viewmodel.set("payerId", resp.payerId);
                     formLoaded.done(function () {
                         var vmPayerId = $viewmodel.get("payerId");
                         for (var i = 0; i < $viewmodel.companiesSrc.length; i++) {
                             if (vmPayerId === $viewmodel.companiesSrc[i].payerId) {
                                 $viewmodel.set("company", $viewmodel.companiesSrc[i].payerId);
                                 break;
                             }
                         }
                     });
                     $viewmodel.set("companyPhone", resp.insuranceCompanyPhone);
                     $viewmodel.set("subscriberFirstName", resp.subscriberFirstName);
                     $viewmodel.set("subscriberLastName", resp.subscriberLastName);
                     $viewmodel.set("subscriberDOB", resp.subscriberDob);
                     $viewmodel.set("policyNumber", resp.policyNumber);

                     if (resp.members) {
                         $viewmodel.set("selectedMembersSrc", resp.members);
                     }
                     dataLoaded.resolve();
                 }).fail(function (error, status) {
                     var errorMsg = { message: "" };
                     var errorStatus = { status: "500", statusText: "Internal server error" };
                     try {
                         errorMsg = JSON.parse(error.responseText);
                         errorStatus = JSON.parse(JSON.stringify(status));
                     }
                     catch (e) {

                     }
                     snapError(errorStatus.status + " - " + errorStatus.statusText + "  " + errorMsg.message);
                 });
             } else if (!policyNumber) {
                 dataLoaded.resolve();
             }
         };
         this.show = function () {
             $.when(formLoaded, dataLoaded).done(function () { that.control.show(); });
         };
         this.hide = function () {
             $.when(formLoaded, dataLoaded).done(function () { that.control.hide(); });
         };
     });


})(window, jQuery);
