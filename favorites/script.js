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
            $('#favoritesTable').show()
        }
        else {
            location.href = '../homepage/homepage.html'
        }
        // User is signed out.
        // ...


    })

    function updateFavorites() {

        favoriteKeys = []
        favoritesArray = []
        var findex = 0
        favoritesDatabaseRef.once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                $('#favoritesBody').append(

                    '<tr><td><img src="' + childSnapshot.val()['urlToImage'] + '" alt=""' +
                    'style="height: 80px;width: 80px; border-radius: 60%"></td><td><h6>' + childSnapshot.val()['title'] + '</h6> </td> <td><a   href="' + childSnapshot.val()['url']
                    + '">Read more...</a></td>' +
                    '<td> <a href=""><img id="favorite-' + findex + '"src="https://cdn1.iconfinder.com/data/icons/warnings-and-dangers/400/Warning-05-512.png" alt="" style="height: 48px;width: 48px;"></a></td></tr>')

                favoriteKeys[findex] = childSnapshot.key
                favoritesArray[findex++] = childSnapshot.val()['url']



            })
        })
    }

})