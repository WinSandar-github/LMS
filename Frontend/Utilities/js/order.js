const completeDeliveryStatus = 1;
const imcompleteDeliveryStatus = 0;
function addToOrder(goodReceiptId) {
    $("#tbl_order_body").html("");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptDetail",
        data: "good_receipt_id=" + goodReceiptId,
        success: function (data) {
            var goodReceipt = data[0].good_receipt_by_detail;
            var unit = data[0].unit_by_detail;
            $("#hiddenOrderno").val(goodReceipt.order_no);
            $("#hiddenGoodReceiptId").val(goodReceipt.id);
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + "<input type='text' value='"+element.product_name+"'>" + "</td>";
                tr += "<td >" + "<input type='text' value='" + Math.round(element.qty) + "'>" + "</td>";
                tr += "<td >" + "<input type='text' id='productQuantity' value='" + Math.round(element.qty) + "'>" + "</td>";
                tr += "<td >" + "<input type='text' id='productWeight' value='" + element.weight + "'>" + "</td>";
                tr += "<td >" + "<input type='text' id='productUnit' value='" + unit.unit_name +"'>" + "</td>";
                tr += "<td >" + "<input type='text' id='productPrice' value='0' onkeyup='getTotalPerProduct(this)'>" + "</td>";
                tr += "<td >" + "<input type='text' id='total' value='0'>" + "</td>";
                tr += "</tr>";
                $("#tbl_order_body").append(tr);

            });
            appendRows("labourFee", "အလုပ်သမားခ:");
            appendRows("land", "စိုက်ငွေ:");
            appendRows("totalPrice", "စုစုပေါင်း:");
            $('#modal-order').modal('toggle');
        },
        error: function (message) {
            alert("Please add product");
        }
    });
}
function appendRows(id,label) {
    var tr = "<tr>";
    tr += "<td colspan='6' style='text-align:right;'>" + label + "</td>";
    tr += "<td >" + "<input type='text' id='" + id +"' value='0'>" + "</td>";
    tr += "</tr>";
    $("#tbl_order_body").append(tr);
    var new_id = "#" + id;
    if (id != "totalPrice") {
        $(new_id).keyup(function () {
            getTotal();
        });
    } 
}
function getTotalPerProduct(td) {
    var row = $(td).closest('tr');
    var productQuantity = parseFloat($(row).find('#productQuantity').val());
    var productWeight = parseInt($(row).find('#productWeight').val());
    var productPrice = parseInt($(row).find('#productPrice').val()) ? parseInt($(row).find('#productPrice').val()) : 0;
    var priceMethod = $("input[name='optradio']:checked").val();
    var tableLength = document.getElementById("tbl_order").rows.length;
    var productsTotal = new Array();
    var sumVal = 0;
    switch (priceMethod) {
        case "quantity":
            $(row).find('#total').val(productQuantity * productPrice);
            break;
        case "weight":
            $(row).find('#total').val(productWeight * productPrice);
            break;
        default:
            $(row).find('#total').val(productPrice);
    }
    for (var total = 1; total < tableLength - 3; total++) {
        productsTotal[total - 1] = document.getElementById("tbl_order").rows[total].cells[6].firstChild.value;

    }
    for (var sumTotal = 0; sumTotal < productsTotal.length; sumTotal++) {

        sumVal += Number(productsTotal[sumTotal]);
    }
    var total = sumVal + Number($("#labourFee").val()) + Number($("#land").val());
    $("#totalPrice").val(total);
    $("#hiddenTotal").val(sumVal);
}
function getTotal() {
    var totalPrice = $("#hiddenTotal").val();
    var labourFee = $("#labourFee").val();
    var land = $("#land").val();
    $("#totalPrice").val(Number(totalPrice) + Number(labourFee) + Number(land));
}

function createOrder() {
    var ordersData = new Array();
    var order = {};
    order["order_no"] = $("#hiddenOrderno").val();
    order["order_total"] = $("#hiddenTotal").val();
    order["total"] = $("#totalPrice").val();
    order["labour"] = $("#labourFee").val();
    order["land"] = $("#land").val();
    order["goodReceipt_id"] = $("#hiddenGoodReceiptId").val();
    order["user_id"] = user_id;
    order["company_id"] = company_id;
    ordersData.push(order);
    var tableLength = document.getElementById("tbl_order").rows.length;
    for (var i = 1; i < tableLength - 3; i++) {
        var orderdetails = {};
        orderdetails['product_name'] = document.getElementById("tbl_order").rows[i].cells[0].firstChild.value;
        orderdetails['quantity'] = document.getElementById("tbl_order").rows[i].cells[2].firstChild.value;
        orderdetails['weight'] = document.getElementById("tbl_order").rows[i].cells[3].firstChild.value;
        orderdetails['unit'] = document.getElementById("tbl_order").rows[i].cells[4].firstChild.value;
        orderdetails['product_price'] = document.getElementById("tbl_order").rows[i].cells[5].firstChild.value;
        orderdetails['total'] = document.getElementById("tbl_order").rows[i].cells[6].firstChild.value;
        orderdetails["user_id"] = user_id;
        ordersData.push(orderdetails);
    }
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createOrder",
        data: JSON.stringify(ordersData),
        success: function (data) {
            successMessage(data);
            $('#modal-order').modal('toggle');
            getGoodReceipt();
            $("#tbl_goodreceipt_detail_body").empty();
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}

function getOrder() {
    destroyDatatable("#tbl_order", "#tbl_order_body");
    destroyDatatable("#tbl_complete_order", "#tbl_complete_order_body");
    getOrderByStatus(imcompleteDeliveryStatus, '#tbl_order', '#tbl_order_body');
    getOrderByStatus(completeDeliveryStatus, '#tbl_complete_order', '#tbl_complete_order_body');
}
function getOrderByStatus(status,table,tableBody) {
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOrder/" + status,
        data: "company_id=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr onclick='getOrderDetail(" + element.id + ")'>";
                tr += "<td >" + element.order_no + "</td>";
                tr += "<td >" + formatDate(element.order_date) + "</td>";
                tr += "<td >" + element.total + "</td>";
                tr += "<td >" + element.total_paid + "</td>";
                tr += "<td >" + ((element.total) - (element.total_paid)) + "</td>";
                tr += "<td >" + (element.user_by_order).full_name + "</td>";
                if (status == imcompleteDeliveryStatus) {
                    tr += "<td class='alignright'><div class='btn-group'>" +
                        "<button type='button'  class='btn btn-danger btn-md btn-space' onClick=deleteOrder(\"" + encodeURIComponent(element.order_no) + "\"," + element.id + ")>" +
                        "<li class='fas fa-trash'></li></button></div>";
                    tr += "<div class='btn-group'>" +
                        "<button type='button' class='btn btn-success btn-print btn-md btn-space'>" +
                        "<i class='fas fa-print'></i> Print</button></div></td>";
                }
                else {
                    tr += "<td class='alignright'><td class='alignright'><div class='btn-group'>" +
                        "<button type='button' class='btn btn-success btn-print btn-md btn-space'>" +
                        "<i class='fas fa-print'></i> Print</button></div></td> ";
                }
                tr += "</tr>";
                $(tableBody).append(tr);

            });
            createDataTable(table);
        },
        error: function (message) {
            dataMessage(message, table, tableBody);
        }
    });
}
function getOrderDetail(orderId) {
    destroyDatatable("#tbl_order_detail", "#tbl_order_detail_body");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOrderDetail",
        data: "order_id=" + orderId,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.product_name + "</td>";
                tr += "<td >" + element.remark + "</td>";
                tr += "<td >" + Math.round(element.quantity)  + "</td>";
                tr += "<td >" + element.product_qty + "</td>";
                tr += "<td >" + element.weight + "</td>";
                tr += "</tr>";
                $("#tbl_order_detail_body").append(tr);

            });

            createDataTable("#tbl_order_detail");

        },
        error: function (message) {
            dataMessage(message, "#tbl_order_detail", "#tbl_order_detail_body");
        }
    });
}
function deleteOrder(orderNo, orderId) {
    var result = confirm("WARNING: This will delete Order from " + decodeURIComponent(orderNo) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "order_id=" + orderId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteOrder",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_order", "#tbl_order_body");
                getOrder();
                successMessage(data);
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
}
$("#tbl_order_body").on('click', '.btn-print', function () {
    var currentRow = $(this).closest("tr");
    var orderNo = currentRow.find("td:eq(0)").text();
    window.open("../DeliveryComponents/invoice.html?orderNo=" + orderNo);
});
