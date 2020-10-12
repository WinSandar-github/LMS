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
             alert(data);
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
function loadCompanyInfo()
{
  $("#tbl_company_container").html("");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getCompany",
          data: "companyId="+company_id,
          success: function (data) {
           var tr = "<tr>";
           tr += "<td >" + data[0].name + "</td>";
           tr += "<td >" + data[0].address + "</td>";
           tr += "<td >" + data[0].phone+ "</td>";
           tr += "<td>" + "<a href='#' onclick='loadCompanyLogo("+data[0].id+")' data-toggle='modal' data-target='#companyLogoModal'>" + data[0].logo + "</a>" + "</td>";
           tr += "<td class='alignright'><button type='button' class='btn btn-info btn-md btn-space' onClick=showCompanyInfo("+ data[0].id +")><i class='fas fa-edit'></i></button ></td>";
           tr += "</tr>";
           $("#tbl_company_container").append(tr);
           localStorage.setItem('companyName', data[0].name);
           localStorage.setItem('companyLogo', data[0].logo);
         },
         error:function (XMLHttpRequest, textStatus, errorThrown){
           errorStatus(XMLHttpRequest, textStatus, errorThrown);
         }

  });
}
function showCompanyInfo(companyId)
{
  $('#hcompanyId').val(companyId);
  $("#companyForm").attr('action', 'javascript:updateCompanyInfo()');
  var data="companyId=" + companyId;
  $.ajax({
      type: "POST",
      url: BACKEND_URL + "getCompany",
      data: "companyId="+company_id,
      success: function (data) {
          $("#txt_company_name").val(data[0].name);
          $("#txt_company_address").val(data[0].address);
          $("#txt_company_phone").val(data[0].phone);
          $('#hfile').val(data[0].logo);
          $('#modal-company').modal('toggle');
      },
      error:function (message){
        errorMessage(message);
      }
  });
}
function updateCompanyInfo()
{
  var fileExt = $('#hfile').val().substr(($('#hfile').val().lastIndexOf('.') + 1));
  var companyInfo = new FormData;;
  companyInfo.append('companyId',$('#hcompanyId').val());
  companyInfo.append('companyName',$("#txt_company_name").val());
  companyInfo.append('companyAddress',$("#txt_company_address").val());
  companyInfo.append('companyPhone',$("#txt_company_phone").val());
  companyInfo.append('companyExt',fileExt);
  companyInfo.append('companylogo',$('#hfile').val());
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "updateCompany",
          data: companyInfo,
          contentType: false,
          processData: false,
          success: function (data) {
            alert(data);
            $('#modal-company').modal('toggle');
            loadCompanyInfo();

         },
         error:function (XMLHttpRequest, textStatus, errorThrown){
           errorStatus(XMLHttpRequest, textStatus, errorThrown);
         }
       });
}
function loadCompanyLogo(companyId) {
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCompany",
        data: "companyId="+companyId,
        success: function (data) {
          $('#hrefinitials').val(data[0].ref_initials);
          var myImageId = BACKEND_URL + "storage/company_logo/" + data[0].logo;
          $(".modal-body #companyLogo").attr("src", myImageId);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}
function editCompanyLogo()
{
  $('#companyLogoModal').modal('toggle');
}
function updateCompanyLogo() {
    var logoForm = new FormData();
    logoForm.append('companyId',company_id);
    logoForm.append('refinitials',$('#hrefinitials').val());
    var logoFile = document.getElementById('updatelogo');
    if (logoFile.files.length > 0) {
        for (var i = 0; i <= logoFile.files.length - 1; i++) {

            var fname = logoFile.files.item(i).name;
            var fsize = logoFile.files.item(i).size;

            var product_photo = document.getElementById('updatelogo').files[0].name;
            var ext = product_photo.substr((product_photo.lastIndexOf('.') + 1));
            var random_number = Math.floor(1000 + Math.random() * 9000);
            console.log(fname,fsize);
            logoForm.append('updatelogo', logoFile.files[i]);
            logoForm.append('companyExt', ext);
        }

    }
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateCompanyLogo",
        data: logoForm,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data);
            loadCompanyInfo();
            $('#editModal').modal('toggle');

            }

    });
}
