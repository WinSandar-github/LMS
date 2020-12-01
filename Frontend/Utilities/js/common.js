var BACKEND_URL = "https://www.talyou.com/logistics/Backend/public/";
function logout() {
    (localStorage.getItem("userinfo")) && localStorage.removeItem("userinfo");
    location.href = "../../Components/Auth/login.html";
}
function successMessage(message) {
    toastr.options = toastOptions;
    toastr.success(message);
}
function errorMessage(message) {
    toastr.options = toastOptions;
}
function removeDoublequote(xhttp) {
    var message = xhttp.responseText;
    return message.replace(/^"|"$/g, '')
}
function errorStatus(XMLHttpRequest, textStatus, errorThrown){
    alert("Status: " + textStatus);
    alert("Error: " + errorThrown);
}
function destroyDatatable(table, tableBody) {
    if ($.fn.DataTable.isDataTable(table)) {
        $(table).DataTable().destroy();
    }
    $(tableBody).empty();
}
var toastOptions = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "1000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
function createDataTable(table) {

    $(table).DataTable({
        'destroy': true,
        'paging': true,
        'lengthChange': false,
        "pageLength": 5,
        'searching': false,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "scrollX": true,
        'select': true,
        "order": [[0, "desc"]]
    });

}

$('table tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
    }
    else {
        $('table tbody tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
function createDatepicker(datepicker){
  $(datepicker).datepicker({ format: 'yyyy-mm-dd',autoclose:true,cursor:'pointer' });
}
function getCompanyInfo() {
  $("#company_name").html(""),$("#user_name").html("");
  var src = BACKEND_URL + "storage/company_logo/" + company_logo;
  $('#logo').attr("src", src);
  $("#company_name").append(company_name);
  $("#address").append(address);
}
function getGoodreceiptInvoiceDetails() {
    var currentUrl = window.location.href;
    var url = new URL(currentUrl);
    var goodReceiptId = url.searchParams.get("goodReceiptId");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptInvoice",
        data: "good_receipt_id=" + goodReceiptId,
        success: function (data) {
            $("#customerName").append(data[0]["customer_name"]);
            $("#senderName").append(data[0]["sender_name"]);
            $("#orderNo").append(data[0]["order_no"]);
            $("#date").append(formatDate(data[0]["date"]));
            $("#city").append(data[0].city_list.city_name);
            $("#cashRemark").append(data[0]["cash_method"])
            var goodReceiptDetail = data[0].good_receipt_detail_by_good_receipt;
            var length = goodReceiptDetail.length;
            for (var detail = 0; detail < length; detail++) {
                var tr = "<tr>";
                tr += "<td style='text-align:center;'>" +  + "</td>";
                tr += "<td style='text-align:center;'>" + goodReceiptDetail[detail]["product_name"] + "</td>";
                tr += "<td style='text-align:center;'>" + Math.round(goodReceiptDetail[detail]["qty"]) + "</td>";
                tr += "</tr>";
                $("#tbl_invoice_container").append(tr);
            }
            numberRows();
        },
        error: function (message) {
            var returnMessage = JSON.parse(message.responseText)
            alert(returnMessage.message);
        }
    });
}
function formatDate(date) {
    var newDate = new Date(date);
    return newDate.getDate() + '-' + (newDate.getMonth() + 1) + "-" + newDate.getFullYear();
}
function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}
function removeComma(number){
  var number_part=parseInt(number.split(',').join(""));
  return number_part;
}
function removePercent(number){
  var number_part=parseInt(number.split('%').join(""));
  return number_part;
}
function countColumn(table) {
    var numCols = $(table).find('tr')[0].cells.length;
    return numCols;
}
function dataMessage(message, table, tableBody) {
    var dataMsg = message.responseText;
    var noOfColumn = countColumn(table);
    var tr = "<tr>";
    tr += "<td colspan='" + noOfColumn + "'>အချက်အလက်များမရှိ‌‌‌သေးပါ</td>";
    tr += "</tr>";
    $(tableBody).append(tr);
    if(noOfColumn>=11){
      $(table).addClass('table-responsive');
    }
}
function numberRows() {
    $('table tbody tr').each(function (idx) {
        $(this).children(":eq(0)").html(idx + 1);
    });
}
function generateQRCode(){
  var currentUrl = window.location.href;
  var url = new URL(currentUrl);
  var url=window.location.href.split('/');
  var last_array=url[url.length - 1].split('?');
  if(last_array[last_array.length - 2] === 'goodreceipt_invoice.html'){
    var goodReceiptId = last_array[last_array.length - 1].split('=');
    var id=goodReceiptId[goodReceiptId.length - 1];
    var url="https://www.talyou.com/logistics/Frontend/Components/Good/qr_view_goodreceipt.html?id="+id;
    var qr;
        (function() {
                      qr = new QRious({
                      element: document.getElementById('qr-code'),
                      size: 200,
                      value: url
                  });
        })();
  }else{
    var order_no =last_array[last_array.length - 1].split('=');
    var last_order_no=order_no[order_no.length - 1];
    if(last_order_no[last_order_no.length - 1]=='*'){
      var replace_order=last_order_no.replace("*",'');
      var url="https://www.talyou.com/logistics/Frontend/Components/Delivery/qr_view_invoice.html?orderNo="+replace_order;
      var qr;
          (function() {
                        qr = new QRious({
                        element: document.getElementById('qr-code'),
                        size: 200,
                        value: url
                    });
          })();

    }else{
      var send_order_no=order_no[order_no.length - 1];
      var url="https://www.talyou.com/logistics/Frontend/Components/Delivery/qr_view_invoice.html?orderNo="+send_order_no;
      var qr;
          (function() {
                        qr = new QRious({
                        element: document.getElementById('qr-code'),
                        size: 200,
                        value: url
                    });
          })();

    }
  }
}
