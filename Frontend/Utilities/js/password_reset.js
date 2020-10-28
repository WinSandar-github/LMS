function matchPassword() {
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();
    if (password != confirmPassword) {
        $("#matchPwd").html("Passwords Not Match.").addClass('alert alert-danger');
    }
    else {
        $("#matchPwd").html("").removeClass('alert alert-danger ');
    }
}
function resetPassword() {
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();
    if (password != confirmPassword) {
        alert("Passwords Not Match.");
    }
    else {
        var resetData = "username=" + $("#email").val() + "&password=" + $("#confirmPassword").val();
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "resetPassword",
            data: resetData,
            success: function (data) {
                localStorage.setItem('userinfo', JSON.stringify(data));
                location.href = '../../Components/Company/company_info.html';
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }

}
