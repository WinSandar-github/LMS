function saveStatementCarList()
{

  var carNumber = document.getElementById("td_car_number").innerHTML;
  var deliveryDate = document.getElementById("td_delivery_date").innerHTML;
  var totalPrice = document.getElementById("td_total_price").innerHTML;
  var commission = $("#comission_percent").val();
  var commissionValue =$("#gate_labour_price").val();
  var labour = $("#labour_price").val();
  var advance=$("#advance").val();
  var land = $("#land_price").val();
  var finalPrice = $("#all_sum_price").val();
  var cashTotal = $("#paid_price").val();
  var allTotal=$("#balance_price").val();
  var deliveryId=localStorage.getItem("deliveryId");
  var status='0';

  var statement = new FormData;
  statement.append('carNumber',carNumber);
  statement.append('deliveryDate',deliveryDate);
  statement.append('totalPrice',removeComma(totalPrice));
  statement.append('commission',removePercent(commission));
  statement.append('commissionValue',removeComma(commissionValue));
  statement.append('labour',removeComma(labour));
  statement.append('advance',removeComma(advance));
  statement.append('land',removeComma(land));
  statement.append('finalPrice',removeComma(finalPrice));
  statement.append('cashTotal',removeComma(cashTotal));
  statement.append('allTotal',removeComma(allTotal));
  statement.append('deliveryId',deliveryId);
  statement.append('status',status);

  $.ajax({
          type: "POST",
          url: BACKEND_URL + "saveStatementCarList",
          data: statement,
          contentType: false,
          processData: false,
          success: function (data) {
            alert(data);
            loadInvoiceDelivery();
            document.getElementById("print_table").style.display = "block";
            document.getElementById("price_table").style.display = "none";
            document.getElementById("save_button").style.display = "none";
            document.getElementById("print_button").style.display = "block";
         },
         error:function (XMLHttpRequest, textStatus, errorThrown){
           errorStatus(XMLHttpRequest, textStatus, errorThrown);
         }

  });
}
