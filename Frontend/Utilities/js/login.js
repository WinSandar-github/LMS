var Backend_url = window.location.origin + "/Backend/" ;

function login() {

    var email = $('#email').val();

    var password = $('#password').val();
    var data = {};

    data["email"] = email;
    data["password"] = password;

    var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
              if (xhttp.responseText.trim()=="") {
                  document.getElementById("result").innerHTML = "<h3>Authentication Failed!</h3>";
                }
              else {
                    var obj = JSON.parse((xhttp.responseText));

                    if (typeof (localStorage) !== "undefined") {
                     document.getElementById("result").innerHTML = "<h3>Authentication Successful!</h3>";
                      localStorage.setItem('userinfo', xhttp.responseText);
                      
                  }

              }
          }

          if (xhttp.readyState == 4 && xhttp.status == 500) {
              document.write(xhttp.responseText);
          }
      };
      xhttp.open('POST',Backend_url+'loginValidate');
      xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhttp.send(JSON.stringify(data));
}
