function loadGoodInOut()
{
  destroyDatatable("#table_tbl_goodinout","#tbl_goodinout_container");
  destroyDatatable("#table_tbl_goodexport","#tbl_goodexport_container");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getGoodInOutByCompanyId",
          data: "company_id=" + company_id ,
          success: function (data) {
            var export_data=[];
            export_data=data;
            data.forEach(function (element) {
              var tr = "<tr>";
              tr += "<td >" + element.good_receipt_bydetails.date+ "</td>";
              tr += "<td >" + element.good_receipt_bydetails.order_no+ "</td>";
              tr += "<td >" + element.good_receipt_bydetails.customer_name + "</td>";
              tr += "<td >" + element.good_receipt_bydetails.sender_name + "</td>";
              tr += "<td >" + element.to_city_name + "</td>";
              tr += "<td >" + element.product_name + "</td>";
              tr += "<td >" + element.good_receipt_detail_bydetails.qty + "</td>";
              tr += "<td >" + element.weight + "</td>";
              tr += "<td >" + element.out_date + "</td>";
              tr += "<td >" + element.delivery.car_no + "</td>";
              tr += "<td >" + element.quantity + "</td>";
              tr += "</tr>";
              $("#tbl_goodinout_container").append(tr);
            });
            export_data.forEach(function (element) {
              if(element.good_receipt_detail_bydetails.qty!=element.quantity){
                var good_export=parseInt(element.good_receipt_detail_bydetails.qty) - parseInt(element.quantity);
                var tr = "<tr>";
                tr += "<td >" + element.good_receipt_bydetails.order_no + "</td>";
                tr += "<td >" + element.good_receipt_bydetails.customer_name + "</td>";
                tr += "<td >" + element.product_name + "</td>";
                tr += "<td >" + element.good_receipt_detail_bydetails.qty + "</td>";
                tr += "<td >" + element.quantity + "</td>";
                tr += "<td >" + good_export+ "</td>";
                tr += "</tr>";
                $("#tbl_goodexport_container").append(tr);
              }
            });
          dateRange('#dateRange','startDate','endDate','#table_tbl_goodinout');
          createDataTable('#table_tbl_goodexport');
          },
          error: function (message) {
              dataMessage(message, "#table_tbl_goodinout", "#tbl_goodinout_container");
          }
  });
}
