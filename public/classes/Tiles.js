class Tiles {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.BOARD_SIZE = 512; // tamanho total do tabuleiro em pixels
        this.GRID_OFFSET = 16; // tamanho da borda ao redor do tabuleiro
        const gridAreaSize = this.BOARD_SIZE - (2 * this.GRID_OFFSET);
        this.TILE_SIZE = gridAreaSize / 8;

        this.selectedTile = null;

        this.pecas = [];

        this.boardImage = new Image();
        this.boardImage.src = "./assets/hud/background/xadrezFundo.png";

        this.boardImage.onload = () => {
            this._initializeBoard();
            this.gameLoop();
        };
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(this.boardImage, 0, 0, this.canvas.width, this.canvas.height);

        if(this.selectedTile) {
            const pixelX = (this.selectedTile.x * this.TILE_SIZE) + this.GRID_OFFSET;
            const pixelY = (this.selectedTile.y * this.TILE_SIZE) + this.GRID_OFFSET;

            this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.ctx.fillRect(pixelX, pixelY, this.TILE_SIZE, this.TILE_SIZE);
        }

        this.pecas.forEach(peca => peca.draw(this.ctx));
    }

    handleGridClick(tileX, tileY) {
        if(this.selectedTile && this.selectedTile.x === tileX && this.selectedTile.y === tileY) {
            this.selectedTile = null;
        } else {
            this.selectedTile = { x: tileX, y: tileY };
        }

        //teste
        console.log(`Classe Tiles: Clique no tile (x, y): ${tileX}, ${tileY}`);
        if (this.selectedTile) {
            console.log("Classe Tiles: Tile selecionado.");
        } else {
            console.log("Classe Tiles: Tile desmarcado.");
        }
    }

    getTileCoordsFromPixels(pixelX, pixelY) {
        const relativeX = pixelX - this.GRID_OFFSET;
        const relativeY = pixelY - this.GRID_OFFSET;

        const tileX = Math.floor(relativeX / this.TILE_SIZE);
        const tileY = Math.floor(relativeY / this.TILE_SIZE); 

        if (tileX < 0 || tileX > 7 || tileY < 0 || tileY > 7) {
            return null;
        }
        return { x: tileX, y: tileY };
    }

    _initializeBoard(){
        const path = "./assets/spriteSheets";
        const redConfig = { tiles: this, directionMoviment: "down"};
        const blueConfig = { tiles: this, directionMoviment: "up"};

        // Time Vermelho (Traseira - y=0, Peões - y=1)
        this.pecas.push(new Torre({ ...redConfig, gridX: 0, gridY: 0, spriteSheet: `${path}/red/torreRed.png` }));
        this.pecas.push(new Cavalo({ ...redConfig, gridX: 1, gridY: 0, spriteSheet: `${path}/red/cavaloRed.png` }));
        this.pecas.push(new Bispo({ ...redConfig, gridX: 2, gridY: 0, spriteSheet: `${path}/red/bispoRed.png` }));
        this.pecas.push(new Rainha({ ...redConfig, gridX: 3, gridY: 0, spriteSheet: `${path}/red/rainhaRed.png` }));
        this.pecas.push(new Rei({ ...redConfig, gridX: 4, gridY: 0, spriteSheet: `${path}/red/reiRed.png` }));
        this.pecas.push(new Bispo({ ...redConfig, gridX: 5, gridY: 0, spriteSheet: `${path}/red/bispoRed.png` }));
        this.pecas.push(new Cavalo({ ...redConfig, gridX: 6, gridY: 0, spriteSheet: `${path}/red/cavaloRed.png` }));
        this.pecas.push(new Torre({ ...redConfig, gridX: 7, gridY: 0, spriteSheet: `${path}/red/torreRed.png` }));

        for (let i = 0; i < 8; i++) {
            this.pecas.push(new Peao({ ...redConfig, gridX: i, gridY: 1, spriteSheet: `${path}/red/peaoRed.png` }));
        }

        // Time Azul (Traseira - y=7, Peões - y=6)
        this.pecas.push(new Torre({ ...blueConfig, gridX: 0, gridY: 7, spriteSheet: `${path}/blue/torreBlue.png` }));
        this.pecas.push(new Cavalo({ ...blueConfig, gridX: 1, gridY: 7, spriteSheet: `${path}/blue/cavaloBlue.png` }));
        this.pecas.push(new Bispo({ ...blueConfig, gridX: 2, gridY: 7, spriteSheet: `${path}/blue/bispoBlue.png` }));
        this.pecas.push(new Rainha({ ...blueConfig, gridX: 3, gridY: 7, spriteSheet: `${path}/blue/rainhaBlue.png` }));
        this.pecas.push(new Rei({ ...blueConfig, gridX: 4, gridY: 7, spriteSheet: `${path}/blue/reiBlue.png` }));
        this.pecas.push(new Bispo({ ...blueConfig, gridX: 5, gridY: 7, spriteSheet: `${path}/blue/bispoBlue.png` }));
        this.pecas.push(new Cavalo({ ...blueConfig, gridX: 6, gridY: 7, spriteSheet: `${path}/blue/cavaloBlue.png` }));
        this.pecas.push(new Torre({ ...blueConfig, gridX: 7, gridY: 7, spriteSheet: `${path}/blue/torreBlue.png` }));

        for (let i = 0; i < 8; i++) {
            this.pecas.push(new Peao({ ...blueConfig, gridX: i, gridY: 6, spriteSheet: `${path}/blue/peaoBlue.png` }));
        }

        console.log(`Tabuleiro inicializado com ${this.pecas.length} peças.`);
    }

    gameLoop(){
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}