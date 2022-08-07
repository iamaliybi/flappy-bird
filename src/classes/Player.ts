import { createImage } from './../helper';
type PlayerObjectConstructor = {
	screenX: number;
	screenY: number;
	g: number;
	speed: number;
	ctx: CanvasRenderingContext2D;
};

type BirdState = 'upward' | 'downward' | 'forward';


type Sprites = {
	x: number;
	x1: number;
};

class Player {
	width: number;
	height: number;
	gravity: number;
	screenX: number;
	screenY: number;
	velocity: number;
	speed: number;
	stillness: boolean;
	lose: boolean;
	frames: 0 | 1 | 2;
	image: CanvasImageSource;
	ctx: CanvasRenderingContext2D;
	position: { x: number, y: number };
	sprite: Sprites;
	state: 'upward' | 'downward' | 'forward';

	constructor({ ctx, screenX, screenY, speed, g }: PlayerObjectConstructor) {
		this.ctx = ctx;
		this.gravity = g;
		this.screenX = screenX;
		this.screenY = screenY;
		this.width = 61;
		this.height = 42;
		this.frames = 1; // 0: downward, 1: forward, 2: upward
		this.stillness = true;
		this.lose = false;
		this.velocity = 0;
		this.speed = speed;
		this.image = createImage('https://flappy-bird-ay.netlify.app/assets/images/bird.png');
		this.position = { x: (this.screenX / 2) - this.width, y: (this.screenY / 2) - this.height };
		this.sprite = {
			x: 92,
			x1: 61
		};
	}

	draw() {
		this.ctx.drawImage(
			this.image,
			this.sprite.x * this.frames, // sx
			0, // sy
			this.sprite.x, // sWidth
			64, // sHeight
			this.position.x, // dx
			this.position.y, // dy
			this.sprite.x1, // dWidth
			this.height // dHeight
		);
	}

	update() {
		if (this.lose) return this.draw();

		if (this.stillness) {
			const centerPoint = (this.screenY / 2) - this.height;
			if (this.position.y < centerPoint - 10) this.gravity += 0.01;
			else this.gravity -= 0.01;

			this.position.y += this.gravity;

			return this.draw();
		}

		this.position.y += this.velocity;
		this.velocity += this.gravity;

		this.draw();
	}

	nextFrame() {
		if (this.frames + 1 > 2) this.frames = 0;
		else this.frames++;
	}
};

export default Player;