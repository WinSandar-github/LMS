function saveDelivery()
{
  var carNumber = $("#car_number").val();
  var driverName = $("#driver_name").val();
  var driverPhone = $("#driver_phone").val();
  var fromCityName = $("#from_city_name").val();
  var toCityName = $("#to_city_name").val();
  var startedDate = $("#start_dt").val();
  var arrivedDate = $("#arrived_dt").val();
  var differentArrived = $("#different_day").val();
  var remark = $("#delivery_remark").val();
  var status=$('#selected_status').val();
  var delivery = new FormData;
  delivery.append('carNumber',carNumber);
  delivery.append('driverName',driverName);
  delivery.append('driverPhone',driverPhone);
  delivery.append('fromCityName',fromCityName);
  delivery.append('toCityName',toCityName);
  delivery.append('startedDate',startedDate);
  delivery.append('arrivedDate',arrivedDate);
  delivery.append('differentArrived',differentArrived);
  delivery.append('remark',remark);
  delivery.append('companyId',company_id);
  delivery.append('status',status);
  delivery.append('userId',user_id);
  if(differentArrived.trim()==""){
    $("#start_dt").focus();
    }
  else if(differentArrived==-1){
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
  var startDate = $("#start_dt").val();
  var endDate = $("#arrived_dt").val();
  if (endDate.trim() == "") {
      $("#different_day").val("-1");
    }
  else {
      var firstDate = new Date(startDate);
      var lastDate = new Date(endDate);
      const differentTime = Math.abs(firstDate.getTime() - lastDate.getTime());
      const differentDay = Math.ceil(differentTime / (1000 * 60 * 60 * 24));
      $("#different_day").val(differentDay);
  }
}
function loadDelivery()
{
  destroyDatatable("#table_tbl_delivery","#tbl_delivery_container");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getDelivery",
          data: "companyId=" + company_id,
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
              tr += "<td class='alignright'><button type='button' class='btn btn-info btn-md btn-space' data-toggle='modal' data-target='#modal-delivery_details' onClick=getDeliveryById("+ element.id +")><i class='fas fa-plus'></i>  Add DeliveryDetails</button >"+
                    "<button type='button' class='btn btn-info btn-md btn-space' onClick=showDeliveryById("+ element.id +")><i class='fas fa-edit'></i></button >"+
                    "<button type='button' class='btn btn-success btn-md btn-space' onClick=printDeliveryById("+ element.id +")><i class='fas fa-print'></i> Print</button ></td > ";
              tr += "</tr>";
              $("#tbl_delivery_container").append(tr);
            });
          createDataTable('#table_tbl_delivery');
          },
          error: function (message) {
              dataMessage(message, "#table_tbl_delivery", "#tbl_delivery_container");
          }
  });
}
function getDeliveryById(deliveryId)
{
  $('#hdeliveryId').val(deliveryId);
}
function saveDeliverDetail()
{
  var tableBody = document.getElementById("tbl_product_container"),deliveryId=$('#hdeliveryId').val(),deliveryDetails = new Array(),orderData=new Array();
  for (var i = 0, row; row = tableBody.rows[i]; i++)
  {
    var productData={},order={};
    order['orderId']=row.cells[2].children[0].value;
    productData['receiverName']=row.cells[1].innerHTML;
    productData['productName']=row.cells[3].innerHTML;
    productData['totalQuantity']=row.cells[4].innerHTML;
    productData['quantity']=row.cells[5].children[0].value;
    productData['weight']=row.cells[6].innerHTML;
    productData['toCityName']=row.cells[7].innerHTML;
    productData['remark']=row.cells[8].innerHTML;
    productData['goodReceiptId']=row.cells[0].children[0].value;
    productData['goodReceiptDetailId']=row.cells[0].children[1].value;
    productData['userId']=user_id;
    productData['companyId']=company_id;
    productData['deliveryId']=deliveryId;
    deliveryDetails.push(productData),orderData.push(order);
  }
  for(var i=0;i<deliveryDetails.length;i++){
      if(parseInt(deliveryDetails[i]['totalQuantity'])==parseInt(deliveryDetails[i]['quantity']))
      {
        var orderId=orderData[i]['orderId'],deliveryStatus='1',order=new FormData;
        order.append('orderId',orderId);
        order.append('deliveryStatus',deliveryStatus);
        $.ajax({
                type: "POST",
                url: BACKEND_URL + "updateOrderStatusByorderId",
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
          data: JSON.stringify(deliveryDetails),
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
function getDeliverDetailsByDeliveryId(deliveryId)
{
  destroyDatatable("#table_tbl_deliverydetails","#tbl_deliverydetails_container");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getDeliverDetailsByDeliveryId",
          data: "deliveryId=" + deliveryId,
          success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.receiver_name + "</td>";
                tr += "<td >" + element.product_name + "</td>";
                tr += "<td >" + element.quantity + "</td>";
                tr += "<td >" + element.weight + "</td>";
                tr += "<td >" + element.remark + "</td>";
                tr += "</tr>";
                $("#tbl_deliverydetails_container").append(tr);
              });
            createDataTable('#table_tbl_deliverydetails');
          },
          error: function (message) {
              dataMessage(message, "#table_tbl_deliverydetails", "#tbl_deliverydetails_container");
          }
      });
}
function loadDeliveryByComplete()
{
  destroyDatatable("#table_tbl_delivery2","#tbl_delivery_container2");
  $.ajax({
    type: "POST",
    url: BACKEND_URL + "getDeliveryByStatus",
    data: "companyId=" + company_id,
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
            tr += "<td >" + element.full_name + "</td>";
            tr += "<td >" + element.name + "</td>";
            tr += "<td class='alignright'><button type='button' class='btn btn-info btn-space' data-toggle='modal' data-target='#modal-delivery_details' onClick=getDeliveryById("+ element.id +")><i class='fas fa-plus'> Add DeliveryDetails</button >"+
                  "<button type='button' class='btn btn-info btn-space' onClick=showDeliveryById("+ element.id +")><i class='fas fa-edit'></i></button>"+
                  "<button type='button' class='btn btn-success btn-space' onClick=printDeliveryById("+ element.id +")><i class='fas fa-print'> Print</button ></td> ";
            tr += "</tr>";
            $("#tbl_delivery_container2").append(tr);
          });
    createDataTable('#table_tbl_delivery2');
  },
  error: function (message) {
      dataMessage(message, "#table_tbl_delivery2", "#tbl_delivery_container2");
  }
  });
}
function showDeliveryById(deliveryId)
{
  $('#hdeliveryId').val(deliveryId);
  $("#delivery_form").attr('action', 'javascript:updateDelivery()');
  var data="deliveryId=" + deliveryId;
  $.ajax({
      type: "POST",
      url: BACKEND_URL + "getDeliveryById",
      data: data,
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
  delivery.append('deliveryId',$('#hdeliveryId').val());
  delivery.append('carNumber',$("#car_number").val());
  delivery.append('driverName',$("#driver_name").val());
  delivery.append('driverPhone',$("#driver_phone").val());
  delivery.append('fromCityName',$("#from_city_name").val());
  delivery.append('toCityName',$("#to_city_name").val());
  delivery.append('startedDate',$("#start_dt").val());
  delivery.append('arrivedDate',$("#arrived_dt").val());
  delivery.append('differentArrived',$("#different_day").val());
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
            loadDeliveryByComplete();
         },
         error:function (XMLHttpRequest, textStatus, errorThrown){
           errorStatus(XMLHttpRequest, textStatus, errorThrown);
         }
       });
}
function printDeliveryById(deliveryId)
{
  location.href='deliver_invoice.html';
  localStorage.setItem("deliveryId", deliveryId);
}
function loadInvoiceDelivery()
{
  destroyDatatable("#tbl_invoice","#tbl_invoice_container");
  var deliveryId = localStorage.getItem("deliveryId"),alldata=new Array(),order=new Array();
  $('.driverName').html(""),$('.carNumber').html(""),$('.incomeDate').html("");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getCompanyInfoBydeliveryId",
          data: "deliveryId=" + deliveryId,
          success: function (data) {
            $('.driverName').append(data[0].driver_name);
            $('.carNumber').append(data[0].car_no);
            var outDate=data[0].delivery_details[0].out_date;
            var splitDate=outDate.split('-');
            var completDate=splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0];
            $('.incomeDate').append(completDate);
            document.getElementById("td_car_number").innerHTML = thousands_separators(data[0].car_no);
            document.getElementById("print_car_number").innerHTML = thousands_separators(data[0].car_no);
            document.getElementById("td_out_date").innerHTML = completDate;
            document.getElementById("td_delivery_date").innerHTML = outDate;
            var goodReceipt=data[0].delivery_details;
            var orderTotal=0;
            var labourTotal=0;
            for(var g=0;g<goodReceipt.length;g++){
              var goodReceiptId=goodReceipt[g].good_receipt_id;
              $.ajax({
                  type: "POST",
                  url: BACKEND_URL + "getInvoiceDetailsBydeliveryId",
                  data: "goodReceiptId=" + goodReceiptId,
                  success: function (alldata) {
                    var orderId=alldata[0].good_receipt_order[0].id;
                    if(alldata[0].cash_method=='ငွေရှင်းပြီး')
                    {
                      orderTotal +=alldata[0].good_receipt_order[0].order_total;

                    }
                     labourTotal +=alldata[0].good_receipt_order[0].labour;
                     $.ajax({
                      type: "POST",
                      url: BACKEND_URL + "getInvoiceDetailsByorderId",
                      data:"orderId="+orderId,
                      success: function (orderdetails) {
                          orderdetails.forEach(function(details){
                          alldata.forEach(function (element){
                            var tr = "<tr class='border-tr'>";
                            tr += "<td >" + element.good_receipt_order[0].order_no + "</td>";
                            tr += "<td >" + element.customer_name + "</td>";
                            tr += "<td >" + element.good_receipt_city.city_name + "</td>";
                            tr += "<td >" + details.product_name + "</td>";
                            tr += "<td >" + details.quantity+" "+ details.unit_byorder_detail.unit_name+ "</td>";
                            tr += "<td >" + thousands_separators(element.good_receipt_order[0].order_total)+ "</td>";
                            tr += "<td >" +  thousands_separators(element.good_receipt_order[0].labour) + "</td>";
                            tr += "<td><button type='button' class='btn btn-success' onclick=invoiceByOrderNo(\""+encodeURIComponent(element.order_no)+ "\")><i class='fas fa-print'></i> Print</button ></td >" ;
                            tr += "</tr>";
                            $("#tbl_invoice_container").append(tr);
                            var table = document.getElementById("tbl_invoice"), sumPrice = 0; sumLabour = 0;
                            for (var i = 1; i < table.rows.length; i++) {
                                sumPrice = sumPrice + parseFloat((table.rows[i].cells[5].innerHTML).replace(/,/g, ''));
                                sumLabour = sumLabour + parseFloat((table.rows[i].cells[6].innerHTML).replace(/,/g, ''));
                              }
                              document.getElementById("sumPrice").innerHTML = thousands_separators(sumPrice);
                              document.getElementById("sumLabour").innerHTML = thousands_separators(sumLabour);
                              document.getElementById("td_total_price").innerHTML = thousands_separators(sumPrice+sumLabour);
                              document.getElementById("print_total_price").innerHTML = thousands_separators(sumPrice+sumLabour);
                              var comissionPercent=$('#comission_percent').val();
                              document.getElementById("print_comission_percent").innerHTML=comissionPercent;
                              var gateLabourPrice=[(sumPrice+sumLabour)*(comissionPercent)]/100;
                              $("#gate_labour_price").val(thousands_separators(gateLabourPrice));
                              document.getElementById("print_gate_labour_price").innerHTML=thousands_separators(gateLabourPrice);
                              $("#labour_price").val(thousands_separators(labourTotal));
                              document.getElementById("print_labour_price").innerHTML = thousands_separators(labourTotal);
                              var advance=$('#advance').val(),landPrice=$('#land_price').val();
                              document.getElementById("print_advance").innerHTML = thousands_separators(advance);
                              var allSumPrice=parseInt(gateLabourPrice)+removeComma(advance)+parseInt(landPrice)+parseInt(labourTotal);
                              $("#all_sum_price").val(thousands_separators(allSumPrice));
                              document.getElementById("print_land_price").innerHTML = thousands_separators(landPrice);
                              document.getElementById("print_all_sum_price").innerHTML = thousands_separators(allSumPrice);
                              $("#paid_price").val(thousands_separators(orderTotal));
                              document.getElementById("print_paid_price").innerHTML = thousands_separators(orderTotal);
                              $("#balance_price").val(thousands_separators(parseInt(allSumPrice)-parseInt(orderTotal)));
                              document.getElementById("print_balance_price").innerHTML = thousands_separators(parseInt(allSumPrice)-parseInt(orderTotal));
                          });
                        });
                      },
                    error:function (message){

                    }
                  });
                  },
                error:function (message){

                }
              });
            }
          },
        error:function (message){

        }
      });
}
function comissionPercent()
{
    var totalPrice=  document.getElementById("td_total_price").innerHTML;
    var comissionPercent=document.getElementById("comission_percent").value;
    document.getElementById("print_comission_percent").innerHTML=comissionPercent;
    var gateLabourPrice=((removeComma(totalPrice)*removePercent(comissionPercent))/100);
    $("#gate_labour_price").val(thousands_separators(gateLabourPrice));
    document.getElementById("print_gate_labour_price").innerHTML = thousands_separators(gateLabourPrice);
    var advance=$('#advance').val(),landPrice=$('#land_price').val(),labourPrice=$("#labour_price").val(),paidPrice=$("#paid_price").val();
    var allSumPrice=parseInt(gateLabourPrice)+removeComma(advance)+parseInt(landPrice)+parseInt(labourPrice);
    $("#all_sum_price").val(thousands_separators(allSumPrice));
    document.getElementById("print_all_sum_price").innerHTML = thousands_separators(allSumPrice);
    $("#balance_price").val(thousands_separators(parseInt(allSumPrice)-removeComma(paidPrice)));
    document.getElementById("print_balance_price").innerHTML = thousands_separators(parseInt(allSumPrice)-removeComma(paidPrice));
    document.getElementById("advance").value=thousands_separators(advance);
    document.getElementById("print_advance").innerHTML=thousands_separators(advance);
}
function invoiceByOrderNo(orderNo)
{
  location.href='invoice.html';
  localStorage.setItem("orderNo", orderNo);
}
function loadInvoiceByOrderNo()
{
  destroyDatatable("#tbl_order_invoice","#tbl_order_invoice_container");
  var orderNo = localStorage.getItem("orderNo");
  var deliveryId = localStorage.getItem("deliveryId");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getCompanyDetailBydeliveryId",
          data: "deliveryId=" + deliveryId,
          success: function (data) {
            $('.driverName').append(data[0].driver_name);
            $('.carNumber').append(data[0].car_no);
            var outDate=data[0].out_date;
            var splitDate=outDate.split('-');
            var completDate=splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0];
            $('.incomeDate').append(completDate);
            $('.customerName').append(data[0].customer_name);
            $('.senderName').append(data[0].sender_name);
            $('.orderNo').append(data[0].order_no);
            $('.toCityName').append(data[0].city_name);
            $.ajax({
                  type: "POST",
                  url: BACKEND_URL + "getInvoiceDetailsByorderNo",
                  data: "orderNo=" + orderNo,
                  success: function (data) {
                    for(var i=0;i<data.length;i++){
                      data.forEach(function (element){
                        var tr = "<tr class='border-tr'>";
                        tr += "<td >" + (i+1) + "</td>";
                        tr += "<td >" + element.product_name + "</td>";
                        tr += "<td >" + element.quantity+" "+ element.unit+ "</td>";
                        tr += "<td >" + thousands_separators(element.product_price)+ "</td>";
                        tr += "</tr>";
                        $("#tbl_order_invoice_container").append(tr);
                        document.getElementById("order_total_price").innerHTML = thousands_separators(element.order_total);
                        document.getElementById("order_labour_price").innerHTML = thousands_separators(element.labour);
                        document.getElementById("order_sum").innerHTML = thousands_separators(element.total);
                        document.getElementById("order_land_price").innerHTML = thousands_separators(element.land);
                      });
                    }
                  },
                error:function (message){
                  errorMessage(message);
                }
              });
        },
        error:function (message){
          errorMessage(message);
        }
      });
}
function back()
{
  location.href="deliver_invoice.html";
}
function autoOrderNo()
{
  var select = document.getElementById("selectOrderId");
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOrderNoBycompanyId",
        data:"companyId=" + company_id,
        success: function (data) {
                data.forEach(function(element){
                  var option = document.createElement('option');
                  option.text = element.order_no;
                  option.value = element.order_no;
                  select.add(option);
                });
              },
        error:function (message){
            errorMessage(message);
          }
      });
}
var count=0;
function searchOrderNo(orderNo)
{
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "getGoodReceiptByorderNo",
        data:"orderNo=" + orderNo,
        success: function (goodReceipt) {
                  var goodReceiptDetail=goodReceipt[0].good_receipt_bygoodreceipt_details;
                  goodReceiptDetail.forEach(function (element, index, array){
                    count +=1;
                    var tr="<tr>";
                    tr+="<td><input type='hidden' value='"+goodReceipt[0].id+"'><input type='hidden' value='"+element.id+"'>"+count+"</td>";
                    tr+="<td>"+goodReceipt[0].customer_name+"</td>";
                    tr+="<td><input type='hidden' value='"+goodReceipt[0].order_by_good_receipt[0].id+"'>"+goodReceipt[0].order_no+"</td>";
                    tr+="<td>"+element.product_name+"</td>";
                    tr+="<td>"+element.qty+"</td>";
                    tr+="<td><input type='text' class='orderQty' value='0' id='orderQty"+element.id+"' disabled><input type='number' style='width:50%;' value='0' onblur='orderQtyCalculate("+element.id+","+"this.value)'></td>";
                    tr+="<td>"+element.weight+"</td>";
                    tr+="<td>"+goodReceipt[0].good_receipt_city.city_name+"</td>";
                    tr+="<td>"+element.remark+"</td>";
                    if(index===0){
                      tr+="<td ><button type='button' class='btn btn-delete btn-space' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash-alt'></i></button>"+
                          "<button type='button' class='btn btn-info btn-space' onClick='addToOrderByOrderNo(" + goodReceipt[0].order_by_good_receipt[0].id + ")'>ဘောင်ချာဖွင့်ရန်</button>"+
                          "<button type='button' class='btn btn-success btn-space' onclick=invoiceByOrderNo(\""+encodeURIComponent(goodReceipt[0].order_no)+ "\")><i class='fas fa-print'></i> Print</button></td>";
                    }
                    else{
                      tr+="<td><button type='button' class='btn btn-delete btn-space btn-left' onclick='deleteDeliveryDetails(this);'><i class='fas fa-trash-alt'></i></button></td>";
                        }
                    tr+="</tr>";
                    $('#tbl_product_container').append(tr);
                  });

                  },
        error:function (message){
            errorMessage(message);
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
    $('#orderQty'+id).val(quantity);
}
function addToOrderByOrderNo(orderId) {
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOrderDetailsByorderNo",
        data: "orderId=" + orderId,
        success: function (orderdetails) {
          $('#hiddenOrderId').val(orderId);
            orderdetails.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td>" + "<input type='hidden' value='"+element.id+"'><input type='text' value='"+element.product_name+"'>" + "</td>";
                tr += "<td >" + "<input type='text' id='productQuantity' value='" + Math.round(element.quantity) + "'>" + "</td>";
                tr += "<td >" + "<input type='text'  value='" + Math.round(element.product_qty) + "'disabled>" + "</td>";
                tr += "<td >" + "<input type='text' id='productWeight' value='" + element.weight + "'>" + "</td>";
                tr += "<td >" + "<input type='hidden' value='"+element.unit_byorder_detail.id+"'><input type='text' id='productUnit' value='" + element.unit_byorder_detail.unit_name + "' disabled>"+"</td>";
                tr += "<td >" + "<input type='text' id='productPrice' value='0' onkeyup='getTotalPerProduct(this)' >" + "</td>";
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
            $("#hiddenTotal").val('0');
            $('#modal-order').modal('toggle');
        },
        error: function (message) {
            errorMessage(message);
        }
    });

}
function updateOrderBygoodReceiptId()
{
  var order={},orderData=new Array();
  order['orderId']=$('#hiddenOrderId').val();
  order['orderTotal']=$("#hiddenTotal").val();
  order['total']= $("#totalPrice").val();
  order['labour']= $("#labourFee").val();
  order['land']=$("#land").val();
  orderData.push(order);
  var tableLength = document.getElementById("tbl_order").rows.length;;
  for (var i = 1; i < tableLength - 3; i++) {
      var orderdetails = {};
      orderdetails['orderdetailId'] = document.getElementById("tbl_order").rows[i].cells[0].firstChild.value;
      orderdetails['productName'] =document.getElementById("tbl_order").rows[i].cells[0].children[1].value;
      orderdetails['quantity'] = document.getElementById("tbl_order").rows[i].cells[1].firstChild.value;
      orderdetails['weight'] = document.getElementById("tbl_order").rows[i].cells[3].firstChild.value;
      orderdetails['unit'] = document.getElementById("tbl_order").rows[i].cells[4].firstChild.value;
      orderdetails['productPrice'] = document.getElementById("tbl_order").rows[i].cells[5].firstChild.value;
      orderdetails['total'] =document.getElementById("tbl_order").rows[i].cells[6].firstChild.value;
      orderData.push(orderdetails);
  }
  $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateOrderByorderId",
        data:JSON.stringify(orderData),
        success: function (data) {
                alert(data);
                $('#modal-order').modal('toggle');
          },
        error:function (message){
            errorMessage(message);
          }
      });
}
