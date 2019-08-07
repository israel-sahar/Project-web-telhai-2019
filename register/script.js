$(document).ready(function () {

    $('#SignUpButton').click(function () {
        var errors = 0
        $('#SignUpMsg').text('')
        if ($('#firstNameInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please fill your first name." + "<br>")
        }
        if ($('#familyNameInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please fill your family name.<br>")
        }

        if ($('#emailSignUpInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please fill your Email.<br>")
        }

        if ($('#passwordSignUpInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please fill your password.<br>")
        }

        if ($('#NickNameInput').val() == '') {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please choose a nickname.<br>")
        }
        /*TODO:check if nickname taken*/

        if ($('#inputFile').prop('files').length == 0 || (!$('#inputFile').prop('files')[0].name.includes("jpg") && !$('#inputFile').prop('files')[0].name.includes("jpeg"))) {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please Choose picture end with JPG.<br>")
        }
        if (errors == 0) {
            firebase.auth().createUserWithEmailAndPassword($('#emailSignUpInput').val(), $('#passwordSignUpInput').val()).then(function (params) {
                var user = firebase.auth().currentUser;
                console.log(user)
                user.updateProfile({
                    displayName: $('#NickNameInput').val()

                }).then(function () {
                    var storageRef = firebase.storage().ref();
                    var name = storageRef.child("userimages/" + new Date().getTime() + ".jpg");

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
                var errorCode = error.code
                var errorMsg = error.message
                $('#SignUpMsg').text("ההרשמה נכשלה, אנא נסה שנית")
            });
        }


    })

    $("#inputFile").change(function (e) {

        $(".custom-file-label").text($('#inputFile').prop('files')[0].name.slice(0, 25))
    });

})