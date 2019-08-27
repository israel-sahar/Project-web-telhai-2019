$(document).ready(function(){
    var currentCategory = localStorage.getItem("category");
    var currentCountry = localStorage.getItem("country");
    currentCountry = "il";
    currentCategory = "science";
    var indx;

    var urlFrom = "https://newsapi.org/v2/top-headlines?country=" + currentCountry + "&category=" + currentCategory + "&apiKey=32733c433b974e5e87be80d889932a64"
      $.ajax({
        url: urlFrom,
        type: "GET",
        async: false,
        success: function (data) {
          console.log(data);
          var numberOfArticels = data.articles.length;
          indx = 1;
          var card = '<div class="col-sm-4" ><div class="wrapper"  id="c'+indx+'"><div class="card radius shadowDepth1"><div class="card__image border-tlr-radius"><img alt="image" class="border-tlr-radius cards_img" id="c-'+i+'-img"></div><div class="card__content card__padding"><div class="card__share"><a id="c-'+
          indx+'-share" class="favoriteClick" href="#"><img id="c-'+indx
          +'-plus"src="https://freeiconshop.com/wp-content/uploads/edd/plus-flat.png" alt=""style="height: 48px;width: 48px;"></a></div><div class="card__meta"><a href="#"></a><time id="c-'+indx
          +'-date"></time></div><article class="card__article"><h2><a href="#" id="c-'+indx
          +'-header"></a></h2><p id="c-'+indx+'-description">...</p></article></div><div class="card__action"><div class="card__author"><div class="card__author-content">By <a href="#" id="c-'+indx
          +'-author"></a></div></div></div></div></div></div>' ;
          var rowStarting = '<div class="row">';
          var rowEnding = '</div>';
          var articlesCounter;
          var html = "";

          var numOfRowsWeNeed = numberOfArticels/3;
          numOfRowsWeNeed = Math.ceil(numOfRowsWeNeed);
          console.log(numOfRowsWeNeed);
          for (var i = 0; i < numOfRowsWeNeed ; i++) {
              console.log("im here!");
            html+=rowStarting;
            for (var j = 0; j < 3 ; j++) {
              if (indx > numberOfArticels) {
                break;
              }
              html+='<div class="col-sm-4" ><div class="wrapper"  id="c'+indx+'"><div class="card radius shadowDepth1"><div class="card__image border-tlr-radius"><img alt="image" class="border-tlr-radius cards_img" id="c-'+i+'-img"></div><div class="card__content card__padding"><div class="card__share"><a id="c-'+
              indx+'-share" class="favoriteClick" href="#"><img id="c-'+indx
              +'-plus"src="https://freeiconshop.com/wp-content/uploads/edd/plus-flat.png" alt=""style="height: 48px;width: 48px;"></a></div><div class="card__meta"><a href="#"></a><time id="c-'+indx
              +'-date"></time></div><article class="card__article"><h2><a href="#" id="c-'+indx
              +'-header"></a></h2><p id="c-'+indx+'-description">...</p></article></div><div class="card__action"><div class="card__author"><div class="card__author-content">By <a href="#" id="c-'+indx
              +'-author"></a></div></div></div></div></div></div>';

              indx++;
            }
            html+=rowEnding;

          }
          $("#Appending_item").append(html);

        /*  for (j = 1; j <= 3; j++) {
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
          }*/

        },
        error: function (err) {
          console.error();
        }
      });




})
