export const createImage = (url: string): CanvasImageSource => {
	const img = new Image();
	img.src = url;

	return img;
}