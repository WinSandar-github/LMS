function saveDelivery()
{
  var different_arrived =$("#different_day").val() ;
  var delivery = {};
  delivery['car_no']=$("#car_number").val();
  delivery['driver_name']=$("#driver_name").val();
  delivery['driver_phone']=$("#driver_phone").val();
  delivery['from_city_id']=$("#select_city").val();
  delivery['to_city_id']=$("#select_city_delivery").val();
  delivery['start_dt']=$("#start_dt").val();
  delivery['end_dt']=$("#arrived_dt").val();
  delivery['arrived']=$("#different_day").val();
  delivery['remark']=$("#delivery_remark").val();
  delivery['company_id']=company_id;
  delivery['status']=$('#selected_status').val();
  delivery['user_id']=user_id;
  if(different_arrived.trim()==""){
    $("#start_dt").focus();
    }
  else if(different_arrived==-1){
     $("#arrived_dt").focus();
  }
  else{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          var message=removeDoublequote(xhttp);
          successMessage(message);
          clearDeliveryForm();
        }
    };
    xhttp.open('POST', BACKEND_URL + 'saveDelivery');
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(delivery));

  }
}
function clearDeliveryForm(){
  $("#car_number").val("");
  $("#driver_name").val("");
  $("#driver_phone").val("");
  $("#from_city_name").val("");
  $("#to_city_name").val("");
  $("#start_dt").val("");
  $("#arrived_dt").val("");
  $("#different_day").val("");
  $("#delivery_remark").val("");
  $('#modal-delivery').modal('toggle');
  destroyDatatable("#table_tbl_delivery","#tbl_delivery_container");
  loadDelivery();
}
function getDifferentDays()
{
  var start_date = $("#start_dt").val();
  var end_date = $("#arrived_dt").val();
  if (end_date.trim() == "") {
      $("#different_day").val("-1");
    }
  else {
      var first_date = new Date(start_date);
      var last_date = new Date(end_date);
      const different_time = Math.abs(first_date.getTime() - last_date.getTime());
      const different_day = Math.ceil(different_time / (1000 * 60 * 60 * 24));
      $("#different_day").val(different_day);
  }
}
const imcomplete_status=0,complete_status=1;
function loadDelivery()
{
  destroyDatatable("#table_tbl_delivery","#tbl_delivery_container");
  destroyDatatable("#table_tbl_delivery2","#tbl_delivery_container2");
  loadDeliveryByStatus(imcomplete_status,"#table_tbl_delivery","#tbl_delivery_container");
  loadDeliveryByStatus(complete_status,"#table_tbl_delivery2","#tbl_delivery_container2");
}
function loadDeliveryByStatus(status,table,table_body)
{
  $.ajax({
    type: "POST",
    url: BACKEND_URL + "getDeliveryByStatus/"+status,
    data: "company_id=" + company_id,
    success: function (data) {
            data.forEach(function (element) {
            var tr = "<tr onclick='getDeliverDetailsByDeliveryId(" + element.id + ");'>";
            tr += "<td >" + element.car_no + "</td>";
            tr += "<td >" + element.driver_name + "</td>";
            tr += "<td >" + element.driver_phone + "</td>";
            tr += "<td >" + element.from_city.city_name + "</td>";
            tr += "<td >" + element.to_city.city_name + "</td>";
            tr += "<td >" + element.start_dt + "</td>";
            tr += "<td >" + element.end_dt + "</td>";
            tr += "<td >" + element.arrived + "</td>";
            tr += "<td >" + element.remark + "</td>";
            tr += "<td >" + element.user.full_name + "</td>";
            tr += "<td >" + element.company_delivery.name + "</td>";
            tr += "<td class='alignright'><button type='button' class='btn btn-info btn-space' data-toggle='modal' data-target='#modal-delivery_details' onClick=getDeliveryById("+ element.id +")><i class='fas fa-plus'></i> Add DeliveryDetails</button>"+
                  "<button type='button' class='btn btn-info btn-space' onClick=showDeliveryById("+ element.id +")><i class='fas fa-edit'></i></button>"+
                  "<button type='button' class='btn btn-success btn-print btn-space' onClick=printDeliveryById("+ element.id +")><i class='fas fa-print'> Print</button ></td> ";
            tr += "</tr>";
            $(table_body).append(tr);
          });
    createDataTable(table);
  },
  error: function (message) {
      dataMessage(message, table, table_body);
  }
  });
}
function getDeliveryById(delivery_id)
{
  $('#hdelivery_id').val(delivery_id);
}
function showDeliveryById(delivery_id)
{
  $('#hdelivery_id').val(delivery_id);
  $("#delivery_form").attr('action', 'javascript:updateDelivery()');
  $.ajax({
      type: "POST",
      url: BACKEND_URL + "getDeliveryById",
      data:"id=" + delivery_id,
      success: function (data) {
          $("#car_number").val(data.car_no);
          $("#driver_name").val(data.driver_name);
          $("#driver_phone").val(data.driver_phone);
          $("#select_city").val(data.from_city_id);
          $("#select_city_delivery").val(data.to_city_id);
          $("#start_dt").val(data.start_dt);
          $("#arrived_dt").val(data.end_dt);
          $("#different_day").val(data.arrived);
          $("#delivery_remark").val(data.remark);
          $("#selected_status").val(data.status);
          $('#modal-delivery').modal('toggle');
      },
      error:function (message){
        errorMessage(message);
      }
  });
}
function updateDelivery()
{
  var delivery = new FormData;;
  delivery.append('delivery_id',$('#hdelivery_id').val());
  delivery.append('car_no',$("#car_number").val());
  delivery.append('driver_name',$("#driver_name").val());
  delivery.append('driver_phone',$("#driver_phone").val());
  delivery.append('from_city_id',$("#from_city_name").val());
  delivery.append('to_city_id',$("#to_city_name").val());
  delivery.append('start_dt',$("#start_dt").val());
  delivery.append('end_dt',$("#arrived_dt").val());
  delivery.append('arrived',$("#different_day").val());
  delivery.append('remark',$("#delivery_remark").val());
  delivery.append('status',$("#selected_status").val());
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "updateDelivery",
          data: delivery,
          contentType: false,
          processData: false,
          success: function (data) {
            successMessage(data);
            location.reload();
            },
         error:function (XMLHttpRequest, textStatus, errorThrown){
           errorStatus(XMLHttpRequest, textStatus, errorThrown);
         }
       });
}
function saveDeliverDetail()
{
  var table_body = document.getElementById("tbl_product_container"),delivery_id=$('#hdelivery_id').val(),delivery_details = new Array(),order_data=new Array();
  for (var i = 0, row; row = table_body.rows[i]; i++)
  {
    var product_data={},order={};
    order['orderId']=row.cells[2].children[0].value;
    product_data['receiver_name']=row.cells[1].innerHTML;
    product_data['product_name']=row.cells[3].innerHTML;
    product_data['total_quantity']=row.cells[4].innerHTML;
    product_data['quantity']=row.cells[5].children[0].value;
    product_data['weight']=row.cells[6].innerHTML;
    product_data['to_city_name']=row.cells[7].innerHTML;
    product_data['remark']=row.cells[8].innerHTML;
    product_data['good_receipt_id']=row.cells[0].children[0].value;
    product_data['good_receipt_detail_id']=row.cells[0].children[1].value;
    product_data['user_id']=user_id;
    product_data['company_id']=company_id;
    product_data['delivery_id']=delivery_id;
    delivery_details.push(product_data),order_data.push(order);
  }
  for(var i=0;i<delivery_details.length;i++){
      if(parseInt(delivery_details[i]['total_quantity'])==parseInt(delivery_details[i]['quantity']))
      {
        var order_id=order_data[i]['order_id'],delivery_status='1',order=new FormData;
        order.append('order_id',order_id);
        order.append('delivery_status',delivery_status);
        $.ajax({
                type: "POST",
                url: BACKEND_URL + "updateOrderByorderId",
                data: order,
                contentType: false,
                processData: false,
                success: function (data) {

               },
               error:function (XMLHttpRequest, textStatus, errorThrown){
                 errorStatus(XMLHttpRequest, textStatus, errorThrown);
               }
            });
      }
    }
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "saveDeliverDetail",
          data: JSON.stringify(delivery_details),
          contentType: false,
          processData: false,
          success: function (data) {
            successMessage(data);
            location.reload();
          },
         error:function (XMLHttpRequest, textStatus, errorThrown){
           errorStatus(XMLHttpRequest, textStatus, errorThrown);
         }
      });
}
function getDeliverDetailsByDeliveryId(delivery_id)
{
  destroyDatatable("#table_tbl_deliverydetails","#tbl_deliverydetails_container");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getDeliverDetailsByDeliveryId",
          data: "delivery_id=" + delivery_id,
          success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td class='align-center'>" + element.receiver_name + "</td>";
                tr += "<td class='align-center'>" + element.product_name + "</td>";
                tr += "<td class='align-center'>" + element.quantity + "</td>";
                tr += "<td class='align-center'>" + element.weight + "</td>";
                tr += "<td class='align-center'>" + element.remark + "</td>";
                tr += "</tr>";
                $("#tbl_deliverydetails_container").append(tr);
              });
            },
          });
}
function printDeliveryById(delivery_id)
{
  window.open("../../Components/Delivery/deliver_invoice.html",localStorage.setItem("delivery_id", delivery_id));
}
function loadInvoice()
{
  var delivery_id =localStorage.getItem("delivery_id");
  $('.driver_name').html(""),$('.car_number').html(""),$('.income_date').html("");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getDeliveryById",
          data: "delivery_id=" + delivery_id,
          success: function (data) {
            $('.driver_name').append(data[0].driver_name);
            $('.car_number').append(data[0].car_no);
            var out_date=data[0].delivery_details[0].out_date;
            var split_date=out_date.split('-');
            var complet_date=split_date[2]+'/'+split_date[1]+'/'+split_date[0];
            $('.income_date').append(complet_date);
            var url=window.location.href.split('/');
            if (url[url.length - 1]  === 'deliver_invoice.html') {
                  appendTableRow("td_car_number",data[0].car_no);
                  appendTableRow("print_car_number",data[0].car_no);
                  appendTableRow("td_out_date",complet_date);
                  appendTableRow("td_delivery_date",complet_date);
                  loadInvoiceDelivery(data[0].delivery_details);
              } else {
                loadInvoiceByOrderNo();
              }
            }
        });
}
function loadInvoiceDelivery(good_receipt)
{
  destroyDatatable("#tbl_invoice","#tbl_invoice_container");
  var order_total=0,labour_total=0,good_receipt_id_array = [];
  for (var i = 0; i < good_receipt.length; i++) {
      good_receipt_id_array[i] = good_receipt[i].good_receipt_id;
    }
  function removeDuplicate(data){
    return [...new Set(data)]
  }
  var good_receipt_unique=removeDuplicate(good_receipt_id_array);
      good_receipt_unique.forEach(function(good_receipt_id){
      $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptByorderNo",
        data:"good_receipt_id="+good_receipt_id,
        success: function (alldata) {
          var order_id=alldata[0].order_by_good_receipts[0].id;
          if(alldata[0].cash_method=='ငွေရှင်းပြီး')
          {
            order_total +=alldata[0].order_by_good_receipts[0].order_total;
          }
           labour_total +=alldata[0].order_by_good_receipts[0].labour;
           $.ajax({
           type: "POST",
           url: BACKEND_URL + "getOrderDetailsByorderId",
           data:"order_id="+order_id,
           success: function (orderdetails) {
              orderdetails.forEach(function (element, index, array){
                 var tr = "<tr class='border-tr'>";
                 if(index===0){
                   tr += "<td >" + alldata[0].order_by_good_receipts[0].order_no + "</td>";
                   tr += "<td >" + alldata[0].customer_name+ "</td>";
                   tr += "<td >" + alldata[0].city_list.city_name+ "</td>";
                 }
                 else{
                   tr += "<td >" + ""+ "</td>";
                   tr += "<td >" + alldata[0].customer_name+ "</td>";
                   tr += "<td >" + alldata[0].city_list.city_name+ "</td>";
                 }
                 tr += "<td >" +element.product_name + "</td>";
                 tr += "<td >" + element.quantity+" "+element.unit+ "</td>";
                 if(index===0){
                    tr += "<td >" + thousands_separators( alldata[0].order_by_good_receipts[0].order_total)+ "</td>";
                    tr += "<td >" +  thousands_separators( alldata[0].order_by_good_receipts[0].labour) + "</td>";
                    tr += "<td><button type='button' class='btn btn-success btn-print'><i class='fas fa-print'></i> Print</button ></td >" ;
                  }
                 else {
                   tr += "<td >" +" "+ "</td>";
                   tr += "<td >" +" "+ "</td>";
                   tr += "<td >" +" "+ "</td>";
                 }
                 tr += "</tr>";
                 $("#tbl_invoice_container").append(tr);
                    appendTableRow("sumPrice",order_total);
                    appendTableRow("sumLabour",labour_total);
                    appendTableRow("td_total_price",order_total+labour_total);
                    appendTableRow("print_total_price",order_total+labour_total);
                    var comission_percent=$('#comission_percent').val();
                    appendTableRow("print_comission_percent",comission_percent);
                    var gate_labour_price=[(order_total+labour_total)*(removePercent(comission_percent))]/100;
                    $("#gate_labour_price").val(thousands_separators(gate_labour_price));
                    appendTableRow("print_gate_labour_price",gate_labour_price);
                    $("#labour_price").val(thousands_separators(labour_total));
                    appendTableRow("print_labour_price",labour_total);
                    var advance=$('#advance').val(),land_price=$('#land_price').val();
                    appendTableRow("print_advance",advance);
                    var all_sum_price=parseInt(gate_labour_price)+removeComma(advance)+parseInt(land_price)+parseInt(labour_total);
                    $("#all_sum_price").val(thousands_separators(all_sum_price));
                    appendTableRow("print_land_price",land_price);
                    appendTableRow("print_all_sum_price",all_sum_price);
                    $("#paid_price").val(thousands_separators(order_total));
                    appendTableRow("print_paid_price",order_total);
                    $("#balance_price").val(thousands_separators(parseInt(all_sum_price)-parseInt(order_total)));
                    appendTableRow("print_balance_price",parseInt(all_sum_price)-parseInt(order_total));
                    });
               tableRowClick("#tbl_invoice_container");
               }
         });
        }
      });
    });
}
function appendTableRow(id,value){
  if(typeof value=="number"){
    document.getElementById(id).innerHTML =thousands_separators(value);
  }else{
    document.getElementById(id).innerHTML = value;
  }
}
function comissionPercent()
{
    var total_price=  document.getElementById("td_total_price").innerHTML;
    var comission_percent=document.getElementById("comission_percent").value;
    appendTableRow("print_comission_percent",comission_percent);
    var gate_labour_price=((removeComma(total_price)*removePercent(comission_percent))/100);
    $("#gate_labour_price").val(thousands_separators(gate_labour_price));
    appendTableRow("print_gate_labour_price",gate_labour_price);
    var advance=$('#advance').val(),land_price=$('#land_price').val(),labour_price=$("#labour_price").val(),paid_price=$("#paid_price").val();
    var all_sum_price=parseInt(gate_labour_price)+removeComma(advance)+parseInt(land_price)+parseInt(labour_price);
    $("#all_sum_price").val(thousands_separators(all_sum_price));
    appendTableRow("print_all_sum_price",all_sum_price);
    $("#balance_price").val(thousands_separators(parseInt(all_sum_price)-removeComma(paid_price)));
    appendTableRow("print_balance_price",parseInt(all_sum_price)-removeComma(paid_price));
    $('#advance').val(thousands_separators(advance));
    appendTableRow("print_advance",advance);
}
function tableRowClick(table_body){
  $(table_body).on('click', '.btn-print', function () {
    var url=window.location.href.split('/');
    if (url[url.length - 1]  === 'deliver_invoice.html') {
      var current_row = $(this).closest("tr");
      var order_no = current_row.find("td:eq(0)").text();
    }else{
      var current_row = $(this).closest("tr");
      var order_no = current_row.find("td:eq(2)").text();
    }
    window.open("../../Components/Delivery/invoice.html?orderNo=" + order_no);
  });
}
function loadInvoiceByOrderNo()
{
  destroyDatatable("#tbl_order_invoice","#tbl_order_invoice_container");
  var current_url = window.location.href;
  var url = new URL(current_url);
  var order_no = url.searchParams.get("orderNo");
  $('.customer_name').html(""),$('.order_no').html(""),$('.sender_name').html(""),$('.to_city_name').html("");
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptByorderNo",
        data: "order_no=" + order_no,
        success: function (good_receipt) {
          var order_id=good_receipt[0].order_by_good_receipts[0].id;
          $('.customer_name').append(good_receipt[0].customer_name);
          $('.sender_name').append(good_receipt[0].sender_name);
          $('.order_no').append(good_receipt[0].order_no);
          $('.to_city_name').append(good_receipt[0].city_list.city_name);
          localStorage.setItem('good_receipt',JSON.stringify(good_receipt[0]));
          addToOrderByOrderNo(order_id);
        }
    });
}
function back()
{
  location.href="deliver_invoice.html";
}
function autoOrderNo()
{
  var select = document.getElementById("select_order_id");
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOrderNoBycompanyId",
        data:"company_id=" + company_id,
        success: function (data) {
                data.forEach(function(element){
                  var option = document.createElement('option');
                  option.text = element.order_no;
                  option.value = element.order_no;
                  select.add(option);
                });
              }
      });
}
var count=0;
function searchOrderNo(order_no)
{
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptByorderNo",
        data:"order_no=" + order_no,
        success: function (good_receipt) {
                  var good_receipt_detail=good_receipt[0].good_receipt_detail_by_good_receipt;
                  good_receipt_detail.forEach(function (element, index, array){
                    count +=1;
                    var tr="<tr>";
                    tr+="<td><input type='hidden' value='"+good_receipt[0].id+"'><input type='hidden' value='"+element.id+"'>"+count+"</td>";
                    tr+="<td>"+good_receipt[0].customer_name+"</td>";
                    tr+="<td><input type='hidden' value='"+good_receipt[0].order_by_good_receipts[0].id+"'>"+good_receipt[0].order_no+"</td>";
                    tr+="<td>"+element.product_name+"</td>";
                    tr+="<td>"+element.qty+"</td>";
                    tr+="<td><input type='text' class='orderQty' value='0' id='order_qty"+element.id+"' disabled><input type='number' style='width:50%;' value='0' onblur='orderQtyCalculate("+element.id+","+"this.value)'></td>";
                    tr+="<td>"+element.weight+"</td>";
                    tr+="<td>"+good_receipt[0].city_list.city_name+"</td>";
                    tr+="<td>"+element.remark+"</td>";
                    if(index===0){
                      tr+="<td ><button type='button' class='btn btn-danger btn-space' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash'></i></button>"+
                          "<button type='button' class='btn btn-info btn-space' onClick='addToOrderByOrderNo(" + good_receipt[0].order_by_good_receipts[0].id + ")'>ဘောင်ချာဖွင့်ရန်</button>"+
                          "<button type='button' class='btn btn-success btn-print btn-space'><i class='fas fa-print'></i> Print</button></td>";
                    }
                    else{
                      tr+="<td><button type='button' class='btn btn-danger btn-space btn-left' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash'></i></button></td>";
                        }
                    tr+="</tr>";
                    $('#tbl_product_container').append(tr);
                  });
                  tableRowClick('#tbl_product_container');
                  },
                  error: function (message) {
                      dataMessage(message, '#tbl_product', '#tbl_product_container');
                  }
      });
}
function deleteDeliveryDetails(row)
{
    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById('tbl_product').deleteRow(i);
}
function orderQtyCalculate(id,quantity)
{
    $('#order_qty'+id).val(quantity);
}
function addToOrderByOrderNo(order_id) {
  var good_receipt=JSON.parse(localStorage.getItem('good_receipt'));
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOrderDetailsByorderId",
        data: "order_id=" + order_id,
        success: function (orderdetails) {
          $('#hidden_order_id').val(order_id);
          var url=window.location.href.split('/');
          var last_array=url[url.length - 1].split('?');
          if (last_array[last_array.length - 2] === 'invoice.html') {
              for(var i=0;i<orderdetails.length;i++) {
                  var tr = "<tr>";
                  tr += "<td >" + (i+1) + "</td>";
                  tr += "<td >" + orderdetails[i].product_name + "</td>";
                  tr += "<td >" + orderdetails[i].quantity+" "+ orderdetails[i].unit+ "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(orderdetails[i].product_price)+ "</td>";
                  tr += "</tr>";
                  $("#tbl_order_invoice_container").append(tr);
              }
              createRow("အလုပ်သမားခ:",good_receipt.order_by_good_receipts[0].order_total);
              createRow("စိုက်ငွေ:",good_receipt.order_by_good_receipts[0].labour);
              createRow("စုစုပေါင်း:",good_receipt.order_by_good_receipts[0].total);
              createRow("တာဝန်ခံ:",user_name);

            } else {
              for(var i=0;i<orderdetails.length;i++) {
                  var tr = "<tr>";
                  tr += "<td>" + "<input type='hidden' value='"+orderdetails[i].id+"'><input type='text' value='"+orderdetails[i].product_name+"'>" + "</td>";
                  tr += "<td >" + "<input type='text' id='productQuantity' value='" + Math.round(orderdetails[i].quantity) + "'>" + "</td>";
                  tr += "<td >" + "<input type='text'  value='" + Math.round(orderdetails[i].product_qty) + "'disabled>" + "</td>";
                  tr += "<td >" + "<input type='text' id='productWeight' value='" + orderdetails[i].weight + "'>" + "</td>";
                  tr += "<td >" + "<input type='hidden' value='"+orderdetails[i].unit_byorder_detail.id+"'><input type='text' id='productUnit' value='" + orderdetails[i].unit_byorder_detail.unit_name + "' disabled>"+"</td>";
                  tr += "<td >" + "<input type='text' id='productPrice' value='0' onkeyup='getTotalPerProduct(this)' >" + "</td>";
                  tr += "<td >" + "<input type='text' id='total' value='0'>" + "</td>";
                  tr += "</tr>";
                  $("#tbl_order_body").append(tr);
                }
              appendRows("labourFee", "အလုပ်သမားခ:");
              appendRows("land", "စိုက်ငွေ:");
              appendRows("totalPrice", "စုစုပေါင်း:");
              $("#hiddenTotal").val('0');
              $('#modal-order').modal('toggle');
            }
          }
        });
}
function createRow(label,value){
  if(typeof value=="number"){
    var tr = "<tr>";
    tr += "<td colspan='3' class='align-right'>" + label + "</td>";
    tr += "<td class='align-right'>" +thousands_separators(value)+ "</td>";
    tr += "</tr>";
    $("#tbl_order_invoice_container").append(tr);
  }else{
    var tr = "<tr>";
    tr += "<td colspan='3' class='align-right'>" + label + "</td>";
    tr += "<td class='align-right'>" +value+ "</td>";
    tr += "</tr>";
    $("#tbl_order_invoice_container").append(tr);
  }
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
function updateOrderBygoodReceiptId()
{
  var order={},order_data=new Array();
  order['order_id']=$('#hidden_order_id').val(),order['order_total']=$("#hidden_total").val(),order['total']= $("#total_price").val(),order['labour']= $("#labour_fee").val(),order['land']=$("#land").val();
  order_data.push(order);
  var table_length = document.getElementById("tbl_order").rows.length;
  for (var i = 1; i < table_length - 3; i++) {
      var orderdetails = {};
      orderdetails['orderdetail_id'] = document.getElementById("tbl_order").rows[i].cells[0].firstChild.value;
      orderdetails['product_name'] =document.getElementById("tbl_order").rows[i].cells[0].children[1].value;
      orderdetails['quantity'] = document.getElementById("tbl_order").rows[i].cells[1].firstChild.value;
      orderdetails['weight'] = document.getElementById("tbl_order").rows[i].cells[3].firstChild.value;
      orderdetails['unit'] = document.getElementById("tbl_order").rows[i].cells[4].firstChild.value;
      orderdetails['product_price'] = document.getElementById("tbl_order").rows[i].cells[5].firstChild.value;
      orderdetails['total'] =document.getElementById("tbl_order").rows[i].cells[6].firstChild.value;
      order_data.push(orderdetails);
  }
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateOrderByorderId",
        data:JSON.stringify(order_data),
        success: function (data) {
                successMessage(data);
                $('#modal-order').modal('toggle');
          },
        error:function (message){
            errorMessage(message);
          }
      });
}
