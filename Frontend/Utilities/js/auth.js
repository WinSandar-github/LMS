if (typeof (localStorage) != "undefined")
{
    if (localStorage.getItem("userinfo") == null) {
        location.href = "../authComponents/login.html";
    }
    else {
        var user = JSON.parse(localStorage.getItem("userinfo"));
        var user_id = user[0].users["id"];
        var user_name = user[0].users["full_name"];
        var api_key = user[0].users["api_key"];
        var company_id = user[0].users["company_id"];
        var company_logo = localStorage.getItem("companyLogo");
        var address = user[0]["address"];
        var ref_initials = user[0]["ref_initials"];
        var role = user[0].users["role"];
        var company_name = localStorage.getItem("companyName");

    }
}
else {
    alert('Your browser does not support local storage');
    location.href = "../authComponents/login.html";
  }
