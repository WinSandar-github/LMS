function saveStatementCarList()
{
  var delivery_id = localStorage.getItem("delivery_id");
  var car_number = document.getElementById("td_car_number").innerHTML;
  var delivery_date = document.getElementById("td_delivery_date").innerHTML;
  var total_price = document.getElementById("td_total_price").innerHTML;
  var commission = $("#comission_percent").val();
  var commission_value =$("#gate_labour_price").val();
  var labour = $("#labour_price").val();
  var advance=$("#advance").val();
  var land = $("#land_price").val();
  var final_price = $("#all_sum_price").val();
  var all_total= $("#paid_price").val();
  var cash_total=$("#balance_price").val();
  var status='0';

  var statement = new FormData;
  statement.append('car_no',car_number);
  statement.append('date',delivery_date);
  statement.append('total_price',removeComma(total_price));
  statement.append('commission',removePercent(commission));
  statement.append('commission_value',removeComma(commission_value));
  statement.append('labour',removeComma(labour));
  statement.append('advance',removeComma(advance));
  statement.append('land',removeComma(land));
  statement.append('final_price',removeComma(final_price));
  statement.append('cash_total',removeComma(cash_total));
  statement.append('all_total',removeComma(all_total));
  statement.append('delivery_id',delivery_id);
  statement.append('company_id',company_id);
  statement.append('status',status);
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "saveStatementCarList",
          data: statement,
          contentType: false,
          processData: false,
          success: function (data) {
            successMessage(data);
            loadInvoice();
            document.getElementById("print_table").style.display = "inline";
            document.getElementById("price_table").style.display = "none";
            document.getElementById("save_button").style.display = "none";
            document.getElementById("print_button").style.display = "inline";
            document.getElementById("back_button").style.display = "inline";
         },
         error:function (XMLHttpRequest, textStatus, errorThrown){
           errorStatus(XMLHttpRequest, textStatus, errorThrown);
         }

  });
}
function loadStatmentCarList() {
    $("#tbl_statment_container").html("");
    $("#total").html("");
    var date_string = $("#date").val();
    var start_date = date_string.split(' - ')[0];
    var end_date = date_string.split(' - ')[1];
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getStatmentCarList",
        data: "company_id=" + company_id + "&start_date=" + start_date + "&end_date=" + end_date,
        success: function (data) {
            data.forEach(function (element) {

                  var tr = "<tr>";
                  tr += "<td >" + formatDate(element.date) + "</td>";
                  tr += "<td >" + element.car_no + "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(element.total_price)+ "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(element.commission_value) + "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(element.labour)  + "</td>";
                  tr += "<td class='align-right'>" +  thousands_separators(element.advance) + "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(element.land) + "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(element.final_price) + "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(element.all_total) + "</td>";
                  tr += "<td class='align-right'>" + thousands_separators(element.cash_total)+ "</td>";
                  tr += "</tr>";
                  $("#tbl_statment_container").append(tr);

                });
            var total = 0;
            $('#table_tbl_statment tr').each(function () {
                var value = removeComma($('td', this).eq(3).text());
                if (!isNaN(value)) {
                    total += value;
                }
            });
            $("#total").html(thousands_separators(total));
        },
        error: function (message) {
            dataMessage(message, "#table_tbl_statment", "#tbl_statment_container");
        }
    });
}
