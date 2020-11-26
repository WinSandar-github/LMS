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
  else if(different_arrived=='0'){
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
      $("#different_day").val("0");
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
            tr += "<td >" + formatDate(element.start_dt) + "</td>";
            tr += "<td >" + formatDate(element.end_dt) + "</td>";
            tr += "<td >" + element.arrived + "</td>";
            tr += "<td >" + element.remark + "</td>";
            tr += "<td >" + element.user.full_name + "</td>";
            tr += "<td >" + element.company_delivery.name + "</td>";
            tr += "<td class='alignright'><button type='button' class='btn btn-info btn-space' data-toggle='modal' data-target='#modal-delivery_details' onClick=getDeliveryById("+ element.id +")><i class='fas fa-plus'></i> Add DeliveryDetails</button>"+
                  "<button type='button' class='btn btn-info btn-space' onClick=showDeliveryById("+ element.id +")><i class='fas fa-edit'></i></button>"+
                  "<button type='button' class='btn btn-success btn-print btn-space' onClick=printDeliveryById("+ element.id +")><i class='fas fa-print'> Print</button ></td> ";//onClick=printDeliveryById("+ element.id +")
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
  localStorage.setItem("delivery_id", delivery_id);
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
  var delivery = {};
  delivery['delivery_id']=$('#hdelivery_id').val();
  delivery['car_no']=$("#car_number").val();
  delivery['driver_name']=$("#driver_name").val();
  delivery['driver_phone']=$("#driver_phone").val();
  delivery['from_city_id']=$("#select_city").val();
  delivery['to_city_id']=$("#select_city_delivery").val();
  delivery['start_dt']=$("#start_dt").val();
  delivery['end_dt']=$("#arrived_dt").val();
  delivery['arrived']=$("#different_day").val();
  delivery['remark']=$("#delivery_remark").val();
  delivery['status']=$("#selected_status").val();
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          var message=removeDoublequote(xhttp);
          successMessage(message);
          clearDeliveryForm();
        }
    };
    xhttp.open('POST', BACKEND_URL + 'updateDelivery');
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(delivery));
}
function saveDeliverDetail()
{
  var table_body = document.getElementById("tbl_product_container"),delivery_id=$('#hdelivery_id').val(),delivery_details = [];
  for (var i = 0, row; row = table_body.rows[i]; i++)
  {
    var product_data={};
    product_data['receiver_name']=row.cells[1].children[2].value;
    product_data['product_name']=row.cells[3].innerHTML;
    product_data['total_quantity']=row.cells[4].children[0].value;
    product_data['quantity']=row.cells[5].children[0].value;
    product_data['weight']=row.cells[7].children[0].value;
    product_data['to_city_name']=row.cells[8].innerHTML;
    product_data['remark']=row.cells[9].innerHTML;
    product_data['good_receipt_id']=row.cells[1].children[0].value;
    product_data['order_status']=row.cells[10].children[0].value;
    if(row.cells[10].children[0].value=='0' || row.cells[10].children[0].value==''){
      product_data['order_id']=0;
      product_data['good_receipt_detail_id']=row.cells[1].children[1].value;
    }else{
      product_data['order_id']=row.cells[10].children[1].value;
      product_data['good_receipt_detail_id']=0;
      product_data['order_detail_id']=row.cells[1].children[1].value;
      product_data['remaine_qty']=row.cells[6].children[1].value;
    }
    product_data['user_id']=user_id;
    product_data['company_id']=company_id;
    product_data['delivery_id']=delivery_id;
    delivery_details.push(product_data);
  }
    $.ajax({
          type: "POST",
          url: BACKEND_URL + "saveDeliverDetail",
          data: JSON.stringify(delivery_details),
          success: function (data) {
                  $.ajax({
                        type: "POST",
                        url: BACKEND_URL + "updateOrderByorderId",
                        data: JSON.stringify(delivery_details),
                        success: function (data) {
                          successMessage(data);
                          $('#modal-delivery_details').modal('toggle');
                          loadDelivery();
                       },
                       error:function (XMLHttpRequest, textStatus, errorThrown){
                         errorStatus(XMLHttpRequest, textStatus, errorThrown);
                       }
                     });
                  },
              error:function (message){
                alert('Please add to order!');
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
              createDataTable("#table_tbl_deliverydetails");
            },
            error: function (message) {
                dataMessage(message, "#table_tbl_deliverydetails", "#tbl_deliverydetails_container");
            }
        });
}
function printDeliveryById(delivery_id)
{
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getDeliveryById",
          data: "delivery_id=" + delivery_id,
          success: function (data) {
            window.open("../../Components/Delivery/deliver_invoice.html?delivery_id="+delivery_id);
            },
            error: function (message) {
                alert("Please add deliverydetails");
            }
        });
}
function loadInvoice()
{
  var currentUrl = window.location.href;
  var url = new URL(currentUrl);
  var url=window.location.href.split('/');
  var last_array=url[url.length - 1].split('?');
  if (last_array[last_array.length - 2] === 'deliver_invoice.html'){
    var delivery_id = last_array[last_array.length - 1].split('=');
    deliveryInvoice(delivery_id[delivery_id.length - 1]);
  }else{
    var order_no =last_array[last_array.length - 1].split('=');
    var last_order_no=order_no[order_no.length - 1];
    if(last_order_no[last_order_no.length - 1]=='*'){
      var replace_star=last_order_no.replace("*",'');
      loadInvoiceByOrderNo(replace_star);
    }else{
      loadInvoiceByOrderNo(order_no[order_no.length - 1]);
    }
  }
}
function deliveryInvoice(delivery_id){
  $('.driver_name').html(""),$('.car_number').html("");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getDeliveryById",
          data: "deliveryId=" + delivery_id,
          success: function (data) {
            $('.driver_name').append(data[0].driver_name);
            $('.car_number').append(data[0].car_no);
            var out_date=data[0].created_at;
            var currentUrl = window.location.href;
            var url = new URL(currentUrl);
            var url=window.location.href.split('/');
            var last_array=url[url.length - 1].split('?');
            if (last_array[last_array.length - 2] === 'deliver_invoice.html'){
              $('.income_date').append(formatDate(out_date));
              appendTableRow("td_car_number",data[0].car_no);
              appendTableRow("print_car_number",data[0].car_no);
              appendTableRow("td_out_date",formatDate(out_date));
              appendTableRow("td_delivery_date",out_date);
              loadInvoiceDelivery(data[0].delivery_details);
            }

          },
            error: function (message) {
                errorMessage(message);
            }
        });
}
function loadInvoiceDelivery(delivery_details)
{
  destroyDatatable("#tbl_invoice","#tbl_invoice_container");
  var order_total=0,labour_total=0,good_receipt_id_array = [],paid_order_total=0,order_land=0;
  for (var i = 0; i < delivery_details.length; i++) {
      good_receipt_id_array[i] = delivery_details[i].good_receipt_id;
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
          order_total +=alldata[0].order_by_good_receipts[0].order_total;
          labour_total +=alldata[0].order_by_good_receipts[0].labour;
           $.ajax({
           type: "POST",
           url: BACKEND_URL + "getOrderDetailsByorderId",
           data:"order_id="+order_id,
           success: function (orderdetails) {
              orderdetails.forEach(function (element, index, array){
                 var tr = "<tr class='border-tr'>";
                 if(index===0){
                   if(alldata[0].cash_method=='ငွေရှင်းပြီး')
                   {
                     tr += "<td >" + alldata[0].order_by_good_receipts[0].order_no +"*"+"</td>";
                     tr += "<td >" + alldata[0].customer_name+ "</td>";
                     tr += "<td >" + alldata[0].city_list.city_name+ "</td>";
                     paid_order_total+=parseInt(alldata[0].order_by_good_receipts[0].order_total)+parseInt(alldata[0].order_by_good_receipts[0].labour);
                    }else{
                     tr += "<td >" + alldata[0].order_by_good_receipts[0].order_no +"</td>";
                     tr += "<td >" + alldata[0].customer_name+ "</td>";
                     tr += "<td >" + alldata[0].city_list.city_name+ "</td>";
                   }
                   order_land+=parseInt(alldata[0].order_by_good_receipts[0].land);
                  }
                 else{
                   tr += "<td >" + ""+ "</td>";
                   tr += "<td >" + alldata[0].customer_name+ "</td>";
                   tr += "<td >" + alldata[0].city_list.city_name+ "</td>";
                 }
                 tr += "<td >" +element.product_name + "</td>";
                 tr += "<td >" + Math.round(element.quantity)+" "+element.unit+ "</td>";
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
                    var advance=$('#advance').val(),land_price=$('#hland_price').val(),print_all_sum_price=$('#hall_sum_price').val();$('#land_price').val(thousands_separators(order_land));
                    appendTableRow("print_advance",advance);
                    var all_sum_price=parseInt(gate_labour_price)+removeComma(advance)+parseInt(order_land)+parseInt(labour_total);
                    $("#all_sum_price").val(thousands_separators(all_sum_price));
                    if(land_price=='0'){
                      appendTableRow("print_land_price",thousands_separators(order_land));
                      appendTableRow("print_all_sum_price",thousands_separators(all_sum_price));
                      appendTableRow("print_balance_price",parseInt(all_sum_price)-parseInt(paid_order_total));
                    }else{
                      appendTableRow("print_land_price",thousands_separators(land_price));
                      appendTableRow("print_all_sum_price",thousands_separators(print_all_sum_price));
                      appendTableRow("print_balance_price",parseInt(print_all_sum_price)-parseInt(paid_order_total));
                    }
                    $("#paid_price").val(thousands_separators(paid_order_total));
                    appendTableRow("print_paid_price",paid_order_total);
                    $("#balance_price").val(thousands_separators(parseInt(all_sum_price)-parseInt(paid_order_total)));
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
    var all_sum_price=parseInt(gate_labour_price)+removeComma(advance)+removeComma(land_price)+removeComma(labour_price);
    $("#all_sum_price").val(thousands_separators(all_sum_price));
    $('#hland_price').val(land_price);$('#hall_sum_price').val(all_sum_price);
    appendTableRow("print_all_sum_price",all_sum_price);
    $("#balance_price").val(thousands_separators(parseInt(all_sum_price)-removeComma(paid_price)));
    appendTableRow("print_balance_price",parseInt(all_sum_price)-removeComma(paid_price));
    $('#advance').val(thousands_separators(advance));
    $('#land_price').val(thousands_separators(land_price));
    appendTableRow("print_advance",advance);
}
function tableRowClick(table_body){
  $(table_body).on('click', '.btn-print', function () {
    var url=window.location.href.split('/');
    var last_array=url[url.length - 1].split('?');
    if (last_array[last_array.length - 2] === 'deliver_invoice.html') {
      var current_row = $(this).closest("tr");
      var order_no = current_row.find("td:eq(0)").text();
    }else{
      var current_row = $(this).closest("tr");
      var order_no = current_row.find("td:eq(2)").text();
    }
    window.open("../../Components/Delivery/invoice.html?orderNo=" + order_no);
  });
}
function loadInvoiceByOrderNo(order_no)
{
  destroyDatatable("#tbl_order_invoice","#tbl_order_invoice_container");
  $('.customer_name').html(""),$('.order_no').html(""),$('.sender_name').html(""),$('.to_city_name').html(""),$('.income_date').html("");
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
          $('.income_date').append(formatDate(good_receipt[0].order_by_good_receipts[0].order_date));
          $('#cashRemark').append(good_receipt[0].cash_method);
          if(good_receipt[0].good_receipt_delivery==1){
              document.getElementById('delivery_data').style.display='block';
              deliveryInvoice(good_receipt[0].good_receipt_bydelivery[0].delivery_id);
          }
          localStorage.setItem('good_receipt',JSON.stringify(good_receipt[0]));
          addToOrderByOrderNo(order_id);
        }
    });
}
function back()
{
  location.href="delivery.html";
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
                  if(good_receipt[0].order_status=='0'){
                    good_receipt_detail.forEach(function (element, index, array){
                    count+=1;
                    var tr="<tr>";
                    tr+="<td>"+count+"</td>";
                    tr+="<td><input type='hidden' value='"+good_receipt[0].id+"'><input type='hidden' value='"+element.id+"'><input type='hidden' value='"+good_receipt[0].customer_name+"'>"+good_receipt[0].customer_name+"</td>";
                    tr+="<td>"+good_receipt[0].order_no+"</td>";
                    tr+="<td>"+element.product_name+"</td>";
                    tr+="<td><input type='hidden' id='total_qty"+element.id+"' value='"+Math.round(element.qty)+"'>"+Math.round(element.qty)+"</td>";
                    tr+="<td><input type='number' value='"+Math.round(element.qty)+"' onblur='orderQtyCalculate("+element.id+","+"this.value)' onkeyup='orderQtyCalculate("+element.id+","+"this.value)'></td>";//<input type='text' class='orderQty' value='"+element.qty+"' id='order_qty"+element.id+"' disabled>
                    tr+="<td><input type='hidden' id='remain_qty_product"+element.id+"' value='0'><input type='text' value='0' id='remaine_qty"+element.id+"' disabled>"+"</td>";
                    tr+="<td><input type='text' value='"+element.weight+"'>"+"</td>";
                    tr+="<td>"+good_receipt[0].city_list.city_name+"</td>";
                    tr+="<td>"+element.remark+"</td>";
                    if(index===0){
                        tr+="<td class='align-left'><input type='hidden' value='"+good_receipt[0].order_status+"'><button type='button' class='btn btn-danger btn-space' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash'></i></button>"+
                            "<button type='button' class='btn btn-success  btn-space' onClick='printGoodReceipt(" + good_receipt[0].id + ")'><i class='fas fa-print'></i> Print</button>"+
                            "<button type='button' class='btn btn-info btn-space' onClick='addToOrder(" + good_receipt[0].id + ")'>ဘောင်ချာဖွင့်ရန်</button></td>";
                      }else{
                        tr+="<td class='align-left'><input type='hidden' value='"+good_receipt[0].order_status+"'><button type='button' class='btn btn-danger btn-space btn-left' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash'></i></button></td>";
                      }
                      tr+="</tr>";
                      $('#tbl_product_container').append(tr);
                  });
                }else{
                    $.ajax({
                          type: "POST",
                          url: BACKEND_URL + "getOrderDetailsByorderId",
                          data:"order_id="+good_receipt[0].order_by_good_receipts[0].id,
                          success: function (orderdetails) {
                              orderdetails.forEach(function(unit, orderindex, array){
                                count+=1;
                                  var tr="<tr>";
                                  tr+="<td>"+count+"</td>";
                                  tr+="<td><input type='hidden' value='"+good_receipt[0].id+"'><input type='hidden' value='"+unit.id+"'><input type='hidden' value='"+good_receipt[0].customer_name+"'>"+good_receipt[0].customer_name+"</td>";
                                  tr+="<td>"+good_receipt[0].order_no+"</td>";
                                  tr+="<td>"+unit.product_name+"</td>";
                                  tr+="<td><input type='hidden' id='total_qty"+unit.id+"' value='"+Math.round(unit.quantity)+"'>"+Math.round(unit.quantity)+"</td>";
                                  if(unit.product_qty=='0'){
                                    tr+="<td><input type='number' value='"+Math.round(unit.quantity)+"' onblur='orderQtyCalculate("+unit.id+","+"this.value)' onkeyup='orderQtyCalculate("+unit.id+","+"this.value)'></td>";//<input type='text' class='orderQty' value='"+element.qty+"' id='order_qty"+element.id+"' disabled>
                                    tr+="<td><input type='hidden' id='remain_qty_product"+unit.id+"' value='0'><input type='text' value='0' id='remaine_qty"+unit.id+"' disabled>"+"</td>";
                                  }else{
                                    tr+="<td><input type='number' value='"+Math.round(unit.quantity-unit.product_qty)+"' onblur='orderQtyCalculate("+unit.id+","+"this.value)' onkeyup='orderQtyCalculate("+unit.id+","+"this.value)'></td>";//<input type='text' class='orderQty' value='"+element.qty+"' id='order_qty"+element.id+"' disabled>//unit.quantity+[unit.quantity-unit.product_qty
                                    tr+="<td><input type='hidden' id='remain_qty_product"+unit.id+"' value='"+Math.round(unit.quantity-unit.product_qty)+"'><input type='text' value='"+Math.round(unit.quantity-[unit.quantity+unit.product_qty])+"' id='remaine_qty"+unit.id+"' disabled>"+"</td>";
                                  }
                                  tr+="<td><input type='text' value='"+unit.weight+"'>"+"</td>";
                                  tr+="<td>"+good_receipt[0].city_list.city_name+"</td>";
                                  tr+="<td>"+unit.remark+"</td>";
                                  if(orderindex===0){
                                    tr+="<td class='align-left'><input type='hidden' value='"+good_receipt[0].order_status+"'><input type='hidden' value='"+good_receipt[0].order_by_good_receipts[0].id+"'><button type='button' class='btn btn-danger btn-space' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash'></i></button>"+
                                      "<button type='button' class='btn btn-success btn-print btn-space'><i class='fas fa-print'></i> Print</button>"+
                                      "<button type='button' class='btn btn-info btn-space' onClick='addToOrderByOrderNo(" + good_receipt[0].order_by_good_receipts[0].id+ ")'>ဘောင်ချာပြန်ဖွင့်ရန်</button></td>";
                                  }else{
                                    tr+="<td class='align-left'><input type='hidden' value='"+good_receipt[0].order_status+"'><input type='hidden' value='"+good_receipt[0].order_by_good_receipts[0].id+"'><button type='button' class='btn btn-danger btn-space btn-left' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash'></i></button></td>";
                                  }
                                  tr+="</tr>";
                                  $('#tbl_product_container').append(tr);
                                });

                              }
                        });
                  }
                  tableRowClick('#tbl_product_container');
                },
                  error: function (message) {
                      dataMessage(message, '#tbl_product', '#tbl_product_container');
                  }
      });
}
function printGoodReceipt(goodReceiptId) {
    window.open("../../Components/Good/goodreceipt_invoice.html?goodReceiptId=" + goodReceiptId);
}
function deleteDeliveryDetails(row)
{
    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById('tbl_product').deleteRow(i);
    count-=1;
}
function orderQtyCalculate(id,quantity)
{
    if($('#remain_qty_product'+id).val()=='0'){
      $('#remaine_qty'+id).val(parseInt($('#total_qty'+id).val())-Number(quantity));
    }else if($('#remain_qty_product').val()=='0' && quantity==''){
      $('#remaine_qty'+id).val(parseInt($('#remain_qty_product'+id).val()));
    }else if($('#remain_qty_product').val()!='0' && quantity==''){
      $('#remaine_qty'+id).val(parseInt($('#remain_qty_product'+id).val()));
    }
    else{
      $('#remaine_qty'+id).val(parseInt($('#remain_qty_product'+id).val())-Number(quantity));
    }
}
function addToOrderByOrderNo(order_id) {
  var good_receipt=JSON.parse(localStorage.getItem('good_receipt'));
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOrderDetailsByorderId",
        data: "order_id=" + order_id,
        success: function (orderdetails) {
          $("#tbl_order_delivery_body").html("");
          $('#hidden_order_id').val(order_id);
          var url=window.location.href.split('/');
          var last_array=url[url.length - 1].split('?');
          if (last_array[last_array.length - 2] === 'invoice.html') {
              for(var i=0;i<orderdetails.length;i++) {
                  var tr = "<tr>";
                  tr += "<td >" + (i+1) + "</td>";
                  tr += "<td >" + orderdetails[i].product_name + "</td>";
                  tr += "<td >" + Math.round(orderdetails[i].quantity)+" "+ orderdetails[i].unit+ "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(orderdetails[i].product_price)+ "</td>";
                  tr += "</tr>";
                  $("#tbl_order_invoice_container").append(tr);
              }
              createRow("စုစုပေါင်း:",good_receipt.order_by_good_receipts[0].order_total);
              createRow("အလုပ်သမားခ:",good_receipt.order_by_good_receipts[0].labour);
              createRow("စိုက်ငွေ:",good_receipt.order_by_good_receipts[0].land);
              createRow("စုစုပေါင်းသင့်ငွေ:",good_receipt.order_by_good_receipts[0].total);
              createRow("တာဝန်ခံ:",user_name);

            } else {
              for(var i=0;i<orderdetails.length;i++) {
                  var tr = "<tr>";
                  tr += "<td>" + "<input type='hidden' value='"+orderdetails[i].id+"'><input type='text' value='"+orderdetails[i].product_name+"'>" + "</td>";
                  tr += "<td >" + "<input type='text' autocomplete='off' id='productQuantity' value='" + Math.round(orderdetails[i].quantity) + "'>" + "</td>";
                  tr += "<td >" + "<input type='text' autocomplete='off'  value='" + Math.round(orderdetails[i].quantity-orderdetails[i].product_qty) + "'>" + "</td>";
                  tr += "<td >" + "<input type='text' autocomplete='off' id='productWeight' value='" + orderdetails[i].weight + "'>" + "</td>";
                  tr += "<td >" + "<input type='text' id='productUnit' value='" + orderdetails[i].unit + "' disabled>"+"</td>";
                  tr += "<td >" + "<input type='text' autocomplete='off' id='productPrice' value='0'  onkeyup='getTotalByUnit(this)'>" + "</td>";
                  tr += "<td >" + "<input type='text' id='total' value='0'>" +"</td>";
                  tr += "</tr>";
                  $("#tbl_order_delivery_body").append(tr);
                }
              appendTBody("labourFee", "အလုပ်သမားခ:");
              appendTBody("land", "စိုက်ငွေ:");
              appendTBody("totalPrice", "စုစုပေါင်း:");
              $('#modal-order-delivey').modal('toggle');
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
function appendTBody(id,label) {
    var tr = "<tr>";
    tr += "<td colspan='6' style='text-align:right;'>" + label + "</td>";
    tr += "<td >" + "<input type='text' id='" + id +"' value='0'>" + "</td>";
    tr += "</tr>";
    $("#tbl_order_delivery_body").append(tr);
    var new_id = "#" + id;
    if (id != "totalPrice") {
        $(new_id).keyup(function () {
          getTotalDelivery();
        });
    }
}
function getTotalByUnit(td) {
    var row = $(td).closest('tr');
    var productQuantity = parseFloat($(row).find('#productQuantity').val());
    var productWeight = parseInt($(row).find('#productWeight').val());
    var productPrice = parseInt($(row).find('#productPrice').val()) ? parseInt($(row).find('#productPrice').val()) : 0;
    var priceMethod = $("input[name='delivey-radio']:checked").val();
    var tabledelivery = document.getElementById("tbl_order_delivery").rows.length;
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
    for (var total = 1; total < tabledelivery - 3; total++) {
        productsTotal[total - 1] = document.getElementById("tbl_order_delivery").rows[total].cells[6].firstChild.value;

    }
    for (var sumTotal = 0; sumTotal < productsTotal.length; sumTotal++) {

        sumVal += Number(productsTotal[sumTotal]);
    }
    var total = sumVal + Number($("#labourFee").val()) + Number($("#land").val());
    $("#totalPrice").val(total);
    $("#hidden_Total").val(sumVal);
}
function getTotalDelivery() {
    var totalPrice = $("#hidden_Total").val();
    var labourFee = $("#labourFee").val();
    var land = $("#land").val();
    $("#totalPrice").val(Number(totalPrice) + Number(labourFee) + Number(land));
}
function updateOrderBygoodReceiptId()
{
  var order={},order_data=[];
  order['order_id']=$('#hidden_order_id').val(),order['order_total']=$("#hidden_Total").val(),order['total']= $("#totalPrice").val(),order['labour']= $("#labourFee").val(),order['land']=$("#land").val();
  order_data.push(order);
  var table_length = document.getElementById("tbl_order_delivery").rows.length;
  for (var i = 1; i < table_length - 3; i++) {
      var orderdetails = {};
      orderdetails['orderdetail_id'] = document.getElementById("tbl_order_delivery").rows[i].cells[0].firstChild.value;
      orderdetails['product_name'] =document.getElementById("tbl_order_delivery").rows[i].cells[0].children[1].value;
      orderdetails['quantity'] = document.getElementById("tbl_order_delivery").rows[i].cells[1].firstChild.value;
      orderdetails['weight'] = document.getElementById("tbl_order_delivery").rows[i].cells[3].firstChild.value;
      orderdetails['unit'] = document.getElementById("tbl_order_delivery").rows[i].cells[4].firstChild.value;
      orderdetails['product_price'] = document.getElementById("tbl_order_delivery").rows[i].cells[5].firstChild.value;
      orderdetails['total'] =document.getElementById("tbl_order_delivery").rows[i].cells[6].firstChild.value;
      order_data.push(orderdetails);
  }
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateOrderBygoodReceiptId",
        data:JSON.stringify(order_data),
        success: function (data) {
                successMessage(data);
                $('#modal-order-delivey').modal('toggle');
          },
        error:function (message){
            errorMessage(message);
          }
      });
}
