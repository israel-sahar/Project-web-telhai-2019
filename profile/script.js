$(document).ready(function () {
    var databaseRef
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            //login div
            $("#USER-CONNECTED-DIV").hide()
            $("#name").html("Hello," + "<b>" + displayName + "</b>")
            $("#img").attr('src', photoURL)
            $("#USER-CONNECTED-DIV").show()

            //page detalis
            $("#h1-info").html("<b>" + displayName + "'s Profile..</b>")
            $("#img-info").attr('src', photoURL)
            $("#email-info").html("<b>Email:</b>" + user.email)
            databaseRef = firebase.database().ref().child('users/' + user.uid);
            databaseRef.on('value', function (snapshot) {
                $("#first-info").text(snapshot.val()['FirstName'])
                $("#family-info").text(snapshot.val()['familyName'])
                $("#birthday-info").text(snapshot.val()['BirthDay'])
                $("#country-info").text(snapshot.val()['Country'])
                $("#Gender-info").text(snapshot.val()['Gender'])
                $("#data-div").show()
            })
        }
        else {
            $("#MsgProfileErr").show();
        }
        // User is signed out.
        // ..
    })
    $("#first-info-update-btn").click(function () {
        $("#first-change-input").val('')
        $("#first-change-input").attr('placeholder', $("#first-info").text())
        $('.first-group').toggle()
    })

    $("#family-info-update-btn").click(function () {
        $("#family-change-input").val('')
        $("#family-change-input").attr('placeholder', $("#family-info").text())
        $('.family-group').toggle()
    })

    $("#birthday-info-update-btn").click(function () {
        $("#birthday-change-input").val('')
        $("#birthday-change-input").attr('placeholder', $("#birthday-info").text())
        $('.birthday-group').toggle()
    })

    $("#country-info-update-btn").click(function () {
        $("select option").each(function () {
            if ($(this).text() == $('#country-info').text())
                $(this).attr("selected", "selected");
        });
        $('.country-group').toggle()
    })

    /*cencel buttons - start*/

    $("#country-cen-btn").click(function () {
        $('.country-group').toggle()

    })

    $("#birthday-cen-btn").click(function () {
        $('.birthday-group').toggle()

    })

    $("#family-cen-btn").click(function () {
        $('.family-group').toggle()

    })
    $("#first-cen-btn").click(function () {
        $('.first-group').toggle()

    })
    /*cencel buttons - end*/

    /*update buttons - start*/


    $("#family-change-btn").click(function () {
        if ($('#family-change-input').val() == 0) {
            alert("Please fill family name.")
            return;
        }
        databaseRef.update({ 'familyName': $('#family-change-input').val() }).then(function () {
            $('.family-group').toggle()
        })

    })

    $("#first-change-btn").click(function () {
        if ($('#first-change-input').val() == 0) {
            alert("Please fill first name.")
            return;
        }
        databaseRef.update({ 'FirstName': $('#first-change-input').val() }).then(function () {
            $('.first-group').toggle()
        })
    })

    $("#birthday-change-btn").click(function () {
        if ($('#birthday-change-input').val() == 0) {
            alert("Please fill birth day.")
            return;
        }
        var now = new Date()
        var birthDay = new Date($('#birthday-change-input').val())
        if (birthDay > now) {
            alert("Please fill a normal date.")
            return;
        }
        databaseRef.update({ 'BirthDay': $('#birthday-change-input').val() }).then(function () {
            $('.birthday-group').toggle()
        })
    })

    $("#country-change-btn").click(function () {
        databaseRef.update({ 'Country': $("#country-change-input").val() }).then(function () {
            $('.country-group').toggle()
        })
    })
    /*update buttons - end*/
})