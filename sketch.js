// Array to store the points of the heart shape
let heart = [];

// Array to store the vehicles
let vehicles = [];

// Increment for heart radius
let radiusIncrement = 0.02;

// The setup function is called once when the program starts
function setup() {
  // Create a canvas of 800x800 pixels
  createCanvas(800, 800);
  // Set the pixel density to 2 for high-resolution displays
  pixelDensity(2);
  // Setup the heart shape
  setupHeart();

  // Create vehicles such that it matches the heart shape
  for (let a = 0; a < TWO_PI; a += radiusIncrement) {
    vehicles.push(new Vehicle(random(-width / 2, width / 2), random(-height / 2, height / 2)));
  }
}

// The draw function is called continuously in a loop
function draw() {
  // Set the background color to black
  background(0);
  // Move the origin to the center of the canvas
  translate(width / 2, height / 2);

  // Disable filling shapes
  noFill();
  // Set the stroke color to white
  stroke(255);
  // Set the stroke weight to 4 pixels
  strokeWeight(4);
  // Set the fill color to a shade of purple
  // fill(150, 0, 100);

  // Begin drawing a shape
  // beginShape();
  // Loop through each point in the heart array and create a vertex
  // for (let vector of heart) {
  //   vertex(vector.x, vector.y);
  // }
  // End drawing the shape
  // endShape();

  // Update behavior and display vehicles
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].update();
    vehicles[i].display();
    vehicles[i].applyBehaviors(vehicles, heart[i]);
    vehicles[i].applyAvoidTarget(createVector(mouseX - width / 2, mouseY - height / 2));
  }
}

function setupHeart() {
  for (let a = 0; a < TWO_PI; a += radiusIncrement) {
    // Radius for the heart shape calculation
    let r = 10;
    // Calculate the x-coordinate of the next point in the heart shape
    let x = r * 16 * pow(sin(a), 3);
    // Calculate the y-coordinate of the next point in the heart shape
    let y = -r * (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a));
    // Add the new point to the heart array
    heart.push(createVector(x, y));
  }
}
