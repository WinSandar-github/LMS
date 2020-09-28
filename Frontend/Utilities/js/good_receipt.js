function saveGoodReceipt() {
    var customerName = $("#txt_customer_name").val();
    var date = $("#txt_date").val();
    const customerCode = 0;
    const vipCustomerCode = 1;
    var customerStatus = ($('#vip_customer').is(":checked")) ? vipCustomerCode : customerCode;
    var address = $("#txt_address").val();
    var senderName = $("#txt_sender_name").val();
    var city = $("#select_city option:selected").val();
    var phoneNo = $("#txt_phno").val();
    var cashMethod = $("#select_cash_method option:selected").val();
    var remark = $("#txt_remark").val();
    var goodReceipt = {};
    goodReceipt['customerName'] = customerName;
    goodReceipt['date'] = date;
    goodReceipt['customerStatus'] = customerStatus;
    goodReceipt['address'] = address;
    goodReceipt['senderName'] = senderName;
    goodReceipt['cityId'] = city;
    goodReceipt['phoneNo'] = phoneNo;
    goodReceipt['cashMethod'] = cashMethod;
    goodReceipt['remark'] = remark;
    goodReceipt['refInitials'] = user[0]["ref_initials"];
    goodReceipt['companyId'] = company_id;
    goodReceipt['userId'] = user_id;
    if (customerName.trim() != "" && address.trim() != "" && senderName.trim() != "" && city != "" && phoneNo.trim() != "" && cashMethod != "") {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                var message = JSON.parse(xhttp.responseText).message;
                alert(message);
                $("#txt_customer_name").val("");
                $("#txt_date").val("");
                $('#vip_customer').prop('checked', false);
                $("#txt_address").val("");
                $("#txt_sender_name").val("");
                $("#select_city").val("");
                $("#txt_phno").val("");
                $("#select_cash_method").val("");
                $("#txt_remark").val("");
                $('#modal-goodreceipt').modal('toggle');
                getGoodReceipt();
            }
        };
        xhttp.open('POST', BACKEND_URL + 'createGoodRecipt');
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(JSON.stringify(goodReceipt));
    }
    else {
        alert("Following value(s) cannot be left empty.\nကုန်သည်အမည်\nနေ့စွဲ\nနေရပ်လိပ်စာ\nကုန်ပို့သူအမည်\nမြို့အမည်\nဖုန်းနံပါတ်\nCash Method");
    }
}

function getGoodReceipt() {
    destroyDatatable("#tbl_goodreceipt", "#tbl_goodreceipt_body");
    const completeOrderStatus = 1;
    const imcompleteOrderStatus = 0;
    $.ajax({
        type: "POST",
        url:  BACKEND_URL + "getGoodReceipt/" + imcompleteOrderStatus,
        data: "companyId=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr onclick='getGoodReceiptDetail(" + element.id + ")'>";
                tr += "<td >" + element.cash_method + "</td>";
                tr += "<td >" + element.order_no + "</td>";
                tr += "<td >" + element.customer_name + "</td>";
                tr += "<td >" + element.sender_name + "</td>";
                tr += "<td >" + element.remark + "</td>";
                tr += "<td >" + formatDate(element.date) + "</td>";
                tr += "<td >" + element.full_name + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-info btn-product btn-md' id='btn-add-prduct' data-toggle='modal' data-target='#modal-product' onClick='addProduct(" + element.id + ")'>" +
                    "<i class='fas fa-plus'></i> Add Product</button></div></td> ";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button  type='button' class='btn btn-warning btn-edit btn-md' onClick='showGoodReceiptInfo(" + element.id + ")'>" +
                    "<li class='fas fa-edit' ></li ></button ></div ></td > ";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button'  class='btn btn-danger btn-delete btn-md' onClick=deleteGoodReceipt(\"" + encodeURIComponent(element.sender_name) + "\"," + element.id + ")>" +
                    "<li class='fas fa-trash'></li></button></div></td> ";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-info btn-order btn-md btn-disable' onClick='addToOrder(" + element.id + ")'>" +
                    "ဘောင်ချာဖွင့်ရန်</button></div></td> ";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-success btn-print btn-md' onClick='printGoodReceipt(" + element.id + ")'>" +
                    "<i class='fas fa-print'></i> Print</button></div></td> ";
                tr += "</tr>";
                $("#tbl_goodreceipt_body").append(tr);

            });
            createDataTable("#tbl_goodreceipt");
            $('.btn-disable').prop('disabled', true);
        },
        error:function (message){
          errorMessage(message);
        }
    });
}
function showGoodReceiptInfo(goodReceiptId) {
    $("#goodReceiptForm").attr('action', 'javascript:updateGoodReceipt()');
    $("#goodReceiptId").val(goodReceiptId);

    var data = "&goodReceiptId=" + goodReceiptId;
    $.ajax({
        type: "POST",
        url:  BACKEND_URL + "showGoodReceiptInfo",
        data: data,
        success: function (data) {
            $("#txt_customer_name").val(data.customer_name);
            $("#txt_date").val(data.date);
            var customerStatus = (data.status == "0") ? false : true;
            $('#vip_customer').prop('checked', customerStatus);
            $("#txt_address").val(data.address);
            $("#txt_sender_name").val(data.sender_name);
            $("#select_city").val(data.city_id);
            $("#txt_phno").val(data.phone_no);
            $("#select_cash_method").val(data.cash_method);
            $("#txt_remark").val(data.remark);
            $('#modal-goodreceipt').modal('toggle');

        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function updateGoodReceipt() {
    const customerCode = 0;
    const vipCustomerCode = 1;
    var customerStatus = ($('#vip_customer').is(":checked")) ? vipCustomerCode : customerCode;
    var goodReceiptData = {};
    goodReceiptData["goodReceiptId"] = $("#goodReceiptId").val();
    goodReceiptData["customerName"] = $("#txt_customer_name").val();
    goodReceiptData["date"] = $("#txt_date").val();
    goodReceiptData["status"] = customerStatus;
    goodReceiptData["address"] = $("#txt_address").val();
    goodReceiptData["senderName"] = $("#txt_sender_name").val();
    goodReceiptData["cityId"] = $("#select_city").val();
    goodReceiptData["phoneNo"] = $("#txt_phno").val();
    goodReceiptData["cashMethod"] = $("#select_cash_method").val();
    goodReceiptData["remark"] = $("#txt_remark").val();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            var message = JSON.parse(xhttp.responseText).message;
            alert(message);
            $("#txt_customer_name").val("");
            $("#txt_date").val("");
            $('#vip_customer').prop('checked', false);
            $("#txt_address").val("");
            $("#txt_sender_name").val("");
            $("#select_city").val("");
            $("#txt_phno").val("");
            $("#select_cash_method").val("");
            $("#txt_remark").val("");
            $('#modal-goodreceipt').modal('toggle');
            destroyDatatable("#tbl_goodreceipt", "#tbl_goodreceipt_body");
            getGoodReceipt();
        }
    };
    xhttp.open('POST', BACKEND_URL + 'updateGoodReceipt');
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(goodReceiptData));
}

function deleteGoodReceipt(senderName, goodReceiptId) {
    var result = confirm("WARNING: This will delete GoodReceipt from " + decodeURIComponent(senderName) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "goodReceiptId=" + goodReceiptId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteGoodReceipt",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_goodreceipt", "#tbl_goodreceipt_body");
                getGoodReceipt();
                alert(data.message);
            },
            error: function (message){
                errorMessage(message);
            }
        });
    }
}

function addProduct(goodReceiptId) {
    $("#goodReceiptId").val(goodReceiptId);
}

function saveProduct() {
    var productName = $("#txt_product_name").val();
    var Unit = $("#select_unit option:selected").val();
    var quantity = $("#txt_quantity").val();
    var weight = $("#txt_weight").val();
    var remark = $("#txt_product_remark").val();
    if (productName.trim() != "" && Unit != "" && quantity.trim() != "" && weight != "") {
        var productDetail = {};
        productDetail["goodReceiptId"] = $("#goodReceiptId").val();
        productDetail["productName"] = productName;
        productDetail["unitId"] = Unit;
        productDetail["quantity"] = quantity;
        productDetail["weight"] = weight;
        productDetail["companyId"] = 2;
        productDetail["userId"] = 1;
        productDetail["remark"] = remark;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                var message = JSON.parse(xhttp.responseText).message;
                alert(message);
                $("#txt_product_name").val()
                $("#txt_product_name").val()
                $("#txt_quantity").val();
                $("#txt_weight").val();
                $("#txt_product_remark").val();
                $('#modal-product').modal('toggle');
                getGoodReceiptDetail($("#goodReceiptId").val());
            }
        };
        xhttp.open('POST', BACKEND_URL + 'createGoodReciptDetails');
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(JSON.stringify(productDetail));
    }
    else {
        alert("Following value(s) cannot be left empty.\nပစ္စည်းအမည်\nနေ့စွဲ\nအတိုင်းအတာ\nအရည်အတွက်\nအလေးချိန်");
    }
}
function getGoodReceiptDetail(goodReceiptId) {
    destroyDatatable("#tbl_goodreceipt_detail", "#tbl_goodreceipt_detail_body");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptDetail",
        data: "goodReceiptId=" + goodReceiptId,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.product_name + "</td>";
                tr += "<td >" + element.qty + "</td>";
                tr += "<td >" + element.unit_name + "</td>";
                tr += "<td >" + element.weight + "</td>";
                tr += "<td >" + element.remark + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-warning btn-edit btn-md btn-disable' onClick='showGoodReceiptDetailsInfo(" + element.id + ")'>" +
                    "<li class='fas fa-edit' ></li ></button ></div ></td > ";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-danger btn-delete btn-md btn-disable' onClick=deleteGoodReceiptDetails(\"" + encodeURIComponent(element.product_name) + "\"," + element.id + ")>" +
                    "<li class='fas fa-trash'></li></button></div></td> ";
                tr += "</tr>";
                $("#tbl_goodreceipt_detail_body").append(tr);

            });

            $('.btn-disable').prop('disabled', true);
            createDataTable("#tbl_goodreceipt_detail");

        },
        error: function (message) {
            errorMessage(message);
        }
    });
}
function printGoodReceipt(goodReceiptId) {
    window.open("goodreceipt_invoice.html?goodReceiptId=" + goodReceiptId);
}
