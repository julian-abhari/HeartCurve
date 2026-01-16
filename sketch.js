// Array to store the points of the heart shape
let outerHeart = [];
let innerHeart = [];
// Maximum angle for heart shape calculation
var maxAngle;
// Increment for heart radius
let radiusIncrement = 0.02;

// Array to store the vehicles
let vehicles = [];

// Grass blade variables
let grassBlades = [];
let grassLength = 50;

// Flowfield variables
var gridScale = 15;
var flowfield;
var time = 0;
var timeIncrement = 0.05;
var spatialIncrement = 0.06;

// The setup function is called once when the program starts
function setup() {
  // Create a canvas of 800x800 pixels
  createCanvas(800, 800);
  // Set the pixel density to 2 for high-resolution displays
  pixelDensity(2);

  // Setup flowfield array with the element amount equal to total cells
  columns = floor(width / gridScale);
	rows = floor(height / gridScale);
	flowfield = new Array(columns * rows);

  // Initialize Max Angle
  maxAngle = 2 * TWO_PI;
  // Setup the heart shape
  outerHeart = setupHeart(outerHeart, 15);
  innerHeart = setupHeart(innerHeart, 10);

  // Create vehicles such that it matches the heart shape
  for (let a = 0; a < maxAngle; a += radiusIncrement) {
    vehicles.push(new Vehicle(random(-width / 2, width / 2), random(-height / 2, height / 2)));
  }

  for (let i = 0; i < innerHeart.length; i++) {
    grassBlades.push(new Grass(innerHeart[i].x, innerHeart[i].y, grassLength));
  }
}

// The draw function is called continuously in a loop
function draw() {
  // Set the background color to black
  background(0);
  // Move the origin to the center of the canvas
  translate(width / 2, height / 2);

  // Calculate the vectors in the flowfield based on time
  calculateFlowField(flowfield, spatialIncrement, time, timeIncrement);

  // Update behavior and display vehicles
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].display();
    vehicles[i].update();
    vehicles[i].applyBehaviors(vehicles, outerHeart[i]);
    vehicles[i].applyAvoidTarget(createVector(mouseX - width / 2, mouseY - height / 2));

    // Calculate vehicle's flowfield index by the vehicle's position
    // Vehicle's column position normalized to the grid size
    let col = Math.floor((vehicles[i].position.x + (width / 2)) / gridScale);
    // Vehicle's row position normalized to the grid size
    let row = Math.floor((vehicles[i].position.y + (height / 2)) / gridScale);
    // Calculate the index in the flowfield array
    let index = col + row * columns;
    // Apply the flowfield vector as a force to the vehicle
    vehicles[i].applyForce(flowfield[index]);

    // Update grass blades
    grassBlades[i].show(vehicles[i].position);
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

function calculateFlowField(flowfield, spatialIncrement,  time, timeIncrement) {
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
	time += timeIncrement;
}
