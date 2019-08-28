$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            location.href = '../homepage/homepage.html'
        }
        else {
            $("#LoginRegDiv").show()
            $("#forgot-password-container").show()
        }
        // User is signed out.
        // ...


    })


    /*send request to reset password */
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