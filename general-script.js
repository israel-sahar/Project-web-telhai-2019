var countries = new Map([
    ["Israel", "il"],
    ["Argentina", "ar"],
    ["India", "in"],
    ["Australia", "au"],
    ["Ireland", "ie"],
    ["Austria", "at"],
    ["Romania", "ro"],
    ["Turkey", "tr"],
    ["Russia", "ru"],
    ["UAE", "ae"],
    ["Saudi Arabia", "sa"],
    ["Ukraine", "ua"]
])

var Categories = ["entertainment", "health", "science", "sports", "technology", "business"]
var CategoriesPhotos = ["../categories-photos/entertainment.jpeg", "../categories-photos/health.jpg",
    "../categories-photos/science.jpg",
    "../categories-photos/sports.jpg",
    "../categories-photos/technology.jpg",
    "../categories-photos/business.jpg"
]

$(document).ready(function () {
    var userID = null
    firebase.auth().onAuthStateChanged(function (user) {
        if (user)

            userID = user.uid;

    })

    var CurrentPage = document.URL.match(/.*\/(.*)$/)[1]
    $(".groupClick").click(function () {
        $('#emailInput').removeClass('border-danger')
        $('#passwordInput').removeClass('border-danger')
    })
    $("#log").click(function () {
        $('#emailInput').removeClass('border-danger')
        $('#passwordInput').removeClass('border-danger')
        firebase.auth().signInWithEmailAndPassword($('#emailInput').val(), $('#passwordInput').val()).then(function () {
            location.href = '../homepage/homepage.html'

        }).catch(function (error) {
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

    $('.Topnavs').click(function () {
        if ($(this)[0].id.indexOf("ref-country-") == -1) {
            //user choose category
            category = $(this)[0].id.replace('ref-', '')
            localStorage.removeItem('category')
            localStorage.setItem('category', category)
            if (userID != null) {
                databaseRef = firebase.database().ref().child('users/' + userID);
                databaseRef.once('value').then(function (snapshot) {
                    localStorage.removeItem('country')
                    localStorage.setItem('country', countries.get(snapshot.val()['Country']))
                })
            }
            else {
                localStorage.removeItem('country')
                localStorage.setItem('country', 'il')
            }

        }
        else {
            //user choose country
            countryCode = $(this)[0].id.replace('ref-country-', '')
            localStorage.removeItem('category')
            localStorage.setItem('category', 'Country')
            localStorage.removeItem('country')
            localStorage.setItem('country', countryCode)
        }


        location.href = '../categories/categories.html'

    })
})