(function (global, $) {

    snap.namespace("Snap.Patient").use(["snapNotification", "snapLoader"])
       .extend(kendo.observable)
      .define("PaymentProfileViewModel", function ($snapNotification, $snapLoader) {
          this.cardNumber = "";
          this.pid = "";
          this.ddlMonth = 0;
          this.ddlYear = 0;
          this.years = new kendo.data.DataSource({ data: [{description: "Year", value: "0"}]});
          this.cscCode = "";
          this.firstName = "";
          this.lastName = "";
          this.title = "";
          this.billingAddress = {
              address: "",
              city: "",
              state: "",
              zip: "",
              ddlCountry: 0
          };
          this.isNumberReadOnly = true;
          this.savedCallback = function () { };
          this.buildRequest = function () {
              var paymentData = {
                  cardNumber: this.cardNumber,
                  cvv: this.cscCode,
                  firstName: this.firstName,
                  lastName: this.lastName,
                  billingAddress: this.billingAddress.address,
                  city: this.billingAddress.city,
                  state: this.billingAddress.state,
                  zip: this.billingAddress.zip,
                  country: this.billingAddress.ddlCountry,
                  expiryMonth: this.ddlMonth,
                  expiryYear: this.ddlYear,
                  emailId: this.customerEmail
              };
              return paymentData;
          };
          this.validation = function () {
              var input = this.buildRequest();
              var validationMsg = "";

              this.changeColor("#444444");

              if (input.cardNumber == undefined || input.cardNumber.length <= 0) {
                  validationMsg += "Please enter Card Number <br />";
              }
              else if (this.cardNumber.length < 11) {
                  validationMsg += "Please enter valid Card Number <br />";
              }
              if (input.expiryMonth <= 0 || input.expiryYear <= 0) {
                  validationMsg += "Please select Expiration Date <br />";
              }
              else if (isNaN(input.expiryMonth) || isNaN(input.expiryYear)) {
                  validationMsg += "Invalid Expiration Date <br />";
              } else {
                  var date = new Date();
                  var startingYear = date.getFullYear();
                  if (parseInt(input.expiryYear) === parseInt(startingYear)) {
                      var month = date.getMonth() + 1;
                      if (input.expiryMonth < month) {
                          validationMsg += "Invalid Expiry Month <br />";
                      }
                  }
              }

              if (input.cvv.length <= 0) {
                  validationMsg += "Please enter CVV Code <br />";
                  $(this.control).find(".c_cvv").css('color', "red");
              }
              else if (isNaN(input.cvv) || input.cvv.length < 3) {
                  validationMsg += "Invalid CVV Code <br />";
                  $(this.control).find(".c_cvv").css('color', "red");
              }

              if (input.firstName == undefined || input.firstName.length <= 0) {
                  validationMsg += "Please enter First Name <br />";
              }

              if (input.lastName == undefined || input.lastName.length <= 0) {
                  validationMsg += "Please enter Last Name <br />";
              }

              if (input.billingAddress == undefined || input.billingAddress.length <= 0) {
                  validationMsg += "Please enter Billing Address <br />";
              }

              if (input.city == undefined || input.city.length <= 0) {
                  validationMsg += "Please enter City <br />";
              }

              if (input.state == undefined || input.state.length <= 0) {
                  validationMsg += "Please enter State <br />";
              }

              if (!input.zip || input.zip.length <= 0) {
                  validationMsg += "Please enter Zip/Postal Code <br />";
              } else if (/[^0-9a-zA-Z]/g.test(input.zip) != false) {
                  validationMsg += "Please enter only alphanumeric value into Zip/Postal Code <br />";
              }
              else if (input.zip.length < 3 || input.zip.length > 10) {
                  validationMsg += window.validationMessages.zipInvalid;
                  $(this.control).find(".c_zip").css('color', "red");
              }

              if (input.country == 0 || input.country == undefined) {
                  validationMsg += "Please select Country <br />";
              }

              if (validationMsg.length > 0) {
                  $snapNotification.error(validationMsg);
                  return false;
              } else {
                  return true;
              }
          },
          this.changeColor = function (hex) {
              $(this.control).find(".c_zip").css('color', hex);
              $(this.control).find(".c_cvv").css('color', hex);
              $(this.control).find(".c_cnum").css('color', hex);
          };
          this.close = function (e) {
              e.preventDefault();
              $(this.control).hide();
          };
          this.save = function (e) {
              e.preventDefault();

              var validationStatus = this.validation();
              if (validationStatus) {
                  $snapLoader.showLoader();
                  var paymentData = this.buildRequest();

                  var that = this;
                  var def = $.Deferred();
                  if (this.pid) {
                      paymentData.profileID = this.pid;
                      var path = "/api/patients/payments/"
                          + this.customerProfileId;
                      $.ajax({
                          type: "PUT",
                          url: path,
                          data: JSON.stringify(paymentData),
                          contentType: "application/json; charset=utf-8",
                          dataType: "json",
                          success: function () {
                              snapSuccess('Payment Details Updated Successfully');
                              def.resolve(that.pid);
                          },
                          error: function (xhr) {
                              def.reject();
                              if (xhr.status == 401) {
                                  sessionStorage.setItem("snap_logoutError", "Payment Details Failure");
                                  location.href = snap.patientLogin();
                              }
                              if (!snap.userAborted(xhr)) {
                                  snapError("Unable to update payment method");
                              }
                          }
                      });
                  } else {
                      var path = "/api/v2/patients/payments";
                      paymentData.profileID = this.customerProfileId;
                      $.ajax({
                          type: "POST",
                          url: path,
                          data: JSON.stringify(paymentData),
                          contentType: "application/json; charset=utf-8",
                          dataType: "json",
                          success: function (response) {
                              try {
                                  snapSuccess('Payment Details Added Successfully');
                                  def.resolve(response.data[0].paymentProfileId);
                              } catch (e) {
                                  console.error(e);
                              }
                          },
                          error: function (xhr) {
                              def.reject();
                              if (!snap.userAborted(xhr)) {
                                  if (xhr.status === 400) {
                                      try {
                                          var msg = JSON.parse(xhr.responseText).message;
                                          snapError(msg);
                                      } catch (err) {
                                          if (typeof xhr.statusText !== "undefined" && xhr.statusText.length) {
                                            snapError(parseResponseMessage(xhr.statusText));
                                          } else {
                                            snapError("Unable to add payment method");
                                          }
                                      }
                                  }
                                  else {
                                      console.error(xhr.responseText);
                                      snapError("Unable to add payment method");
                                  }
                              }
                          }
                      });
                  }
                  def.done(this.savedCallback).always(function () { $snapLoader.hideLoader(); });
              }

          };

          function parseResponseMessage(msg) {
            var searchString = "testmode";
            var ind = msg.toLowerCase().indexOf(searchString);
            if (ind >= 0) {
              msg = msg.substring(ind + searchString.length + 1);
            }
            ind = msg.indexOf(":");
            if (ind >= 0) {
              msg = msg.substring(ind + 1);
            }
            ind = msg.indexOf("-");
            if (ind >= 0) {
              msg = msg.substring(ind + 1);
            }
            
            msg = msg.trim();
            return msg;
          };
          
      });

    snap.namespace("Snap.Patient").use(["snapNotification", "Snap.Patient.PaymentProfileViewModel"])
     .define("PaymentProfileControl", function ($snapNotification, $viewmodel) {
         var def = $.Deferred();
         var that = this;
         this.initializeZipInputs = function () {
             $('.ValidateZip').bind("keydown", function (event) {
                 if (event.altKey) {
                     event.preventDefault();
                     return false;
                 } else {
                     var key = event.keyCode;
                     if (event.shiftKey && (key < 65 || key > 90)) {
                         event.preventDefault();
                         return false;
                     }
                     if (key == 9)
                         return true;
                     else if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                         event.preventDefault();
                         return false;
                     }
                 }
                 return true;
             });
         };
         this.loadControl = function (containerId, savedCallback, customerProfileId, customerEmail, data) {
             var year = new Date().getFullYear();

             $viewmodel.set("title", data ? "Edit Card" : "AddCard");
             $viewmodel.savedCallback = savedCallback;

             if (!this.control) {
                 var years = [];
                 years.push({ description: "Year", value: 0 });
                 for (var i = 0; i < 21; i++) {
                     years.push({ description: year + i, value: year + i });
                 }
                 $viewmodel.years.data(years);
                 $.get("/content/patient/paymentProfile.html" + snap.addVersion).done(function (html) {
                     var control = $('<div></div>');
                     control.html(html);
                     $('.c_cnum, .c_cvv').bind("cut copy paste", function (e) {
                         e.preventDefault();
                     });
                     $viewmodel.control = control[0];
                     $(containerId).append(control[0]);
                     that.control = control[0];
                     $(that.control).hide();
                     kendo.bind(control[0], $viewmodel);
                     that.initializeZipInputs();
                     def.resolve();
                 });
             }

             if (data) {
                 $viewmodel.set("cardNumber", data.cardNumber);
                 $viewmodel.set("pid", data.profileId);
                 $viewmodel.set("ddlMonth", isNaN(data.month) ? 0 : data.month);
                 $viewmodel.set("ddlYear", isNaN(data.year) ? 0 : data.year);
                 $viewmodel.set("cscCode", "");
                 $viewmodel.set("firstName", data.firstName);
                 $viewmodel.set("lastName", data.lastName);
                 $viewmodel.set("billingAddress", {
                     address: data.billingAddress.address,
                     city: data.billingAddress.city,
                     state: data.billingAddress.state,
                     zip: data.billingAddress.zip,
                     ddlCountry: data.billingAddress.country

                 });
                 $viewmodel.set("customerProfileId", customerProfileId);
                 $viewmodel.set("customerEmail", customerEmail);
                 $viewmodel.set("isNumberReadOnly", true);
             } else {
                 $viewmodel.set("cardNumber", "");
                 $viewmodel.set("pid", "");
                 $viewmodel.set("ddlMonth", 0);
                 $viewmodel.set("ddlYear", 0);
                 $viewmodel.set("cscCode", "");
                 $viewmodel.set("firstName", "");
                 $viewmodel.set("lastName", "");
                 $viewmodel.set("billingAddress", {
                     address: "",
                     city: "",
                     state: "",
                     zip: "",
                     ddlCountry: 0

                 });
                 $viewmodel.set("isNumberReadOnly", false);
                 $viewmodel.set("customerProfileId", customerProfileId);
                 $viewmodel.set("customerEmail", customerEmail);
             }
         };
         this.show = function () {
             def.done(function () { $(that.control).show(); });
         };
         this.hide = function () {
             def.done(function () { $(that.control).hide(); });
         };
     });


})(window, jQuery);
