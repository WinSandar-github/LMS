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
        var status=0;

        var delivery = new FormData;;
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
                  type: "post",
                  url: BACKEND_URL + "saveDelivery",
                  data: delivery,
                  contentType: false,
                  processData: false,
                  success: function (data) {
                    alert(data.message);
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
function getDifferentDays() {

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
                type: "post",
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
                    tr += "<td >" + element.full_name + "</td>";
                    tr += "<td >" + element.name + "</td>";
                    tr += "<td class='alignright'><button type='button' class='btn btn-info' data-toggle='modal' data-target='#modal-delivery_details' onClick=getDeliveryById("+ element.id +")>Add DeliveryDetails</button ></td >" ;
                    tr += "<td class='alignright'><button type='button' class='btn btn-primary' onClick=completeDeliveryByStatus("+ element.id +")>Complete</button ></td > ";
                    tr += "<td class='alignright'><button type='button' class='btn btn-warning' onClick=showDeliveryById("+ element.id +")>Update Delivery</button ></td > ";
                    tr += "</tr>";
                    $("#tbl_delivery_container").append(tr);

                });
                createDataTable('#table_tbl_delivery');
                selectedDataTableTr('#table_tbl_delivery');
                },
                error:function (message){
                  errorMessage(message);
                }
        });
}
function getDeliveryById(deliveryId)
{
  $('#hdeliveryId').val(deliveryId);

}
function saveDeliverDetail()
{
        var tableBody = document.getElementById("product_table");   //tbl_order_details
        var deliveryId=$('#hdeliveryId').val();
        var goodReceiptId=1;                                  //tbl_good_receipt
        var goodReceiptDetailId=1;                           //tbl_good_receipt_details
        var orderDetailsId=1;                                 //tbl_order_details
        var receiverName='U Tun';                              //row.cells[1].innerHTML
        var productName='test';                                //row.cells[2].innerHTML
        var totalQuantity='100';                               //row.cells[3].innerHTML
        var quantity='10';                                      //row.cells[4].innerHTML
        var weight='10kg';                                      //row.cells[5].innerHTML
        var toCityName='Monywa';                              //row.cells[6].innerHTML
        var remark='description';                               //row.cells[7].innerHTML
        var deliveryDetails = new FormData;
        for (var i = 0, row; row = tableBody.rows[i]; i++)//tbl_order_details
        {
            var productData={};
            productData['receiverName']=row.cells[1].innerHTML;   //tbl_order_details
            productData['productName']=row.cells[2].innerHTML;    //tbl_order_details
            productData['totalQuantity']=row.cells[3].innerHTML;  //tbl_order_details
            productData['quantity']=row.cells[4].innerHTML;       //tbl_order_details
            productData['weight']=row.cells[5].innerHTML;         //tbl_order_details
            productData['toCityName']=row.cells[6].innerHTML;     //tbl_order_details
            productData['remark']=row.cells[7].innerHTML;         //tbl_order_details
            productData['userId']=user_id;
            productData['companyId']=company_id;
            productData['deliveryId']=deliveryId;
            productData['goodReceiptId']=goodReceiptId;
            productData['goodReceiptDetailId']=goodReceiptDetailId;
            productData['order_details_id']=orderDetailsId;

        }

        deliveryDetails.append('receiverName',receiverName);
        deliveryDetails.append('productName',productName);
        deliveryDetails.append('totalQuantity',totalQuantity);
        deliveryDetails.append('quantity',quantity);
        deliveryDetails.append('weight',weight);
        deliveryDetails.append('toCityName',toCityName);
        deliveryDetails.append('remark',remark);
        deliveryDetails.append('userId',user_id);
        deliveryDetails.append('companyId',company_id);
        deliveryDetails.append('deliveryId',deliveryId);
        deliveryDetails.append('goodReceiptId',goodReceiptId);
        deliveryDetails.append('goodReceiptDetailId',goodReceiptDetailId);
        deliveryDetails.append('orderDetailsId',orderDetailsId);

        $.ajax({
                type: "post",
                url: BACKEND_URL + "saveDeliverDetail",
                data: deliveryDetails,
                contentType: false,
                processData: false,
                success: function (data) {
                  alert(data.message);
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
                type: "post",
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
              error:function (message){
                errorMessage(message);
              }
            });
}
function completeDeliveryByStatus(deliveryId)
{
        var delivery=new FormData;
        var status='1';
        delivery.append('deliveryId',deliveryId);
        delivery.append('status',status);
        $.ajax({
                type: "post",
                url: BACKEND_URL + "updateDeliveryByStatus",
                data: delivery,
                contentType: false,
                processData: false,
                success: function (data) {
                  alert(data.message);
                  destroyDatatable("#table_tbl_delivery","#tbl_delivery_container");
                  loadDelivery();
                  loadDeliveryByComplete();
              },
              error:function (XMLHttpRequest, textStatus, errorThrown){
                errorStatus(XMLHttpRequest, textStatus, errorThrown);
              }
            });
}
function loadDeliveryByComplete()
{
        destroyDatatable("#table_tbl_delivery2","#tbl_delivery_container2");
        $.ajax({
          type: "post",
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
                  tr += "<td class='alignright'><button type='button' class='btn btn-info' data-toggle='modal' data-target='#modal-delivery_details' onClick=getDeliveryById("+ element.id +")>Add DeliveryDetails</button ></td >" ;
                  tr += "<td class='alignright'><button type='button' class='btn btn-warning' onClick=showDeliveryById("+ element.id +")>Update Delivery</button ></td > ";
                  tr += "</tr>";
                  $("#tbl_delivery_container2").append(tr);

                });
          createDataTable('#table_tbl_delivery2');
          selectedDataTableTr('#table_tbl_delivery2');
        },
        error:function (message){
          errorMessage(message);
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

        $.ajax({
                type: "post",
                url: BACKEND_URL + "updateDelivery",
                data: delivery,
                contentType: false,
                processData: false,
                success: function (data) {
                  alert(data.message);
                  $('#modal-delivery').modal('toggle');
                  destroyDatatable("#table_tbl_delivery","#tbl_delivery_container");
                  loadDelivery();
                  loadDeliveryByComplete();
               },
               error:function (XMLHttpRequest, textStatus, errorThrown){
                 errorStatus(XMLHttpRequest, textStatus, errorThrown);
               }

        });
}
