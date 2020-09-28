function loadGoodInOut()
{
  destroyDatatable("#table_tbl_goodinout","#tbl_goodinout_container");
  destroyDatatable("#table_tbl_goodexport","#tbl_goodexport_container");
  $.ajax({
          type: "POST",
          url: BACKEND_URL + "getGoodInOutByCompanyId",
          data: "companyId=" + company_id,
          success: function (data) {
            var exportData=[];
            exportData=data;
            data.forEach(function (element) {
              var tr = "<tr>";
              tr += "<td >" + element.in_date + "</td>";
              tr += "<td >" + element.order_no + "</td>";
              tr += "<td >" + element.customer_name + "</td>";
              tr += "<td >" + element.sender_name + "</td>";
              tr += "<td >" + element.city_name + "</td>";
              tr += "<td >" + element.product_name + "</td>";
              tr += "<td >" + element.qty + "</td>";
              tr += "<td >" + element.weight + "</td>";
              tr += "<td >" + element.out_date + "</td>";
              tr += "<td >" + element.car_no + "</td>";
              tr += "<td >" + element.quantity + "</td>";
              tr += "</tr>";
              $("#tbl_goodinout_container").append(tr);
            });
            exportData.forEach(function (element) {
              if(element.qty!=element.quantity){
                var goodExport=parseInt(element.qty) - parseInt(element.quantity);
                var tr = "<tr>";
                tr += "<td >" + element.order_no + "</td>";
                tr += "<td >" + element.customer_name + "</td>";
                tr += "<td >" + element.product_name + "</td>";
                tr += "<td >" + element.qty + "</td>";
                tr += "<td >" + element.quantity + "</td>";
                tr += "<td >" + goodExport+ "</td>";
                tr += "</tr>";
                $("#tbl_goodexport_container").append(tr);
              }
            });
          dateRange('#dateRange','startDate','endDate','#table_tbl_goodinout');
          createDataTable('#table_tbl_goodexport');
          },
          error:function (message){
            errorMessage(message);
          }
  });
}
