type PlayerObjectConstructor = {
	screenX: number;
	screenY: number;
	g: number;
	ctx: CanvasRenderingContext2D;
};

interface Sprites {
	[key: string]: {
		image: CanvasImageSource;
		cropWidth: number;
		imageWidth: number;
	}
};

class Player {
	width: number;
	height: number;
	gravity: number;
	screenX: number;
	screenY: number;
	speed: number;
	frames: number;
	sprites: number;
	image: CanvasImageSource;
	ctx: CanvasRenderingContext2D;
	position: { x: number, y: number };
	velocity: { x: number, y: number };
	// sprites: Sprites;
	state: 'upward' | 'downward' | 'forward';

	constructor({ ctx, screenX, screenY, g }: PlayerObjectConstructor) {
		this.ctx = ctx;
		this.gravity = g;
		this.screenX = screenX;
		this.screenY = screenY;
		this.position = { x: 100, y: 100 };
		this.velocity = { x: 0, y: 0 };
		this.speed = 10;
		this.width = 66;
		this.height = 150;
		this.frames = 0;
		// this.sprites = {};
		this.state = 'forward';
	}
};

export default Player;