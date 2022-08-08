import Player from "./classes/Player";
import Platform from "./classes/Platform";
import GenericObject from "./classes/GenericObject";
import { createImage, encodeScore, getRndInteger, decodeScore } from './helper';
import Pipe from "./classes/Pipe";

/* Variables */
let JUMP_KEY_PRESSED = false;

const SCORE = {
	CURRENT: 0,
	BEST: 0
};

const CONFIG = {
	PLAYER_VELOCITY_WHILE_JUMP: -8,
	PLAYER_SPEED: 4,
	FRAME_CHANGE: 25,
	GRAVITY: 0.4
};

const SIZES = {
	GROUND: {
		WIDTH: Math.floor(37 * 2 / 3),
		HEIGHT: Math.floor(128 * 2 / 3)
	},

	PIPE: {
		WIDTH: 92,
		HEIGHT: 528
	}
}

let animation: number,
	width: number,
	height: number,
	player: Player,
	platforms: Platform[],
	genericObjects: GenericObject[],
	scrollOffset: number = 0,
	stillness: boolean = false,
	pipes: Pipe[];

const BASE_URL = 'https://flappy-bird-ay.netlify.app';
const IMAGES = {
	ground: BASE_URL + '/assets/images/ground.png',
	background: BASE_URL + '/assets/images/background.png',
	restart: BASE_URL + '/assets/images/restart.png'
};

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

	platforms.push(platform);
}

const addPipe = (space: number) => {
	const floor = height - SIZES.PIPE.HEIGHT;
	let lastPipeX: Pipe | number = pipes[pipes.length - 1];
	lastPipeX = lastPipeX ? lastPipeX.position.x + SIZES.PIPE.WIDTH + 20 : scrollOffset + 750;

	const pipe1 = new Pipe({ ctx, position: { x: lastPipeX, y: floor + space }, state: 'bottom' });
	const pipe2 = new Pipe({ ctx, position: { x: lastPipeX, y: pipe1.position.y - SIZES.PIPE.HEIGHT - 225 }, state: 'top' });

	pipes.push(pipe1, pipe2);
}

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

const loadPlayer = () => {
	player = new Player({ ctx, screenX: width, screenY: height, speed: CONFIG.PLAYER_SPEED, g: 0 });
	player.draw();
};

const loadPlaygroundObjects = () => {
	pipes.forEach(pipe => pipe.draw());
};

const reset = () => {
	if (player) player.lose = false;
	stillness = false;

	pipes = [];
	platforms = [];
	genericObjects = [];
};

const cancelAnimation = () => {
	setTimeout(() => cancelAnimationFrame(animation), 25);
};

const whenPlayerLose = (userIsLose: boolean = false) => {
	if (userIsLose || player.height + player.position.y + player.velocity >= platforms[0].position.y) {
		player.position.y = platforms[0].position.y - player.height;
		player.lose = true;

		cancelAnimation();
	}
	stillness = true;

	updateBestScore(SCORE.CURRENT);
	createRestartButton();

	document.body.style.cursor = 'pointer';
	window.addEventListener('click', restart);
};

const whenPlayerDamaged = () => {
	if (!window.canLose) return;

	let reachedPipes = 0;
	pipes.forEach(pipe => {
		if (player.position.x >= pipe.position.x + pipe.width) reachedPipes++;

		if (
			(
				(pipe.state === 'bottom' && player.position.y + player.velocity >= pipe.position.y) ||
				(pipe.state === 'top' && player.position.y - player.velocity <= pipe.position.y + pipe.height)
			) &&
			player.position.x >= pipe.position.x - player.width &&
			player.position.x <= pipe.position.x + pipe.width
		) {
			whenPlayerLose();
		}
	});

	SCORE.CURRENT = Math.floor(reachedPipes / 2);
	updateCurrentScore();
};

const changePlayerFrame = () => {
	if (scrollOffset % CONFIG.FRAME_CHANGE === 0) player.nextFrame();
};

const balancePlatforms = () => {
	if (scrollOffset > SIZES.GROUND.WIDTH && scrollOffset % SIZES.GROUND.WIDTH === 0) {
		addNewPlatform();
		platforms.splice(0, 1);
	}
};

const balancePipes = () => {
	const rnd = getRndInteger(300, 400);
	addPipe(rnd);
};

const movingObjects = () => {
	platforms.forEach(platform => platform.position.x -= player.speed);

	pipes.forEach(pipe => pipe.position.x -= player.speed);
};

const animate = () => {
	// Code
	animation = requestAnimationFrame(animate);
	ctx.clearRect(0, 0, width, height);

	genericObjects.forEach(obj => obj.draw());

	if (!stillness) {
		balancePlatforms();
		changePlayerFrame();
		movingObjects();
	}

	if (!player.stillness) loadPlaygroundObjects();

	player.update();

	if (!player.stillness) {
		balancePipes();
		whenPlayerDamaged();
	}

	platforms.forEach(platform => platform.draw());

	if (player.height + player.position.y + player.velocity >= platforms[0].position.y) whenPlayerLose(true);

	scrollOffset += player.speed;
};

const restart = () => {
	window.removeEventListener('click', restart);
	document.body.style.cursor = 'default';

	start();
};

const start = () => {
	scrollOffset = 0;
	SCORE.CURRENT = 0;

	/* Load playground */
	reset();

	/* Add */
	addGenericObjects();
	addPlatforms();

	/* Load */
	genericObjects.forEach(obj => obj.draw());

	platforms.forEach(platform => platform.draw());

	loadPlayer();
	updateCurrentScore();

	if (animation) cancelAnimation();

	setTimeout(animate, 25);
};

const logMyName = () => {
	console.log(`
██╗░█████╗░███╗░░░███╗░█████╗░██╗░░░░░██╗██╗░░░██╗██████╗░██╗
██║██╔══██╗████╗░████║██╔══██╗██║░░░░░██║╚██╗░██╔╝██╔══██╗██║
██║███████║██╔████╔██║███████║██║░░░░░██║░╚████╔╝░██████╦╝██║
██║██╔══██║██║╚██╔╝██║██╔══██║██║░░░░░██║░░╚██╔╝░░██╔══██╗██║
██║██║░░██║██║░╚═╝░██║██║░░██║███████╗██║░░░██║░░░██████╦╝██║
╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚══════╝╚═╝░░░╚═╝░░░╚═════╝░╚═╝
	`);
};

const resetScore = () => {
	SCORE.CURRENT = 0;
	SCORE.BEST = 0;
};

const updateScore = () => {
	try {
		SCORE.CURRENT = 0;

		let scoreFromLocalStorage: number | string = localStorage.getItem('best-score');

		if (!scoreFromLocalStorage) {
			localStorage.setItem('best-score', encodeScore(0));
			scoreFromLocalStorage = 0;
		}
		else scoreFromLocalStorage = decodeScore(scoreFromLocalStorage);

		SCORE.BEST = scoreFromLocalStorage;
	} catch (e) {
		resetScore();
	}
};

const updateBestScore = (score: number) => {
	if (SCORE.BEST >= SCORE.CURRENT) return;

	localStorage.setItem('best-score', encodeScore(score));
	SCORE.BEST = score;
};

const updateCurrentScore = () => {
	const score = `${SCORE.CURRENT} : ${SCORE.BEST}`;

	ctx.font = '44px FlappyBird';
	const text = ctx.measureText(score);

	const x = (width / 2) - (text.width / 2);
	const y = 100;

	ctx.strokeStyle = 'rgb(0, 0, 0)';
	ctx.lineWidth = 8;
	ctx.strokeText(score, x, y);
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillText(score, x, y);
};

const init = () => {
	window.canLose = true;

	logMyName();

	console.log("%cHello dear developer,", "color: green; font-size: 14px");
	console.log("%cTry:", "color: green; font-size: 14px");
	console.log("%cwindow.canLose = false;", "color: red; font-size: 14px");

	width = window.innerWidth > 480 ? 480 : window.innerWidth;
	height = window.innerHeight > 640 ? 640 : window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	updateScore();
	start();
};

const whenPlayerJump = () => {
	if (stillness) return;

	/* When user stillness */
	if (player.stillness) {
		player.stillness = false;
		player.gravity = CONFIG.GRAVITY;
	}

	/* When user pressed space */
	player.velocity = CONFIG.PLAYER_VELOCITY_WHILE_JUMP;

	JUMP_KEY_PRESSED = true;
};

const createRestartButton = () => {
	const w = 142;
	const h = 50;
	const image = createImage(IMAGES.restart);

	ctx.drawImage(image, (width / 2) - (w / 2), (height / 2) - (h - 2), w, h);
};

canvas.addEventListener('mousedown', whenPlayerJump);

document.addEventListener('keypress', ({ keyCode }) => {
	if (![32, 38].includes(keyCode) || player.lose || JUMP_KEY_PRESSED) return;

	whenPlayerJump();
});

document.addEventListener('keyup', ({ keyCode }) => {
	if (![32, 38].includes(keyCode)) return;

	JUMP_KEY_PRESSED = false;
});

canvas.addEventListener('mouseup', () => {
	JUMP_KEY_PRESSED = false;
});

/* When dom content loaded */
document.addEventListener('DOMContentLoaded', init);