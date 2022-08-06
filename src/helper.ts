export const createImage = (url: string): CanvasImageSource => {
	const img = new Image();
	img.src = url;

	return img;
}

export const isBetween = (min: number, value: number, max:number): boolean => {
	return value >= min && value <= max;
};