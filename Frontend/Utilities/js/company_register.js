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
    validateImage(logo_file,form);
    form.append('name', company_name);
    form.append('address', company_address);
    form.append('full_name', txt_name);
    form.append('phone', txt_phone);
    form.append('email', txt_email);
    form.append('password', txt_password);
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
function validateImage(logo_file,logo_form){

  if (logo_file.files.length > 0) {
      for (var i = 0; i <= logo_file.files.length - 1; i++) {
          var file_name = logo_file.files.item(i).name;
          var file_size = logo_file.files.item(i).size;
          var ext = file_name.substr((file_name.lastIndexOf('.') + 1));
          var file_ext=ext.toLowerCase();
          if ( file_ext!= "jpeg" && file_ext != "jpg" && file_ext != "png" && file_ext != "bmp" && file_ext != "gif") {
                  $('#invalid_file').html('invalid file type.This file type must be jpeg,jgg,png,bmp,gif..').css('color', 'red');
                  $('#invalid_size').html("");
                  document.getElementById(logo_file).value = '';
                  return false;
          }
          if(file_size > 1024000){
                  $('#invalid_size').html('Max Upload size is 1MB only').css('color', 'red');
                  $('#invalid_file').html("");
                  document.getElementById(logo_file).value = '';
                  return false;
          }
                  $('#invalid_file').html("");
                  $('#invalid_size').html("");
                  logo_form.append('logo', logo_file.files[i]);
                  logo_form.append('ext', file_ext);
      }
    }
}
function loadCompanyInfo()
{
  $("#tbl_company_container").html("");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getCompany",
          data: "company_id="+company_id,
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
function showCompanyInfo(company_id)
{
  $('#hcompanyId').val(company_id);
  $("#companyForm").attr('action', 'javascript:updateCompanyInfo()');
  $.ajax({
      type: "POST",
      url: BACKEND_URL + "getCompany",
      data: "company_id="+company_id,
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
  var file_ext = $('#hfile').val().substr(($('#hfile').val().lastIndexOf('.') + 1));
  var company_info = new FormData;;
  company_info.append('company_id',$('#hcompanyId').val());
  company_info.append('name',$("#txt_company_name").val());
  company_info.append('address',$("#txt_company_address").val());
  company_info.append('phone',$("#txt_company_phone").val());
  company_info.append('ext',file_ext);
  company_info.append('logo',$('#hfile').val());
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "updateCompany",
          data: company_info,
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
function loadCompanyLogo(company_id) {
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCompany",
        data: "company_id="+company_id,
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
    var logo_form = new FormData();
    logo_form.append('companyId',company_id);
    logo_form.append('ref_initials',$('#hrefinitials').val());
    var logo_file = document.getElementById('updatelogo');
    validateImage(logo_file,logo_form);
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateCompany",
        data: logo_form,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data);
            loadCompanyInfo();
            $('#editModal').modal('toggle');

            }

    });
}
