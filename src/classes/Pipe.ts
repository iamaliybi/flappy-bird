import { createImage } from "../helper";

type PipeObjectConstructor = {
	ctx: CanvasRenderingContext2D;
	position: { x: number, y: number };
	state: 'top' | 'bottom'
};

class Pipe {
	width: number;
	height: number;
	state: 'top' | 'bottom';
	image: CanvasImageSource;
	ctx: CanvasRenderingContext2D;
	position: { x: number, y: number };

	constructor({ ctx, position, state }: PipeObjectConstructor) {
		this.position = position;
		this.height = 528;
		this.width = 92;
		this.state = state;
		this.image = createImage(`https://flappy-bird-ay.netlify.app/assets/images/pipe-${this.state}.png`);
		this.ctx = ctx;
	}

	draw() {
		this.ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}
};

export default Pipe;