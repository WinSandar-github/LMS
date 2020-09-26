var BACKEND_URL = "http://localhost:8000/";
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
        'autoWidth': true,
        "order": [[0, "desc"]]
    });

}
$("table").on('click', 'tr', function () {

    $(this).addClass('selected').siblings().removeClass('selected');

});
function get_company_info() {
    var src = "http://localhost:8000/storage/company_logo/" + company_logo;
    $('#logo').attr("src", src);
    $("#company_name").append(company_name);
    $("#address").append(adress);
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
            $("#city").append(data[0]["city_name"]);
            $("#cashRemark").append(data[0]["cash_method"])
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td style='text-align:center;'>" + "#"+ "</td>";
                tr += "<td style='text-align:center;'>" + element.product_name + "</td>";
                tr += "<td style='text-align:center;'>" + element.qty + "</td>";
                tr += "</tr>";
                $("#tbl_invoice_container").append(tr);

            });

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

