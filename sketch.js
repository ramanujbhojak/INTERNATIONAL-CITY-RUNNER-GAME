var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, ground_image, invisible_ground;
var franklin,franklinImage, franklin_running, franklin_collided,  enemy, enemy_running, enemy_attack;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var score;
var gameOver, restart, gameOverImage, restartImage;
var enemy_idle;
var coinGroup,coinImage;
var rubi,diamond,coins;
var rubiImg,diamondImg;
var tresure,tresureImg;
function preload() {
  ground_image = loadImage("Background.jpg");
  franklin_running = loadAnimation("BOY1.png", "BOY2.png", "BOY3.png", "BOY4.png","BOY5.png");
  enemy_running = loadAnimation("Walk (1).png", "Walk (2).png", "Walk (3).png", "Walk (4).png", "Walk (5).png", "Walk (6).png", "Walk (7).png", "Walk (8).png", "Walk (9).png", "Walk (10).png");
  enemy_attack = loadAnimation("Attack (2).png", "Attack (3).png", "Attack (4).png", "Attack (5).png", "Attack (6).png", "Attack (7).png", "Attack (8).png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  enemy_idle = loadImage("Stand.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3")
  gameOverImage = loadImage("gameOver1.png");
  restartImage = loadImage("restart1.png");
  franklin_collided = loadImage("falling.png");
  franklinImage = loadImage("franklin.png")
  coinImage = loadImage("coins.png");
  rubiImg = loadImage("rubi.png");
  diamondImg = loadImage("diamond.png");
  tresureImg = loadImage("tresure.png");
  coinSound = loadSound("coin.wav");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  ground = createSprite(400,350,800,700);
  ground.shapeColor = "white";
  ground.addImage("ground_image", ground_image);
  ground.scale =3 ;
  ground.velocityX = -1

  franklin = createSprite(300,height-70, 600, 10);
  franklin.addAnimation("franklin_running", franklin_running);
  franklin.addImage("franklin_collided", franklin_collided);
  franklin.scale = 0.5;
  // girl.velocityX=2;
  franklin.debug = false;
  franklin.setCollider("rectangle", 0, 0, franklin.width, franklin.height)


  enemy = createSprite(200,height-150,20,30);
  enemy.addAnimation("enemy_running", enemy_running);
  enemy.addAnimation("enemy_attack", enemy_attack);
  enemy.addImage("enemy_idle", enemy_idle);
  enemy.scale = 0.2;
  enemy.debug = false;
  // zombie.velocityY=-13;
  // zombie.velocityX=Math.round(random(1,2));

  invisible_ground = createSprite(width/2,height-10,width,125);
  invisible_ground.visible = false;

  gameOver = createSprite(900, 100);
  gameOver.addImage(gameOverImage);

  restart = createSprite(900, 180);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();
  coinGroup = new Group();
  score = 0;
}

function draw() {
  background("black");

  // console.log(girl.y);
  //Gravity
  franklin.velocityY = franklin.velocityY + 0.5;
  franklin.collide(invisible_ground);

  //Gravity
  franklin.velocityY = franklin.velocityY + 0.8;
  franklin.collide(invisible_ground);


  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //  zombie.y=girl.y;
    score = score + Math.round(getFrameRate() / 60);
    spawnCoin();
    spawnObstacles();
  
    ground.velocityX = -(4 + 3 * score / 100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if (( touches.length > 0 || keyDown("space") && franklin.y >= height- 300)) {
      franklin.velocityY = -12;
      jumpSound.play();
      touches = [];
    }

    if (franklin.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }


 
 if(coinGroup.isTouching(franklin)){
  score = score + 1;
  coinSound.play();
  coinGroup[0].destroy();
  
  
}


  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    franklin.velocityY = 0
    franklin.changeImage("franklinImage", franklinImage);
    franklin.changeAnimation("enemy_attack", enemy_attack);
    enemy.x = franklin.x;
    if (franklin.isTouching(enemy)) {
      franklin.changeImage("franklin_collided", franklin_collided);
      enemy.changeImage("enemy_idle", enemy_idle);
    }
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    coinGroup.setLifetimeEach(-1);
    if (mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
  fill("red");
  textSize(30);
  text("Score: " + score, 1500, 50);
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  franklin.changeAnimation("franklin_running", franklin_running);
  obstaclesGroup.destroyEach();
  score = 0;
  franklin.x = 50;
}

function spawnObstacles() {
	if(frameCount % 60 === 0) {
	  var obstacle = createSprite(500,height-150,10,40);    
	  //generate random obstacles
	  var rand = Math.round(random(1,3));
	  switch(rand) {
		case 1: obstacle.addImage(obstacle2);
				break;
		case 2: obstacle.addImage(obstacle1);
				break;
		 
		
	  }
		  
	  obstacle.velocityX = -(6 + 3*score/100);
	  
	  //assign scale and lifetime to the obstacle           
	  obstacle.scale = 0.5        ;
	  obstacle.lifetime = 300;
	  //add each obstacle to the group
	  obstaclesGroup.add(obstacle);
	}
 }

 function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(800,random(100,900),1,1);
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
    
		tresure = createSprite(800,random(80,880),1,1);
		tresure.addImage("tresure",tresureImg);
		tresure.scale = 0.3;
		tresure.velocityX = -12;
		
	diamond = createSprite(800,random(90,850),1,1);
	diamond.addImage("tresure",diamondImg);
	diamond.scale = 0.2;
	diamond.velocityX = -15;

	rubi = createSprite(800,random(100,950),1,1);
	rubi.addImage("rub",rubiImg);
	rubi.scale = 0.2;
	rubi.velocityX = -17;

     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = franklin.depth;
    franklin.depth = franklin.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
    coinGroup.add(tresure);
    coinGroup.add(diamond);
    coinGroup.add(rubi);
  }
  
}