function getVipCustomerInfo() {
    $("#tbl_vipCustomer_body").html("");
    $("#total").html("");
    var customerName = $("#selectVipCustomer").val();
    var dateString = $("#date").val();
    var startDate = dateString.split(' - ')[0];
    var endDate = dateString.split(' - ')[1];
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getVipCustomerInfo",
        data: "customer_name=" + customerName + "&start_date=" + startDate + "&end_date=" + endDate,
        success: function (data) {
            data.forEach(function (element) {
                for (var i = 0; i < (element.order_by_good_receipts).length; i++) {
                    var tr = "<tr>";
                    tr += "<td>" + element.date + "</td>";
                    tr += "<td >" + element.customer_name + "</td>";
                    tr += "<td >" + element.order_no + "</td>";
                    tr += "<td class='align-right'>" + (element.order_by_good_receipts)[i]["order_total"] + "</td>";
                    tr += "</tr>";
                    $("#tbl_vipCustomer_body").append(tr);
                }
            });
            getTotal();
        },
        error: function (message) {
            dataMessage(message, "#tbl_vipCustomer", "#tbl_vipCustomer_body");
        }
    });
}
function getTotal() {
    var total = 0;
    $('#tbl_vipCustomer tr').each(function () {
        var value = parseInt($('td', this).eq(3).text());
        if (!isNaN(value)) {
            total += value;
        }
    });
    $("#total").html(total);
}
function printCashReport() {
    var printContents = document.getElementById("print-area").innerHTML;
    document.body.innerHTML = printContents;
    $("#print-header").css("display", "block")
    window.print();
    location.reload();
}
