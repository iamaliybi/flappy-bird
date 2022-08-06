import Player from "./classes/Player";
import Platform from "./classes/Platform";
import GenericObject from "./classes/GenericObject";
import { createImage, isBetween } from './helper';
import Pipe from "./classes/Pipe";

/* Variables */
let JUMP_KEY_PRESSED = false;

const SIZES = {
	GROUND: {
		WIDTH: Math.floor(37 * 2 / 3),
		HEIGHT: Math.floor(128 * 2 / 3)
	}
}

let animation: number,
	width: number,
	height: number,
	player: Player,
	platforms: Platform[],
	genericObjects: GenericObject[],
	scrollOffset: number = 0,
	reached: number = 0,
	gravity: number = 0.23,
	stillness: boolean = false,
	pipes: Pipe[];

const IMAGES = {
	ground: 'http://localhost/Github/flappy-bird/public/images/ground.png',
	background: 'http://localhost/Github/flappy-bird/public/images/background.png'
}

const canvas = document.getElementById('flappyBird') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

/* Code */
const addNewPlatform = () => {
	const platformImage = createImage(IMAGES.ground);

	const platform = new Platform({
		ctx,
		image: platformImage,
		width: SIZES.GROUND.WIDTH,
		height: SIZES.GROUND.HEIGHT,
		x: (platforms[platforms.length - 1].position.x + SIZES.GROUND.WIDTH),
		y: height - SIZES.GROUND.HEIGHT
	});

	platforms.splice(0, 1);
	platforms.push(platform);
}

const addPipe = () => {
	const pipeHeight = 100;
	const pipe = new Pipe({ ctx, height: pipeHeight, position: { x: scrollOffset + 200, y: height - SIZES.GROUND.HEIGHT - pipeHeight } });

	pipes.push(pipe);
}

const loadPlayer = () => {
	player = new Player({ ctx, screenX: width, screenY: height, g: 0 });
	player.draw();
};

const addPlatforms = () => {
	const platformImage = createImage(IMAGES.ground);

	const groundCount = Math.floor(width / SIZES.GROUND.WIDTH) + 10;
	for (let i = 0; i < groundCount; i++) {
		const platform = new Platform({
			ctx,
			image: platformImage,
			width: SIZES.GROUND.WIDTH,
			height: SIZES.GROUND.HEIGHT,
			x: (i * SIZES.GROUND.WIDTH),
			y: height - SIZES.GROUND.HEIGHT
		});

		platforms.push(platform);
	}
};

const addGenericObjects = () => {
	const bgImage = createImage(IMAGES.background);

	genericObjects.push(new GenericObject({
		ctx,
		image: bgImage,
		width,
		height: height - SIZES.GROUND.HEIGHT,
		x: -1,
		y: -1
	}));
};

const loadCommonObjects = () => {
	genericObjects.forEach(obj => obj.draw());

	platforms.forEach(platform => platform.draw());
};

const loadPlaygroundObjects = () => {
	pipes.forEach(pipe => pipe.draw());
};

const reset = () => {
	pipes = [];
	platforms = [];
	genericObjects = [];
};

const animate = () => {
	animation = requestAnimationFrame(animate);
	ctx.clearRect(0, 0, width, height);

	if (!stillness) {
		if (scrollOffset > 200 && scrollOffset % SIZES.GROUND.WIDTH === 0) addNewPlatform();
		if (scrollOffset % 25 === 0) player.nextFrame();

		if (reached > 200 && scrollOffset % 200 === 0) addPipe();

		platforms.forEach(platform => platform.position.x -= player.speed);

		pipes.forEach(pipe => pipe.position.x -= player.speed);
	}
	
	loadCommonObjects();


	if (!player.stillness) loadPlaygroundObjects();

	if (player.position.y >= height - SIZES.GROUND.HEIGHT - player.height) {
		player.lose = true;
		stillness = true;
	}

	if (!player.stillness && !stillness) reached += player.speed;
	scrollOffset += player.speed;
	player.update();
};

const start = () => {
	if (animation) cancelAnimationFrame(animation);
	scrollOffset = 0;

	/* Load playground */
	reset();

	/* Add */
	addGenericObjects();
	addPlatforms();

	/* Load */
	loadCommonObjects();
	loadPlayer();

	animate();
};

const init = () => {
	width = window.innerWidth > 480 ? 480 : window.innerWidth;
	height = window.innerHeight > 640 ? 640 : window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	start();
};

const whenPlayerJump = () => {
	/* When user stillness */
	if (player.stillness) {
		player.stillness = false;
		player.gravity = gravity;
	}

	/* When user pressed space */
	player.velocity = -7;

	JUMP_KEY_PRESSED = true;
};

document.addEventListener('mousedown', whenPlayerJump);

document.addEventListener('keypress', ({ keyCode }) => {
	if (![32, 38].includes(keyCode) || player.lose || JUMP_KEY_PRESSED) return;

	whenPlayerJump();
});

document.addEventListener('keyup', ({ keyCode }) => {
	if (![32, 38].includes(keyCode)) return;

	JUMP_KEY_PRESSED = false;
});

document.addEventListener('mouseup', () => {
	JUMP_KEY_PRESSED = false;
});

/* When dom content loaded */
document.addEventListener('DOMContentLoaded', init);