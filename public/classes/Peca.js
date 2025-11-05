class Peca extends Sprite {
    constructor(config) {
        
        super(config);

        this.gridX = config.gridX;
        this.gridY = config.gridY;
        this.color = config.color; // red ou blue
        this.tiles = config.tiles;
        this.facing = config.facing || "front"; // front ou back

        this.frameSize = 32;
        this.drawSize = this.tiles.TILE_SIZE;

        this.recalculatePixelPosition();
    }

    recalculatePixelPosition(){
        this.pixelX = (this.gridX * this.tiles.TILE_SIZE) + this.tiles.GRID_OFFSET;
        this.pixelY = (this.gridY * this.tiles.TILE_SIZE) + this.tiles.GRID_OFFSET;
    }

    moveTo(gridX, gridY){
        this.gridX = gridX;
        this.gridY = gridY;
        this.recalculatePixelPosition();
    }

    draw(ctx){

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