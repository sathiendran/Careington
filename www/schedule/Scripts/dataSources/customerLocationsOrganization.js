function GetOrganizationDropDown() {
    var path = '/api/v2/organizations/';
    var resultList;
    $.ajax({
        type: "GET",
        url: path,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {

                resultList = response.data;
                if (resultList && resultList.length > 0) {
                    $("#organizationDD").kendoDropDownList({
                        dataTextField: "name",
                        dataValueField: "id",
                        dataSource: resultList,
                        filter: "contains",
                        suggest: true,
                        optionLabel: {
                            name: "None",
                            id: ""
                        },
                        change: function() {
                            var dataItem = this.dataItem();
                            var loc = $("#locationDD").data("kendoDropDownList");

                            if (!loc) {
                                loc = $("#locationDD").kendoDropDownList({
                                    enable: false,
                                    dataTextField: "name",
                                    dataValueField: "id",
                                    filter: "contains",
                                    suggest: true,
                                    optionLabel: {
                                        name: "None",
                                        id: ""
                                    }
                                }).data("kendoDropDownList");
                            }
                            if ($("#organizationDD").val() == null || $("#organizationDD").val() <= 0) {
                                $(".locationContent").hide();
                                $("#locationDD").Value("");
                            }
                            else {
                                loc.enable(true);
                                if (dataItem.locations.length > 0) {
                                    $(".locationContent").show();
                                    loc.dataSource.data(dataItem.locations);
                                } else {
                                    loc.value(""); // Selects empty value
                                    $(".locationContent").hide();
                                }
                            }

                        }
                    });

                } else {
                    $(".organizationContent").hide();
                    $(".locationContent").hide();
                }
            
        }
    });
}


function GetLocationDropDown() {

    $("#locationDD").kendoDropDownList({
        enable:false,
        dataTextField: "name",
        dataValueField: "id",
        filter: "contains",
        suggest: true,
        optionLabel: {
            name: "None",
            id: ""
        }
    });
}
