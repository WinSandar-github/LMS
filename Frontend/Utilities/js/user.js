$("#addButton").click(function () {
    $("#name").val("");
    $("#email").val("");
    $("#password").val("");
    $("#phoneNo").val("");
    $("#address").val("");
    $("#passwordArea").css("display", "block");
    $("#userForm").attr('action', 'javascript:createUser()');
});
function createUser() {
    var name = $("#name").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var phone = $("#phoneNo").val();
    var address = $("#address").val();
    if (name.trim() != "" && email.trim() != "" && password.trim() != "" && phone.trim() != "" && address.trim() != "") {
        var user = {};
        user['full_name'] = name;
        user['email'] = email;
        user['password'] = password;
        user['phone_no'] = phone;
        user['address'] = address;
        user['company_id'] = company_id;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                successMessage(xhttp.responseText);
                clearUserForm();
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
function clearUserForm() {
    $("#name").val("");
    $("#email").val("");
    $("#password").val("");
    $("#phoneNo").val("");
    $("#address").val("");
    $('#modal-user').modal('toggle');
    destroyDatatable("#tbl_user", "#tbl_user_body");
    getUser();
}
function getUser() {
    destroyDatatable("#tbl_user", "#tbl_user_body");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getUser",
        data: "company_id=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.full_name + "</td>";
                tr += "<td >" + element.email + "</td>";
                tr += "<td >" + element.phone_no + "</td>";
                tr += "<td >" + element.address + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button  type='button' class='btn btn-info btn-md' onClick='showUserInfo(" + element.id + ")'>" +
                    "<li class='fas fa-edit' ></li ></button >";
                tr += "<button type='button'  class='btn btn-danger btn-md' onClick=deleteUser(\"" + encodeURIComponent(element.full_name) + "\"," + element.id + ")>" +
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
function deleteUser(user_name, user_id) {
    var result = confirm("WARNING: This will delete User from " + decodeURIComponent(user_name) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "user_id=" + user_id;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteUser",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_user", "#tbl_user_body");
                getUser();
                successMessage(data);
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

    var data = "&user_id=" + userId;
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
    userData["user_id"] = $("#userId").val();
    userData["full_name"] = $("#name").val();
    userData["email"] = $("#email").val();
    userData["password"] = $("#password").val();
    userData["phone_no"] = $("#phoneNo").val();
    userData["address"] = $("#address").val();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            successMessage(xhttp.responseText);
            var userInfo = JSON.parse(localStorage.getItem("userinfo"));
            var user = userInfo[0].user;
            if (user.id == $("#userId").val()) {
                user.full_name = $("#name").val();
                localStorage.setItem("userinfo", JSON.stringify(userInfo));
            }
            location.reload();
        }
    };
    xhttp.open('POST', BACKEND_URL + 'updateUser');
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(userData));
}

