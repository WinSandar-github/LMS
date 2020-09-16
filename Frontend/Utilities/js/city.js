var BACKEND_URL = "http://" + window.location.host + "/";
function save_tbl_city() {
    var cityData = "company_id=" + company_id + "&city_name=" + $("#txt_city_name").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "save_tbl_city",
        data: cityData,
        success: function (data) {
            if (data == "1") {
                alert("Success!");
                $("#txt_city_name").val("");
                $('#table_tbl_city').DataTable().destroy();
                load_tbl_city();
            }
        
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert("Status: " + textStatus);
          alert("Error: " + errorThrown);
        }
    });
}
function load_tbl_city() {
    if ($.fn.DataTable.isDataTable('#table_tbl_city')) {
        $('#table_tbl_city').DataTable().destroy();
    }
    $("#tbl_city_container").empty();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "get_tbl_city",
        data: "company_id=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.id + "</td>";
                tr += "<td >" + element.city_name + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-warning btn-xs' onClick='update_city_init(" + element.id + ")'>" +
                    "<li class='fas fa-edit'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=delete_city(\"" + encodeURIComponent(element.city_name) + "\"," + element.id + ")><li class='fa fa-trash' ></li ></button ></div ></td > ";
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
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}

function update_city_init(city_id) {
    $("#city_form").attr('action', 'javascript:update_city()');
    $("#city_id").val(city_id);

    var data ="&city_id=" + city_id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            $("#txt_city_name").val(data.city_name);

        }

        else if (this.status == 500) {
            document.write(this.responseText);
        }
    };

    xhttp.open("POST", BACKEND_URL + "get_tbl_city_by_id", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}

function update_city() {
    
    var cityData = "city_id=" + $("#city_id").val() + "&city_name=" + $("#txt_city_name").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "update_tbl_city",
        data: cityData,
        success: function (data) {
            if (data == "1") {
                $("#txt_city_name").val("");
                $('#table_tbl_city').DataTable().destroy();
                load_tbl_city();
                $("#city_form").attr('action', 'javascript:save_tbl_city()');
                alert("Update successfully!");
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}

function delete_city(city_name, city_id) {

    var result = confirm("WARNING: This will delete the city " + decodeURIComponent(city_name) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "&city_id=" + city_id;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "delete_tbl_city",
            data: data,
            success: function (data) {
                if (data == "1") {
                    $("#txt_city_name").val("");
                    $('#table_tbl_city').DataTable().destroy();
                    load_tbl_city();
                    alert("delete successfully!");
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus);
                alert("Error: " + errorThrown);
            }
        });
    }
}