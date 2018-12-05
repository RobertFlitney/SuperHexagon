function setup() {
  createCanvas(1000, 700);

  player = {rot: 0};
  backdrop = color(random(255), random(255), random(255));
  newbackdrop = backdrop;
	screenAvr = (width + height) / 2;

	hexs = [];
	count = 0;
	speed = 3;
}

var player;
var hexs = [];
var blocks = [];
var count = 75;
var blockCount = 100;
var shots = [];
var speed = 1;
var screenAvr;
var backdrop;
var newbackdrop;
var delta = 300;
var playing = true;
var score = 0;
var shotdelay = 0;
var scoreincrease = 0;
var txt;
var splodes = [];

function draw() {
	background(0);

	if (playing){

		var screenAvr = (width + height) / 2;

		translate(width / 2, height / 2);

		scale(1, map(sin(radians(frameCount / 2)), -1, 1, 0.6, 0.9));

		rotate((-PI/2) + radians(frameCount/ 5));

		for(let i = 0; i < 360; i += 60){
			noStroke();
			fill(backdrop.levels[0] / 2,
				   backdrop.levels[1] / 2,
				   backdrop.levels[2] / 2);
			if((i / 60) % 2 == 0){
				fill(backdrop.levels[0] / 4,
					   backdrop.levels[1] / 4,
					   backdrop.levels[2] / 4);
			}
			beginShape();
			vertex(0, 0);
			vertex(screenAvr * cos(radians(i)), screenAvr * sin(radians(i)));
			vertex(screenAvr * cos(radians(i + 60)), screenAvr * sin(radians(i + 60)));
			endShape();
		}

    splodes.forEach(makeSplode);
		hexs.forEach(makeHex);
		blocks.forEach(makeBlock);
		shots.forEach(makeShot);

		if(count < 0){
			let newHex = {rot: floor(random(6)) * 60, size: (width + height) / 2,
								  colour: color(random(255), random(255), random(255))}

			hexs.push(newHex);
			count = delta / speed;
			speed += 0.05;
		}
		else{
			count--;
		}

		if(blockCount < 0){
			let block = {rot: floor(random(6)) * 60, size: (width + height) / 2,
						       colour: color(255, 0, 0)}

			blocks.push(block);
			blockCount = random(150, 200);
		}
		else{
			blockCount--;
		}

		fill(255);
		stroke(255);

		ellipse(cos(radians(player.rot)) * (screenAvr / 7),
					sin(radians(player.rot)) * (screenAvr / 7),
					screenAvr / 75, screenAvr / 75);

		ellipse(0, 0, screenAvr / 20, screenAvr / 20);

		move();

    if(scoreincrease != 0){
      let scoreChange = 2;
      if(scoreincrease < 0){
        scoreChange = -2;
      }
      score += scoreChange;
      scoreincrease -= scoreChange;
    }

    for(let i = 0; i < 3; i++){
      backdrop.levels[i] += (newbackdrop.levels[i] - backdrop.levels[i]) / 50;
    }

		resetMatrix();
		strokeWeight(1);
		stroke(255);
		fill(255);
		scale(5, 5);
		text(score, 1, 10);
		//text(player.rot, width / 5 - 50, 10);
    //text(txt, width / 5 - 50, 20);
	}

	else{
		stroke(0, 0, 0, 0);
		fill(255);
		translate(width/2, height/2);
		scale(9, 9);
		text("GAME OVER", -35, -15);
		text("Press space", -32, 0);
		text(score, -12 * score.toString.length, 15);
		//text(player.rot, 10, 10);
    //text(txt, 10, 20);
		if(keyIsDown(32)){
			location.reload();
		}
	}
}

function move(){
	if(keyIsDown(RIGHT_ARROW)){
		player.rot = (player.rot + 365) % 360;
	}
	if(keyIsDown(LEFT_ARROW)){
		player.rot = (player.rot + 355) % 360;
	}
	if(keyIsDown(UP_ARROW) && shotdelay <= 0){
		let shot = {rot: player.rot, distance: screenAvr / 7};
		shots.push(shot);
		scoreincrease-=200;
		shotdelay = 30;
	}
	shotdelay--;
}

function makeSplode(splode){
  if(splode.size < screenAvr * 2){
    noFill();
    strokeWeight(25);
    stroke(splode.colour);
    ellipse(0, 0, splode.size, splode.size);
    splode.size += 25;
  }
  else{
    splodes.splice(splodes.indexOf(splode));
  }
}

function makeHex(hex){
	if(hex.size <= screenAvr / 45){
		newbackdrop = hex.colour;
		hexs.splice(hexs.indexOf(hex), 1);
		scoreincrease += 100;
    splodes.push({size: 0, colour: color(hex.colour.levels[0],
                                         hex.colour.levels[1],
                                         hex.colour.levels[2],
                                         hex.colour.levels[3] / 2)});
	}
	else{
		strokeWeight(10);
		stroke(hex.colour);

		for(let a = 0; a < 5 * 60; a += 60){
			let start = createVector(hex.size * cos(radians(a + hex.rot)),
									             hex.size * sin(radians(a + hex.rot)));
			let end = createVector(hex.size * cos(radians(a + 60 + hex.rot)),
								             hex.size * sin(radians(a + 60 + hex.rot)));
			line(start.x, start.y, end.x, end.y);
		}

		if(hex.size < (screenAvr / 7) + 10 && hex.size > (screenAvr / 7) - 10){
      txt = hex.rot;
      if(!(floor(player.rot / 60) == (floor(hex.rot / 60) + 5) % 6)){
        playing = false;
			}
		}

		hex.size -= speed;
	}
}

function makeBlock(block){
	if(block.size <= screenAvr / 45){
		blocks.splice(blocks.indexOf(block), 1);
		scoreincrease += 200;
    splodes.push({size: 0, colour: color(255, 0, 0, 50)});
	}
	else{
		strokeWeight(10);
		stroke(block.colour);

		for(let a = 0; a < 2 * 60; a += 60){
			let start = createVector(block.size * cos(radians(a + block.rot)),
									             block.size * sin(radians(a + block.rot)));
			let end = createVector(block.size * cos(radians(a + 60 + block.rot)),
								             block.size * sin(radians(a + 60 + block.rot)));
			line(start.x, start.y, end.x, end.y);
		}

		if(block.size < (screenAvr / 7) && block.size > (screenAvr / 7) - 5){
			if (floor(block.rot / 60) >= floor(player.rot / 60) - 1 && floor(block.rot / 60) <= floor(player.rot / 60)){
				playing = false;
			}
		}

		block.size -= speed / 3;
	}
}

function makeShot(shot){
	fill(255, 0, 0);
	stroke(255, 0, 0);
	if(shot.distance >= screenAvr){
		shots.splice(shots.indexOf(shot), 1);
	}
	for(let i = 0; i < blocks.length; i++){
		let block = blocks[i];
		if(sqrt((block.size - shot.distance)**2) < 10){
			if(floor(block.rot / 60) >= floor(shot.rot / 60) - 1 && floor(block.rot / 60) <= floor(shot.rot / 60)){
				shots.splice(shots.indexOf(shot), 1);
				blocks.splice(blocks.indexOf(block), 1);
			}
		}
	}
	ellipse(shot.distance * cos(radians(shot.rot)),
          shot.distance * sin(radians(shot.rot)), 20, 20);
	shot.distance += 5;
}
