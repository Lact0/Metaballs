window.onresize = changeWindow;
const balls = [];
const vels = [];
const threshold = 1;
let grid = [];
let gridX = 0;
let gridY = 0;
let dotDist = 20;

function load() {
  makeGrid();
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  ctx.strokeStyle = 'white';
  for(let i = 0; i < 10; i++) {
    balls.push(new Metaball());
    const angle = Math.random() * Math.PI * 2;
    vels.push(new Vector(Math.cos(angle), Math.sin(angle)));
    vels[i].setMag(1);
  }
  runFrame();
}

function runFrame() {
  ctx.clearRect(0, 0, width, height);
  for(let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    const vel = vels[i];
    ball.pos.add(vel);
    if(ball.pos.x <= 0 || ball.pos.x >= width) {
      ball.pos.x = min(max(ball.pos.x, 0), width);
      vel.x *= -1;
    }
    if(ball.pos.y <= 0 || ball.pos.y >= height) {
      ball.pos.y = min(max(ball.pos.y, 0), height);
      vel.y *= -1;
    }

    // ctx.beginPath();
    // ctx.arc(ball.pos.x, ball.pos.y, ball.r, 0, Math.PI * 2);
    // ctx.stroke();
  }
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      grid[i][j] = 0;
      let pos = new Vector(gridX + dotDist * i, gridY + dotDist * j, 1, 1)
      for(let ball of balls) {
        grid[i][j] += max(ball.r - pos.distTo(ball.pos), 0);
      }
      const color = grid[i][j] >= threshold ? 0 : 255;
      ctx.fillStyle = 'rgba( 255, ' + color + ', ' + color + ', 1)';
      ctx.fillRect(pos.x, pos.y, 1, 1);
    }
  }
  requestAnimationFrame(runFrame);
}

function marchSquares() {
  for(let i = 0; i < grid.length - 1; i++) {
    for(let j = 0; j < grid[i].length - 1; i++) {
      let x = gridX + dotDist * i;
      let y = gridY + dotDist * j;
    }
  }
}

function makeGrid() {
  grid = [];
  gridX = (dotDist - (width % dotDist)) / -2;
  gridY = (dotDist - (height % dotDist)) / -2;
  for(let i = gridX; i <= width + dotDist; i += dotDist) {
    const temp = [];
    for(let j = gridY; j <= height + dotDist; j += dotDist) {
      temp.push([0]);
    }
    grid.push(temp);
  }
}

function changeWindow() {
  width = window.innerWidth;
  height = window.innerHeight;
  //REDRAW SCREEN
  makeGrid();
}

function keyPress(key) {
  if(key.keyCode != 32) {
    return;
  }
}

function leftClick() {
  const x = event.clientX;
  const y = event.clientY;
}
