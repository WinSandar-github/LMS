function saveDelivery()
{
  var car_number = $("#car_number").val();
  var driver_name = $("#driver_name").val();
  var driver_phone = $("#driver_phone").val();
  var from_city_name = $("#from_city_name").val();
  var to_city_name = $("#to_city_name").val();
  var started_date = $("#start_dt").val();
  var arrived_date = $("#arrived_dt").val();
  var different_arrived = $("#different_day").val();
  var remark = $("#delivery_remark").val();
  var status=$('#selected_status').val();
  var delivery = new FormData;
  delivery.append('car_number',car_number);
  delivery.append('driver_name',driver_name);
  delivery.append('driver_phone',driver_phone);
  delivery.append('from_city_name',from_city_name);
  delivery.append('to_city_name',to_city_name);
  delivery.append('started_date',started_date);
  delivery.append('arrived_date',arrived_date);
  delivery.append('different_arrived',different_arrived);
  delivery.append('remark',remark);
  delivery.append('company_id',company_id);
  delivery.append('status',status);
  delivery.append('user_id',user_id);
  if(different_arrived.trim()==""){
    $("#start_dt").focus();
    }
  else if(different_arrived==-1){
     $("#arrived_dt").focus();
  }
  else{
    $.ajax({
            type: "POST",
            url: BACKEND_URL + "saveDelivery",
            data: delivery,
            contentType: false,
            processData: false,
            success: function (data) {
              alert(data);
              $('#modal-delivery').modal('toggle');
              destroyDatatable("#table_tbl_delivery","#tbl_delivery_container");
              loadDelivery();
           },
           error:function (XMLHttpRequest, textStatus, errorThrown){
             errorStatus(XMLHttpRequest, textStatus, errorThrown);
           }
         });
  }
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
            tr += "<td >" + element.depart_from + "</td>";
            tr += "<td >" + element.depart_to + "</td>";
            tr += "<td >" + element.start_dt + "</td>";
            tr += "<td >" + element.end_dt + "</td>";
            tr += "<td >" + element.arrived + "</td>";
            tr += "<td >" + element.remark + "</td>";
            tr += "<td >" + element.users['full_name'] + "</td>";
            tr += "<td >" + element.company_delivery['name'] + "</td>";
            tr += "<td class='alignright'><button type='button' class='btn btn-info btn-space' data-toggle='modal' data-target='#modal-delivery_details' onClick=getDeliveryById("+ element.id +")><i class='fas fa-plus'></i> Add DeliveryDetails</button>"+
                  "<button type='button' class='btn btn-info btn-space' onClick=showDeliveryById("+ element.id +")><i class='fas fa-edit'></i></button>"+
                  "<button type='button' class='btn btn-success btn-space' onClick=printDeliveryById("+ element.id +")><i class='fas fa-print'> Print</button ></td> ";
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
          $("#from_city_name").val(data.depart_from);
          $("#to_city_name").val(data.depart_to);
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
  delivery.append('car_number',$("#car_number").val());
  delivery.append('driver_name',$("#driver_name").val());
  delivery.append('driver_phone',$("#driver_phone").val());
  delivery.append('from_city_name',$("#from_city_name").val());
  delivery.append('to_city_name',$("#to_city_name").val());
  delivery.append('started_date',$("#start_dt").val());
  delivery.append('arrived_date',$("#arrived_dt").val());
  delivery.append('different_arrived',$("#different_day").val());
  delivery.append('remark',$("#delivery_remark").val());
  delivery.append('status',$("#selected_status").val());
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "updateDelivery",
          data: delivery,
          contentType: false,
          processData: false,
          success: function (data) {
            alert(data);
            $('#modal-delivery').modal('toggle');
            loadDelivery();
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
            alert(data);
            $('#modal-delivery_details').modal('toggle');
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
  location.href='deliver_invoice.html';
  localStorage.setItem("delivery_id", delivery_id);
}
function loadInvoice()
{
  var delivery_id = localStorage.getItem("delivery_id");
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
              if (url[url.length - 1] === 'deliver_invoice.html') {
                  document.getElementById("td_car_number").innerHTML = (data[0].car_no);
                  document.getElementById("print_car_number").innerHTML = (data[0].car_no);
                  document.getElementById("td_out_date").innerHTML = complet_date;
                  document.getElementById("td_delivery_date").innerHTML = out_date;
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
          var order_id=alldata[0].order_by_good_receipt[0].id;
          if(alldata[0].cash_method=='ငွေရှင်းပြီး')
          {
            order_total +=alldata[0].order_by_good_receipt[0].order_total;
          }
           labour_total +=alldata[0].order_by_good_receipt[0].labour;
           $.ajax({
           type: "POST",
           url: BACKEND_URL + "getOrderDetailsByorderId",
           data:"order_id="+order_id,
           success: function (orderdetails) {
              orderdetails.forEach(function (element, index, array){
                 var tr = "<tr class='border-tr'>";
                 if(index===0){
                   tr += "<td >" + alldata[0].order_by_good_receipt[0].order_no + "</td>";
                   tr += "<td >" + alldata[0].customer_name+ "</td>";
                   tr += "<td >" + alldata[0].city_list.city_name+ "</td>";
                 }
                 else{
                   tr += "<td >" + ""+ "</td>";
                   tr += "<td >" + alldata[0].customer_name+ "</td>";
                   tr += "<td >" + alldata[0].city_list.city_name+ "</td>";
                 }
                 tr += "<td >" +element.product_name + "</td>";
                 tr += "<td >" + element.quantity+" "+element.unit_byorder_detail.unit_name+ "</td>";
                 if(index===0){
                    tr += "<td >" + thousands_separators( alldata[0].order_by_good_receipt[0].order_total)+ "</td>";
                    tr += "<td >" +  thousands_separators( alldata[0].order_by_good_receipt[0].labour) + "</td>";
                    tr += "<td><button type='button' class='btn btn-success' onclick=invoiceByOrderNo(\""+encodeURIComponent(alldata[0].id)+ "\")><i class='fas fa-print'></i> Print</button ></td >" ;
                  }
                 else {
                   tr += "<td >" +" "+ "</td>";
                   tr += "<td >" +" "+ "</td>";
                   tr += "<td >" +" "+ "</td>";
                 }
                 tr += "</tr>";
                 $("#tbl_invoice_container").append(tr);
                   document.getElementById("sumPrice").innerHTML = thousands_separators(order_total);
                   document.getElementById("sumLabour").innerHTML = thousands_separators(labour_total);
                   document.getElementById("td_total_price").innerHTML = thousands_separators(order_total+labour_total);
                   document.getElementById("print_total_price").innerHTML = thousands_separators(order_total+labour_total);
                   var comission_percent=$('#comission_percent').val();
                   document.getElementById("print_comission_percent").innerHTML=comission_percent;
                   var gate_labour_price=[(order_total+labour_total)*(comission_percent)]/100;
                   $("#gate_labour_price").val(thousands_separators(gate_labour_price));
                   document.getElementById("print_gate_labour_price").innerHTML=thousands_separators(gate_labour_price);
                   $("#labour_price").val(thousands_separators(labour_total));
                   document.getElementById("print_labour_price").innerHTML = thousands_separators(labour_total);
                   var advance=$('#advance').val(),land_price=$('#land_price').val();
                   document.getElementById("print_advance").innerHTML = thousands_separators(advance);
                   var all_sum_price=parseInt(gate_labour_price)+removeComma(advance)+parseInt(land_price)+parseInt(labour_total);
                   $("#all_sum_price").val(thousands_separators(all_sum_price));
                   document.getElementById("print_land_price").innerHTML = thousands_separators(land_price);
                   document.getElementById("print_all_sum_price").innerHTML = thousands_separators(all_sum_price);
                   $("#paid_price").val(thousands_separators(order_total));
                   document.getElementById("print_paid_price").innerHTML = thousands_separators(order_total);
                   $("#balance_price").val(thousands_separators(parseInt(all_sum_price)-parseInt(order_total)));
                   document.getElementById("print_balance_price").innerHTML = thousands_separators(parseInt(all_sum_price)-parseInt(order_total));
               });
               }
         });
        }
      });
    });
}
function comissionPercent()
{
    var total_price=  document.getElementById("td_total_price").innerHTML;
    var comission_percent=document.getElementById("comission_percent").value;
    document.getElementById("print_comission_percent").innerHTML=comission_percent;
    var gate_labour_price=((removeComma(total_price)*removePercent(comission_percent))/100);
    $("#gate_labour_price").val(thousands_separators(gate_labour_price));
    document.getElementById("print_gate_labour_price").innerHTML = thousands_separators(gate_labour_price);
    var advance=$('#advance').val(),land_price=$('#land_price').val(),labour_price=$("#labour_price").val(),paid_price=$("#paid_price").val();
    var all_sum_price=parseInt(gate_labour_price)+removeComma(advance)+parseInt(land_price)+parseInt(labour_price);
    $("#all_sum_price").val(thousands_separators(all_sum_price));
    document.getElementById("print_all_sum_price").innerHTML = thousands_separators(all_sum_price);
    $("#balance_price").val(thousands_separators(parseInt(all_sum_price)-removeComma(paid_price)));
    document.getElementById("print_balance_price").innerHTML = thousands_separators(parseInt(all_sum_price)-removeComma(paid_price));
    document.getElementById("advance").value=thousands_separators(advance);
    document.getElementById("print_advance").innerHTML=thousands_separators(advance);
}
function invoiceByOrderNo(good_receipt_id)
{
  location.href='invoice.html';
  localStorage.setItem("good_receipt_id",good_receipt_id);
}
function loadInvoiceByOrderNo()
{
  destroyDatatable("#tbl_order_invoice","#tbl_order_invoice_container");
  var good_receipt_id = localStorage.getItem("good_receipt_id");
  $('.customer_name').html(""),$('.order_no').html(""),$('.sender_name').html(""),$('.to_city_name').html("");
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptByorderNo",
        data: "good_receipt_id=" + good_receipt_id,
        success: function (good_receipt) {
          var order_id=good_receipt[0].order_by_good_receipt[0].id;
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
                    tr+="<td><input type='hidden' value='"+good_receipt[0].order_by_good_receipt[0].id+"'>"+good_receipt[0].order_no+"</td>";
                    tr+="<td>"+element.product_name+"</td>";
                    tr+="<td>"+element.qty+"</td>";
                    tr+="<td><input type='text' class='orderQty' value='0' id='order_qty"+element.id+"' disabled><input type='number' style='width:50%;' value='0' onblur='orderQtyCalculate("+element.id+","+"this.value)'></td>";
                    tr+="<td>"+element.weight+"</td>";
                    tr+="<td>"+good_receipt[0].city_list.city_name+"</td>";
                    tr+="<td>"+element.remark+"</td>";
                    if(index===0){
                      tr+="<td ><button type='button' class='btn btn-danger btn-space' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash'></i></button>"+
                          "<button type='button' class='btn btn-info btn-space' onClick='addToOrderByOrderNo(" + good_receipt[0].order_by_good_receipt[0].id + ")'>ဘောင်ချာဖွင့်ရန်</button>"+
                          "<button type='button' class='btn btn-success btn-space' onclick=invoiceByOrderNo(\""+encodeURIComponent(good_receipt[0].id)+ "\")><i class='fas fa-print'></i> Print</button></td>";
                    }
                    else{
                      tr+="<td><button type='button' class='btn btn-danger btn-space btn-left' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash'></i></button></td>";
                        }
                    tr+="</tr>";
                    $('#tbl_product_container').append(tr);
                  });

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
            if (url[url.length - 1] === 'invoice.html') {
              for(var i=0;i<orderdetails.length;i++) {
                  var tr = "<tr>";
                  tr += "<td >" + (i+1) + "</td>";
                  tr += "<td >" + orderdetails[i].product_name + "</td>";
                  tr += "<td >" + orderdetails[i].quantity+" "+ orderdetails[i].unit_byorder_detail.unit_name+ "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(orderdetails[i].product_price)+ "</td>";
                  tr += "</tr>";
                  $("#tbl_order_invoice_container").append(tr);
              }
              var tr = "<tr>";
              tr += "<td colspan='3' class='align-right'>" + "အလုပ်သမားခ:" + "</td>";
              tr += "<td class='align-right'>" +thousands_separators(good_receipt.order_by_good_receipt[0].order_total)+ "</td>";
              tr += "</tr>";
              $("#tbl_order_invoice_container").append(tr);
              var tr = "<tr>";
              tr += "<td colspan='3' class='align-right'>" + "စိုက်ငွေ:" + "</td>";
              tr += "<td class='align-right'>" + thousands_separators(good_receipt.order_by_good_receipt[0].labour)+ "</td>";
              tr += "</tr>";
              $("#tbl_order_invoice_container").append(tr);
              var tr = "<tr >";
              tr += "<td colspan='3' class='align-right'>" + "စုစုပေါင်း:" + "</td>";
              tr += "<td class='align-right'>" +thousands_separators(good_receipt.order_by_good_receipt[0].total)+ "</td>";
              tr += "</tr>";
              $("#tbl_order_invoice_container").append(tr);
              var tr = "<tr >";
              tr += "<td colspan='3' class='align-right'>" + "တာဝန်ခံ:" + "</td>";
              tr += "<td class='align-right'>" +user_name+ "</td>";
              tr += "</tr>";
              $("#tbl_order_invoice_container").append(tr);
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
              var tr = "<tr>";
              tr += "<td colspan='6' style='text-align:right;'>" + "အလုပ်သမားခ:" + "</td>";
              tr += "<td >" + "<input type='text' id='labour_fee' value='0' onkeyup='getTotal();'>" + "</td>";
              tr += "</tr>";
              $("#tbl_order_body").append(tr);
              var tr = "<tr>";
              tr += "<td colspan='6' style='text-align:right;'>" + "စိုက်ငွေ:" + "</td>";
              tr += "<td >" + "<input type='text' id='land' value='0' onkeyup='getTotal();'>" + "</td>";
              tr += "</tr>";
              $("#tbl_order_body").append(tr);
              var tr = "<tr>";
              tr += "<td colspan='6' style='text-align:right;'>" + "စုစုပေါင်း:" + "</td>";
              tr += "<td >" + "<input type='text' id='total_price' value='0'>" + "</td>";
              tr += "</tr>";
              $("#tbl_order_body").append(tr);
              $("#hidden_total").val('0');
              $('#modal-order').modal('toggle');
            }
          }
        });
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
                alert(data);
                $('#modal-order').modal('toggle');
          },
        error:function (message){
            errorMessage(message);
          }
      });
}
