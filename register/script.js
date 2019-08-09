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

        //TODO - check birthday


        /*check photo*/
        if ($('#inputFile').prop('files').length == 0 || (!$('#inputFile').prop('files')[0].name.includes("jpg") && !$('#inputFile').prop('files')[0].name.includes("jpeg"))) {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please Choose picture end with JPG.<br>")
        }
        if (errors != 0) return;

        /*add user to database*/
        firebase.auth().createUserWithEmailAndPassword($('#emailSignUpInput').val(), $('#passwordSignUpInput').val()).then(function (params) {
            var user = firebase.auth().currentUser;
            var pushnickname = nicknamesRef.push();
            pushnickname.set($('#NickNameInput').val());
            usersRef = databaseRef.child('users/' + user.uid)
            var pushuser = usersRef.push();
            pushuser.set({
                FirstName: $('#firstNameInput').val(),
                familyName: $('#familyNameInput').val(),
                nickName: $('#NickNameInput').val(),
                Gender: $('input:radio[name=sex]:checked').val(),
                BirthDay: $('#BirthInput').val(),
                favorites: "null"
            });


            user.updateProfile({
                displayName: $('#NickNameInput').val()

            }).then(function () {

                var storageRef = firebase.storage().ref();

                var name = storageRef.child("userimages/" + user.uid + ".jpg");

                name.put($('#inputFile').prop('files')[0]).then(function (snap) {

                    name.getDownloadURL().then(function (url) {
                        var user = firebase.auth().currentUser;
                        user.updateProfile({
                            photoURL: url
                        }).then(function () {

                            //TODO:after sign up
                        }).catch(function (error) {

                            // An error happened.
                        });


                    }).catch(function (err) { console.log(err); });

                }).catch(function (err) { console.log(err); });
            }).catch(function (error) {
                // An error happened.
            });

        }).catch(function (error) {
            $('#SignUpMsg').text(error)
        });


    })


    $("#inputFile").change(function (e) {
        $(".custom-file-label").text($('#inputFile').prop('files')[0].name.slice(0, 25))
    });
})