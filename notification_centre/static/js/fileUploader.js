
$(document).ready(function () {

    $("#btnSubmit").click(function (event) {
        //alert("hello");
        var url      = window.location.href;
        const user = url.split('?');
        console.log(user[1]);
        const userName= user[1].split("=");
        var form = $('#fileUploadForm')[0];

        var data = new FormData(form);
        // disabled the submit button
        $("#btnSubmit").prop("disabled", true);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/notify",
            data: data,
            headers: {"user":userName[1]},
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {

                $("#result").text(data.incidentNo);
                console.log("SUCCESS : ", data);
                $("#btnSubmit").prop("disabled", true);

            },
            error: function (e) {

                $("#result").text(e.responseText);
                console.log("ERROR : ", e);
                $("#btnSubmit").prop("disabled", true);

            }
        });

    });

});