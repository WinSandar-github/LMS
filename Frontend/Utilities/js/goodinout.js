function loadGoodInOut()
{
  $("#tbl_goodinout_container").html("");
  var date_string = $("#date").val();
  var start_date = date_string.split(' - ')[0];
  var end_date = date_string.split(' - ')[1];
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getGoodInOutByCompanyId",
          data: "company_id=" + company_id + "&start_date=" + start_date + "&end_date=" + end_date,
          success: function (data) {
            var export_data=[];
            export_data=data;
            data.forEach(function (element) {
              var tr = "<tr>";
              tr += "<td >" + formatDate(element.good_receipt_bydetail.date)+ "</td>";
              tr += "<td >" + element.good_receipt_bydetail.order_no+ "</td>";
              tr += "<td >" + element.good_receipt_bydetail.customer_name + "</td>";
              tr += "<td >" + element.good_receipt_bydetail.sender_name + "</td>";
              tr += "<td >" + element.to_city_name + "</td>";
              tr += "<td >" + element.product_name + "</td>";
              tr += "<td >" + element.good_receipt_detail_bydetail.qty + "</td>";
              tr += "<td >" + element.weight + "</td>";
              tr += "<td >" + formatDate(element.out_date) + "</td>";
              tr += "<td >" + element.delivery.car_no + "</td>";
              tr += "<td >" + element.quantity + "</td>";
              tr += "</tr>";
              $("#tbl_goodinout_container").append(tr);
            });
            export_data.forEach(function (element) {
              if(element.good_receipt_detail_bydetail.qty!=element.quantity){
                var good_export=parseInt(element.good_receipt_detail_bydetail.qty) - parseInt(element.quantity);
                var tr = "<tr>";
                tr += "<td >" + element.good_receipt_bydetail.order_no + "</td>";
                tr += "<td >" + element.good_receipt_bydetail.customer_name + "</td>";
                tr += "<td >" + element.product_name + "</td>";
                tr += "<td >" + element.good_receipt_detail_bydetail.qty + "</td>";
                tr += "<td >" + element.quantity + "</td>";
                tr += "<td >" + good_export+ "</td>";
                tr += "</tr>";
                $("#tbl_goodexport_container").append(tr);
              }
            });
            createDataTable("#table_tbl_goodinout");
          },
          error: function (message) {
              dataMessage(message, "#table_tbl_goodinout", "#tbl_goodinout_container");
          }
        });
}
