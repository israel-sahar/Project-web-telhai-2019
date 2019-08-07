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

        if ($('#inputFile').prop('files').length == 0 || (!$('#inputFile').prop('files')[0].name.includes("jpg") && !$('#inputFile').prop('files')[0].name.includes("jpeg"))) {
            if (errors == 0) {
                $('#SignUpMsg').html("Fail to Sign Up.Reasons:" + "<br>")
                errors++
            }
            $('#SignUpMsg').html($('#SignUpMsg').html() + "- Please Choose picture end with JPG.<br>")
        }
        if (errors == 0) {
            firebase.auth().createUserWithEmailAndPassword($('#emailSignUpInput').val(), $('#passwordSignUpInput').val()).then(function (params) {
                $('#SignUpDiv').slideToggle()
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: $('#firstNameInput').val() + " " + $('#familyNameInput').val()
                }).then(function () {
                    $('#shalomMsg').html("<b>" + user.displayName + "</b>" + "  ,שלום")
                    $('#LogInDiv').hide()
                    $('#chooseSection').hide()
                    $('#choosePic').show()
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