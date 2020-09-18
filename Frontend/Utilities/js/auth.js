if (typeof (localStorage) != "undefined")
{
    if (localStorage.getItem("userinfo") == null) {
        location.href = "login.html";
    }
    else {
        var user = JSON.parse(localStorage.getItem("userinfo"));
        
        var user_id = user[0]["id"];
        var user_name = user[0]["full_name"];
        var api_key = user[0]["api_key"];
        var company_id = user[0]["company_id"];
        var company_logo = user[0]["logo"];
        var adress = user[0]["address"];
        var ref_initials = user[0]["ref_initials"];
        var role = user[0]["role"];

    }
}
else {
    alert('Your browser does not support local storage');
    location.href = "login.html";
  }
