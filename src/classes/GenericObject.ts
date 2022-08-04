type GenericObjectConstructor = {
	width: number;
	height: number;
	image: CanvasImageSource;
	ctx: CanvasRenderingContext2D;
	position: { x: number, y: number };
};

class GenericObject {
	width: number;
	height: number;
	image: CanvasImageSource;
	ctx: CanvasRenderingContext2D;
	position: { x: number, y: number };

	constructor({ ctx, image, width, height, position }: GenericObjectConstructor) {
		this.position = position;
		this.height = height;
		this.width = width;
		this.image = image;
		this.ctx = ctx;
	}

	draw() {
		this.ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}
};

export default GenericObject;