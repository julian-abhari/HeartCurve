// Array to store the points of the heart shape
let outerHeart = [];
let innerHeart = [];
// Maximum angle for heart shape calculation
var maxAngle;
// Increment for heart radius
let radiusIncrement = 0.02;

// Array to store the vehicles
let vehicles1 = [];
let vehicles2 = [];

// Lace blade variables
let laceNet = [];
let laceLength = 90;

// Time variables
var time = 0;
var timeIncrement = 0.005;

// The setup function is called once when the program starts
function setup() {
  // Create a canvas of 800x800 pixels
  createCanvas(800, 800);
  // Set the pixel density to 2 for high-resolution displays
  pixelDensity(2);

  // Initialize Max Angle
  maxAngle = 1 * TWO_PI;
  // Setup the heart shape
  outerHeart = setupHeart(outerHeart, 20);
  innerHeart = setupHeart(innerHeart, 8);

  // Create vehicles such that it matches the heart shape
  for (let a = 0; a < maxAngle; a += radiusIncrement) {
    vehicles1.push(new Vehicle(random(-width / 2, width / 2), random(-height / 2, height / 2)));
    vehicles2.push(new Vehicle(random(-width / 2, width / 2), random(-height / 2, height / 2)));
  }

  for (let i = 0; i < vehicles2.length; i++) {
    let xOffset = width / 2;
    let yOffset = height / 2;
    // Calculate the distance between the points in outerHeart and innerHeart at the current index
    let distance = dist(outerHeart[i].x - xOffset, outerHeart[i].y - yOffset, innerHeart[i].x - xOffset, innerHeart[i].y - yOffset);
    laceNet.push(new Lace(vehicles2[i].position.x, vehicles2[i].position.y, laceLength));
  }
}

// The draw function is called continuously in a loop
function draw() {
  // Set the background color to black
  background(0);
  // Move the origin to the center of the canvas
  translate(width / 2, height / 2);

  // Update time
  time += timeIncrement;

  // Update behavior and display vehicles
  let allVehicles = vehicles1.concat(vehicles2);
  for (let i = 0; i < vehicles1.length; i++) {
    // Update vehicle 1
    vehicles1[i].update();
    vehicles1[i].applyBehaviors(allVehicles, Math.floor(time % 2) == 0 ? outerHeart[i] : innerHeart[i]);
    vehicles1[i].applyAvoidTarget(createVector(mouseX - width / 2, mouseY - height / 2));

    // Update vehicle 2
    vehicles2[i].update();
    vehicles2[i].applyBehaviors(allVehicles, Math.floor(time % 2) == 0 ? innerHeart[i] : outerHeart[i]);
    vehicles2[i].applyAvoidTarget(createVector(mouseX - width / 2, mouseY - height / 2));

    // Update lace blades
    laceNet[i].position.set(vehicles2[i].position);
    laceNet[i].show(vehicles1[i].position);

    // Display
    vehicles1[i].display();
    vehicles2[i].display();
  }
}

function setupHeart(heart, radius) {
  for (let a = 0; a < maxAngle; a += radiusIncrement) {
    // Radius for the heart shape calculation
    let r = radius;
    // Calculate the x-coordinate of the next point in the heart shape
    let x = r * 16 * pow(sin(a), 3);
    // Calculate the y-coordinate of the next point in the heart shape
    let y = -r * (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a));
    // Add the new point to the heart array
    heart.push(createVector(x, y));
  }
  return heart
}

function calculateFlowField(flowfield, spatialIncrement,  time) {
  // Iterate through the flowfield columns
  var xOffset = 0;
	for (var x = 0; x < columns; x += 1) {
		var yOffset = 0;
		// Iterate through the flowfield rows
		for (var y = 0; y < rows; y += 1) {
			var index = x + y * columns;
			var perlinNoise = noise(xOffset, yOffset, time);
			var angle = map(perlinNoise, 0, 1, 0, TWO_PI);
			var vector = p5.Vector.fromAngle(angle);
			vector.setMag(0.35);
			flowfield[index] = vector;
			yOffset += spatialIncrement;
		}
		xOffset += spatialIncrement;
	}
}
