$(document).ready(function () {
    $('#resetBtn').click(function () {
        var emailAddress = $('#emailResetInput').val();
        $('#ResetMsg').text('')
        firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
            $("#ResetMsg").css("color", 'green')
            $('#ResetMsg').text("Check out your Email.")

        }).catch(function (error) {
            $("#ResetMsg").css("color", 'brown')
            $('#ResetMsg').text(error.message)
            return
        });
    })
})