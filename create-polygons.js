const util = require("util");
const GeoJSON = require("geojson");
const fs = require("fs");
const JSITM = require("js-itm");

const numVertices = 10;
const default_radius = 100; //meters
const default_field_of_view = 100; //Degrees

module.exports = function() {
  const polygons = [];

  const cameras = require("./input.json");

  /*
   * Converting measurements:
   * Angles -> Radians
   * Meters -> LatLong degrees
   * X,Y -> LatLong
   */
  var i = 0;
  cameras.forEach(camera => {
    camera.angle = toRadians(camera.angle);
    camera.radius = toLatLongDegrees(default_radius);
    if (!camera.field_of_view)
      camera.field_of_view = toRadians(default_field_of_view);

    const gpsRef = JSITM.itmRef2gpsRef(
      Math.round(camera.x) + " " + Math.round(camera.y)
    );
    const latLong = gpsRef.split(" ");
    camera.x = latLong[0]; //Latitude
    camera.y = latLong[1]; //Longitude

    camera.id = i;
    i += 1;
  });

  //Creating polygons
  cameras.forEach(camera => {
    const polygon = getPolygon(camera, numVertices - 1);
    polygons.push(polygon);
  });

  const result = GeoJSON.parse(polygons, {
    Polygon: "coordinates"
  });
  return result;
};

// fs.writeFile('./output.geojson', util.inspect(result, {
//	depth: null,
//	maxArrayLength: null
// }), () => console.log('success'))

function getPolygon(camera, numVertices) {
  var vertices = [];
  const firstAngle = Math.PI / 2 + camera.angle - camera.field_of_view / 2;
  for (var i = 0; i < numVertices; i++) {
    const angle = firstAngle + (camera.field_of_view / (numVertices - 1)) * i;
    const newX = camera.x + camera.radius * Math.cos(angle);
    const newY = camera.y + camera.radius * Math.sin(angle);
    vertices.push([newX, newY]);
  }

  vertices.unshift([camera.x, camera.y]);
  vertices.push([camera.x, camera.y]);
  const polygon = {
    id: camera.id,
    coordinates: vertices
  };
  return polygon;
}

//------ Utility Methods ------//

function toLatLongDegrees(distance) {
  return distance / 111111;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
