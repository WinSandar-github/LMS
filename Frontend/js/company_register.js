var Backend_url="http://"+window.location.host+"/";
function saveCompanyRegister()
{

  var company_name=$('#companyname').val();

  var company_address=$('#companyaddress').val();
  var gender= $("input[name='gender']:checked").val();
  var txt_name=$('#txt_name').val();
  var txt_type=$('#txt_type').val();
  var txt_phone=$('#txt_phone').val();
  var txt_email=$('#txt_email').val();
  var description=$('#description').val();
  var city=$('#city').val();
  var state=$('#state').val();
  var zip_code=$('#zip_code').val();
  var nrc_passport=$('#nrc_passport').val();
  var birthday=$('#birthday').val();
  var txt_password=$('#txt_password').val();
  var avatar=$('#avatar').val();

  var form = new FormData;
  var fi = document.getElementById('companylogo');

    var file = "";
    if (fi.files.length > 0) {


        for (var i = 0; i <= fi.files.length - 1; i++) {

            var fname = fi.files.item(i).name;
            var fsize = fi.files.item(i).size;

            var product_photo = document.getElementById('companylogo').files[0].name;
            var ext = product_photo.substr((product_photo.lastIndexOf('.') + 1));
            var random_number = Math.floor(1000 + Math.random() * 9000);
            file = fi.files[i];

            form.append('img[]', fi.files[i]);
            form.append('ext',ext);
        }

    }
    form.append('companyname',company_name);
    form.append('companyaddress',company_address);
    form.append('gender',gender);
    form.append('txt_name',txt_name);
    form.append('txt_type',txt_type);
    form.append('txt_phone',txt_phone);
    form.append('txt_email',txt_email);
    form.append('txt_password',txt_password);

    form.append('description',description);
    form.append('city',city);
    form.append('state',state);
    form.append('zip_code',zip_code);
    form.append('nrc_passport',nrc_passport);
    form.append('birthday',birthday);
    form.append('avatar',avatar);
    $.ajax({
            type: "post",
            url: Backend_url + "saveTblCompany",
            data: form,
            contentType: false,
            processData: false,
            success: function (data) {

                if (data == '1') {
                    alert("Successfully!");

                }


            }

        });
}