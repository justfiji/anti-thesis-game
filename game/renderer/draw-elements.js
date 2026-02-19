import { INIT_ALIEN_VALUES } from '../constants.js';

/**
 * Draws all aliens to canvas and handles their movement
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Array} alienArray - Array of alien objects
 * @param {number} boardWidth - Width of the game board
 * @param {number} shipY - Y position of the ship (for game over check)
 * @param {number} alienVelocityX - Current horizontal velocity of aliens
 * @returns {Object} { alienVelocityX, gameOver } - Updated velocity and game over state
 */
export const drawAliensToCanvas = (
	ctx,
	alienArray,
	boardWidth,
	shipY,
	alienVelocityX,
) => {
	let newVelocityX = alienVelocityX;
	let gameOver = false;

	alienArray.forEach((alien) => {
		if (alien.alive) {
			alien.x += newVelocityX;

			//if alien touches border, reverse direction and move down
			if (alien.x + alien.width > boardWidth || alien.x < 0) {
				newVelocityX *= -1;
				alien.x += newVelocityX * 2;

				//move all aliens down one row
				for (let j = 0; j < alienArray.length; j++) {
					alienArray[j].y += INIT_ALIEN_VALUES.height;
				}
			}

			ctx.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);

			//if the alien passes the ship, game over
			if (alien.y > shipY) {
				gameOver = true;
			}
		}
	});

	return { alienVelocityX: newVelocityX, gameOver };
};

/**
 * Draws all bullets to canvas, moves them, and checks for collisions with aliens
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Array} bulletArray - Array of bullet objects
 * @param {Image} bulletImg - The preloaded bullet image
 * @param {number} bulletVelocityY - Vertical velocity of bullets (negative = upward)
 * @param {Array} alienArray - Array of alien objects to check collisions against
 * @param {Function} detectCollision - Collision detection function
 * @returns {Object} { alienCount, score } - Number of aliens killed and score earned this frame
 */
export const drawBulletsToCanvas = (
	ctx,
	bulletArray,
	bulletImg,
	bulletVelocityY,
	alienArray,
	detectCollision,
) => {
	let aliensKilled = 0;
	let scoreEarned = 0;

	for (let i = 0; i < bulletArray.length; i++) {
		let bullet = bulletArray[i];
		bullet.y += bulletVelocityY;
		ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);

		//bullet collision with aliens
		for (let j = 0; j < alienArray.length; j++) {
			let alien = alienArray[j];
			if (!bullet.used && alien.alive && detectCollision(alien, bullet)) {
				bullet.used = true;
				alien.alive = false;
				aliensKilled++;
				scoreEarned += 100;
			}
		}
	}

	return { aliensKilled, scoreEarned };
};
