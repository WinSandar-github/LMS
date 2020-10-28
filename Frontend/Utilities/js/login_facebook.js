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
    FB.api('/me?fields=id,name,email', function(userdata) {
      var userform=new FormData;
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
                location.href='../CompanyComponents/company_info.html';
             },
             error:function (XMLHttpRequest, textStatus, errorThrown){
               errorStatus(XMLHttpRequest, textStatus, errorThrown);
             }

      });
    });
}
