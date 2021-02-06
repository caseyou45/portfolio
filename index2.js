var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

window.addEventListener(
  "keydown",
  function (e) {
    // space and arrow keys
    if (gameStart === true)
      if (e.code === "ArrowUp" || "ArrowDown" || "ArrowRight" || "ArrowLeft") {
        e.preventDefault();
      }
  },
  false
);

let x = 140;
let y = 3;
let leftMomentum = 0;
let rightMomentum = 0;
let upMomentum = 0;
let downMomentum = 0.5;
let stars = [];
let asteriodArray = [];
let up = false;
let left = false;
let right = false;
let fuelMax = 100;
let positionXSat1 = -50;
let positionYSat1 = 40;
let positionXSat2 = c.width + 30;
let positionYSat2 = 100;
let lives = 3;
let gameStart = false;

// Level Control
let level = 1;
let asteroidAmount = 0;
let satelliteSpeed = 0;

let astInt;
let gameLoop;

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

img = new Image();
img.src = "./Images/Lander/Lander.png";

img2 = new Image();
img2.src = "./Images/Lander/Flame.png";

img3 = new Image();
img3.src = "./Images/Lander/FlameRight.png";

img4 = new Image();
img4.src = "./Images/Lander/FlameLeft.png";

img5 = new Image();
img5.src = "./Images/Lander/Surface.png";

img6 = new Image();
img6.src = "./Images/Lander/Explosion.png";

img7 = new Image();
img7.src = "./Images/Lander/Sat1.png";

img8 = new Image();
img8.src = "./Images/Lander/Sat2.png";

img9 = new Image();
img9.src = "./Images/Lander/Cover.png";

// Gets random positive/negative num

const getRandomInt = (max) => {
  return Math.floor(Math.random() * (max * 2) - max);
};

// Gets random positive num
const getRandomPosInt = () => {
  let x = Math.floor(Math.random() * (250 - 30) + 30);
  return x;
};

// Draws lander and rocket
const drawLanderAndRockets = () => {
  ctx.drawImage(img, x, y, 40, 45);
  if (up === true) {
    ctx.drawImage(img2, x, y + 21, 40, 40);
  }

  if (right === true) {
    ctx.drawImage(img3, x - 11, y + 13, 30, 16);
  }

  if (left === true) {
    ctx.drawImage(img4, x + 19, y + 13, 30, 16);
  }
};

// Soft reset between levels

const reset = () => {
  x = 140;
  y = 3;
  leftMomentum = 0;
  rightMomentum = 0;
  upMomentum = 0;
  downMomentum = 0.5;
  pathLeft = 300;
  pathDown = 70;
  asteriodArray = [];
  up = false;
  left = false;
  right = false;
  fuelMax = 100;
  positionXSat1 = -50;
  positionYSat1 = 40;
  positionXSat2 = c.width + 30;
  positionYSat2 = 100;
  clearInterval(astInt);
  clearInterval(gameLoop);
  loadGame();
};

// Whole reset
const gameReset = () => {
  clearCanvas();
  x = 140;
  y = 3;
  leftMomentum = 0;
  rightMomentum = 0;
  upMomentum = 0;
  downMomentum = 0.5;
  pathLeft = 300;
  pathDown = 70;
  stars = [];
  asteriodArray = [];
  up = false;
  left = false;
  right = false;
  fuelMax = 100;
  positionXSat1 = -50;
  positionYSat1 = 40;
  positionXSat2 = c.width + 30;
  positionYSat2 = 100;
  clearInterval(astInt);
  clearInterval(gameLoop);
  makeStarsArray();

  lives = 3;
  gameStart = false;

  level = 1;
  asteroidAmount = 0;
  satelliteSpeed = 0;
  intro();
};

// Acutally starts game
const loadGame = () => {
  compileAllDrawsandProcesses();
  gamePlayLoop();
  moveAsteroids();
};

// Shows intro screen

const intro = (e) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 300, 300);
  img9.onload = () => {
    ctx.drawImage(img9, 30, 2.5, 240, 300);
  };
  ctx.drawImage(img9, 25, 2.5, 250, 295);
};

// Handles level change

const levels = () => {
  switch (level) {
    case 1:
      loadGame();

      break;
    case 2:
      reset();
      asteroidAmount = 200;
      satelliteSpeed = 1;

    case 3:
      reset();
      asteroidAmount = 400;
      satelliteSpeed = 1;

      break;
    case 4:
      reset();
      asteroidAmount = 600;
      satelliteSpeed = 2;

      break;
    case 5:
      reset();
      asteroidAmount = 1000;
      satelliteSpeed = 2;

      break;

    case 6:
      gameVictory();

      break;

    default:
      break;
  }
};

// Creates array of random nums
const createAsteroidsArray = () => {
  for (let index = 0; index < asteroidAmount; index++) {
    asteriodArray.push(getRandomInt(1000));
  }
};

// Creates array of random nums
const makeStarsArray = () => {
  for (let index = 0; index < 1000; index++) {
    stars.push(getRandomInt(300));
  }
};

// Draws stars
const drawStars = () => {
  for (let index = 0; index < stars.length; index += 4) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(stars[index], stars[index + 1], 0.5, 0.5);
    ctx.fillRect(stars[index + 2], stars[index + 3], 1, 1.5);
  }

  // Makes Black Bar on Top
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, c.width, 25);
};

// Moves asteroids from NW to SW

const moveAsteroids = () => {
  createAsteroidsArray();

  astInt = setInterval(() => {
    for (let index = 0; index < asteriodArray.length; index += 2) {
      asteriodArray[index]--;
      asteriodArray[index + 1]++;
    }
  }, 20);
};

// Draws asteroids and senses for impact with Lander

const createAsteroids = () => {
  for (let index = 0; index < asteriodArray.length; index += 2) {
    ctx.fillStyle = "white";
    ctx.fillRect(asteriodArray[index], asteriodArray[index + 1], 3, 3);
    if (asteriodArray[index] > x + 10 && asteriodArray[index] < x + 30) {
      if (
        asteriodArray[index + 1] > y + 10 &&
        asteriodArray[index + 1] < y + 30
      ) {
        if (y > 30) {
          destroyLander();
        }
      }
    }
  }
};

// Moves Small Sattelite

const drawSatellite1 = () => {
  if (positionXSat1 > c.width + 20) {
    positionXSat1 = -20;
    positionYSat1 = getRandomPosInt();
  }
  positionXSat1 = positionXSat1 + satelliteSpeed;

  ctx.drawImage(img7, positionXSat1, positionYSat1, 45, 65);

  ctx.rect(positionXSat1, positionYSat1, 35, 35);
  // ctx.fill();
  if (ctx.isPointInPath(x, y + 10)) {
    destroyLander();
  }
};

// Moves Large Sattelite

const drawSatellite2 = () => {
  if (positionXSat2 === -120) {
    positionXSat2 = c.width + 20;
    positionYSat2 = getRandomPosInt();
  }

  positionXSat2 = positionXSat2 - satelliteSpeed;

  ctx.drawImage(img8, positionXSat2, positionYSat2, 200, 200);
  ctx.rect(positionXSat2 + 55, positionYSat2 + 25, 40, 35);

  if (ctx.isPointInPath(x + 15, y + 15)) {
    destroyLander();
  }
};

const compileAllDrawsandProcesses = () => {
  clearCanvas();
  drawCanvasBlack();
  drawStars();
  createAsteroids();
  drawSatellite1();
  drawSatellite2();

  drawSurface();
  calculateMomentum();
  drawLevelText();
  drawSpeedometer();
  drawFuel();
  drawLivesLeft();
  drawLanderAndRockets();
};

// Destorys Lander
const destroyLander = () => {
  clearInterval(gameLoop);
  clearInterval(astInt);

  setTimeout(() => {
    ctx.drawImage(img6, x - 110, y - 93, 300, 400);
  }, 100);
  setTimeout(() => {
    gameEnd();
  }, 800);
};

// Handles game's end

const gameEnd = (message) => {
  clearCanvas();
  drawCanvasBlack();
  drawStars();
  drawSurface();

  lives--;
  drawLivesLeft();

  setTimeout(() => {
    if (lives > 0) {
      reset();
    } else {
      ctx.font = "22px Courier";
      ctx.fillText("Mission Failed", 62, 150);
      setTimeout(() => {
        hideStartButton();
        gameReset();
      }, 1000);
    }
  }, 1800);
};

// Makes level text at top

const drawLevelText = () => {
  ctx.font = "10px Courier";
  ctx.fillStyle = "white";
  ctx.fillText(`Level ${level}`, 108, 15);
};

// Makes moon's surface

const drawSurface = () => {
  ctx.drawImage(img5, -40, -150, 420, 1000);
};

const drawSpeedometer = () => {
  ctx.fillStyle = "green";

  if (downMomentum > 1) {
    ctx.fillStyle = "red";
  }
  ctx.fillText(Math.abs(Math.ceil(downMomentum)), 247.5, 41.5);

  ctx.fillStyle = "white";
  ctx.font = "10px Courier";

  ctx.fillText("Verticle Speed", 210, 15);
  if (downMomentum < 0) {
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.moveTo(250.5, 22);
    ctx.lineTo(259, 32);
    ctx.lineTo(242, 32);
    ctx.fill();
  }

  if (downMomentum > 0) {
    ctx.beginPath();
    ctx.fillStyle = "green";
    if (downMomentum > 1) {
      ctx.fillStyle = "red";
    }
    ctx.moveTo(250.5, 55);
    ctx.lineTo(259, 45);
    ctx.lineTo(242, 45);
    ctx.fill();
  }
};

// Draws fuel guage at top
const drawFuel = () => {
  ctx.fillStyle = "white";
  ctx.font = "10px Courier";

  ctx.fillText("Fuel", 170, 15);
  if (fuelMax > 0) {
    ctx.fillRect(167, 25, (fuelMax / 5) * 1.5, 5);
  }
  if (fuelMax < 0) {
    ctx.fillRect(167, 25, (fuelMax / 5) * 1.5, 5);
    up = false;
    left = false;
    right = false;
  }
};

// Draws lives left at top

const drawLivesLeft = () => {
  ctx.fillStyle = "white";
  ctx.font = "10px Courier";

  ctx.fillText(`Lives: ${lives} `, 40, 15);
};

// Loop that handles game actually working
const gamePlayLoop = () => {
  gameLoop = setInterval(() => {
    // Pulls Lander down

    downMomentum += 0.02;

    y += downMomentum;

    compileAllDrawsandProcesses();

    // Ends game if Lander too far out of

    if (y < -300 || x > 550 || x < -550) {
      clearInterval(gameLoop);
      gameEnd();
    }

    // Stop Decent at Surface
    if (y > 242) {
      // Check Velocity

      if (downMomentum > 1) {
        destroyLander();
      } else {
        clearInterval(gameLoop);
        up = false;
        left = false;
        right = false;
        compileAllDrawsandProcesses();
        level++;
        setTimeout(() => {
          clearCanvas();
          drawCanvasBlack();
          drawStars();
          ctx.font = "22px Courier";
          ctx.fillText(`Level ${level}`, 113, 150);

          setTimeout(() => {
            levels();
          }, 1000);
        }, 1000);
      }
    }
  }, 20);
};

// Draws black canvas background

const drawCanvasBlack = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, c.width, c.height);
};

// Clears canvas

const clearCanvas = () => {
  ctx.clearRect(0, 0, c.width, c.height);
};

// Handles key press down

function onKeyDown(e) {
  e = e || window.event;

  if (fuelMax > 0) {
    if (e.keyCode === 38) {
      // up arrow
      up = true;
      fuelMax -= 2;
    }
    if (e.keyCode === 40) {
      // down arrow
    }

    if (e.keyCode === 37) {
      // left arrow
      left = true;
      fuelMax -= 1;
    }
    if (e.keyCode === 39) {
      // right arrow
      right = true;
      fuelMax -= 1;
    }
  }
}

// Handles key press release

function onKeyUp(e) {
  e = e || window.event;

  if (e.keyCode === 38) {
    up = false;
  }
  if (e.keyCode === 37) {
    left = false;
  }
  if (e.keyCode === 39) {
    right = false;
  }
}

// Left button press

const leftGo = () => {
  if (fuelMax > 0) {
    left = true;
    fuelMax -= 1;
  }
};

// Left button release

const leftStop = () => {
  left = false;
};

// Right button press

const rightGo = () => {
  if (fuelMax > 0) {
    right = true;
    fuelMax -= 1;
  }
};

// Right button release

const rightStop = () => {
  right = false;
};

// Up button press

const upGo = () => {
  if (fuelMax > 0) {
    up = true;
    fuelMax -= 2;
  }
};
// Up button release

const upStop = () => {
  up = false;
};

// Start game button press

const startGame = () => {
  loadGame();
  gameStart = true;
  hideStartButton();
};

// Handles game ending if win

const gameVictory = () => {
  reset();
  x = 140;
  y = 242;
  let liftoff = setInterval(() => {
    clearCanvas();
    drawCanvasBlack();
    drawSurface();
    up = true;
    y = y - 3;
    drawLanderAndRockets();
    setTimeout(() => {
      clearInterval(liftoff);
      ctx.font = "22px Courier";
      ctx.fillStyle = "white";
      ctx.fillText(`Game Over`, 100, 150);
      setTimeout(() => {
        gameReset();
      }, 3000);
    }, 2500);
  }, 20);
};

// Hides game start button

const hideStartButton = () => {
  var x = document.getElementById("start");
  console.log(x);
  if (x.style.display === "none") {
    x.style.display = "";
  } else {
    x.style.display = "none";
  }
};

// Handles the calculation of momentum

const calculateMomentum = () => {
  if (left === true) {
    if (rightMomentum > 0) {
      rightMomentum = rightMomentum - 0.025;
    } else {
      if (leftMomentum < 1) leftMomentum = leftMomentum + 0.05;
    }
  }
  x -= leftMomentum;

  if (right === true) {
    if (leftMomentum > 0) {
      leftMomentum = leftMomentum - 0.025;
    } else {
      if (rightMomentum < 1) rightMomentum = rightMomentum + 0.05;
    }
  }
  x += rightMomentum;

  if (up === true) {
    downMomentum -= 0.1;

    y -= upMomentum * 0.5;
  }
};

const init = () => {
  makeStarsArray();
  intro();
};

init();
