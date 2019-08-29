$(document).ready(function () {
  var currentCategory = localStorage.getItem("category");
  var currentCountry = localStorage.getItem("country");
  console.log(currentCategory);
  console.log(currentCountry);
  var favoritesDatabaseRef
  var indx;
  var favoritesArray__ = []
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

      databaseRef = firebase.database().ref().child('users/' + user.uid);
      favoritesDatabaseRef = firebase.database().ref().child('favorites/' + user.uid);

      databaseRef.once('value').then(function (snapshot) {
        $("#name").html("Hello," + "<b>" + snapshot.val()['nickName'] + "</b>")
        $("#img").attr('src', snapshot.val()['photoURL'])
        $("#USER-CONNECTED-DIV").show()
        updateFavorites()
      })
    }
    else {
      $(".favoriteClick").hide()
      $("#LoginRegDiv").show()
      fillPage()
    }
    // User is signed out.
    // ...


  })

  /*update the favorites arrays*/
  function updateFavorites() {
    favoriteKeys = []
    favoritesArray__ = []
    var findex = 0
    favoritesDatabaseRef.once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        favoriteKeys[findex] = childSnapshot.key
        favoritesArray__[findex++] = childSnapshot.val()['url']
      })
      fillPage()

    })
  }

  function fillPage() {
    var urlFrom = "https://newsapi.org/v2/"
    if (currentCategory == "Country") {
      urlFrom = urlFrom + "top-headlines?country=" + currentCountry
    }
    else {
      urlFrom = urlFrom + "top-headlines?country=" + currentCountry + "&category=" + currentCategory
    }

    urlFrom = urlFrom + "&apiKey=a2dadad25d07481ca59b5037b5b63c9d"

    /*url is ready to use*/
    $.ajax({
      url: urlFrom,
      type: "GET",
      async: false,
      success: function (data) {
        var numberOfArticels = data.articles.length;
        indx = 0;

        var rowStarting = '<div class="row">';
        var rowEnding = '</div>';
        var articlesCounter;
        var html = "";

        var numOfRowsWeNeed = numberOfArticels / 3;
        numOfRowsWeNeed = Math.ceil(numOfRowsWeNeed);
        for (var i = 0; i < numOfRowsWeNeed; i++) {
          html += rowStarting;
          for (var j = 0; j < 3; j++) {
            if (indx + 1 == numberOfArticels) {
              break;
            }
            html += '<div class="col-sm-4" id="a-' + indx + '"><div class="wrapper">' +
              '<div class="card radius shadowDepth1">' +
              '<div class="card__image border-tlr-radius">' +
              '<img alt="image" class="border-tlr-radius cards_img" id="a-' + indx + '-img">' +
              '</div>' +
              '<div class="card__content card__padding">' +
              '<div class="card__share">' +
              '<button type="submit" id="a-' + indx + '-share" class="btn btn-link favoriteClick">' +
              '<img id="a-' + indx + '-plus"' +
              'src="https://freeiconshop.com/wp-content/uploads/edd/plus-flat.png" alt=""' +
              'style="height: 48px;width: 48px;">' +
              '</button>' +
              '</div>' +
              '<div class="card__meta">' +
              '<a href="#"></a>' +
              '<time id="a-' + indx + '-date"></time>' +
              '</div>' +
              '<article class="card__article">' +
              '<h2><a target="_blank" href="#" id="a-' + indx + '-header"></a></h2>' +
              '<p id="a-' + indx + '-description">...</p>' +
              '</article>' +
              '</div>' +
              '<div class="card__action">' +
              '<div class="card__author">' +
              '<div class="card__author-content">' +
              'By <a href="#" id="a-' + indx + '-author"></a>' +
              '</div>' +
              '</div>' +
              '</div>' +
              ' </div>' +
              '</div>' +
              '</div>'
            indx++;
          }
          html += rowEnding;

        }
        $("#Appending_item").append(html);

        for (k = 0; k < indx; k++) {
          if (favoritesArray__.indexOf(data.articles[k].url) != -1) {
            $("#a-" + k + "-plus").attr("src", "https://cdn1.iconfinder.com/data/icons/warnings-and-dangers/400/Warning-05-512.png")
          }
          if (data.articles[k].urlToImage == null) {
            var purl
            if (currentCategory != "Country") {
              purl = CategoriesPhotos[Categories.indexOf(currentCategory)]
            }
            else {
              purl = "https://pbs.twimg.com/profile_images/1064243036899680256/jv8USylc.jpg"
            }
            $("#a-" + k + "-img").attr("src", purl);
          }
          else
            $("#a-" + k + "-img").attr("src", data.articles[k].urlToImage);
          $("#a-" + k + "-date").text(data.articles[k].publishedAt.slice(0, 10));
          $("#a-" + k + "-header").text(data.articles[k].title);
          $("#a-" + k + "-header").attr('href', data.articles[k].url);
          if (data.articles[k].description == null) {
            $("#a-" + k + "-description").text("No Description.");
          }
          else
            $("#a-" + k + "-description").text(data.articles[k].description);
          if (data.articles[k].author == null) {
            $("#a-" + k + "-author").text("Anonymous");
          }
          else
            $("#a-" + k + "-author").text(data.articles[k].author);
        }

      },
      error: function (err) {
        console.error();
      }
    });
  }
  /*respones to add/remove btn.the function add or remove the article from the server and change to photo of the button*/

  $("#Appending_item").on("click", ".favoriteClick", function () {
    path = $(this)[0].id.replace('-share', '')
    index__ = favoritesArray__.indexOf($("#" + path + "-header").attr('href'))
    if (index__ != -1) {
      deleteChild = favoritesDatabaseRef.child('/' + favoriteKeys[index__])
      deleteChild.remove()
        .then(function () {
          updateFavorites()
          $("#" + path + "-plus").attr("src", "https://freeiconshop.com/wp-content/uploads/edd/plus-flat.png")
        })
        .catch(function (error) {
        });
      return
    }
    /*not favorite*/
    node1 = favoritesDatabaseRef.push()
    node1.set({
      urlToImage: $("#" + path + "-img").attr("src"),
      title: $("#" + path + "-header").text(),
      url: $("#" + path + "-header").attr('href')
    }).then(function () {
      $("#" + path + "-plus").attr("src", "https://cdn1.iconfinder.com/data/icons/warnings-and-dangers/400/Warning-05-512.png")
      updateFavorites()
      alert("The article added to your favorites list.")
    })
  });



})
