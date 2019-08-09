$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // User is logged in

            $("#LoginRegDiv").hide()
            $("#name").html("Hello," + "<b>" + displayName + "</b>")
            $("#img").attr('src', photoURL)
            $("#diivvvvv").show()
        } else {
            // User is signed out.
            // ...
        }
    });

    $("#loginBtn").click(function () {

        $("#LoginNav").slideToggle("slow")
    })
})