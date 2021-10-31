var clickIt = () => {
	function getUsernames() {
		let usernames = [];
		document.querySelectorAll("span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0").forEach((ele) => {
			let usernameRegExp = ele.innerText.match("^@[a-zA-Z0-9_]{0,15}$");
			if (usernameRegExp) {
				let username = usernameRegExp[0].substring(1);
				usernames.includes(username) || usernames.push(username);
			}
		});
		return usernames;
	}
	chrome.tabs.executeScript(
		{
			code: "(" + getUsernames + ")();"
		},
		(usernames) => {
			function addDataToExtension(
				username,
				name,
				created_at,
				public_metrics,
				overall_rating,
				pos_count,
				neg_count,
				neu_count
			) {
				const monthNames = [
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December"
				];
				const dateObj = new Date(created_at);
				const month = monthNames[dateObj.getMonth()];
				const day = String(dateObj.getDate()).padStart(2, "0");
				const year = dateObj.getFullYear();
				const joinedTwitter = month + day + ", " + year;

				var bodyDiv = document.getElementById("mainPopup");
				while (bodyDiv.firstChild) {
					bodyDiv.removeChild(bodyDiv.firstChild);
				}
				var userName = document.createElement("h4");
				userName.innerText = "@" + username;
				userName.style.color = "grey";

				var Name = document.createElement("h4");
				Name.innerText = name;
				Name.style.color = "black";
				Name.style.paddingBottom = "0.5rem";
				Name.style.fontSize = "0.9rem";

				var joined = document.createElement("h5");
				joined.innerText = "Joined on: " + joinedTwitter;
				joined.style.color = "rgb(29, 155, 240)";
				joined.style.fontSize = "0.9rem";

				var Followers = document.createElement("h5");
				Followers.innerText = "Followers: " + public_metrics.followers_count;
				Followers.style.color = "rgb(29, 155, 240)";
				Followers.style.fontSize = "0.9rem";

				var Following = document.createElement("h5");
				Following.innerText = "Following: " + public_metrics.following_count;
				Following.style.color = "rgb(29, 155, 240)";
				Following.style.fontSize = "0.9rem";

				var Tweet_count = document.createElement("h5");
				Tweet_count.innerText = "Tweet count: " + public_metrics.tweet_count;
				Tweet_count.style.color = "rgb(29, 155, 240)";
				Tweet_count.style.marginBottom = "1rem";
				Tweet_count.style.fontSize = "0.9rem";

				var OverallRating = document.createElement("h5");
				OverallRating.innerText = "Overall Sentiment Score: " + overall_rating;
				OverallRating.style.color = "black";
				OverallRating.style.marginTop = "1rem";
				OverallRating.style.marginBottom = "0.5rem";

				var Positive = document.createElement("h4");
				Positive.innerText = "Positive: " + pos_count;
				Positive.className = "text-success";

				var p1 = document.createElement("div");
				p1.className = "progress";
				p1.style.marginTop = "0.5rem";
				var p2 = document.createElement("div");
				p2.className = "progress-bar progress-bar-striped progress-bar-animated bg-success";
				p2.role = "progressbar";
				p2.ariaValueNow = pos_count;
				p2.ariaValueMin = 0;
				p2.ariaValueMax = 50;
				p2.style.width = pos_count * 2 + "%";
				p1.appendChild(p2);

				var Negative = document.createElement("h4");
				Negative.innerText = "Negative: " + neg_count;
				Negative.className = "text-danger";

				var n1 = document.createElement("div");
				n1.className = "progress";
				n1.style.marginTop = "0.5rem";
				var n2 = document.createElement("div");
				n2.className = "progress-bar progress-bar-striped progress-bar-animated bg-danger";
				n2.role = "progressbar";
				n2.ariaValueNow = neg_count;
				n2.ariaValueMin = 0;
				n2.ariaValueMax = 50;
				n2.style.width = neg_count * 2 + "%";
				n1.appendChild(n2);

				var Neutral = document.createElement("h4");
				Neutral.innerText = "Neutral: " + neu_count;
				Neutral.className = "text-warning";

				var nu1 = document.createElement("div");
				nu1.className = "progress";
				nu1.style.marginTop = "0.5rem";
				var nu2 = document.createElement("div");
				nu2.className = "progress-bar progress-bar-striped progress-bar-animated bg-warning";
				nu2.role = "progressbar";
				nu2.ariaValueNow = neu_count;
				nu2.ariaValueMin = 0;
				nu2.ariaValueMax = 50;
				nu2.style.width = neu_count * 2 + "%";
				nu1.appendChild(nu2);

				var unfollow = document.createElement("button");
				unfollow.innerText = "@" + username;
				unfollow.className = "btn btn-danger";
				unfollow.id = "unfollow";
				unfollow.style.borderRadius = "20px";
				unfollow.style.fontWeight = "600";
				unfollow.addEventListener("click", function () {
					window.open("https://twitter.com/" + username, "_blank").focus();
				});

				var getusernames = document.createElement("button");
				getusernames.innerText = "Analyze more profiles";
				getusernames.className = "btn btn-primary";
				getusernames.id = "getUsernames";
				getusernames.addEventListener("click", clickIt);

				var innerDiv = document.createElement("div");
				innerDiv.appendChild(userName);
				innerDiv.appendChild(Name);
				innerDiv.appendChild(joined);
				innerDiv.appendChild(Followers);
				innerDiv.appendChild(Following);
				innerDiv.appendChild(Tweet_count);
				innerDiv.appendChild(Positive);
				innerDiv.appendChild(p1);
				innerDiv.appendChild(Neutral);
				innerDiv.appendChild(nu1);
				innerDiv.appendChild(Negative);
				innerDiv.appendChild(n1);
				bodyDiv.appendChild(innerDiv);
				innerDiv.appendChild(OverallRating);
				innerDiv.appendChild(unfollow);
				bodyDiv.appendChild(getusernames);
				innerDiv.style.paddingBottom = "0.5rem";
			}
			let check = 0;
			var bodyDiv = document.getElementById("mainPopup");
			while (bodyDiv.firstChild) {
				bodyDiv.removeChild(bodyDiv.firstChild);
			}

			var heading = document.createElement("h1");
			heading.id = "SafetWeeHeading";
			heading.innerText = `SafetWee has found ${usernames[0].length} usernames`;

			var tbody = document.createElement("p");
			tbody.id = "SafetWeeBody";
			tbody.innerText = `Click to analyze anyone`;

			let div = document.createElement("div");
			div.classList.add("d-grid", "gap-2", "d-md-block");
			usernames[0].forEach(() => {
				let btn = document.createElement("button");
				btn.innerHTML = usernames[0][check++];
				btn.classList.add("btn", "btn-outline-primary", "usernameButton");
				btn.style.borderRadius = "20px";
				btn.style.fontWeight = "600";
				div.appendChild(btn);
			});

			var innerDiv = document.createElement("div");
			innerDiv.appendChild(heading);
			innerDiv.appendChild(tbody);
			innerDiv.appendChild(div);
			bodyDiv.appendChild(innerDiv);

			document.querySelectorAll("button.usernameButton").forEach((ele) => {
				ele.addEventListener("click", () => {
					var bodyDiv = document.getElementById("mainPopup");
					while (bodyDiv.firstChild) {
						bodyDiv.removeChild(bodyDiv.firstChild);
					}
					var loader = document.createElement("div");
					loader.id = "loader";
					bodyDiv.appendChild(loader);

					console.log("Sending", ele.innerText, "to NLP API");
					//20.198.108.109
					fetch("http://localhost:8000/getRating", {
						method: "post",
						headers: {
							"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
						},
						body: `username=${ele.innerText}`
					})
						.then((res) => {
							if (res.status === 200) {
								return res.json();
							} else {
								throw new Error("Something went wrong on API server!");
							}
						})
						.then((res) => {
							console.log("API response is:", res);
							addDataToExtension(
								res.username,
								res.name,
								res.joined,
								res.public_metrics,
								res.overall,
								res.positive,
								res.negative,
								res.neutral
							);
						})
						.catch((error) => {
							console.error(error);
						});
				});
			});
		}
	);
};
document.getElementById("getUsernames").addEventListener("click", clickIt);
