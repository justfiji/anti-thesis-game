import {
	INIT_BOARD_VALUES,
	INIT_ALIEN_VALUES,
	INIT_BULLET_VALUES,
} from './game/constants.js';
import { shoot, moveShip } from './game/actions/hero.js';
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
let alienWidth = INIT_ALIEN_VALUES.width;
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
	board = this.document.getElementById('board');
	board.width = boardWidth;
	board.height = boardHeight;
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

	createAliens(); //create initial aliens

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

	//draw aliens
	alienArray.forEach((alien) => {
		if (alien.alive) {
			alien.x += alienVelocityX;

			//if alien touch border reverse direction and move down
			if (alien.x + alien.width > boardWidth || alien.x < 0) {
				alienVelocityX *= -1;
				alien.x += alienVelocityX * 2;

				//move alien down one row
				for (let j = 0; j < alienArray.length; j++) {
					alienArray[j].y += alienHeigth;
				}
			}
			ctx.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);

			//if the alien passes the ship, game over
			if (alien.y > ship.y) {
				gameOver = true;
			}
		}
	});

	//draw the bullets
	for (let i = 0; i < bulletArray.length; i++) {
		let bullet = bulletArray[i];
		bullet.y += bulletVelcityY;
		ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);

		//bullet collision
		for (let j = 0; j < alienArray.length; j++) {
			let alien = alienArray[j];
			if (!bullet.used && alien.alive && detectCollision(alien, bullet)) {
				bullet.used = true;
				alien.alive = false;
				alienCount--;
				score += 100;
			}
		}
	}

	//clear bullets
	while (
		bulletArray.length > 0 &&
		(bulletArray[0].used || bulletArray[0].y < 0)
	) {
		bulletArray.shift();
	}

	if (alienCount === 0) {
		//increase the number of alien in teh column and rows by 1
		alienColumns = Math.min(alienColumns + 1, INIT_BOARD_VALUES.col / 2 - 1); //cap at 16/2 - 2 = 6
		alienRows = Math.min(alienRows + 1, INIT_BOARD_VALUES.row - 4); //cap at 16-4 = 12
		alienVelocityX += 0.5; //increase alien speed
		//reset the alien array and create new aliens
		alienArray = [];
		bulletArray = []; // to clear the bullets after the
		createAliens();
	}

	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText('Score: ' + score, 10, 30);

	console.log('bullet count', bulletArray.length);
}

const handleMoveShip = (e) => {
	moveShip(e, ship, boardWidth, gameOver, shipVelocityX);
};

const handleShootBullet = (e) => {
	shoot(e, ship, INIT_BOARD_VALUES.tileSize, bulletArray, gameOver);
};

function createAliens() {
	for (let c = 0; c < alienColumns; c++) {
		for (let r = 0; r < alienRows; r++) {
			let alien = {
				img: alienImg,
				x: alienX + c * INIT_ALIEN_VALUES.width,
				y: alienY + r * INIT_ALIEN_VALUES.height,
				width: INIT_ALIEN_VALUES.width,
				height: INIT_ALIEN_VALUES.height,
				alive: true,
			};
			alienArray.push(alien);
		}
	}
	alienCount = alienArray.length;
}

function detectCollision(a, b) {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
}
