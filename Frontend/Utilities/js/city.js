var BACKEND_URL = "http://" + window.location.host + "/";
function saveCity() {
    var cityData = "company_id=" + company_id + "&city_name=" + $("#txt_city_name").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createCity",
        data: cityData,
        success: function (data) {
            alert(data.message);
            $("#txt_city_name").val("");
            $('#table_tbl_city').DataTable().destroy();
            getCity();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert("Status: " + textStatus);
          alert("Error: " + errorThrown);
        }
    });
}
function getCity() {
    if ($.fn.DataTable.isDataTable('#table_tbl_city')) {
        $('#table_tbl_city').DataTable().destroy();
    }
    $("#tbl_city_container").empty();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCity",
        data: "company_id=" + company_id,
        success: function (data) {
            
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.id + "</td>";
                tr += "<td >" + element.city_name + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-warning btn-xs' onClick='showCityInfo(" + element.id + ")'>" +
                    "<li class='fas fa-edit'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteCity(\"" + encodeURIComponent(element.city_name) + "\"," + element.id + ")><li class='fa fa-trash' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_city_container").append(tr);

            });
            var table_tbl_city = $('#table_tbl_city').DataTable({
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

function showCityInfo(city_id) {
    $("#city_form").attr('action', 'javascript:updateCity()');
    $("#city_id").val(city_id);

    var data = "&city_id=" + city_id;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCityInfo",
        data: data,
        success: function (data) {
            $("#txt_city_name").val(data.city_name);

        },
        error: function (message) {
            var returnMessage = JSON.parse(message.responseText)
            alert(returnMessage.message);
        }
    });
}

function updateCity() {
    var cityData = "city_id=" + $("#city_id").val() + "&city_name=" + $("#txt_city_name").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateCity",
        data: cityData,
        success: function (data) {
            $("#txt_city_name").val("");
            $('#table_tbl_city').DataTable().destroy();
            getCity();
            $("#city_form").attr('action', 'javascript:saveTblCity()');
            alert(data.message);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}

function deleteCity(city_name, city_id) {
    var result = confirm("WARNING: This will delete the city " + decodeURIComponent(city_name) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "city_id=" + city_id;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteCity",
            data: data,
            success: function (data) {
                $("#txt_city_name").val("");
                $('#table_tbl_city').DataTable().destroy();
                getCity();
                alert(data.message);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus);
                alert("Error: " + errorThrown);
            }
        });
    }
}