$(document).ready(function () {
    databaseRef = firebase.database().ref()


    $("#NickNameInput").change(function () {

        isValidnickname($("#NickNameInput").val())

    })

    function isValidnickname(nickname) {
        $("#NickNameInput").removeClass("border-danger")
        $("#NickNameInput").removeClass("border-success")
        $('#taken').html("")
        var flag = 0
        nicknamesRef = databaseRef.child('nicknames')
        nicknamesRef.once('value').then(function (snapshot) {
            if (snapshot.val() != null) {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val() == nickname) {
                        $("#NickNameInput").addClass("border-danger")
                        $('#taken').html("<b>taken</b>")
                        flag = 1
                    }
                })
            }
        }).then(function () {
            if (flag == 0) {
                $("#NickNameInput").addClass("border-success")

            }

        });
        return !flag
    }
    $('#SignUpButton').click(function () {
        var errors = 0
        $('#SignUpMsg').text('')

        /*check first name*/
        if ($('#firstNameInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please fill your first name." + "<br>")
        }

        /*check family name*/
        if ($('#familyNameInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please fill your family name.<br>")
        }

        /*check email*/
        if ($('#emailSignUpInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please fill your Email.<br>")
        }

        /*check password*/
        if ($('#passwordSignUpInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please fill your password.<br>")
        }

        /*check nickname*/
        if ($('#NickNameInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please choose a nickname.<br>")
        }
        else {
            /*check if nickname taken*/
            if (!isValidnickname($("#NickNameInput").val())) {
                if (errors == 0) {
                    $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                    errors++
                }
                $('#SignUpMsg').html($('#SignUpMsg').html() + "- Nickname token.choose new one.<br>")
            }
        }

        /*check birthday*/
        if ($('#BirthInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please choose a BirthDay.<br>")
        }
        else {
            var now = new Date()
            var birthDay = new Date($('#BirthInput').val())
            if (birthDay > now) {
                if (errors == 0) {
                    $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                    errors++
                }
                $('#SignUpMsg').html($('#SignUpMsg').html() + "- Choose valid birthday.<br>")
            }
        }

        //TODO - check birthday
        if (errors != 0) return;

        /*add user to database*/
        firebase.auth().createUserWithEmailAndPassword($('#emailSignUpInput').val(), $('#passwordSignUpInput').val()).then(function (params) {
            var user = firebase.auth().currentUser;
            var pushnickname = nicknamesRef.push();
            pushnickname.set($('#NickNameInput').val());
            usersRef = databaseRef.child('users/' + user.uid)
            usersRef.set({
                FirstName: $('#firstNameInput').val(),
                familyName: $('#familyNameInput').val(),
                nickName: $('#NickNameInput').val(),
                Gender: $('input:radio[name=sex]:checked').val(),
                BirthDay: $('#BirthInput').val(),
                Country: $("#countrySelect").val(),
                favorites: "null"
            });


            user.updateProfile({
                displayName: $('#NickNameInput').val(),
                photoURL: "https://api.adorable.io/avatars/50/" + user.email + ".io.png"

            }).then(function () {
                /*TODO*/
            }).catch(function (error) {
                // An error happened.
            });

        }).catch(function (error) {
            $('#SignUpMsg').text(error)
        });


    })
})