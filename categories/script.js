$(document).ready(function(){
    var Categorie = localStorage.getItem("currentCategory");
    var country = localStorage.getItem("currentCountry");

    var urlFrom = "https://newsapi.org/v2/top-headlines?country=" + country + "&category=" + Categorie + "&apiKey=32733c433b974e5e87be80d889932a64"
      $.ajax({
        url: urlFrom,
        type: "GET",
        async: false,
        success: function (data) {
          console.log(data);
          var numberOfArticels = data.articles.length();

          for (j = 1; j <= 3; j++) {
            if (favoritesArray.indexOf(data.articles[j].url) != -1) {
              $("#" + Categories[cat_i] + "-" + j + "-plus").attr("src", "https://cdn1.iconfinder.com/data/icons/warnings-and-dangers/400/Warning-05-512.png")
            }
            if (data.articles[j].urlToImage == null) {
              $("#" + Categories[cat_i] + "-" + j + "-img").attr("src", CategoriesPhotos[cat_i]);
            }
            else
              $("#" + Categories[cat_i] + "-" + j + "-img").attr("src", data.articles[j].urlToImage);
            $("#" + Categories[cat_i] + "-" + j + "-date").text(data.articles[j].publishedAt.slice(0, 10));
            $("#" + Categories[cat_i] + "-" + j + "-header").text(data.articles[j].title);
            $("#" + Categories[cat_i] + "-" + j + "-header").attr('href', data.articles[j].url);
            if (data.articles[j].description == null) {
              $("#" + Categories[cat_i] + "-" + j + "-description").text("No Description.");
            }
            else
              $("#" + Categories[cat_i] + "-" + j + "-description").text(data.articles[j].description);
            if (data.articles[j].author == null) {
              $("#" + Categories[cat_i] + "-" + j + "-author").text("Anonymous");
            }
            else
              $("#" + Categories[cat_i] + "-" + j + "-author").text(data.articles[j].author);
          }

        },
        error: function (err) {
          console.error();
        }
      });




})
