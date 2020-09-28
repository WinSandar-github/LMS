function saveCity() {
    var cityData = "companyId=" + company_id + "&cityName=" + $("#txt_city_name").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createCity",
        data: cityData,
        success: function (data) {
            alert(data.message);
            $("#txt_city_name").val("");
            destroyDatatable('#table_tbl_city','#tbl_city_container');
            getCity();
        },
        error: function (message){
            errorMessage(message);
        }
    });
}
function getCity() {
    destroyDatatable("#table_tbl_city", "#tbl_city_container");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCity",
        data: "companyId=" + company_id,
        success: function (data) {

            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.id + "</td>";
                tr += "<td >" + element.city_name + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-warning btn-edit btn-xs' onClick='showCityInfo(" + element.id + ")'>" +
                    "<li class='fas fa-edit'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-delete btn-xs' onClick=deleteCity(\"" + encodeURIComponent(element.city_name) + "\"," + element.id + ")><li class='fa fa-trash' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_city_container").append(tr);

            });
            createDataTable("#table_tbl_city");

        },
        error: function (message) {
            errorMessage(message);
        }
    });
}

function showCityInfo(cityId) {
    $("#city_form").attr('action', 'javascript:updateCity()');
    $("#city_id").val(cityId);
    var data = "&cityId=" + cityId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCityInfo",
        data: data,
        success: function (data) {
            $("#txt_city_name").val(data.city_name);

        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function updateCity() {
    var cityData = "cityId=" + $("#city_id").val() + "&cityName=" + $("#txt_city_name").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateCity",
        data: cityData,
        success: function (data) {
            $("#txt_city_name").val("");
            destroyDatatable('#table_tbl_city','#tbl_city_container');
            getCity();
            $("#city_form").attr('action', 'javascript:saveTblCity()');
            alert(data.message);
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}

function deleteCity(cityName, cityId) {
    var result = confirm("WARNING: This will delete the city " + decodeURIComponent(cityName) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "cityId=" + city_id;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteCity",
            data: data,
            success: function (data) {
                $("#txt_city_name").val("");
                destroyDatatable('#table_tbl_city','#tbl_city_container');
                getCity();
                alert(data.message);
            },
            error: function (message){
                errorMessage(message);
            }
        });
    }
}
function getCitySelect(){
    var select = document.getElementById("select_city");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCity",
        data: "companyId=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var option = document.createElement('option');
                option.text = element.city_name;
                option.value = element.id;
                select.add(option, 0);

            });
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}
