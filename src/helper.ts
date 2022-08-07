export const createImage = (url: string): CanvasImageSource => {
	const img = new Image();
	img.src = url;

	return img;
};

export const getRndInteger = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min)) + min;
};

export const encodeScore = (n: number): string => n.toString(32);

export const decodeScore = (n: string): number => parseInt(n, 32);