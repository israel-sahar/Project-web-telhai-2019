$(document).ready(function () {
    var favoritesDatabaseRef
    var favoritesArray = []
    var favoriteKeys = []
    var startPage = true
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
            $("#USER-CONNECTED-DIV").hide()
            databaseRef = firebase.database().ref().child('users/' + user.uid);
            favoritesDatabaseRef = firebase.database().ref().child('favorites/' + user.uid);
            updateFavorites()

            databaseRef.once('value').then(function (snapshot) {
                $("#name").html("Hello," + "<b>" + snapshot.val()['nickName'] + "</b>")
                $("#img").attr('src', snapshot.val()['photoURL'])
                $("#USER-CONNECTED-DIV").show()
                localStorage.removeItem('country')
                localStorage.setItem('country', countries.get(snapshot.val()['Country']))
            })

        }
        else {
            location.href = '../homepage/homepage.html'
        }
        // User is signed out.
        // ...


    })

    /*function to delete favorite when click the remove button*/
    $("#favoritesBody").on("click", ".removeClick", function () {
        path = $(this)[0].id.replace('-favorite', '')
        deleteChild = favoritesDatabaseRef.child('/' + favoriteKeys[path])
        deleteChild.remove().then(function () {
            updateFavorites()
            $("#" + path + "-row").remove()
        })
            .catch(function (error) { });
    });

    /*fill/update the favoritesArray and favoriteKeys .update the table in the page*/
    function updateFavorites() {
        $('#favoritesTable').hide()
        $('#favoritesTable tr').remove()
        favoriteKeys = []
        favoritesArray = []
        var findex = 0
        favoritesDatabaseRef.once('value').then(function (snapshot) {
            if (snapshot.val() == null) {
                $('#EmptyMsg').show()
            }
            else {
                snapshot.forEach(function (childSnapshot) {

                    $('#favoritesBody').html($('#favoritesBody').html() +

                        '<tr id="' + findex + '-row"><td><img src="' + childSnapshot.val()['urlToImage'] + '" alt=""' +
                        'style="height: 80px;width: 80px; border-radius: 60%"></td><td><h6>' + childSnapshot.val()['title'] + '</h6> </td> <td><a   href="' + childSnapshot.val()['url']
                        + '">Read more...</a></td>' +
                        '<td><button type="submit" class=" btn btn-link removeClick" id="' + findex + '-favorite"><img src="https://cdn1.iconfinder.com/data/icons/warnings-and-dangers/400/Warning-05-512.png" alt="" style="height: 48px;width: 48px;"/></button></td></tr>')




                    favoriteKeys[findex] = childSnapshot.key
                    favoritesArray[findex++] = childSnapshot.val()['url']
                    if (findex + 1 == snapshot.val().__proto__.constructor.assign.length) {
                        $('#favoritesTable').show()
                    }
                })


            }
        })


    }

})
