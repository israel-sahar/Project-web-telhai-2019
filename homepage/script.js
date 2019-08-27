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
	$('.card__share > a').on('click', function (e) {
		e.preventDefault() // prevent default action - hash doesn't appear in url
		$(this).parent().find('div').toggleClass('card__social--active');
		$(this).toggleClass('share-expanded');
	});

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
				fillPosts(country)
			})


		}
		else {
			$(".favoriteClick").hide()
			fillPosts("il")
			$("#LoginRegDiv").show()
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
				favoriteKeys[findex] = childSnapshot.key
				favoritesArray[findex++] = childSnapshot.val()['url']
			})
		})
	}
	function fillPosts(country) {
		var cat_i
		for (cat_i = 0; cat_i < Categories.length; cat_i++) {
			urlFrom = "https://newsapi.org/v2/top-headlines?country=" + country + "&category=" + Categories[cat_i] + "&apiKey=32733c433b974e5e87be80d889932a64"
			$.ajax({
				url: urlFrom,
				type: "GET",
				async: false,
				success: function (data) {
					console.log(data);


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
		}
	}

	$(".favoriteClick").click(function () {

		path = $(this)[0].id.replace('-share', '')
		index__ = favoritesArray.indexOf($("#" + path + "-header").attr('href'))
		console.log(index__)
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
			alert("Done!")
		})
	})
})
