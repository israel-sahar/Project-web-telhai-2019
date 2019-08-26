$(document).ready(function ($) {
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
			databaseRef.once('value').then(function (snapshot) {
				var country = countries.get(snapshot.val()['Country'])
				fillPosts(country)
			})
		}
		else {
			fillPosts("il")
			$("#LoginRegDiv").show()
		}
		// User is signed out.
		// ...


	})
	function fillPosts(country) {
		var cat_i
		for (cat_i = 0; cat_i < Categories.length; cat_i++) {
			urlFrom = "https://newsapi.org/v2/top-headlines?country=" + country + "&category=" + Categories[cat_i] + "&apiKey=a2dadad25d07481ca59b5037b5b63c9d"
			$.ajax({
				url: urlFrom,
				type: "GET",
				async: false,
				success: function (data) {

					for (j = 1; j <= 3; j++) {
						console.log(data.articles[j])
						console.log(data.articles[j].urlToImage)
						$("#" + Categories[cat_i] + "-" + j + "-img").attr("src", data.articles[j].urlToImage);
						console.log(data.articles[j].publishedAt.slice(0, 10))
						$("#" + Categories[cat_i] + "-" + j + "-date").text(data.articles[j].publishedAt.slice(0, 10));
						console.log(data.articles[j].title)
						$("#" + Categories[cat_i] + "-" + j + "-header").text(data.articles[j].title);
						console.log(data.articles[j].description)
						$("#" + Categories[cat_i] + "-" + j + "-description").text(data.articles[j].description);
						console.log(data.articles[j].author)
						$("#" + Categories[cat_i] + "-" + j + "-author").text(data.articles[j].author);
					}
					console.log("**************")
				},
				error: function (err) {
					console.error();
				}
			});
		}
	}
})

