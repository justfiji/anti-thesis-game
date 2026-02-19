export const INIT_BOARD_VALUES = {
	tileSize: 64,
	row: 16,
	col: 16,
};

export const INIT_ALIEN_VALUES = {
	width: INIT_BOARD_VALUES.tileSize * 2,
	height: INIT_BOARD_VALUES.tileSize,
	x: INIT_BOARD_VALUES.tileSize,
	y: INIT_BOARD_VALUES.tileSize,
	rows: 2,
	columns: 3,
};

export const INIT_BULLET_VALUES = {
	velocityY: -10,
};
