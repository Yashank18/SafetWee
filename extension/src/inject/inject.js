// const vader = require('vader-sentiment')

chrome.extension.sendMessage({}, function (response) {
	document.addEventListener('scroll', function(e) {
		var num = 101;
		document.querySelectorAll("article>div>div>div>div>div>div>div>div").forEach((ele) => {
			if(ele.childNodes[0].nodeName === "SPAN"){
				ele.querySelectorAll("span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0").forEach((r) => {
					r.className = num;
			})};
			num += 1;
		});
		for(var i = 101; i < num; i += 1) {
			var tweet = "";
			var abhinav = document.getElementsByClassName(i);
			for (var j = 0; j < abhinav.length; j++) {
				tweet += abhinav[j]?.innerText;
			}
			if(tweet.length !== 0) {
				// const input = tweet;
				// const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
				for (var j = 0; j < abhinav.length; j++) {
					abhinav[j].style.color="blue";
				}
			}
		}
	});

	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			console.clear();
			console.log("Hello there from SafetWee! 🥳");
			// ----------------------------------------------------------
		}
	}, 10);
});
