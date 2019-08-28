$(document).ready(function ($) {
	var favoritesDatabaseRef
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
			databaseRef.once('value').then(function (snapshot) {
				var country = countries.get(snapshot.val()['Country'])
				localStorage.removeItem('country')
				localStorage.setItem('country', snapshot.val()['Country'])
				fillPosts(country)
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
		favoritesArray = []
		var findex = 0
		favoritesDatabaseRef.once('value').then(function (snapshot) {
			snapshot.forEach(function (childSnapshot) {
				favoriteKeys[findex] = childSnapshot.key
				favoritesArray[findex++] = childSnapshot.val()['url']
			})
		})
	}
	/*fill all the fields with new articles from server and update the arrays */
	/*fill the post according to the country we get as peremater*/

	function fillPosts(country) {
		var cat_i
		for (cat_i = 0; cat_i < Categories.length; cat_i++) {
			urlFrom = "https://newsapi.org/v2/top-headlines?country=" + country + "&category=" + Categories[cat_i] + "&apiKey=32733c433b974e5e87be80d889932a64"
			$.ajax({
				url: urlFrom,
				type: "GET",
				async: false,
				success: function (data) {
					for (j = 1; j <= 3; j++) {
						if (data.articles[j].url != null && favoritesArray.indexOf(data.articles[j].url) != -1) {
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
					$("#allArticles").show()

				},
				error: function (err) {
					console.error();
				}
			});
		}
	}

	/*respones to add/remove btn.the function add or remove the article from the server and change to photo of the button*/
	$(".favoriteClick").click(function () {

		path = $(this)[0].id.replace('-share', '')
		index__ = favoritesArray.indexOf($("#" + path + "-header").attr('href'))
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
