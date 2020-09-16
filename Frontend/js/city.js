var BACKEND_URL = "http://" + window.location.host + "/";
function save_city() {
  var city_name = $("#txt_city_name").val();
  $.ajax({
    beforeSend: function () {

    },
    type: "POST",
    url: "http://localhost:8000/" + "test",
    data: { city_name:city_name },
    success: function (data) {
      
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("Status: " + textStatus);
      alert("Error: " + errorThrown);
    }
  });
}

