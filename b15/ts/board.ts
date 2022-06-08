import * as THREE from 'three'
import { Piece } from './piece.js'

export enum Dir {
	UNKNOWN,
	UP,
	DOWN,
	LEFT,
	RIGHT,
}

export class Board {
	private readonly _shuffleMoves : number = 200;
	private readonly _boardLength : number = 4;
	private readonly _pieceSize : number = 3;

	private readonly _boardSize : number = this._boardLength * this._boardLength;
	private readonly _emptyValue : number = this._boardSize - 1;

	private _board : Array<number>;
	private _emptyIndex : number;
	private _pieces : Map<number, Piece>
	private _scene : THREE.Scene;
	private _textureUrl : string;

	constructor(url : string) {
		this._board = new Array();
		for (let i = 0 ; i < this._boardLength * this._boardLength; ++i) {
			this._board.push(i);
		}
		this._emptyIndex = this._boardLength * this._boardLength - 1;
		this._pieces = new Map();
		this._scene = new THREE.Scene();
		this._textureUrl = url;

		this.shuffleBoard();
		this.populatePieces();
	}

	scene() : THREE.Scene {
		return this._scene;
	}

	update() : void {
		this._pieces.forEach((piece) => {
			piece.update();
		});
	}

	move(dir : Dir) {
		if (!this.validDir(dir)) {
			return;
		}

		if (dir === Dir.DOWN) {
			this.movePiece(this._emptyIndex - this._boardLength);
		} else if (dir === Dir.UP) {
			this.movePiece(this._emptyIndex + this._boardLength);
		} else if (dir === Dir.LEFT) {
			this.movePiece(this._emptyIndex + 1);
		} else if (dir === Dir.RIGHT) {
			this.movePiece(this._emptyIndex - 1);
		}

		if (this.victory()) {
			console.log("WIN");
		}
	}

	click(pos : THREE.Vector3) {
		const index = this.getIndexFromPos(pos);
		if (!this.validIndex(index)) {
			return;
		}

		this.movePiece(index);

		if (this.victory()) {
			console.log("WIN");
		}
	}

	victory() : boolean {
		for (let i = 0; i < this._boardSize; ++i) {
			if (this._board[i] != i) {
				return false;
			}
		}
		return true;
	}

	private getRowCol(index : number) : Array<number> {
		return [Math.floor(index / this._boardLength), index % this._boardLength];
	}

	private movePiece(pieceIndex : number) : void {
		if (!this.validIndex(pieceIndex)) {
			return;
		}

		if (pieceIndex === this._emptyIndex) {
			return;
		}

		const [pieceRow, pieceCol] = this.getRowCol(pieceIndex);
		const [emptyRow, emptyCol] = this.getRowCol(this._emptyIndex);
		if (Math.abs(pieceRow - emptyRow) + Math.abs(pieceCol - emptyCol) !== 1) {
			this._pieces.get(pieceIndex).jiggle(600);
			return;
		}

		if (this._pieces.has(pieceIndex)) {
			this._pieces.get(pieceIndex).move(this.getPos(this._emptyIndex), 200);
			this._pieces.get(this._emptyIndex).move(this.getPos(pieceIndex), 0);

			const tempPiece = this._pieces.get(this._emptyIndex);
			this._pieces.set(this._emptyIndex, this._pieces.get(pieceIndex));
			this._pieces.set(pieceIndex, tempPiece);			
		}

		const temp = this._board[pieceIndex];
		this._board[pieceIndex] = this._board[this._emptyIndex];
		this._board[this._emptyIndex] = temp;

		this._emptyIndex = pieceIndex;
	}

	private shuffleBoard() : void {
		let disallowedDir = Dir.UNKNOWN;
		const allDirs = [Dir.UP, Dir.RIGHT, Dir.LEFT, Dir.DOWN];
		for (let i = 0; i < this._shuffleMoves; ++i) {
			let dirs = [];

			for (const dir of allDirs) {
				if (!this.validDir(dir)) {
					continue;
				}
				if (dir === disallowedDir) {
					continue;
				}
				dirs.push(dir);
			}

			const randomDir = this.randomDir(dirs);
			this.move(randomDir);
			if (randomDir === Dir.UP) {
				disallowedDir = Dir.DOWN;
			} else if (randomDir === Dir.DOWN) {
				disallowedDir = Dir.UP;
			} else if (randomDir === Dir.LEFT) {
				disallowedDir = Dir.RIGHT;
			} else if (randomDir === Dir.RIGHT) {
				disallowedDir = Dir.LEFT;
			}
		}
	}

	private randomDir(validDir : Array<Dir>) : Dir {
		const random = Math.random();

		for (let i = 0; i < validDir.length; ++i) {
			if (random < (i+1) / validDir.length) {
				return validDir[i];
			}
		}
		return Dir.UNKNOWN;
	}

	private populatePieces() {
		new THREE.TextureLoader().load(this._textureUrl, (texture) => {
			for (let i = 0; i < this._board.length; ++i) {
				const correctIndex = this._board[i];

				let piece = new Piece(texture, this._pieceSize);
				this.mapUV(correctIndex, piece.mesh().geometry);
				piece.move(this.getPos(i), 0);
				if (correctIndex === this._emptyValue) {
					this._emptyIndex = i;
					piece.hide();
				}
				this._pieces.set(i, piece);
				this._scene.add(piece.mesh());
			}
		});
	}

	private mapUV(index : number, geometry : THREE.BufferGeometry) : void {
		const [row, col] = this.getRowCol(index);

		let uvPositions = [];
		const vertices = geometry.attributes.position.array;
		for(let i = 0; i < vertices.length / 3; i++) {
		  let [x, y] = [vertices[3*i], vertices[3*i + 1]];

		  const u = (x + this._pieceSize / 2) / this._pieceSize;
		  const v = (y + this._pieceSize / 2) / this._pieceSize;

		  uvPositions.push(u / this._boardLength + col / this._boardLength);
		  uvPositions.push(v / this._boardLength + (this._boardLength - 1 - row) / this._boardLength);
		}
		geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvPositions, 2 ));
	}

	private validIndex(index : number) : boolean {
		return index >= 0 && index < this._boardSize ;
	}

	private validDir(dir : Dir) : boolean {
		if (dir === Dir.DOWN && this._emptyIndex < this._boardLength) {
			return false;
		}
		if (dir === Dir.UP && this._emptyIndex >= this._boardSize - this._boardLength) {
			return false;
		}
		if (dir === Dir.LEFT && this._emptyIndex % this._boardLength === this._boardLength - 1) {
			return false;
		} 
		if (dir === Dir.RIGHT && this._emptyIndex % this._boardLength === 0) {
			return false;
		}
		return true;
	}

	private getIndexFromRowCol(row : number, col : number) : number {
		return row * this._boardLength + col;
	}

	private getIndexFromPos(pos : THREE.Vector3) : number {
		const row = Math.floor((this._boardLength / 2 * this._pieceSize - pos.y) / this._pieceSize)
		const col = Math.floor((pos.x + this._boardLength / 2 * this._pieceSize) / this._pieceSize);

		if (row < 0 || row >= this._boardLength || col < 0 || col >= this._boardLength) {
			return -1;
		}

		return this.getIndexFromRowCol(row, col);
	}

	private getPos(index : number) : THREE.Vector3 {
		const [row, col] = this.getRowCol(index);
		const x = this._pieceSize * col - this._pieceSize * this._pieceSize / 2;
		const y = (this._boardLength / 2 - row) * this._pieceSize - this._pieceSize / 2;
		return new THREE.Vector3(x, y, 0);
	}
}