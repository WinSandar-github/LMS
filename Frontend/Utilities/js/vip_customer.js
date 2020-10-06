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
        data: "customerName=" + customerName + "&startDate=" + startDate + "&endDate=" + endDate,
        success: function (data) {
            data.forEach(function (element) {
                for (var i = 0; i < (element.good_receipt_order).length; i++) {
                    var tr = "<tr>";
                    tr += "<td>" + element.date + "</td>";
                    tr += "<td >" + element.customer_name + "</td>";
                    tr += "<td >" + element.order_no + "</td>";
                    tr += "<td class='align-right'>" + (element.good_receipt_order)[i]["order_total"] + "</td>";
                    tr += "</tr>";
                    $("#tbl_vipCustomer_body").append(tr);
                }
                
            });
            var total = 0;
            $('#tbl_vipCustomer tr').each(function () {
                var value = parseInt($('td', this).eq(3).text());
                if (!isNaN(value)) {
                    total += value;
                }
            });
            $("#total").html(total);
        },
        error: function (message) {
            dataMessage(message, "#tbl_vipCustomer", "#tbl_vipCustomer_body");
        }
    });
}
function printCashReport() {
    var printContents = document.getElementById("print-area").innerHTML;
    document.body.innerHTML = printContents;
    $("#print-header").css("display", "block")
    window.print();
    location.reload();
}