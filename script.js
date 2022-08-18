window.onresize = changeWindow;
const balls = [new Metaball({r: 100})];
const vels = [new Vector()];
const threshold = 50;
let grid = [];
let gridX = 0;
let gridY = 0;
let dotDist = 10;
let smooth = true;

function load() {
  makeGrid();
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  document.onmousemove = mouseBall;
  ctx.strokeStyle = 'white';
  for(let i = 0; i < 20; i++) {
    balls.push(new Metaball({r: rand(100, 150)}));
    const angle = Math.random() * Math.PI * 2;
    vels.push(new Vector(Math.cos(angle), Math.sin(angle)));
    vels[i].setMag(4);
  }
  runFrame();
}

function mouseBall() {
  balls[0].pos.x = event.clientX;
  balls[0].pos.y = event.clientY;
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
      // const color = grid[i][j] >= threshold ? 0 : 255;
      // ctx.fillStyle = 'rgba(' + color + ', ' + color + ', ' + color + ', 1)';
      // ctx.fillRect(pos.x, pos.y, 1, 1);
    }
  }
  marchSquares();
  requestAnimationFrame(runFrame);
}

function marchSquares() {
  for(let i = 0; i < grid.length - 1; i++) {
    for(let j = 0; j < grid[i].length - 1; j++) {
      ctx.strokeStyle = 'white';
      if(i == 5 && j == 5) {
        ctx.strokeStyle = 'red';
      }
      const dot = grid[i][j];
      let x = gridX + dotDist * i;
      let y = gridY + dotDist * j;
      let s = dot > threshold ? '1' : '0';
      s += grid[i + 1][j] > threshold ? '1' : '0';
      s += grid[i + 1][j + 1] > threshold ? '1' : '0';
      s += grid[i][j + 1] > threshold ? '1' : '0';
      
      const top = new Vector(x + dotDist * lerp(grid[i][j], grid[i+1][j], threshold), y);
      const right = new Vector(x + dotDist, y + dotDist * lerp(grid[i + 1][j], grid[i+1][j + 1], threshold));
      const bottom = new Vector(x + dotDist * lerp(grid[i][j + 1], grid[i+1][j + 1], threshold), y + dotDist);
      const left = new Vector(x, y + dotDist * lerp(grid[i][j], grid[i][j + 1], threshold));
      let lines = [];
      switch(s) {
        case '0000':
          //Nothing
          break;
        case '0001':
          lines = [[left, bottom]];
          break;
        case '0010':
          lines = [[bottom, right]];
          break;
        case '0011':
          lines = [[left, right]];
          break;
        case '0100':
          lines = [[top, right]];
          break;
        case '0101':
          lines = [[left, bottom], [top, right]];
          break;
        case '0110':
          lines = [[top, bottom]];
          break;
        case '0111':
          lines = [[left, top]];
          break;
        case '1000':
          lines = [[left, top]];
          break;
        case '1001':
          lines = [[top, bottom]];
          break;
        case '1010':
          lines = [[left, top], [bottom, right]];
          break;
        case '1011':
          lines = [[top, right]];
          break;
        case '1100':
          lines = [[left, right]];
          break;
        case '1101':
          lines = [[bottom, right]];
          break;
        case '1110':
          lines = [[left, bottom]];
          break;
        case '1111':
          //No Lines
          break;
      }
      for(line of lines) {
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        ctx.lineTo(line[1].x, line[1].y);
        ctx.stroke();
      }
    }
  }
}

function lerp(a, b, t) {
  if(!smooth) {
    return .5;
  }
  return (a - t) / (a - b);
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
