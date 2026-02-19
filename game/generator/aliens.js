import { INIT_ALIEN_VALUES, INIT_BOARD_VALUES } from '../constants.js';

/**
 * Creates a grid of aliens based on the specified columns and rows
 * @param {number} alienColumns - Number of alien columns to create
 * @param {number} alienRows - Number of alien rows to create
 * @param {Image} alienImg - The preloaded alien image
 * @returns {Object} Object containing alienArray and alienCount
 */
export const createAliens = (alienColumns, alienRows, alienImg) => {
	const alienArray = [];

	for (let c = 0; c < alienColumns; c++) {
		for (let r = 0; r < alienRows; r++) {
			let alien = {
				img: alienImg,
				x: INIT_ALIEN_VALUES.x + c * INIT_ALIEN_VALUES.width,
				y: INIT_ALIEN_VALUES.y + r * INIT_ALIEN_VALUES.height,
				width: INIT_ALIEN_VALUES.width,
				height: INIT_ALIEN_VALUES.height,
				alive: true,
			};
			alienArray.push(alien);
		}
	}

	return {
		alienArray,
		alienCount: alienArray.length,
	};
};

/**
 * Spawns the next wave of aliens with increased difficulty
 * @param {number} currentColumns - Current number of alien columns
 * @param {number} currentRows - Current number of alien rows
 * @param {number} currentVelocityX - Current alien horizontal speed
 * @param {Image} alienImg - The preloaded alien image
 * @returns {Object} { alienColumns, alienRows, alienVelocityX, alienArray, alienCount }
 */
export const spawnNextWave = (
	currentColumns,
	currentRows,
	currentVelocityX,
	alienImg,
) => {
	// Increase difficulty - more columns and rows, capped at max values
	const alienColumns = Math.min(
		currentColumns + 1,
		INIT_BOARD_VALUES.col / 2 - 1,
	);
	const alienRows = Math.min(currentRows + 1, INIT_BOARD_VALUES.row - 4);
	const alienVelocityX = currentVelocityX + 0.5;

	// Create the new wave of aliens
	const { alienArray, alienCount } = createAliens(
		alienColumns,
		alienRows,
		alienImg,
	);

	return {
		alienColumns,
		alienRows,
		alienVelocityX,
		alienArray,
		alienCount,
	};
};
