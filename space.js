import {
	INIT_BOARD_VALUES,
	INIT_ALIEN_VALUES,
	INIT_BULLET_VALUES,
} from './game/constants.js';
import { shoot, moveShip } from './game/actions/hero.js';
import { clearBullets, detectCollision, generateBoard } from './game/utils.js';
import { createAliens, spawnNextWave } from './game/aliens.js';
import {
	drawAliensToCanvas,
	drawBulletsToCanvas,
} from './game/renderer/draw-elements.js';
// Board

let board;
let boardWidth = INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.col;
let boardHeight = INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.row;

//ship

let shipWidth = INIT_BOARD_VALUES.tileSize * 3;
let shipHeight = INIT_BOARD_VALUES.tileSize * 2;
let shipX =
	(INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.col) / 2 -
	INIT_BOARD_VALUES.tileSize;
let shipY =
	INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.row -
	INIT_BOARD_VALUES.tileSize * 2;
let ship = {
	x: shipX,
	y: shipY,
	width: shipWidth,
	height: shipHeight,
	color: 'pink',
};

// aliens
let alienArray = [];
let alienHeigth = INIT_ALIEN_VALUES.height;
let alienX = INIT_ALIEN_VALUES.x;
let alienY = INIT_ALIEN_VALUES.y;
let alienImg;
let alienRows = INIT_ALIEN_VALUES.rows;
let alienColumns = INIT_ALIEN_VALUES.columns;
let alienCount = 0; //number of aliens to defeat
let alienVelocityX = 1;

//bullets
let bulletImg;
let bulletArray = [];
let bulletVelcityY = INIT_BULLET_VALUES.velocityY;
let score = 0;
let gameOver = false;

//ship
let shipImg;
let shipVelocityX = INIT_BOARD_VALUES.tileSize;
let ctx;

window.onload = function () {
	board = generateBoard(this.document);

	ctx = board.getContext('2d');

	//draw inital ship
	ctx.fillStyle = ship.color;
	ctx.fillRect(ship.x, ship.y, ship.width, ship.height);

	//load images
	shipImg = new Image();
	shipImg.src = './assets/ship-asset.png';
	shipImg.onload = function () {
		ctx.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
	};

	//load bullet image
	bulletImg = new Image();
	bulletImg.src = './assets/hero/ship-bullet.png';

	//load alien images
	alienImg = new Image();
	alienImg.src = './assets/alien-bug-one.png';

	//create initial aliens
	const aliens = createAliens(alienColumns, alienRows, alienImg);
	alienArray = aliens.alienArray;
	alienCount = aliens.alienCount;

	//event listener for user input
	document.addEventListener('keydown', handleMoveShip);
	document.addEventListener('keyup', handleShootBullet);

	requestAnimationFrame(update);
};

function update() {
	requestAnimationFrame(update);

	if (gameOver) {
		return;
	}

	//clear ship
	ctx.clearRect(0, 0, boardWidth, boardHeight);
	ctx.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

	// Draw aliens and update their state
	const alienState = drawAliensToCanvas(
		ctx,
		alienArray,
		boardWidth,
		ship.y,
		alienVelocityX,
	);
	alienVelocityX = alienState.alienVelocityX;
	if (alienState.gameOver) {
		gameOver = true;
	}

	//draw bullets and handle collisions
	const bulletState = drawBulletsToCanvas(
		ctx,
		bulletArray,
		bulletImg,
		bulletVelcityY,
		alienArray,
		detectCollision,
	);
	alienCount -= bulletState.aliensKilled;
	score += bulletState.scoreEarned;

	//clear bullets
	clearBullets(bulletArray);

	if (alienCount === 0) {
		// Spawn next wave with increased difficulty
		bulletArray = [];
		const nextWave = spawnNextWave(alienColumns, alienRows, alienVelocityX, alienImg);
		alienColumns = nextWave.alienColumns;
		alienRows = nextWave.alienRows;
		alienVelocityX = nextWave.alienVelocityX;
		alienArray = nextWave.alienArray;
		alienCount = nextWave.alienCount;
	}

	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText('Score: ' + score, 10, 30);
}

const handleMoveShip = (e) => {
	moveShip(e, ship, boardWidth, gameOver, shipVelocityX);
};

const handleShootBullet = (e) => {
	shoot(e, ship, INIT_BOARD_VALUES.tileSize, bulletArray, gameOver);
};
