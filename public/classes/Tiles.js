class Tiles {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.BOARD_SIZE = 512; // tamanho total do tabuleiro em pixels
        this.GRID_OFFSET = 16; // tamanho da borda ao redor do tabuleiro
        const gridAreaSize = this.BOARD_SIZE - (2 * this.GRID_OFFSET);
        this.TILE_SIZE = gridAreaSize / 8;

        this.selectedTile = null;

        this.boardImage = new Image();
        this.boardImage.src = "./assets/hud/background/xadrezFundo.png";

        this.boardImage.onload = () => {
            this.draw();
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

        // Aqui também ficará a função de desenhas as peças. 
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

        this.draw();
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
}