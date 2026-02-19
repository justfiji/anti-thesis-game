// Board

let tileSize = 64;
let row = 16;
let col = 16;

let board;
let boardWidth = tileSize * col;
let boardHeight = tileSize * row;

//ship

let shipWidth = tileSize * 3;
let shipHeight = tileSize * 2;
let shipX = (tileSize * col) / 2 - tileSize;
let shipY = tileSize * row - tileSize * 2;
let ship = {
	x: shipX,
	y: shipY,
	width: shipWidth,
	height: shipHeight,
	color: 'pink',
};

// aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeigth = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of aliens to defeat
let alienVelocityX = 1;

//bullets
let bulletImg;
let bulletArray = [];
let bulletVelcityY = -10;

let score = 0;
let gameOver = false;

//ship
let shipImg;
let shipVelocityX = tileSize;

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

	document.addEventListener('keydown', moveShip);
	document.addEventListener('keyup', shoot);
};
requestAnimationFrame(update);

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
		alienColumns = Math.min(alienColumns + 1, col / 2 - 1); //cap at 16/2 - 2 = 6
		alienRows = Math.min(alienRows + 1, row - 4); //cap at 16-4 = 12
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

function moveShip(e) {
	if (gameOver) {
		return;
	}
	if (e.code === 'ArrowLeft' && ship.x > 0) {
		ship.x -= shipVelocityX;
	} else if (e.code === 'ArrowRight' && ship.x < boardWidth - ship.width) {
		ship.x += shipVelocityX;
	}
}

function createAliens() {
	for (let c = 0; c < alienColumns; c++) {
		for (let r = 0; r < alienRows; r++) {
			let alien = {
				img: alienImg,
				x: alienX + c * alienWidth,
				y: alienY + r * alienHeigth,
				width: alienWidth,
				height: alienHeigth,
				alive: true,
			};
			alienArray.push(alien);
		}
	}
	alienCount = alienArray.length;
}

function shoot(e) {
	console.log('shooting');
	if (gameOver) {
		return;
	}
	if (e.code === 'Space') {
		let leftBullet = {
			x: ship.x + 26.5,
			y: ship.y,
			width: tileSize,
			height: tileSize,
			color: 'yellow',
			used: false,
		};
		let rightBullet = {
			x: ship.x + tileSize + 40,
			y: ship.y,
			width: tileSize,
			height: tileSize,
			color: 'yellow',
			used: false,
		};
		bulletArray.push(leftBullet);
		bulletArray.push(rightBullet);
	}
}

function detectCollision(a, b) {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
}
