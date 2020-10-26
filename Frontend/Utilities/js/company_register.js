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
             successMessage(data);
             location.href='../CompanyComponents/company_info.html';
           },
           error:function (XMLHttpRequest, textStatus, errorThrown){
             errorStatus(XMLHttpRequest, textStatus, errorThrown);
           }

    });
}
function validatePassword(password){
  if (password.length >= 6){
    $('#valid_password').text("Your password is strong.").removeClass('alert alert-danger ').addClass('alert alert-success');
    return true;
  }else{
    $('#valid_password').text("Your password must be at least 8 characters!").addClass('alert alert-danger');
    return false;
  }
}
function validateConfirmPassword(confirm_password){
  if ($('#txt_password').val() != confirm_password) {
    $('#message_password').text("Passwords don't match!Try").addClass('alert alert-danger');
    return false;
  }else{
    $('#message_password').html("").removeClass('alert alert-danger ');
    return true;
  }
}
function validateEmail(email){
  const valid_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (valid_email.test(email)) {
    $("#messageEmail").html("").removeClass('alert alert-danger');
      return false;
  }else{
      $('#messageEmail').text("Email address is invalid!").addClass('alert alert-danger');
      return true;
      }
}
function validateImage(logo_file,logo_form){

  if (logo_file.files.length > 0) {
      for (var i = 0; i <= logo_file.files.length - 1; i++) {
          var file_name = logo_file.files.item(i).name;
          var file_size = logo_file.files.item(i).size;
          var ext = file_name.substr((file_name.lastIndexOf('.') + 1));
          var file_ext=ext.toLowerCase();
          if ( file_ext!= "jpeg" && file_ext != "jpg" && file_ext != "png" && file_ext != "bmp" && file_ext != "gif") {
                  $('#invalid_file').text('This file type must be jpeg,jgg,png,bmp,gif..').addClass('alert alert-danger');
                  $('#invalid_size').html("").removeClass('alert alert-danger');
                  return false;
          }
          if(file_size > 1024000){
                  $('#invalid_size').text('Max Upload size is 1MB only').addClass('alert alert-danger');
                  $('#invalid_file').html("").removeClass('alert alert-danger');
                  return false;
          }
                  $('#invalid_file').html("").removeClass('alert alert-danger');
                  $('#invalid_size').html("").removeClass('alert alert-danger');
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
           if (data[0].logo=="") {
             tr += "<td>" + "<a href='#' onclick='loadCompanyLogo("+data[0].id+")' id='img' data-toggle='modal' data-target='#companyLogoModal'>Add logo</a>" + "</td>";
           }else{
             tr += "<td>" + "<a href='#' onclick='loadCompanyLogo("+data[0].id+")' id='img' data-toggle='modal' data-target='#companyLogoModal'>" + data[0].logo + "</a>" + "</td>";
           }
           tr += "<td class='alignright'><button type='button' class='btn btn-info btn-md btn-space' onClick=showCompanyInfo("+ data[0].id +")><i class='fas fa-edit'></i></button ></td>";
           tr += "</tr>";
           $("#tbl_company_container").append(tr);
           localStorage.setItem('userinfo',JSON.stringify(data));
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
            successMessage(data);
            location.reload();
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
          var myImageId = BACKEND_URL + "storage/company_logo/" + data[0].logo;
          $(".modal-body #companyLogo").attr("src", myImageId);

        },
        error:function (XMLHttpRequest, textStatus, errorThrown){
          errorStatus(XMLHttpRequest, textStatus, errorThrown);
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
    var logo_file = document.getElementById('updatelogo');
    validateImage(logo_file,logo_form);
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateCompany",
        data: logo_form,
        contentType: false,
        processData: false,
        success: function (data) {
            successMessage(data);
            location.reload();
          }

    });
}
