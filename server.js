const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const itm = require("./js-itm");
const createPolygons = require("./create-polygons");
const util = require("util");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.listen(process.env.PORT || 8080, () => {
  console.log("listening on 8080");
});

app.get("/", (req, res) => {
  res.render("index.ejs", { cameras });
});

const polygonJSON = createPolygons();
console.log(util.inspect(polygonJSON, { depth: null, maxArrayLength: null }));

let rawdata = fs.readFileSync("public/cameras.json");
let cameras = JSON.parse(rawdata);
for (var i = 0; i < cameras.length; i++) {
  var xy = Math.round(cameras[i].X) + " " + Math.round(cameras[i].Y);
  newxy = JSITM.itmRef2gpsRef(xy).split(" ");
  cameras[i].X = newxy[0];
  cameras[i].Y = newxy[1];
}
