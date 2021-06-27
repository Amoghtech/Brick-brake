let grid = document.querySelector('.grid');
const blockwidth = 100;
const blockheight = 20;
const boardwidth = 570;
const boardheight = 300;
const scorediaplay = document.querySelector('#score');
const userStart = [230, 10];
let currentposition = userStart;
let timerid;
const balldiameter = 20;
const ballstart = [230, 40];
let ballcurrentposition = ballstart;

let xdirection = 2;
let ydirection = 2;
let score = 0;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomleft = [xAxis, yAxis];
    this.bottomright = [xAxis + blockwidth, yAxis];
    this.topleft = [xAxis, yAxis + blockheight];
    this.topright = [xAxis + blockwidth, yAxis + blockheight];
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];
let random = [...blocks];
function addblock() {
  for (let i = 0; i < blocks.length; i++) {
    let block = document.createElement('div');
    block.classList.add('block');
    block.style.left = blocks[i].bottomleft[0] + 'px';
    block.style.bottom = blocks[i].bottomleft[1] + 'px';
    grid.appendChild(block);
  }
}

addblock();

//add user
const user = document.createElement('div');
user.classList.add('user');
drawuser();
grid.appendChild(user);

//draw the user
function drawuser() {
  user.style.left = currentposition[0] + 'px';
  user.style.bottom = currentposition[1] + 'px';
}

//moving
function moveuser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentposition[0] > 0) {
        currentposition[0] -= 10;
        drawuser();
      }
      break;
    case 'ArrowRight': {
      if (currentposition[0] < boardwidth - blockwidth) {
        currentposition[0] += 10;
        drawuser();
      }

      break;
    }
  }
}

document.addEventListener('keydown', moveuser);

function drawball() {
  ball.style.left = ballcurrentposition[0] + 'px';
  ball.style.bottom = ballcurrentposition[1] + 'px';
}

//add ball
const ball = document.createElement('div');
ball.classList.add('ball');
drawball();
grid.appendChild(ball);

//move the ball
function moveball() {
  ballcurrentposition[0] += xdirection;
  ballcurrentposition[1] += ydirection;
  drawball();
  checkforcollision();
}

let s = 20;

//check for collision
function checkforcollision() {
  //block collision

  for (let i = 0; i < random.length; i++) {
    if (
      ballcurrentposition[0] > random[i].bottomleft[0] &&
      ballcurrentposition[0] < random[i].bottomright[0] &&
      ballcurrentposition[1] + balldiameter > random[i].bottomleft[1] &&
      ballcurrentposition[1] < random[i].topleft[1]
    ) {
      const allblocks = Array.from(document.querySelectorAll('.block'));
      //    console.log(allblocks);
      allblocks[i].classList.remove('block');
      random.splice(i, 1);
      changedirection();
      score++;
      scorediaplay.innerHTML = score;
      if (random.length === 0) {
        let l = +document.querySelector('.level').innerHTML;
        if (l > 4) {
          scorediaplay.innerHTML = 'YOU WIN';
          document.removeEventListener('keydown', moveuser);
          return;
        }
        console.log(blocks);
        console.log('random: ', random);
        addblock();
        random = [...blocks];
        l += 1;
        document.querySelector('.level').innerHTML = l;
        s -= 10;
      }
    }
  }

  if (
    ballcurrentposition[0] >= boardwidth - balldiameter ||
    ballcurrentposition[1] >= boardheight - balldiameter ||
    ballcurrentposition[0] <= 0
  ) {
    changedirection();
  }

  //chack for user's collision
  if (
    ballcurrentposition[0] > currentposition[0] &&
    ballcurrentposition[0] < currentposition[0] + blockwidth &&
    ballcurrentposition[1] > currentposition[1] &&
    ballcurrentposition[1] < currentposition[1] + blockheight
  ) {
    changedirection();
  }

  if (ballcurrentposition[1] <= 0) {
    clearInterval(timerid);
    scorediaplay.innerHTML = 'You Lose';
    document.removeEventListener('keydown', moveuser);
  }
}

function changedirection() {
  if (xdirection === 2 && ydirection === 2) {
    ydirection = -2;
    return;
  }
  if (xdirection === 2 && ydirection === -2) {
    xdirection = -2;
    return;
  }
  if (xdirection === -2 && ydirection === -2) {
    ydirection = 2;
    return;
  }
  if (xdirection === -2 && ydirection === 2) {
    xdirection = 2;
    return;
  }
}

timerid = setInterval(moveball, s);
