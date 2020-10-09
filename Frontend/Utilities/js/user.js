$("#addButton").click(function () {
    $("#name").val("");
    $("#email").val("");
    $("#password").val("");
    $("#phoneNo").val("");
    $("#address").val("");
    $("#passwordArea").css("display", "block");
});
function createUser() {
    var name = $("#name").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var phone = $("#phoneNo").val();
    var address = $("#address").val();
    if (name.trim() != "" && email.trim() != "" && password.trim() != "" && phone.trim() != "" && address.trim() != "") {
        var user = {};
        user['name'] = name;
        user['email'] = email;
        user['password'] = password;
        user['phone'] = phone;
        user['address'] = address;
        user['companyId'] = company_id;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                var message = JSON.parse(xhttp.responseText);
                alert(message);
                $("#name").val("");
                $("#email").val("");
                $("#password").val("");
                $("#phoneNo").val("");
                $("#address").val("");
                $('#modal-user').modal('toggle');
                getUser();
            }
        };
        xhttp.open('POST', BACKEND_URL + 'createUser');
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(JSON.stringify(user));
    }
    else {
        alert("Following value(s) cannot be left empty.\nအမည်\nအီးမေးလ်\nစကားဝှက်\nဖုန်း\nလိပ်စာ");
    }
}
function getUser() {
    destroyDatatable("#tbl_user", "#tbl_user_body");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getUser",
        data: "companyId=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.full_name + "</td>";
                tr += "<td >" + element.email + "</td>";
                tr += "<td >" + element.phone_no + "</td>";
                tr += "<td >" + element.address + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button  type='button' class='btn btn-info btn-md btn-space' onClick='showUserInfo(" + element.id + ")'>" +
                    "<li class='fas fa-edit' ></li ></button ></div >";
                tr += "<div class='btn-group'>" +
                    "<button type='button'  class='btn btn-danger btn-md btn-space' onClick=deleteUser(\"" + encodeURIComponent(element.full_name) + "\"," + element.id + ")>" +
                    "<li class='fas fa-trash'></li></button></div></td>";
                tr += "</tr>";
                $("#tbl_user_body").append(tr);

            });
            createDataTable("#tbl_user");
        },
        error: function (message) {
            dataMessage(message, "#tbl_user", "#tbl_user_body");
        }
    });
}
function deleteUser(userName, userId) {
    var result = confirm("WARNING: This will delete User from " + decodeURIComponent(userName) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "userId=" + userId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteUser",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_user", "#tbl_user_body");
                getUser();
                alert(data);
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
}
function showUserInfo(userId) {
    $("#userForm").attr('action', 'javascript:updateUser()');
    $("#userId").val(userId);

    var data = "&userId=" + userId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showUserInfo",
        data: data,
        success: function (data) {
            $("#name").val(data.full_name);
            $("#email").val(data.email);
            $("#passwordArea").css("display","none");
            $("#phoneNo").val(data.phone_no);
            $("#address").val(data.address);
            $('#modal-user').modal('toggle');
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}
function updateUser() {
    var userData = {};
    userData["userId"] = $("#userId").val();
    userData["name"] = $("#name").val();
    userData["email"] = $("#email").val();
    userData["password"] = $("#password").val();
    userData["phoneNo"] = $("#phoneNo").val();
    userData["address"] = $("#address").val();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            var message = JSON.parse(xhttp.responseText);
            alert(message);
            $("#name").val("");
            $("#email").val("");
            $("#password").val("");
            $("#phoneNo").val("");
            $("#address").val("");
            $('#modal-user').modal('toggle');
            destroyDatatable("#tbl_user", "#tbl_user_body");
            getUser();
        }
    };
    xhttp.open('POST', BACKEND_URL + 'updateUser');
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(userData));
}

