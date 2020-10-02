﻿const completeDeliveryStatus = 1;
const imcompleteDeliveryStatus = 0;
function addToOrder(goodReceiptId) {
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptDetail",
        data: "goodReceiptId=" + goodReceiptId,
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
            var tr = "<tr>";
            tr += "<td colspan='6' style='text-align:right;'>" + "အလုပ်သမားခ:" + "</td>";
            tr += "<td >" + "<input type='text' id='labourFee' value='0' onkeyup='getTotal();'>" + "</td>";
            tr += "</tr>";
            $("#tbl_order_body").append(tr);
            var tr = "<tr>";
            tr += "<td colspan='6' style='text-align:right;'>" + "စိုက်ငွေ:" + "</td>";
            tr += "<td >" + "<input type='text' id='land' value='0' onkeyup='getTotal();'>" + "</td>";
            tr += "</tr>";
            $("#tbl_order_body").append(tr);
            var tr = "<tr>";
            tr += "<td colspan='6' style='text-align:right;'>" + "စုစုပေါင်း:" + "</td>";
            tr += "<td >" + "<input type='text' id='totalPrice' value='0'>" + "</td>";
            tr += "</tr>";
            $("#tbl_order_body").append(tr);
            $('#modal-order').modal('toggle');
        },
        error: function (message) {
            errorMessage(message);
        }
    });
    
}
function getTotalPerProduct(td) {
    var row = $(td).closest('tr');
    var productQuantity = parseFloat($(row).find('#productQuantity').val());
    var productWeight = parseInt($(row).find('#productWeight').val());
    var productPrice = parseInt($(row).find('#productPrice').val()) ? parseInt($(row).find('#productPrice').val()) : 0;
    var priceMethod = $("input[name='optradio']:checked").val();
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
    var tableLength = document.getElementById("tbl_order").rows.length;
    var productsTotal = new Array();
    for (var total = 1; total < tableLength - 3; total++) {
        productsTotal[total - 1] = document.getElementById("tbl_order").rows[total].cells[6].firstChild.value;

    }
    var sumVal = 0;
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
    order["orderNo"] = $("#hiddenOrderno").val();
    order["orderTotal"] = $("#hiddenTotal").val();
    order["total"] = $("#totalPrice").val();
    order["labour"] = $("#labourFee").val();
    order["land"] = $("#land").val();
    order["goodReceiptId"] = $("#hiddenGoodReceiptId").val();
    order["userId"] = user_id;
    order["companyId"] = company_id;
    ordersData.push(order);
    var tableLength = document.getElementById("tbl_order").rows.length;
    for (var i = 1; i < tableLength - 3; i++) {
        var orderdetails = {};
        orderdetails['productName'] = document.getElementById("tbl_order").rows[i].cells[0].firstChild.value;
        orderdetails['quantity'] = document.getElementById("tbl_order").rows[i].cells[2].firstChild.value;
        orderdetails['weight'] = document.getElementById("tbl_order").rows[i].cells[3].firstChild.value;
        orderdetails['unit'] = document.getElementById("tbl_order").rows[i].cells[4].firstChild.value;
        orderdetails['productPrice'] = document.getElementById("tbl_order").rows[i].cells[5].firstChild.value;
        orderdetails['total'] = document.getElementById("tbl_order").rows[i].cells[6].firstChild.value;
        orderdetails["userId"] = user_id;
        ordersData.push(orderdetails);
    }
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createOrder",
        data: JSON.stringify(ordersData),
        success: function (data) {
            alert(data.message);
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
        data: "companyId=" + company_id,
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
                        "<button type='button'  class='btn btn-danger btn-delete btn-md' onClick=deleteOrder(\"" + encodeURIComponent(element.order_no) + "\"," + element.id + ")>" +
                        "<li class='fas fa-trash'></li></button></div></td> ";
                }
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-success btn-print btn-md'>" +
                    "<i class='fas fa-print'></i> Print</button></div></td> ";
                tr += "</tr>";
                $(tableBody).append(tr);

            });
            createDataTable(table);
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}
function getOrderDetail(orderId) {
    destroyDatatable("#tbl_order_detail", "#tbl_order_detail_body");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOrderDetail",
        data: "orderId=" + orderId,
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
            errorMessage(message);
        }
    });
}
function deleteOrder(orderNo, orderId) {
    var result = confirm("WARNING: This will delete Order from " + decodeURIComponent(orderNo) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "orderId=" + orderId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteOrder",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_order", "#tbl_order_body");
                getOrder();
                alert(data.message);
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
    window.open("../DeliveryComponents/deliver_invoice.html?orderNo=" + orderNo);
});