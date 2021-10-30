require("dotenv").config();
const express = require("express"),
	app = express(),
	path = __dirname + "/views/",
	bodyParser = require("body-parser"),
	morgan = require("morgan"),
	{spawn} = require("child_process"),
	getRating = require("./get_rating.js");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(express.static(__dirname + "/public"));
app.set("views", path);
app.set("view engine", "ejs");
app.listen(process.env.PORT || 8000, () => {
	console.info("App is running on port", process.env.PORT || 8000);
});

/*=============================================>>>>>

				= Basic routes =

===============================================>>>>>*/

app.get("/", (_req, res) => {
	res.render("index");
});
app.get("/download", (_req, res) => {
	res.redirect("https://github.com/Yashank18/SafetWee/archive/main.zip");
});
app.post("/getRating", async (req, res) => {
	res.header(
		"Access-Control-Allow-Origin",
		"*"
	);
	let user_data = await getRating.getAnalysis(req.body.username)
	console.log(user_data)
	res.send(user_data);
});

app.use((_req, res) => {
	res.status(404).render("error", {
		errorMessage: "404!"
	});
});
