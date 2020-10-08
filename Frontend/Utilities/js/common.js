var BACKEND_URL = "http://" + window.location.host + "/";

function logout() {
    if (localStorage.getItem("userinfo") == null) {
        location.href = "../authComponents/login.html";
    } else {
        localStorage.removeItem("userinfo");
        location.href = "../authComponents/login.html";
    }
}
function errorMessage(message) {
    var returnMessage = JSON.parse(message.responseText)
    alert(returnMessage);
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
    $(this).toggleClass('selected');
});
function createDatepicker(datepicker){
  $(datepicker).datepicker({ format: 'yyyy-mm-dd' });
}
function get_company_info() {
    var src = BACKEND_URL + "storage/company_logo/" + company_logo;
    $('#logo').attr("src", src);
    $("#company_name").append(company_name);
    $("#address").append(address);
}
function get_goodreceipt_invoicedetail() {
    var currentUrl = window.location.href;
    var url = new URL(currentUrl);
    var goodReceiptId = url.searchParams.get("goodReceiptId");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptInvoice",
        data: "goodReceiptId=" + goodReceiptId,
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
                tr += "<td style='text-align:center;'>" + "#" + "</td>";
                tr += "<td style='text-align:center;'>" + goodReceiptDetail[detail]["product_name"] + "</td>";
                tr += "<td style='text-align:center;'>" + Math.round(goodReceiptDetail[detail]["qty"]) + "</td>";
                tr += "</tr>";
                $("#tbl_invoice_container").append(tr);
            }

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
function dateRange(dateRange,startDate,endDate,table){
  var dataTable=$(table).DataTable({
        'destroy': true,
        'paging': true,
        'lengthChange': false,
        "pageLength": 5,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': true,
        "scrollX": true,
        "order": [[0, "desc"]]
    });
    $(dateRange).click(function () {
      startDateFilter = document.getElementById(startDate).value;
      endDateFilter = document.getElementById(endDate).value;
      dataTable.search(startDateFilter+' '+endDateFilter)
      .draw();
    });
}
function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}
function removeComma(number){
  var numberPart=parseInt(number.split(',').join(""));
  return numberPart;
}
function removePercent(number){
  var numberPart=parseInt(number.split('%').join(""));
  return numberPart;
}
function countColumn(table) {
    var numCols = $(table).find('tr')[0].cells.length;
    return numCols;
}
function dataMessage(message, table, tableBody) {
    var dataMsg = message.responseText;
    var noOfColumn=countColumn(table);
    var tr = "<tr>";
    tr += "<td colspan='" + noOfColumn + "'>" + dataMsg + "</td>";
    tr += "</tr>";
    $(tableBody).append(tr);
}
function numberRows() {
    $('table tbody tr').each(function (idx) {
        $(this).children(":eq(0)").html(idx + 1);
    });
}