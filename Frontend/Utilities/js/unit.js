var BACKEND_URL = "http://" + window.location.host + "/";
function saveUnit() {
var uityData = "company_id=" + company_id + "&unit_name=" + $("#txt_unit_name").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createUnit",
		data: uityData,
        success: function (data) {
            alert(data.message);
            $("#txt_unit_name").val("");
            $('#tbl_unit').DataTable().destroy();
            getUnit();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert("Status: " + textStatus);
          alert("Error: " + errorThrown);
        }
    });
}
function getUnit() {
    if ($.fn.DataTable.isDataTable('#tbl_unit')) {
        $('#tbl_unit').DataTable().destroy();
    }
    $("#tbl_unit_body").empty();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getUnit",
        data : "company_id=" +company_id,
        success: function (data) {
            
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.id + "</td>";
                tr += "<td >" + element.unit_name + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-warning btn-xs' onClick='showUnitInfo(" + element.id + ")'>" +
                    "<li class='fas fa-edit'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteUnit(\"" + encodeURIComponent(element.unit_name) + "\"," + element.id + ")><li class='fa fa-trash' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_unit_body").append(tr);

            });
            var tbl_unit = $('#tbl_unit').DataTable({
                'destroy': true,
                'paging': true,
                'lengthChange': false,
                "pageLength": 5,
                'searching': false,
                'ordering': true,
                'info': false,
                'autoWidth': true,
                "order": [[0, "desc"]]
            });

        },
        error: function (message) {
            var returnMessage = JSON.parse(message.responseText)
            alert(returnMessage.message);
        }
    });
}
function showUnitInfo(unit_id) {
    $("#unit_form").attr('action', 'javascript:updateUnit()');
    $("#unit_id").val(unit_id);

    var data = "&unit_id=" + unit_id;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showUnitInfo",
        data: data,
        success: function (data) {
            $("#txt_unit_name").val(data.unit_name);

        },
        error: function (message) {
            var returnMessage = JSON.parse(message.responseText)
            alert(returnMessage.message);
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
            $("#txt_unit_name").val("");
            $('#tbl_unit').DataTable().destroy();
            getUnit();
            $("#unit_form").attr('action', 'javascript:saveUnit()');
            alert(data.message);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}
function deleteUnit(unit_name, unit_id) {
    var result = confirm("WARNING: This will delete the unit " + decodeURIComponent(unit_name) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "unit_id=" + unit_id;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteUnit",
            data: data,
            success: function (data) {
                $("#txt_unit_name").val("");
                $('#tbl_unit').DataTable().destroy();
                getUnit();
                alert(data.message);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus);
                alert("Error: " + errorThrown);
            }
        });
    }
}