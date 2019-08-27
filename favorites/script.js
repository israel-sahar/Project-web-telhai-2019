$(document).ready(function () {
    var favoritesDatabaseRef
    var favoritesArray = []
    var favoriteKeys = []
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
            $("#name").html("Hello," + "<b>" + displayName + "</b>")
            $("#img").attr('src', photoURL)
            $("#USER-CONNECTED-DIV").show()
            databaseRef = firebase.database().ref().child('users/' + user.uid);
            favoritesDatabaseRef = firebase.database().ref().child('favorites/' + user.uid);
            updateFavorites()

        }
        else {
            location.href = '../homepage/homepage.html'
        }
        // User is signed out.
        // ...


    })

    $(".removeClick").click(function () {
        console.log("ss")
        path = $(this)[0].id.replace('-favorite', '')
        console.log(path)

        deleteChild = favoritesDatabaseRef.child('/' + favoriteKeys[path])
        deleteChild.remove().then(function () {
            updateFavorites()
            $("#" + path + "-row").remove()
        })
            .catch(function (error) { });
    })
    function updateFavorites() {

        favoriteKeys = []
        favoritesArray = []
        var findex = 0
        favoritesDatabaseRef.once('value').then(function (snapshot) {
            if (snapshot.val() == null) {
                $('#favoritesTable').hide()
                $('#EmptyMsg').show()
                console.log("once")
            }
            else {
                snapshot.forEach(function (childSnapshot) {

                    $('#favoritesBody').append(

                        '<tr id="' + findex + '-row"><td><img src="' + childSnapshot.val()['urlToImage'] + '" alt=""' +
                        'style="height: 80px;width: 80px; border-radius: 60%"></td><td><h6>' + childSnapshot.val()['title'] + '</h6> </td> <td><a   href="' + childSnapshot.val()['url']
                        + '">Read more...</a></td>' +
                        '<td><a class="removeClick" id="' +
                        findex +
                        '-favorite" href="#"><img src="https://cdn1.iconfinder.com/data/icons/warnings-and-dangers/400/Warning-05-512.png" alt="" style="height: 48px;width: 48px;"/></a></td></tr>')


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