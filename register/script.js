$(document).ready(function () {
    nicknamesRef = firebase.database().ref().child('nicknames')


    $("#NickNameInput").change(function () {
        $("#NickNameInput").removeClass("border-danger")
        $("#NickNameInput").removeClass("border-success")
        $('#taken').html("")
        var flag = 0
        tempNick = $("#NickNameInput").val()

        nicknamesRef.once('value').then(function (snapshot) {
            if (snapshot.val() != null) {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val() == tempNick) {
                        $("#NickNameInput").addClass("border-danger")
                        $('#taken').html("<b>taken</b>")
                    }
                })
            }
        }).then(function () {
            if (flag == 0) $("#NickNameInput").addClass("border-success")

        });
    })

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
            if ($('#taken').text() != "") {
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
            node.set($('#NickNameInput').val());

            usersRef = firebase.database().ref().child('users/' + user.uid)
            var pushuser = usersRef.push();
            node.set({
                FirstName: $('#firstNameInput').val(),
                familyName: $('#familyNameInput').val(),
                nickName: $('#NickNameInput').val(),
                Gender: $('input[sex]:checked').val(),
                BirthDay: $('#BirthInput').val()
            });

            user.updateProfile({
                displayName: $('#NickNameInput').val()

            }).then(function () {
                var storageRef = firebase.storage().ref();
                var name = storageRef.child("userimages/" + new Date().getTime() + ".jpg");

                name.put($('#inputFile').prop('files')[0]).then(function (snap) {

                    name.getDownloadURL().then(function (url) {
                        console.log(url)
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
            $('#SignUpMsg').text(error.errorMsg)
        });


    })

    $("#inputFile").change(function (e) {

        $(".custom-file-label").text($('#inputFile').prop('files')[0].name.slice(0, 25))
    });
})