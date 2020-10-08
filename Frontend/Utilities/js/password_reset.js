function matchPassword() {
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();
    if (password != confirmPassword) {
        $("#matchPwd").html("Passwords Not Match.");
    }
    else {
        $("#matchPwd").html("");
    }
}
function resetPassword() {
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();
    if (password != confirmPassword) {
        alert("Passwords Not Match.");
    }
    else {
        var resetData = "Username=" + $("#email").val() + "&password=" + $("#confirmPassword").val();
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "resetPassword",
            data: resetData,
            success: function (data) {
                localStorage.setItem('userinfo', JSON.stringify(data));
                location.href = '../CompanyComponents/company_info.html';
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
    
}