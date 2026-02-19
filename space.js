import { INIT_BOARD_VALUES } from './game/constants.js';
import { shoot, moveShip } from './game/actions/hero.js';
import { clearBullets, detectCollision, generateBoard } from './game/utils.js';
import { createAliens, spawnNextWave } from './game/aliens.js';
import {
	drawAliensToCanvas,
	drawBulletsToCanvas,
} from './game/renderer/draw-elements.js';
import { gameState } from './game/gameState.js';

window.onload = function () {
	gameState.board = generateBoard(this.document);
	gameState.ctx = gameState.board.getContext('2d');

	//draw inital ship
	gameState.ctx.fillStyle = gameState.ship.color;
	gameState.ctx.fillRect(
		gameState.ship.x,
		gameState.ship.y,
		gameState.ship.width,
		gameState.ship.height,
	);

	//load images
	gameState.shipImg = new Image();
	gameState.shipImg.src = './assets/ship-asset.png';
	gameState.shipImg.onload = function () {
		gameState.ctx.drawImage(
			gameState.shipImg,
			gameState.ship.x,
			gameState.ship.y,
			gameState.ship.width,
			gameState.ship.height,
		);
	};

	//load bullet image
	gameState.bulletImg = new Image();
	gameState.bulletImg.src = './assets/hero/ship-bullet.png';

	//load alien images
	gameState.alienImg = new Image();
	gameState.alienImg.src = './assets/alien-bug-one.png';

	//create initial aliens
	const aliens = createAliens(
		gameState.alienColumns,
		gameState.alienRows,
		gameState.alienImg,
	);
	gameState.alienArray = aliens.alienArray;
	gameState.alienCount = aliens.alienCount;

	//event listener for user input
	document.addEventListener('keydown', handleMoveShip);
	document.addEventListener('keyup', handleShootBullet);

	requestAnimationFrame(update);
};

function update() {
	requestAnimationFrame(update);

	if (gameState.gameOver) {
		return;
	}

	//clear board
	gameState.ctx.clearRect(0, 0, gameState.boardWidth, gameState.boardHeight);
	gameState.ctx.drawImage(
		gameState.shipImg,
		gameState.ship.x,
		gameState.ship.y,
		gameState.ship.width,
		gameState.ship.height,
	);

	// Draw aliens and update their state
	const alienState = drawAliensToCanvas(
		gameState.ctx,
		gameState.alienArray,
		gameState.boardWidth,
		gameState.ship.y,
		gameState.alienVelocityX,
	);
	gameState.alienVelocityX = alienState.alienVelocityX;
	if (alienState.gameOver) {
		gameState.gameOver = true;
	}

	//draw bullets and handle collisions
	const bulletState = drawBulletsToCanvas(
		gameState.ctx,
		gameState.bulletArray,
		gameState.bulletImg,
		gameState.bulletVelocityY,
		gameState.alienArray,
		detectCollision,
	);
	gameState.alienCount -= bulletState.aliensKilled;
	gameState.score += bulletState.scoreEarned;

	//clear bullets
	clearBullets(gameState.bulletArray);

	if (gameState.alienCount === 0) {
		// Spawn next wave with increased difficulty
		gameState.bulletArray = [];
		const nextWave = spawnNextWave(
			gameState.alienColumns,
			gameState.alienRows,
			gameState.alienVelocityX,
			gameState.alienImg,
		);
		gameState.alienColumns = nextWave.alienColumns;
		gameState.alienRows = nextWave.alienRows;
		gameState.alienVelocityX = nextWave.alienVelocityX;
		gameState.alienArray = nextWave.alienArray;
		gameState.alienCount = nextWave.alienCount;
	}

	gameState.ctx.fillStyle = 'white';
	gameState.ctx.font = '20px Arial';
	gameState.ctx.fillText('Score: ' + gameState.score, 10, 30);
}

const handleMoveShip = (e) => {
	moveShip(
		e,
		gameState.ship,
		gameState.boardWidth,
		gameState.gameOver,
		gameState.shipVelocityX,
	);
};

const handleShootBullet = (e) => {
	shoot(
		e,
		gameState.ship,
		INIT_BOARD_VALUES.tileSize,
		gameState.bulletArray,
		gameState.gameOver,
	);
};
