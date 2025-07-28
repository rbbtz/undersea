let kelp = [], corals = [], fish = [], bubbles = [], sharks = [], jellyfish = [];
let hovered = null;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < 15; i++) kelp.push(new Kelp(random(-500, 500), random(-500, 500)));
  for (let i = 0; i < 12; i++) corals.push(new Coral(random(-450, 450), random(-450, 450)));
  for (let i = 0; i < 22; i++) fish.push(new Fish());
  for (let i = 0; i < 28; i++) bubbles.push(new Bubble());
  for (let i = 0; i < 4; i++) jellyfish.push(new Jelly());
  for (let i = 0; i < 2; i++) sharks.push(new Shark());
}

function draw() {
  background(60, 120, 200, 255);
  orbitControl();

  // Sand color seafloor
  push();
  rotateX(HALF_PI);
  fill(220, 200, 150);
  noStroke();
  plane(1200, 1200);
  pop();

  hovered = findHoveredObject();

  // Draw all species
  for (let c of corals) c.display(isHovered(c));
  for (let k of kelp) k.display(isHovered(k));
  for (let b of bubbles) { b.update(); b.display(isHovered(b)); }
  for (let f of fish) { f.update(); f.display(isHovered(f)); }
  for (let sh of sharks) { sh.update(); sh.display(isHovered(sh)); }
  for (let j of jellyfish) { j.update(); j.display(isHovered(j)); }
}

function mousePressed() {
  if (!hovered) return;
  hovered.onClick();
}

// Improved: Wider radius for interaction
function findHoveredObject() {
  let minDist = 56, target = null;
  let sx = mouseX - width / 2, sz = mouseY - height / 2;
  let mx = sx * 1.2, mz = sz * 1.2;
  let candidates = [].concat(fish, sharks, jellyfish, bubbles, kelp, corals);
  for (let obj of candidates) {
    let pos = obj.getXZ();
    let d = dist(mx, mz, pos[0], pos[1]);
    if (d < minDist) {
      minDist = d;
      target = obj;
    }
  }
  return target;
}
function isHovered(obj) { return hovered === obj; }

// ---- Classes ----

class Kelp {
  constructor(x, z) {
    this.x = x; this.z = z; this.height = random(70, 220);
    this.swing = random(TWO_PI); this.leaves = int(random(8, 15));
    this.wiggle = 0; this.colorFlash = 0; this.hoverEffect = 0;
  }
  display(hover) {
    push();
    translate(this.x, 0, this.z);
    let phase = this.swing + millis() * 0.0005 + this.wiggle;
    if (this.colorFlash > 0) this.colorFlash -= 2;
    if (hover && this.hoverEffect < 25) this.hoverEffect += 3;
    if (!hover && this.hoverEffect > 0) this.hoverEffect--;
    stroke(60 + this.colorFlash + this.hoverEffect * 6, 255, 100, 240);
    strokeWeight(hover ? 18 : 8);
    noFill();
    beginShape();
    for (let i = 0; i <= this.leaves; i++) {
      let t = i / this.leaves;
      let y = -t * this.height;
      let x = sin(phase + t * 2) * (16 + this.hoverEffect / 1.2) * (1 - t);
      vertex(x, y, 0);
      if (i > 1 && i < this.leaves && i % 2 == 0) {
        push();
        translate(x, y, 0);
        rotateZ(sin(phase + t * 6) * 0.7);
        fill(150 + this.colorFlash + this.hoverEffect * 3, 255, 180, 180);
        noStroke();
        ellipse(9 + this.hoverEffect, 0, 21 + (hover ? 7 : 0), 15 + (hover ? 5 : 0));
        pop();
      }
    }
    endShape();
    pop();
  }
  getXZ() { return [this.x, this.z]; }
  onClick() { this.wiggle += random(PI, 2 * PI); this.colorFlash = 180; }
}

class Coral {
  constructor(x, z) {
    this.x = x; this.z = z; this.height = random(25, 70);
    this.branches = int(random(5, 11));
    this.color = color(random(240,255), random(100,180), random(110,210));
    this.colorFlash = 0; this.hoverEffect = 0;
  }
  display(hover) {
    push();
    translate(this.x, 10, this.z);
    let col = this.colorFlash > 0 ? color(255, 255, 210) : this.color;
    if (this.colorFlash > 0) this.colorFlash -= 6;
    if (hover && this.hoverEffect < 25) this.hoverEffect += 3;
    if (!hover && this.hoverEffect > 0) this.hoverEffect--;
    if (hover) col = color(255, 220, 90);
    for (let i = 0; i < this.branches; i++) {
      let ang = (TWO_PI / this.branches) * i;
      let bx = cos(ang) * 14, bz = sin(ang) * 14;
      push();
      fill(col);
      noStroke();
      for (let j = 0; j < 3; j++) {
        let segY = -this.height * (j / 3);
        translate(bx * 0.5, segY, bz * 0.5);
        sphere(9 - j * 2 + this.hoverEffect / 6, 7, 5);
      }
      pop();
    }
    fill(col);
    sphere(13 + this.hoverEffect / 2, 8, 5);
    pop();
  }
  getXZ() { return [this.x, this.z]; }
  onClick() { this.colorFlash = 90; }
}

class Fish {
  constructor() {
    this.radius = random(180, 500);
    this.ang = random(TWO_PI);
    this.y = random(-140, -60);
    this.speed = random(0.006, 0.02);
    this.color = color(random(150, 255), random(110, 240), random(80, 180));
    this.size = random(8, 20);
    this.flash = 0; this.sprint = 0; this.hoverEffect = 0;
  }
  update() {
    if (this.sprint > 0) { this.ang += this.speed * 12; this.sprint--; }
    else this.ang += this.speed;
    if (this.flash > 0) this.flash--;
  }
  display(hover) {
    let x = cos(this.ang) * this.radius;
    let z = sin(this.ang) * this.radius;
    push();
    translate(x, this.y, z);
    rotateY(PI + this.ang);
    if (hover && this.hoverEffect < 30) this.hoverEffect += 4;
    if (!hover && this.hoverEffect > 0) this.hoverEffect--;
    fill(this.flash > 0 || hover ? color(255, 255, 60) : this.color);
    noStroke();
    scale(hover ? 1.6 : 1 + this.hoverEffect / 20, 1, 1);
    ellipsoid(this.size, this.size * 0.45, this.size * 0.3, 10, 3);
    fill(255, 255, 200, 240);
    beginShape();
    vertex(-this.size * 0.7, 0, 0);
    vertex(-this.size * 1.3, -this.size * 0.4, 0);
    vertex(-this.size * 1.3, this.size * 0.4, 0);
    endShape(CLOSE);
    pop();
  }
  getXZ() {
    return [cos(this.ang) * this.radius, sin(this.ang) * this.radius];
  }
  onClick() { this.sprint = 44; this.flash = 28; }
}

class Shark {
  constructor() {
    this.radius = random(480, 680);
    this.ang = random(TWO_PI);
    this.y = random(-120, -40);
    this.speed = random(0.003, 0.008);
    this.size = random(38, 54);
    this.finPhase = random(TWO_PI);
    this.grey = color(random(100, 170));
    this.turning = 0; this.hoverEffect = 0; this.dark = 0;
  }
  update() {
    if (this.turning > 0) { this.ang -= this.speed * 22; this.turning--; }
    else this.ang += this.speed;
    if (this.dark > 0) this.dark--;
    this.finPhase += 0.04;
  }
  display(hover) {
    let x = cos(this.ang) * this.radius;
    let z = sin(this.ang) * this.radius;
    push();
    translate(x, this.y, z);
    rotateY(PI + this.ang);
    if (hover && this.hoverEffect < 25) this.hoverEffect += 4;
    if (!hover && this.hoverEffect > 0) this.hoverEffect--;
    fill(lerpColor(this.grey, color(15, 20, 60), (this.dark + this.hoverEffect) / 32));
    noStroke();
    scale(hover ? 1.42 : 1 + this.hoverEffect / 45, 1, 1);
    ellipsoid(this.size, this.size * 0.23, this.size * 0.28, 16, 3);
    fill(lerpColor(this.grey, color(25, 20, 50), (this.dark + this.hoverEffect) / 32));
    beginShape();
    vertex(-this.size * 0.75, 0, 0);
    vertex(-this.size * 1.5, -this.size * 0.6, 0);
    vertex(-this.size * 1.5, this.size * 0.6, 0);
    endShape(CLOSE);
    push();
    translate(0, -this.size * 0.33, 0);
    fill(30, 40, 80, 210);
    beginShape();
    vertex(0, -this.size * 0.6, 0);
    vertex(this.size * 0.17, this.size * 0.16, 0);
    vertex(-this.size * 0.17, this.size * 0.16, 0);
    endShape(CLOSE);
    pop();
    pop();
  }
  getXZ() {
    return [cos(this.ang) * this.radius, sin(this.ang) * this.radius];
  }
  onClick() { this.turning = 32; this.dark = 80; }
}

class Bubble {
  constructor() {
    this.reset();
    this.popped = false;
    this.popEffect = 0;
    this.hoverEffect = 0;
  }
  reset() {
    this.x = random(-600, 600);
    this.z = random(-600, 600);
    this.y = random(-20, -150);
    this.r = random(4, 16);
    this.speed = random(0.8, 2.2);
    this.wobblePhase = random(TWO_PI);
    this.popped = false;
    this.popEffect = 0;
  }
  update() {
    if (!this.popped) {
      this.y -= this.speed;
      this.wobblePhase += 0.04;
      this.x += sin(this.wobblePhase) * 0.2;
      this.z += cos(this.wobblePhase) * 0.2;
      if (this.y < -330) this.reset();
    } else {
      this.popEffect++;
      if (this.popEffect > 12) this.reset();
    }
    if (this.hoverEffect > 0) this.hoverEffect--;
  }
  display(hover) {
    push();
    translate(this.x, this.y, this.z);
    if (hover && this.hoverEffect < 30) this.hoverEffect += 5;
    if (!hover && this.hoverEffect > 0) this.hoverEffect--;
    if (this.popped) {
      fill(255, 255, 255, 110 - this.popEffect * 8);
      stroke(220, 220, 255, 160 - this.popEffect * 10);
      strokeWeight(3);
      sphere(this.r + this.popEffect * 2.3, 9, 2);
    } else {
      fill(250, 255, 255, hover ? 245 : 130);
      noStroke();
      sphere(this.r * (hover ? 2.5 : 1 + this.hoverEffect / 11), 10, 4);
    }
    pop();
  }
  getXZ() { return [this.x, this.z]; }
  onClick() { this.popped = true; this.popEffect = 0; }
}

class Jelly {
  constructor() {
    this.x = random(-450, 450);
    this.z = random(-450, 450);
    this.y = random(-150, -30);
    this.baseY = this.y;
    this.pulse = random(TWO_PI);
    this.floatSpeed = random(0.2, 0.6);
    this.tentacles = int(random(8, 14));
    this.color = color(random(140,255), random(140,200), random(200,255), 130);
    this.pulseFlash = 0; this.hoverEffect = 0;
  }
  update() {
    this.pulse += 0.07;
    this.y = this.baseY + sin(this.pulse) * (18 + this.pulseFlash * 2 + this.hoverEffect / 1.2);
    this.x += sin(this.pulse * 0.32) * 0.18;
    this.z += cos(this.pulse * 0.29) * 0.15;
    this.baseY -= this.floatSpeed * 0.08;
    if (this.y < -310) {
      this.x = random(-500, 500);
      this.z = random(-500, 500);
      this.baseY = random(-150, -30);
    }
    if (this.pulseFlash > 0) this.pulseFlash -= 0.9;
    if (this.hoverEffect > 0) this.hoverEffect--;
  }
  display(hover) {
    push();
    translate(this.x, this.y, this.z);
    if (hover && this.hoverEffect < 28) this.hoverEffect += 3;
    if (!hover && this.hoverEffect > 0) this.hoverEffect--;
    fill(hover || this.pulseFlash > 0 ? color(255, 100, 255, 245) : this.color);
    noStroke();
    scale(hover ? 1.75 : 1 + this.hoverEffect / 12, 1, 1);
    ellipsoid(26, 20 + sin(this.pulse) * 4 + this.pulseFlash + this.hoverEffect / 1.1, 26, 13, 8);
    for (let i = 0; i < this.tentacles; i++) {
      let ang = (TWO_PI / this.tentacles) * i;
      let tx = cos(ang) * 12, tz = sin(ang) * 12;
      stroke(200, 130, 255, 130);
      strokeWeight(3);
      noFill();
      beginShape();
      for (let j = 0; j < 7; j++) {
        let t = j / 6;
        let segY = 20 + t * 38 + sin(this.pulse + t * 6 + i) * 6;
        let segX = tx + sin(this.pulse + t * 8 + i) * 4;
        let segZ = tz + cos(this.pulse + t * 7 + i) * 4;
        curveVertex(segX, segY, segZ);
      }
      endShape();
    }
    pop();
  }
  getXZ() { return [this.x, this.z]; }
  onClick() { this.pulseFlash = 48; }
}
