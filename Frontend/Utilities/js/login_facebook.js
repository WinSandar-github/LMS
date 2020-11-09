window.fbAsyncInit = function() {
    FB.init({
      appId      : '3355672601215236',
      cookie     : true,
      xfbml      : true,
      version    : 'v8.0'
    });

}
document.getElementById('fb-login-button').addEventListener('click', () => {
  FB.login((response) => {

    if (response.authResponse) {
      fetchUserProfile();
    }
  }, {scope: 'email,public_profile', return_scopes: true});
}, false);
function fetchUserProfile()
{
    /*FB.api('/{user-id}/phones', function(userdata) {
      console.log(userdata);
      //fields=id,name,email
      var userform=new FormData;
      console.log(userdata);
      userform.append('full_name',userdata.name);
      userform.append('email',userdata.email);
      $.ajax({
              type: "POST",
              url: BACKEND_URL + "saveUserInfoFacebook",
              data:userform,
              contentType: false,
              processData: false,
              success: function (data) {
                localStorage.setItem('userinfo', JSON.stringify(data));
              //  location.href='../CompanyComponents/company_info.html';
             },
             error:function (XMLHttpRequest, textStatus, errorThrown){
               errorStatus(XMLHttpRequest, textStatus, errorThrown);
             }

      });
    });*/
    FB.api("/me?fields=name",

    function (response) {
      console.log(response);
      if (response && !response.error) {

      }
    }
);
}
