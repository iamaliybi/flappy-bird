import Player from "./classes/Player";
import Platform from "./classes/Platform";
import GenericObject from "./classes/GenericObject";
import { createImage } from './helper';

/* Variables */
let animation: number,
	width: number,
	height: number,
	player: Player,
	platforms: Platform[],
	genericObjects: GenericObject[],
	scrollOffset: number = 0,
	gravity: number = 0,
	stillness = true;

const canvas = document.getElementById('flappyBird') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

/* Code */
const loadBird = () => {
	//
};

const loadPlatforms = () => {
	const platformImage = createImage('http://localhost/Github/flappy-bird/public/images/ground.png');

	platforms = [];
	for (let i = 0; i < 15; i++) {
		const platform = new Platform({ ctx, image: platformImage, width: 37, height: 128, x: (i * 37) + 1, y: height - 128 });

		platforms.push(platform);
	}
};

const loadGenericObjects = () => {
	const bgImage = createImage('http://localhost/Github/flappy-bird/public/images/background.png');

	genericObjects = [
		new GenericObject({ ctx, image: bgImage, width, height: height - 128, x: -1, y: -1 }),
	];
};

const animate = () => {
	/* increase platform.x position with player position.x */
};

const initialLoad = () => {
	genericObjects.forEach(obj => obj.draw());

	platforms.forEach(obj => obj.draw());
};

const start = () => {
	if (animation) cancelAnimationFrame(animation);

	// if (player) player.reset();
	// else player = player ? player : new Player({ ctx, w: width, h: height, g: gravity });
	// player = player ? player : new Player({ ctx, w: width, h: height, g: gravity });
	loadGenericObjects();
	loadPlatforms();
	// player.update();
	scrollOffset = 0;

	initialLoad();
	animate();
};

const init = () => {
	width = window.innerWidth > 480 ? 480 : window.innerWidth;
	height = window.innerHeight > 640 ? 640 : window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	start();
};

/* When dom content loaded */
document.addEventListener('DOMContentLoaded', init);