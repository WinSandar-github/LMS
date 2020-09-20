var BACKEND_URL = "http://" + window.location.host + "/";
function saveGoodReceipt() {
    var customerName = $("#txt_customer_name").val();
    var date = $("#txt_date").val();
    if ($('#vip_customer').is(":checked")) {
        var status = 1;
    }
    else {
        var status = 0;
    }
    var address = $("#txt_address").val();
    var senderName = $("#txt_sender_name").val();
    var city = $("#select_city option:selected").val();
    var phoneNo = $("#txt_phno").val();
    var cashMethod = $("#select_cash_method option:selected").val();
    var remark = $("#txt_remark").val();
    var goodReceipt = {};
    goodReceipt['customerName'] = customerName;
    goodReceipt['date'] = date;
    goodReceipt['status'] = status;
    goodReceipt['address'] = address;
    goodReceipt['senderName'] = senderName;
    goodReceipt['cityId'] = city;
    goodReceipt['phoneNo'] = phoneNo;
    goodReceipt['cashMethod'] = cashMethod;
    goodReceipt['remark'] = remark;
    goodReceipt['refInitials'] = ref_initials;
    goodReceipt['companyId'] = company_id;
    goodReceipt['userId'] = user_id;
    if (customerName.trim() != "" && address.trim() != "" && senderName.trim() != "" && city != "" && phoneno.trim() != "" && cashMethod != "") {
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