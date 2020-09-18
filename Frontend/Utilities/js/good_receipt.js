var BACKEND_URL = "http://localhost:8000/";
function addProduct() {
    var tr = "<tr>";
    tr += "<td>" + + "</td > ";
    tr += "<td>" + $("#txt_good_name").val() + "</td > ";
    tr += "<td >" + $("#txt_quantity_detail").val() + "</td>";
    tr += "<td >" + $("#txt_unit").val() + "</td>";
    tr += "<td >" + $("#txt_weight_detail").val() + "</td > ";
    tr += "<td><button onclick='delete_city_detail(this);' class='btn btn-danger btn-xs'><li class='fa fa-trash' ></li ></button ></td > ";
    tr += "</tr>";
    $('#tbl_product_body').append(tr);
    $('#tbl_product_body tr').each(function (idx) {
        $(this).children("td:eq(0)").html(idx + 1);
    });
}