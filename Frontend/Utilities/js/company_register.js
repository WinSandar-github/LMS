function saveCompanyRegister()
{
    var company_name = $('#companyname').val();
    var company_address = $('#companyaddress').val();
    var txt_name = $('#txt_name').val();
    var txt_phone = $('#txt_phone').val();
    var txt_email = $('#txt_email').val();
    var txt_password = $('#txt_password').val();
    var txt_password=$('#confirm_password').val();
    var form = new FormData;
    var logo_file = document.getElementById('companylogo');
    if (logo_file.files.length > 0) {
        for (var i = 0; i <= logo_file.files.length - 1; i++) {

            var fname = logo_file.files.item(i).name;
            var fsize = logo_file.files.item(i).size;

            var product_photo = document.getElementById('companylogo').files[0].name;
            var ext = product_photo.substr((product_photo.lastIndexOf('.') + 1));
            var random_number = Math.floor(1000 + Math.random() * 9000);

            form.append('img', logo_file.files[i]);
            form.append('ext', ext);
        }

    }
    form.append('companyname', company_name);
    form.append('companyaddress', company_address);
    form.append('txt_name', txt_name);
    form.append('txt_phone', txt_phone);
    form.append('txt_email', txt_email);
    form.append('txt_password', txt_password);
    $.ajax({
            type: "POST",
            url: BACKEND_URL + "saveCompany",
            data: form,
            contentType: false,
            processData: false,
            success: function (data) {
             alert(data.message);
             location.href='../CompanyComponents/company_info.html';
           },
           error:function (XMLHttpRequest, textStatus, errorThrown){
             errorStatus(XMLHttpRequest, textStatus, errorThrown);
           }

    });
}
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
$('#confirm_password').on('keyup', function () {
  if ($('#txt_password').val() == $('#confirm_password').val()) {
    $('#message').html('Matching').css("color", "blue");
  } else
    $('#message').html('Not Matching').css('color', 'red');
});
$('#txt_email').on('keyup', function () {
  const $result = $("#messageEmail");
  const email = $("#txt_email").val();
  $result.text("");
  if (validateEmail(email)) {
    $result.text(email + " is valid");
    $result.css("color", "blue");
  } else{
    $result.text(email + " is not valid");
    $result.css("color", "red");
  }
});
