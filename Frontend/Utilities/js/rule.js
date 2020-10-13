function getRule() {
    $('#ruleList').empty();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getRule",
        data: "company_id=" + company_id,
        success: function (data) {
            data.forEach(function (element) {
                var li = document.createElement("li");
                li.addEventListener("click", function () {
                    showRuleDetail(element.id);
                });
                var rule = element.description;
                var text = document.createTextNode(rule);
                li.appendChild(text);
                document.getElementById("ruleList").appendChild(li);
            });
        },
        error: function (message) {
        }
    });
}
function showRuleDetail(ruleId) {
    $("#ruleId").val(ruleId);
    var data = "&rule_id=" + ruleId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showRuleDetail",
        data: data,
        success: function (data) {
            $("textarea#descriptionInfo").val(data.description);
            $('#modal-rule-update').modal('toggle');
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}
function updateRule(){
    var ruleData = "rule_id=" + $("#ruleId").val() + "&description=" + $("#descriptionInfo").val();
    console.log(ruleData);
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateRule",
        data: ruleData,
        success: function (data) {
            $('#modal-rule-update').modal('toggle');
            getRule();
            successMessage(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorStatus(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    
}
function addRule() {
    if ($("#description").val() != "") {
        var ruleDescription = $("#description").val();
        var tr = "<tr>";
        tr += "<td >" + "</td>";
        tr += "<td >" + ruleDescription + "</td>";
        tr += "<td><button type='button' class='btn btn-danger btn-xs'><li class='fa fa-trash' onclick='deleterow(this);'></li ></button ></div ></td > ";
        tr += "</tr>";
        $("#tbl_rule_body").append(tr);
        $("#description").val("");
        numberRows();
    }
    else {
        alert("Please fill description.")
    }
}
function createRule() {
    var ruleData = [];
    var tableLength = document.getElementById("tbl_rule").rows.length;
    for (var i = 1; i < tableLength; i++) {
        var rule = {};
        rule['description'] = document.getElementById("tbl_rule").rows[i].cells[1].innerHTML;
        rule["company_id"] = company_id;
        ruleData.push(rule);
    }
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createRule",
        data: JSON.stringify(ruleData),
        success: function (data) {
            successMessage(data);
            $('#modal-rule').modal('toggle');
            getRule();
            $("#tbl_rule_body").empty();
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}

function deleteRule() {
    var ruleId = $("#ruleId").val();
    var result = confirm("WARNING: This will delete Rule and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "rule_id=" + ruleId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteRule",
            data: data,
            success: function (data) {
                successMessage(data);
                $('#modal-rule-update').modal('toggle');
                getRule();
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
}
function deleterow(row) {
    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById('tbl_rule_body').deleteRow(i);  
    numberRows();
}
