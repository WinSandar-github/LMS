const completeOrderStatus = 1;
const imcompleteOrderStatus = 0;
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
    goodReceipt['customer_name'] = customerName;
    goodReceipt['date'] = date;
    goodReceipt['status'] = customerStatus;
    goodReceipt['address'] = address;
    goodReceipt['sender_name'] = senderName;
    goodReceipt['city_id'] = city;
    goodReceipt['phone_no'] = phoneNo;
    goodReceipt['cash_method'] = cashMethod;
    goodReceipt['remark'] = remark;
    goodReceipt['ref_initials'] = user[0]["ref_initials"];
    goodReceipt['company_id'] = company_id;
    goodReceipt['user_id'] = user_id;
    if (customerName.trim() != "" && address.trim() != "" && senderName.trim() != "" && city != "" && phoneNo.trim() != "" && cashMethod != "") {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                var message=removeDoublequote(xhttp);
                successMessage(message);
                clearGoodreceiptForm();
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
function clearGoodreceiptForm() {
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
function getGoodReceipt() {
    destroyDatatable("#tbl_goodreceipt", "#tbl_goodreceipt_body");
    destroyDatatable("#tbl_complete_goodreceipt", "#tbl_complete_goodreceipt_body");
    getGoodReceiptByStatus(imcompleteOrderStatus, '#tbl_goodreceipt','#tbl_goodreceipt_body');
    getGoodReceiptByStatus(completeOrderStatus, '#tbl_complete_goodreceipt', '#tbl_complete_goodreceipt_body');
   
}
function getGoodReceiptByStatus(status, table, table_body) {
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceipt/" + status,
        data: "company_id=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr onclick='getGoodReceiptDetail(" + element.id + ")'>";
                tr += "<td >" + element.cash_method + "</td>";
                tr += "<td >" + element.order_no + "</td>";
                tr += "<td >" + element.customer_name + "</td>";
                tr += "<td >" + element.sender_name + "</td>";
                tr += "<td >" + element.remark + "</td>";
                tr += "<td >" + formatDate(element.date) + "</td>";
                tr += "<td >" + element.users.full_name + "</td>";
                if (status == imcompleteOrderStatus) {
                    tr += "<td class='alignright'><div class='btn-group'>" +
                        "<button type='button' class='btn btn-info btn-md btn-space' onClick='addToOrder(" + element.id + ")'>" +
                        "ဘောင်ချာဖွင့်ရန်</button></div>";
                    tr += "<div class='btn-group'>" +
                        "<button type='button' class='btn btn-info btn-md btn-add' id='btn-add-prduct' data-toggle='modal' data-target='#modal-product' onClick='addProduct(" + element.id + ")'>" +
                        "<i class='fas fa-plus'></i></button>";
                    tr += "<button  type='button' class='btn btn-info btn-edit' onClick='showGoodReceiptInfo(" + element.id + ")'>" +
                        "<li class='fas fa-edit' ></li ></button >";
                    tr += "<button type='button'  class='btn btn-danger btn-md btn-space' onClick=deleteGoodReceipt(\"" + encodeURIComponent(element.sender_name) + "\"," + element.id + ")>" +
                        "<li class='fas fa-trash'></li></button></div>";
                    tr += "<div class='btn-group'>" +
                        "<button type='button' class='btn btn-success btn-print btn-md btn-space' onClick='printGoodReceipt(" + element.id + ")'>" +
                        "<i class='fas fa-print'></i> Print</button></div>";
                }
                else {
                    tr += "<td class='alignright'><div class='btn-group'>" +
                        "<button type='button'  class='btn btn-danger btn-md' onClick=deleteGoodReceipt(\"" + encodeURIComponent(element.sender_name) + "\"," + element.id + ")>" +
                        "<li class='fas fa-trash'></li></button></div>";
                    tr += "</tr>";
                }
               
                $(table_body).append(tr);

            });
            createDataTable(table);
        },
        error: function (message) {
            dataMessage(message, table, table_body);
        }
    });
}
function showGoodReceiptInfo(goodReceiptId) {
    $("#goodReceiptForm").attr('action', 'javascript:updateGoodReceipt()');
    $("#goodReceiptId").val(goodReceiptId);

    var data = "&goodReceipt_id=" + goodReceiptId;
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
    goodReceiptData["goodReceipt_id"] = $("#goodReceiptId").val();
    goodReceiptData["customer_name"] = $("#txt_customer_name").val();
    goodReceiptData["date"] = $("#txt_date").val();
    goodReceiptData["status"] = customerStatus;
    goodReceiptData["address"] = $("#txt_address").val();
    goodReceiptData["sender_name"] = $("#txt_sender_name").val();
    goodReceiptData["city_id"] = $("#select_city").val();
    goodReceiptData["phone_no"] = $("#txt_phno").val();
    goodReceiptData["cash_method"] = $("#select_cash_method").val();
    goodReceiptData["remark"] = $("#txt_remark").val();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            var message = removeDoublequote(xhttp);
            successMessage(message);
            clearGoodreceiptForm();
        }
    };
    xhttp.open('POST', BACKEND_URL + 'updateGoodReceipt');
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(goodReceiptData));
}

function deleteGoodReceipt(senderName, goodReceiptId) {
    var result = confirm("WARNING: This will delete GoodReceipt from " + decodeURIComponent(senderName) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "goodReceipt_id=" + goodReceiptId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteGoodReceipt",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_goodreceipt", "#tbl_goodreceipt_body");
                getGoodReceipt();
                successMessage(data);
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
        productDetail["good_receipt_id"] = $("#goodReceiptId").val();
        productDetail["product_name"] = productName;
        productDetail["unit_id"] = Unit;
        productDetail["qty"] = quantity;
        productDetail["weight"] = weight;
        productDetail["company_id"] = 2;
        productDetail["user_id"] = 1;
        productDetail["remark"] = remark;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                var message = removeDoublequote(xhttp);
                successMessage(message);
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
    $("#goodReceiptId").val(goodReceiptId);
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptDetail",
        data: "good_receipt_id=" + goodReceiptId,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.product_name + "</td>";
                tr += "<td >" + Math.round(element.qty) + "</td>";
                tr += "<td >" + element.unit_by_detail.unit_name + "</td>";
                tr += "<td >" + element.weight + "</td>";
                tr += "<td >" + element.remark + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-info btn-md btn-space' onClick='showGoodReceiptDetailsInfo(" + element.id + ")'>" +
                    "<li class='fas fa-edit' ></li ></button ></div >";
                tr += "<div class='btn-group'>" +
                    "<button type='button' class='btn btn-danger btn-md' onClick=deleteGoodReceiptDetails(\"" + encodeURIComponent(element.product_name) + "\"," + element.id + ")>" +
                    "<li class='fas fa-trash'></li></button></div></td> ";
                tr += "</tr>";
                $("#tbl_goodreceipt_detail_body").append(tr);

            });
            createDataTable("#tbl_goodreceipt_detail");
        },
        error: function (message) {
            dataMessage(message, "#tbl_goodreceipt_detail", "#tbl_goodreceipt_detail_body");
        }
    });
}
function printGoodReceipt(goodReceiptId) {
    window.open("goodreceipt_invoice.html?goodReceiptId=" + goodReceiptId);
}

function showGoodReceiptDetailsInfo(goodReceitptDetailId) {
    $("#productForm").attr('action', 'javascript:updateGoodReceiptDetail()');
    $("#goodReceiptDetailId").val(goodReceitptDetailId);

    var data = "&goodReceipt_detail_id=" + goodReceitptDetailId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showGoodReceiptDetailInfo",
        data: data,
        success: function (data) {
            $("#txt_product_name").val(data.product_name);
            $("#select_unit").val(data.unit);
            $('#txt_quantity').val(Math.round(data.qty));
            $("#txt_weight").val(data.weight);
            $("#txt_product_remark").val(data.remark);
            $('#modal-product').modal('toggle');
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}
function updateGoodReceiptDetail() {
    var goodReceiptDetailData = {};
    goodReceiptDetailData["goodreceipt_detail_id"] = $("#goodReceiptDetailId").val();
    goodReceiptDetailData["product_name"] = $("#txt_product_name").val();
    goodReceiptDetailData["unit_id"] = $("#select_unit").val();
    goodReceiptDetailData["qty"] = $("#txt_quantity").val();
    goodReceiptDetailData["weight"] = $("#txt_weight").val();
    goodReceiptDetailData["remark"] = $("#txt_product_remark").val();
    goodReceiptDetailData["user_id"] = user_id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            var message = removeDoublequote(xhttp);
            successMessage(message);
            $("#txt_product_name").val()
            $("#txt_product_name").val()
            $("#txt_quantity").val();
            $("#txt_weight").val();
            $("#txt_product_remark").val();
            $('#modal-product').modal('toggle');
            getGoodReceiptDetail($("#goodReceiptId").val());
        }
    };
    xhttp.open('POST', BACKEND_URL + 'updateGoodReceiptDetail');
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(goodReceiptDetailData));
}  
function deleteGoodReceiptDetails(productName, goodReceiptDetailId) {
    var result = confirm("WARNING: This will delete GoodReceiptDetails from " + decodeURIComponent(productName) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "goodreceipt_detail_id=" + goodReceiptDetailId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteGoodReceiptDetail",
            data: data,
            success: function (data) {
                getGoodReceiptDetail($("#goodReceiptId").val());
                alert(data);
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
}
function getVipCustomer() {
    var select = document.getElementById("selectVipCustomer");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getVipCustomer",
        data: "company_id=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var option = document.createElement('option');
                option.text = element.customer_name;
                option.value = element.customer_name;
                select.add(option, 0);
            });
        },
        error: function (message) {
        }
    });
}
