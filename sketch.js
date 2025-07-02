let capture;
let posenet;
let poses = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();

  posenet = ml5.poseNet(capture, modelLoaded);
  posenet.on("pose", receivedPoses);

  textFont('Arial');
}

function modelLoaded() {
  console.log("PoseNet model has loaded");
}

function receivedPoses(results) {
  poses = results;
}

function draw() {
  // Mirror the canvas horizontally
  translate(width, 0);
  scale(-1, 1);

  // Draw the webcam feed full screen
  image(capture, 0, 0, width, height);

  stroke(255);
  strokeWeight(3);
  textSize(12);
  fill(255, 0, 0, 150); // semi-transparent red

  for (let p = 0; p < poses.length; p++) {
    let pose = poses[p].pose;
    let skeleton = poses[p].skeleton;

    // Draw keypoints and skeleton (mirrored)
    for (let i = 0; i < pose.keypoints.length; i++) {
      let kp = pose.keypoints[i];
      if (kp.score > 0.5) {
        ellipse(kp.position.x, kp.position.y, 10);
      }
    }

    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0].position;
      let partB = skeleton[j][1].position;
      line(partA.x, partA.y, partB.x, partB.y);
    }

    // Now draw text labels WITHOUT mirroring
    // Save current transformation matrix
    push();
    // Reset transform to normal (no mirror)
    resetMatrix();

    // Since we resetMatrix(), draw text with mirrored x:
    // Calculate flipped x to match mirrored pose points
    fill(255);
    noStroke();
    textSize(12);
    for (let i = 0; i < pose.keypoints.length; i++) {
      let kp = pose.keypoints[i];
      if (kp.score > 0.5) {
        // Flip X position manually for text
        let x = width - kp.position.x;
        let y = kp.position.y;
        text(kp.part, x + 5, y);
      }
    }
    pop();
  }
}
