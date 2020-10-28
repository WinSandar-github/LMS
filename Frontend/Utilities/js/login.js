function login()
{
    var email = $('#email').val();
    var password = $('#password').val();
    var data = {};
    data["email"] = email;
    data["password"] = password;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if (xhttp.responseText.trim() == "") {
                $('#result').text("Authentication Failed!").addClass('alert alert-danger');
            }
            else {
                var obj = JSON.parse((xhttp.responseText));
                if (typeof (localStorage) !== "undefined") {
                      localStorage.setItem('userinfo', xhttp.responseText);
                      location.href='../../Components/Company/company_info.html';
                  }
                }
        }
        if (xhttp.readyState == 4 && xhttp.status == 500) {
            document.write(xhttp.responseText);
        }
    };
    xhttp.open('POST', BACKEND_URL + 'loginValidate');
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(data));
}
