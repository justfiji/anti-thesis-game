import { INIT_BOARD_VALUES } from './game/constants.js';
import { shoot, moveShip } from './game/actions/hero.js';
import { clearBullets, detectCollision, generateBoard } from './game/utils.js';
import { createAliens, spawnNextWave } from './game/aliens.js';
import {
	drawAliensToCanvas,
	drawBulletsToCanvas,
} from './game/renderer/draw-elements.js';
import { gameState, resetGameState } from './game/gameState.js';

window.onload = function () {
	// Preload all images while on start screen
	gameState.shipImg = new Image();
	gameState.shipImg.src = './assets/ship-asset.png';

	gameState.bulletImg = new Image();
	gameState.bulletImg.src = './assets/hero/ship-bullet.png';

	gameState.alienImg = new Image();
	gameState.alienImg.src = './assets/alien-bug-one.png';

	// Set up start button handler
	document.getElementById('start-btn').addEventListener('click', startGame);
	document.getElementById('restart-btn').addEventListener('click', restartGame);
};

function startGame() {
	// Hide start screen, show game
	document.getElementById('start-screen').classList.add('hidden');
	document.getElementById('game-container').classList.remove('hidden');

	// Initialize the game board
	gameState.board = generateBoard(document);
	gameState.ctx = gameState.board.getContext('2d');

	// Create initial aliens
	const aliens = createAliens(
		gameState.alienColumns,
		gameState.alienRows,
		gameState.alienImg,
	);
	gameState.alienArray = aliens.alienArray;
	gameState.alienCount = aliens.alienCount;

	// Event listeners for user input
	document.addEventListener('keydown', handleMoveShip);
	document.addEventListener('keyup', handleShootBullet);

	// Start the game loop
	requestAnimationFrame(update);
}

function update() {
	requestAnimationFrame(update);

	if (gameState.gameOver) {
		showGameOver();
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
	document.getElementById('score-box').innerText = 'Score: ' + gameState.score;
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

function showGameOver() {
	document.getElementById('game-container').classList.add('hidden');
	document.getElementById('restart-screen').classList.remove('hidden');
	document.getElementById('final-score').innerText = gameState.score;
}

function restartGame() {
	// Hide restart screen, show game
	document.getElementById('restart-screen').classList.add('hidden');
	document.getElementById('game-container').classList.remove('hidden');

	// Reset game state
	resetGameState();

	// Reinitialize
	gameState.board = document.getElementById('board');
	gameState.ctx = gameState.board.getContext('2d');

	// Create initial aliens
	const aliens = createAliens(
		gameState.alienColumns,
		gameState.alienRows,
		gameState.alienImg,
	);
	gameState.alienArray = aliens.alienArray;
	gameState.alienCount = aliens.alienCount;

	// Reset score display
	document.getElementById('score-box').innerText = 'Score: 0';
}
