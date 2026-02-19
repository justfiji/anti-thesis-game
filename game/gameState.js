import {
	INIT_BOARD_VALUES,
	INIT_ALIEN_VALUES,
	INIT_BULLET_VALUES,
} from './constants.js';

/**
 * Central game state object
 * All game variables are stored here for easy access across modules
 */
export const gameState = {
	// Board / Canvas
	board: null,
	ctx: null,
	boardWidth: INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.col,
	boardHeight: INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.row,

	// Ship
	ship: {
		x:
			(INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.col) / 2 -
			INIT_BOARD_VALUES.tileSize,
		y:
			INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.row -
			INIT_BOARD_VALUES.tileSize * 2,
		width: INIT_BOARD_VALUES.tileSize * 3,
		height: INIT_BOARD_VALUES.tileSize * 2,
		color: 'pink',
	},
	shipImg: null,
	shipVelocityX: INIT_BOARD_VALUES.tileSize,

	// Aliens
	alienArray: [],
	alienImg: null,
	alienRows: INIT_ALIEN_VALUES.rows,
	alienColumns: INIT_ALIEN_VALUES.columns,
	alienCount: 0,
	alienVelocityX: 1,

	// Bullets
	bulletArray: [],
	bulletImg: null,
	bulletVelocityY: INIT_BULLET_VALUES.velocityY,

	// Game status
	score: 0,
	gameOver: false,
};

/**
 * Reset game state to initial values (for restarting game)
 */
export const resetGameState = () => {
	gameState.ship.x =
		(INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.col) / 2 -
		INIT_BOARD_VALUES.tileSize;
	gameState.ship.y =
		INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.row -
		INIT_BOARD_VALUES.tileSize * 2;

	gameState.alienArray = [];
	gameState.alienRows = INIT_ALIEN_VALUES.rows;
	gameState.alienColumns = INIT_ALIEN_VALUES.columns;
	gameState.alienCount = 0;
	gameState.alienVelocityX = 1;

	gameState.bulletArray = [];

	gameState.score = 0;
	gameState.gameOver = false;
};
