class Today {
    constructor() {
        this._sunrise = 6;
        this._sunset = 20;
        this._oneDay = 1000 * 60 * 60 * 24;
        this._now = new Date();
        this._seed = this.currentDay();
    }
    sunrise() {
        return this._sunrise;
    }
    sunset() {
        return this._sunset;
    }
    isNight() {
        const hours = this.currentHours();
        return hours < this._sunrise || hours >= this._sunset;
    }
    currentHours() {
        return new Date().getHours();
    }
    currentDay() {
        const start = new Date(this._now.getFullYear(), 0, 0);
        const diff = (this._now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - this._now.getTimezoneOffset()) * 60 * 1000);
        return Math.floor(diff / this._oneDay);
    }
    tomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }
    restartRandom() {
        this._seed = this.currentDay();
    }
    random() {
        let x = Math.sin(this._seed++) * 10000;
        return x - Math.floor(x);
    }
}
export const today = new Today();
