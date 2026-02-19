/**
 * Fires two bullets from the ship when spacebar is pressed
 * @param {KeyboardEvent} e - The keyboard event
 * @param {Object} ship - The player's ship with x, y position
 * @param {number} tileSize - Size of one game tile in pixels
 * @param {Array} bulletArray - Array to store all active bullets
 * @param {boolean} gameOver - If true, shooting is disabled
 */
export const shoot = (e, ship, tileSize, bulletArray, gameOver) => {
	// Don't allow shooting if game has ended
	if (gameOver) {
		return;
	}

	// Only fire when spacebar is pressed
	if (e.code === 'Space') {
		// Create left bullet - positioned on left side of ship
		// x: ship.x + 26.5 offsets bullet to align with left gun
		let leftBullet = {
			x: ship.x + 26.5,
			y: ship.y, // Starts at ship's top edge
			width: tileSize,
			height: tileSize,
			color: 'yellow',
			used: false, // Tracks if bullet hit something (for cleanup)
		};

		// Create right bullet - positioned on right side of ship
		// x: ship.x + tileSize + 40 offsets bullet to align with right gun
		let rightBullet = {
			x: ship.x + tileSize + 40,
			y: ship.y,
			width: tileSize,
			height: tileSize,
			color: 'yellow',
			used: false,
		};

		// Add both bullets to the game's bullet array
		// They will be drawn and moved in the update() loop
		bulletArray.push(leftBullet);
		bulletArray.push(rightBullet);
	}
};

export const moveShip = (e, ship, boardWidth, gameOver, shipVelocityX) => {
	if (gameOver) {
		return;
	}
	if (e.code === 'ArrowLeft' && ship.x > 0) {
		ship.x -= shipVelocityX;
	} else if (e.code === 'ArrowRight' && ship.x < boardWidth - ship.width) {
		ship.x += shipVelocityX;
	}
};
