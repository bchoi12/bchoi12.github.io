import { Renderer } from './renderer.js'

document.addEventListener('DOMContentLoaded', (event) => {
	const renderer = new Renderer();
	renderer.start();
});