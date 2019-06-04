const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const itm = require("./js-itm");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.listen(process.env.PORT || 3003, () => {
  console.log("listening on 3003");
});

app.get("/", (req, res) => {
  res.render("index.ejs", { cameras });
});

let rawdata = fs.readFileSync("public/cameras.json");
let cameras = JSON.parse(rawdata);
for (var i = 0; i < cameras.length; i++) {
  var xy = Math.round(cameras[i].X) + " " + Math.round(cameras[i].Y);
  newxy = JSITM.itmRef2gpsRef(xy).split(" ");
  cameras[i].X = newxy[0];
  cameras[i].Y = newxy[1];
}
