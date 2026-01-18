class Lace {
  constructor(x, y, length) {
    this.length = length;
    this.position = createVector(x, y);
    this.segments = [];
    this.segments[0] = new Segment({"position": createVector(this.position.x, this.position.y)}, 3);

    for (var i = 1; i < this.length; i += 1) {
      this.segments.push(new Segment({"parent": this.segments[i - 1], "segmentNumber": i + 2}, 3));
  	}
  }

  show(target) {
    this.endSegment = this.segments[this.length - 1];
    this.endSegment.follow(target);
    this.endSegment.update();

    for (var i = this.length - 2; i >= 0; i -= 1) {
       this.segments[i].follow(this.segments[i + 1].position);
       this.segments[i].update();
    }
    this.segments[0].setBasePosition(this.position);
    for (var i = 1; i < this.length; i += 1) {
      this.segments[i].setBasePosition(this.segments[i-1].secondPos);
    }
    for (var i = 0; i < this.length; i += 1) {
      this.segments[i].show();
    }
  }
}
