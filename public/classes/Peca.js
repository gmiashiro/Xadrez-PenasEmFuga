class Peca extends Sprite {
    constructor(config) {
        
        super(config);

        this.gridX = config.gridX;
        this.gridY = config.gridY;
        this.tiles = config.tiles;

        this.frameSize = 32;
        this.drawSize = this.tiles.TILE_SIZE;

        this.pixelX = (this.gridX * this.tiles.TILE_SIZE) + this.tiles.GRID_OFFSET;
        this.pixelY = (this.gridY * this.tiles.TILE_SIZE) + this.tiles.GRID_OFFSET;
    }

    draw(ctx){

        console.log("Tentando desenhar:", this.spriteSheet.src, "Carregada:", this.isLoaded);

        if(!this.isLoaded) return;

        const frame = this.animations[this.startAnimationFrame][0];
        const frameX = frame[0];
        const frameY = frame[1];

        ctx.drawImage(
            this.spriteSheet,
            frameX * this.frameSize,
            frameY * this.frameSize,
            this.frameSize,
            this.frameSize,
            this.pixelX,
            this.pixelY,
            this.drawSize,
            this.drawSize
        )
    }
}