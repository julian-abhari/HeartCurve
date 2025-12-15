class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.radius = 12;
    this.maxSpeed = 3;
    this.maxForce = 0.2;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  applyBehaviors(vehicles) {
    var separateForce = this.separate(vehicles);
    var seekForce = this.seek(createVector(mouseX, mouseY));
    separateForce.mult(2);
    seekForce.mult(1);
    this.applyForce(separateForce);
    this.applyForce(seekForce);
  }

  // Method that calculuates a steering force towards a target
  // Steering force = desired force - current velocity
  seek(target) {
    var desired = p5.Vector.sub(target, this.position);

    desired.normalize();
    desired.mult(this.maxSpeed);
    var steeringForce = p5.Vector.sub(desired, this.velocity);
    steeringForce.limit(this.maxForce);

    return steeringForce;
  }

  separate(vehicles) {
    var desiredSeparation = this.radius;
    var sum = createVector();
    var count = 0;
    // For every vehicle in the system, chekc if its too close
    for (var i = 0; i < vehicles.length; i += 1) {
      var distance = p5.Vector.dist(this.position, vehicles[i].position);
      if ((distance > 0) && (distance < desiredSeparation)) {
        var difference = p5.Vector.sub(this.position, vehicles[i].position);
        difference.normalize();
        difference.div(distance);
        sum.add(difference);
        count += 1;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      // Steering = Desired - velocity
      sum.sub(this.velocity)
      sum.limit(this.maxForce);
    }
    return sum;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    fill(175);
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    ellipse(0, 0, this.radius, this.radius);
    pop();
  }
}
