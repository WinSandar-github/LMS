function HandleGoogleApiLibrary() {
    gapi.load('client:auth2', {
        callback: function () {
            gapi.client.init({
                apiKey: 'AIzaSyDo53y6vjjPYlZ5r37f3QbMop6lkp8ctBc',
                clientId: '276909841763-p6rr1i1vgqimi58i8o3on8i63v46mthh.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.me'
            }).then(
                function (success) {
                },
                function (error) {
                }
            );
        },
        onerror: function () {
        }
    });
}
$("#google-login-button").on('click', function () {
    gapi.auth2.getAuthInstance().signIn().then(
        function (success) {
            var profile = success.getBasicProfile();
            console.log(profile.getName());
            var userData = "name=" + profile.getName() + "&email=" + profile.getEmail();
            $.ajax({
                type: "POST",
                url: "http://localhost:8000/" + "createCompanyByGoogle",
                data: userData,
                success: function (data) {
                    if (data == "") {
                        $('#result').text("Authentication Failed!").addClass('alert alert-danger');
                    }
                    else {
                        if (typeof (localStorage) !== "undefined") {
                            localStorage.setItem('userinfo', JSON.stringify(data));
                            location.href = '../CompanyComponents/company_info.html';
                        }
                    }
                },
                error: function (message) {
                    errorMessage(message);
                }
            });
        },
        function (error) {
        }
    );
});
