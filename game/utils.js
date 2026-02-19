import { INIT_BOARD_VALUES } from './constants.js';
export const detectCollision = (a, b) => {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
};

export const generateBoard = (document) => {
	let board = document.getElementById('board');
	board.width = INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.col;
	board.height = INIT_BOARD_VALUES.tileSize * INIT_BOARD_VALUES.row;
	return board;
};

export const clearBullets = (bulletArray) => {
	while (
		bulletArray.length > 0 &&
		(bulletArray[0].used || bulletArray[0].y < 0)
	) {
		bulletArray.shift();
	}
};
