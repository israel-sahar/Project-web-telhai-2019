$(document).ready(function () {
    var CurrentPage = document.URL.match(/.*\/(.*)$/)[1]
    firebase.auth().onAuthStateChanged(function (user) {
        if (CurrentPage == "profile.html" || CurrentPage == "profile.html#") {
            return;
        }
        if (user) {
            console.log(user)
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // User is logged in
            if (CurrentPage == "register.html" || CurrentPage == "register.html#" || CurrentPage == "resetpassword.html" || CurrentPage == "resetpassword.html#") {
                location.href = '../homepage/homepage.html'
            }
            $("#USER-CONNECTED-DIV").hide()
            $("#name").html("Hello," + "<b>" + displayName + "</b>")
            $("#img").attr('src', photoURL)
            $("#USER-CONNECTED-DIV").show()
        }
        else {
            $("#LoginRegDiv").show()
        }
        // User is signed out.
        // ...


    })



    $(".groupClick").click(function () {
        $('#emailInput').removeClass('border-danger')
        $('#passwordInput').removeClass('border-danger')
    })
    $("#log").click(function () {
        $('#emailInput').removeClass('border-danger')
        $('#passwordInput').removeClass('border-danger')
        firebase.auth().signInWithEmailAndPassword($('#emailInput').val(), $('#passwordInput').val()).then(function () {
            location.href = '../homepage/homepage.html'

        }).catch(function (error) {
            if (error.code == 'auth/invalid-email') {
                $('#emailInput').addClass('border-danger')
            }
            if (error.code == 'auth/wrong-password') {
                $('#passwordInput').addClass('border-danger')
            }
            return
        });
    })

    $("#loginBtn").click(function () {

        $("#LoginNav").slideToggle("slow")
    })

    $("#SignOutBtn").click(function () {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            location.href = '../homepage/homepage.html'
        }, function (error) {
            // An error happened.
        });
    })
})