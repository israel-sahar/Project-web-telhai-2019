$(document).ready(function(){
    var currentCategory = localStorage.getItem("category");
    var currentCountry = localStorage.getItem("country");
    currentCountry = "il";
    currentCategory = "technology";
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
  			$("#name").html("Hello," + "<b>" + displayName + "</b>")
  			$("#img").attr('src', photoURL)
  			$("#USER-CONNECTED-DIV").show()
  			databaseRef = firebase.database().ref().child('users/' + user.uid);
  			favoritesDatabaseRef = firebase.database().ref().child('favorites/' + user.uid);


  			databaseRef.once('value').then(function (snapshot) {
  				updateFavorites()
  				//var country = countries.get(snapshot.val()['Country'])
  				//localStorage.removeItem('country')
  				//localStorage.setItem('country', snapshot.val()['Country'])
  				//fillPosts(country)
  			})


  		}
  		else {
  			$(".favoriteClick").hide()
  			fillPosts("il")
  			localStorage.removeItem('country')
  			localStorage.setItem('country', 'il')
  			$("#LoginRegDiv").show()
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
  		})
  	}
    var urlFrom = "https://newsapi.org/v2/top-headlines?country=" + currentCountry + "&category=" + currentCategory + "&apiKey=32733c433b974e5e87be80d889932a64"
      $.ajax({
        url: urlFrom,
        type: "GET",
        async: false,
        success: function (data) {
          console.log(data);
          var numberOfArticels = data.articles.length;
          indx = 1;
          var card = '<div class="col-sm-4" ><div class="wrapper"  id="c'+indx+'"><div class="card radius shadowDepth1"><div class="card__image border-tlr-radius"><img alt="image" class="border-tlr-radius cards_img" id="c-'+indx+'-img"></div><div class="card__content card__padding"><div class="card__share"><a id="c-'+
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
                console.log(indx);
              }
              html+='<div class="col-sm-4" ><div class="wrapper"  id="c'+indx+'"><div class="card radius shadowDepth1"><div class="card__image border-tlr-radius"><img alt="image" class="border-tlr-radius cards_img" id="c-'+indx+'-img"></div><div class="card__content card__padding"><div class="card__share"><a id="c-'+
              indx+'-share" class="favoriteClick" href="#"><img id="c-'+indx
              +'-plus"src="https://freeiconshop.com/wp-content/uploads/edd/plus-flat.png" alt=""style="height: 48px;width: 48px;"></a></div><div class="card__meta"><a href="#"></a><time id="c-'+indx
              +'-date"></time></div><article class="card__article"><h2><a href="#" id="c-'+indx
              +'-header"></a></h2><p id="c-'+indx+'-description">...</p></article></div><div class="card__action"><div class="card__author"><div class="card__author-content">By <a id="c-'+indx
              +'-author"></a></div></div></div></div></div></div>';

              indx++;
            }
            html+=rowEnding;

          }
          $("#Appending_item").append(html);

          for (k = 1; k < indx+1; k++) {
            //if (favoritesArray.indexOf(data.articles[k].url) != -1) {
              $("#c-" + k + "-plus").attr("src", "https://cdn1.iconfinder.com/data/icons/warnings-and-dangers/400/Warning-05-512.png")
          //  }
            if (data.articles[k].urlToImage == null) {
              $("#c-" + k + "-img").attr("src","../categories-photos/news.gif");
            }
            else
              $("#c-" + k + "-img").attr("src", data.articles[k].urlToImage);
            $("#c-" + k + "-date").text(data.articles[k].publishedAt.slice(0, 10));
            $("#c-" + k + "-header").text(data.articles[k].title);
            $("#c-" + k + "-header").attr('href', data.articles[k].url);
            if (data.articles[k].description == null) {
              $("#c-" + k + "-description").text("No Description.");
            }
            else
              $("#c-" + k + "-description").text(data.articles[k].description);
            if (data.articles[k].author == null) {
              $("#c-" + k + "-author").text("Anonymous");
            }
            else
              $("#c-" + k + "-author").text(data.articles[k].author);
          }

        },
        error: function (err) {
          console.error();
        }
      });

      /*respones to add/remove btn.the function add or remove the article from the server and change to photo of the button*/
    	$(".favoriteClick").click(function () {

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
    	})



})
