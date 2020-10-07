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
  var allTotal= $("#paid_price").val();
  var cashTotal=$("#balance_price").val();
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
  statement.append('companyId',company_id);
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
            document.getElementById("print_table").style.display = "inline";
            document.getElementById("price_table").style.display = "none";
            document.getElementById("save_button").style.display = "none";
            document.getElementById("print_button").style.display = "inline";
         },
         error:function (XMLHttpRequest, textStatus, errorThrown){
           errorStatus(XMLHttpRequest, textStatus, errorThrown);
         }

  });
}
function loadStatmentCarList() {
    $("#tbl_statment_container").html("");
    $("#total").html("");
    var dateString = $("#date").val();
    var startDate = dateString.split(' - ')[0];
    var endDate = dateString.split(' - ')[1];
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getStatmentCarList",
        data: "companyId=" + company_id + "&startDate=" + startDate + "&endDate=" + endDate,
        success: function (data) {
            data.forEach(function (element) {

                  var tr = "<tr>";
                  tr += "<td >" + element.date + "</td>";
                  tr += "<td >" + element.car_no + "</td>";
                  tr += "<td >" + element.total_price+ "</td>";
                  tr += "<td >" + element.commission_value + "</td>";
                  tr += "<td >" + element.labour  + "</td>";
                  tr += "<td >" + element.advance + "</td>";
                  tr += "<td >" + element.land + "</td>";
                  tr += "<td >" + element.final_price + "</td>";
                  tr += "<td >" + element.all_total + "</td>";
                  tr += "<td >" + element.cash_total+ "</td>";
                  tr += "</tr>";
                  $("#tbl_statment_container").append(tr);

                });
            var total = 0;
            $('#table_tbl_statment tr').each(function () {
                var value = parseInt($('td', this).eq(3).text());
                if (!isNaN(value)) {
                    total += value;
                }
            });
            $("#total").html(total);
        },
        error: function (message) {
            dataMessage(message, "#table_tbl_statment", "#tbl_statment_container");
        }
    });
}
