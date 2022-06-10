
export class Day {
	private readonly _oneDay = 1000 * 60 * 60 * 24;

	private _seed : number;

	constructor() {
		this._seed = this.currentDay();

		console.log("Current day: " + this._seed);
	}

	currentDay() : number {
		const now = new Date();
		const start = new Date(now.getFullYear(), 0, 0);
		const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
		
		return Math.floor(diff / this._oneDay);
	}

	restartRandom() {
		this._seed = this.currentDay();
	}

	random() {
    	let x = Math.sin(this._seed++) * 10000;
	    return x - Math.floor(x);
	}
}