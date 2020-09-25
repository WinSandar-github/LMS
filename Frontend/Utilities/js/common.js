var BACKEND_URL = window.location.origin + "/Backend/" ;

function errorMessage(message) {
    var returnMessage = JSON.parse(message.responseText)
    alert(returnMessage.message);
}
function errorStatus(XMLHttpRequest, textStatus, errorThrown){
    alert("Status: " + textStatus);
    alert("Error: " + errorThrown);
}

function destroyDatatable(table, tableBody) {
    if ($.fn.DataTable.isDataTable(table)) {
        $(table).DataTable().destroy();
    }
    $(tableBody).empty();
}
function createDataTable(table) {
    $(table).DataTable({
        'destroy': true,
        'paging': true,
        'lengthChange': false,
        "pageLength": 5,
        'searching': false,
        'ordering': true,
        'info': false,
        'autoWidth': true,
        "order": [[0, "desc"]]
    });

}
function selectedDataTableTr(table){
  $(table).on( 'click', 'tr', function () {

      $(this).addClass('selected').siblings().removeClass('selected');

  } );
}
function createDatepicker(datepicker){
  $(datepicker).datepicker({ format: 'yyyy-mm-dd' });
}
