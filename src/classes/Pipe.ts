import { createImage } from "../helper";

type PipeObjectConstructor = {
	height: number;
	ctx: CanvasRenderingContext2D;
	position: { x: number, y: number };
};

class Pipe {
	width: number;
	height: number;
	image: CanvasImageSource;
	ctx: CanvasRenderingContext2D;
	position: { x: number, y: number };

	constructor({ ctx, height, position }: PipeObjectConstructor) {
		this.position = position;
		this.height = height;
		this.width = 92;
		this.image = createImage('http://localhost/Github/flappy-bird/public/images/pipe.png');
		this.ctx = ctx;
	}

	draw() {
		this.ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}
};

export default Pipe;