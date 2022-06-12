import * as THREE from 'three';
import smartcrop from 'smartcrop';
import { Piece } from './piece.js';
import { today } from './today.js';
export var Dir;
(function (Dir) {
    Dir[Dir["UNKNOWN"] = 0] = "UNKNOWN";
    Dir[Dir["UP"] = 1] = "UP";
    Dir[Dir["DOWN"] = 2] = "DOWN";
    Dir[Dir["LEFT"] = 3] = "LEFT";
    Dir[Dir["RIGHT"] = 4] = "RIGHT";
})(Dir || (Dir = {}));
export class Board {
    constructor(url) {
        this._shuffleMoves = 200;
        this._boardLength = 4;
        this._pieceSize = 3;
        this._boardSize = this._boardLength * this._boardLength;
        this._emptyValue = this._boardSize - 1;
        this._board = new Array();
        this._emptyIndex = this._boardLength * this._boardLength - 1;
        this._pieces = new Map();
        this._scene = new THREE.Scene();
        this._textureUrl = url;
        const board = this.getBoard();
        if (board.length === this._boardSize) {
            for (let i = 0; i < this._boardSize; ++i) {
                this._board.push(Number(board[i]));
            }
        }
        else {
            for (let i = 0; i < this._boardSize; ++i) {
                this._board.push(i);
            }
            this.shuffleBoard();
        }
        this.postMove();
        this.populatePieces();
    }
    scene() {
        return this._scene;
    }
    update() {
        this._pieces.forEach((piece) => {
            piece.update();
        });
    }
    move(dir, systemMove = false) {
        if (!this.validDir(dir)) {
            return;
        }
        let moveIndex = -1;
        ;
        if (dir === Dir.DOWN) {
            moveIndex = this._emptyIndex - this._boardLength;
        }
        else if (dir === Dir.UP) {
            moveIndex = this._emptyIndex + this._boardLength;
        }
        else if (dir === Dir.LEFT) {
            moveIndex = this._emptyIndex + 1;
        }
        else if (dir === Dir.RIGHT) {
            moveIndex = this._emptyIndex - 1;
        }
        const moved = this.movePiece(moveIndex);
        if (!systemMove && moved) {
            this.postMove();
        }
    }
    click(pos, systemMove = false) {
        const index = this.getIndexFromPos(pos);
        if (!this.validIndex(index)) {
            return;
        }
        const moved = this.movePiece(index);
        if (!systemMove && moved) {
            this.postMove();
        }
    }
    postMove() {
        this.saveBoard();
        if (this.victory()) {
            this._pieces.get(this._emptyIndex).show();
            this._victory = true;
        }
    }
    victory() {
        if (this._victory) {
            return true;
        }
        for (let i = 0; i < this._boardSize; ++i) {
            if (this._board[i] != i) {
                return false;
            }
        }
        return true;
    }
    getRowCol(index) {
        return [Math.floor(index / this._boardLength), index % this._boardLength];
    }
    movePiece(pieceIndex) {
        if (this._victory) {
            return false;
        }
        if (!this.validIndex(pieceIndex)) {
            return false;
        }
        if (pieceIndex === this._emptyIndex) {
            return false;
        }
        const [pieceRow, pieceCol] = this.getRowCol(pieceIndex);
        const [emptyRow, emptyCol] = this.getRowCol(this._emptyIndex);
        if (Math.abs(pieceRow - emptyRow) + Math.abs(pieceCol - emptyCol) !== 1) {
            this._pieces.get(pieceIndex).jiggle(600);
            return false;
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
        return true;
    }
    shuffleBoard() {
        let disallowedDir = Dir.UNKNOWN;
        const allDirs = [Dir.UP, Dir.RIGHT, Dir.LEFT, Dir.DOWN];
        today.restartRandom();
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
            this.move(randomDir, true);
            if (randomDir === Dir.UP) {
                disallowedDir = Dir.DOWN;
            }
            else if (randomDir === Dir.DOWN) {
                disallowedDir = Dir.UP;
            }
            else if (randomDir === Dir.LEFT) {
                disallowedDir = Dir.RIGHT;
            }
            else if (randomDir === Dir.RIGHT) {
                disallowedDir = Dir.LEFT;
            }
        }
    }
    randomDir(validDir) {
        const random = today.random();
        for (let i = 0; i < validDir.length; ++i) {
            if (random < (i + 1) / validDir.length) {
                return validDir[i];
            }
        }
        return Dir.UNKNOWN;
    }
    populatePieces() {
        const image = new Image();
        image.src = this._textureUrl;
        image.crossOrigin = "anonymous";
        image.onload = () => {
            const side = Math.min(image.width, image.height);
            smartcrop.crop(image, { width: side, height: side }).then((crop) => {
                this.loadTexture(crop, image);
            });
        };
    }
    loadTexture(crop, image) {
        new THREE.TextureLoader().load(this._textureUrl, (texture) => {
            for (let i = 0; i < this._board.length; ++i) {
                let piece = new Piece(texture, this._pieceSize);
                piece.move(this.getPos(i), 0);
                if (this._board[i] === this._emptyValue) {
                    this._emptyIndex = i;
                }
                this._pieces.set(i, piece);
                this._scene.add(piece.mesh());
            }
            for (let i = 0; i < this._board.length; ++i) {
                const uMin = crop.topCrop.x / crop.topCrop.width;
                const vMin = crop.topCrop.y / crop.topCrop.height;
                const uMax = crop.topCrop.width / image.width;
                const vMax = crop.topCrop.height / image.height;
                const piece = this._pieces.get(i);
                this.mapUV(this._board[i], uMin, uMax, vMin, vMax, piece.mesh().geometry);
                if (this._board[i] === this._emptyValue) {
                    piece.hide();
                }
            }
        });
    }
    mapUV(index, uMin, uMax, vMin, vMax, geometry) {
        const [row, col] = this.getRowCol(index);
        let uvPositions = [];
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length / 3; i++) {
            let [x, y] = [vertices[3 * i], vertices[3 * i + 1]];
            let u = (x + this._pieceSize / 2) / this._pieceSize;
            let v = (y + this._pieceSize / 2) / this._pieceSize;
            u = u / this._boardLength + col / this._boardLength;
            v = v / this._boardLength + (this._boardLength - 1 - row) / this._boardLength;
            u = (uMax - uMin) * u + uMin;
            v = (vMax - vMin) * v + vMin;
            uvPositions.push(u);
            uvPositions.push(v);
        }
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvPositions, 2));
    }
    validIndex(index) {
        return index >= 0 && index < this._boardSize;
    }
    validDir(dir) {
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
    getIndexFromRowCol(row, col) {
        return row * this._boardLength + col;
    }
    getIndexFromPos(pos) {
        const row = Math.floor((2 * this._pieceSize - pos.y) / this._pieceSize);
        const col = Math.floor((pos.x + this._boardLength / 2 * this._pieceSize) / this._pieceSize);
        if (row < 0 || row >= this._boardLength || col < 0 || col >= this._boardLength) {
            return -1;
        }
        return this.getIndexFromRowCol(row, col);
    }
    getPos(index) {
        const [row, col] = this.getRowCol(index);
        const x = this._pieceSize * col - this._pieceSize * this._pieceSize / 2;
        const y = (this._boardLength / 2 - row) * this._pieceSize - this._pieceSize / 2;
        return new THREE.Vector3(x, y, 0);
    }
    saveBoard() {
        const tomorrow = today.tomorrow().toUTCString();
        document.cookie = "board=" + this._board.toString() + "; expires=" + tomorrow + "; SameSite=None; Secure";
    }
    getBoard() {
        if (typeof document.cookie === 'undefined' || document.cookie.length === 0) {
            return [];
        }
        const pair = document.cookie.split(";").find(line => line.trim().startsWith("board="));
        if (typeof pair === 'undefined' || pair.length === 0) {
            return [];
        }
        const value = pair.split("=");
        if (value.length !== 2) {
            return [];
        }
        const board = value[1].split(",");
        if (board.length !== this._boardSize) {
            return [];
        }
        return board;
    }
}
