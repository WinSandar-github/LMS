function saveUnit() {
    var unitData = "company_id=" + company_id + "&unit_name=" + $("#txt_unit_name").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createUnit",
        data: unitData,
        success: function (data) {
            successMessage(data);
            clearUnitForm();
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}
function clearUnitForm() {
    $("#txt_unit_name").val("");
    getUnit();
}
function getUnit() {
    destroyDatatable("#tbl_unit", "#tbl_unit_body");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getUnit",
        data: "company_id=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.id + "</td>";
                tr += "<td >" + element.unit_name + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-info btn-xs' onClick='showUnitInfo(" + element.id + ")'>" +
                    "<li class='fas fa-edit'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteUnit(\"" + encodeURIComponent(element.unit_name) + "\"," + element.id + ")><li class='fa fa-trash' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_unit_body").append(tr);

            });
            createDataTable("#tbl_unit");

        },
        error:function (message){
            dataMessage(message, "#tbl_unit", "#tbl_unit_body");
        }
    });
}
function showUnitInfo(unitId) {
    $("#unit_form").attr('action', 'javascript:updateUnit()');
    $("#unit_id").val(unitId);

    var data = "&unit_id=" + unitId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showUnitInfo",
        data: data,
        success: function (data) {
            $("#txt_unit_name").val(data.unit_name);
        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function updateUnit() {
    var unitData = "unit_id=" + $("#unit_id").val() + "&unit_name=" + $("#txt_unit_name").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateUnit",
        data: unitData,
        success: function (data) {
            clearUnitForm();
            $("#unit_form").attr('action', 'javascript:saveUnit()');
            successMessage(data);
        },
        error:function (XMLHttpRequest, textStatus, errorThrown){
          errorStatus(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}
function deleteUnit(unitName, unitId) {
    var result = confirm("WARNING: This will delete the unit " + decodeURIComponent(unitName) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "unit_id=" + unitId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteUnit",
            data: data,
            success: function (data) {
                clearUnitForm();
                successMessage(data);
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
}
function getUnitSelect(){
     var select = document.getElementById("select_unit");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getUnit",
        data: "company_id=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var option = document.createElement('option');
                option.text = element.unit_name;
                option.value = element.id;
                select.add(option, 0);

            });
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}
