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
const loadGenericObjects = () => {
	const bgImage = createImage('http://localhost/Github/flappy-bird/public/images/background.png');

	genericObjects = [
		new GenericObject({ ctx, image: bgImage, width, height, position: { x: -1, y: -1 } }),
	];
};

const animate = () => {
	/* Load generic objects */
};

const initialLoad = () => {
	genericObjects.forEach(obj => obj.draw());
};

const start = () => {
	if (animation) cancelAnimationFrame(animation);

	// if (player) player.reset();
	// else player = player ? player : new Player({ ctx, w: width, h: height, g: gravity });
	// player = player ? player : new Player({ ctx, w: width, h: height, g: gravity });
	loadGenericObjects();
	// loadPlatforms();
	// player.update();
	scrollOffset = 0;

	initialLoad();
	animate();
};

const init = () => {
	width = window.innerWidth + 1;
	height = window.innerHeight + 1;

	canvas.width = width;
	canvas.height = height;

	start();
};

/* When dom content loaded */
document.addEventListener('DOMContentLoaded', init);