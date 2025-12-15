function Vehicle(x, y) {
  this.pos = createVector(x, y);
  this.target = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
  this.r = 3;
  this.maxSpeed = 10;
  this.maxForce = 1;
}

Vehicle.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Vehicle.prototype.show = function () {
  stroke(255);
  strokeWeight(this.r);
  point(this.pos.x, this.pos.y);
};

Vehicle.prototype.behaviors = function (avoidingTarget) {
  var arrive = this.arrive(this.target);
  //var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(avoidingTarget);

  arrive.mult(1);
  flee.mult(5);

  this.applyForce(arrive);
  this.applyForce(flee);
};

Vehicle.prototype.arrive = function () {
  var desired = p5.Vector.sub(this.target, this.pos);
  var distance = desired.mag();
  var speed = this.maxSpeed;
  if (distance < 100) {
    var speed = map(distance, 0, 100, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  var steeringForce = p5.Vector.sub(desired, this.vel);
  steeringForce.limit(this.maxForce);
  return steeringForce;
};

Vehicle.prototype.flee = function (target) {
  var desired = p5.Vector.sub(target, this.pos);
  var distance = desired.mag();
  if (distance < 50) {
    desired.setMag(this.maxSpeed);
    desired.mult(-1);
    var steeringForce = p5.Vector.sub(desired, this.vel);
    steeringForce.limit(this.maxForce);
    return steeringForce;
  }
  return createVector();
};

Vehicle.prototype.applyForce = function (force) {
  this.acc.add(force);
};
