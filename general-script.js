$(document).ready(function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    $('#cntGoogle').click(function () {
        firebase.auth().signInWithPopup(provider).then(function (result) {
            console.log(result)
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function (error) {
            console.log(error)

            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    })
    var CurrentPage = document.URL.match(/.*\/(.*)$/)[1]
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
            if (CurrentPage == "register.html" || CurrentPage == "register.html#" || CurrentPage == "resetpassword.html" || CurrentPage == "resetpassword.html#") {
                location.href = '../homepage/homepage.html'
            }
            $("#USER-CONNECTED-DIV").hide()
            $("#name").html("Hello," + "<b>" + displayName + "</b>")
            $("#img").attr('src', photoURL)
            $("#USER-CONNECTED-DIV").show()
        }
        else
            // User is signed out.
            // ...
            $("#LoginRegDiv").show()

    })



    $(".groupClick").click(function () {
        $('#emailInput').removeClass('border-danger')
        $('#passwordInput').removeClass('border-danger')
    })
    $("#log").click(function () {
        $('#emailInput').removeClass('border-danger')
        $('#passwordInput').removeClass('border-danger')
        firebase.auth().signInWithEmailAndPassword($('#emailInput').val(), $('#passwordInput').val()).catch(function (error) {
            console.log(error)
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