class Peca extends Sprite {
    constructor(config) {
        
        super(config);

        this.gridX = config.gridX;
        this.gridY = config.gridY;
        this.color = config.color; // red ou blue
        this.tiles = config.tiles;
        this.facing = config.facing || "front"; // front ou back
        this.isPeao = config.isPeao || false;

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

    belongsToDiagonal(futureGridX, futureGridY) {
        // Função que utiliza a equação reduzida de uma reta para saber se o espaço está na diagonal da peça
        this.leftM = ((this.gridY-1)-this.gridY)/((this.gridX-1)-this.gridX);
        this.leftN = this.gridY - (this.gridX*this.leftM);
        this.rightM = ((this.gridY-1)-this.gridY)/((this.gridX+1)-this.gridX);
        this.rightN = this.gridY - (this.gridX*this.rightM);

        if ((futureGridY == this.leftM*futureGridX + this.leftN) || (futureGridY == this.rightM*futureGridX + this.rightN)) {
            // console.log("true " + this.gridX, this.gridY, futureGridX, futureGridY);
            return true;
        } else {
            // console.log("false " + this.gridX, this.gridY, futureGridX, futureGridY);
            // console.log(this.leftM, this.leftN, this.rightM, this.rightN);
            return false;
        }

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