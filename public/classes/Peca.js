class Peca extends Sprite {
    constructor(config) {
        
        super(config);

        this.gridX = config.gridX;
        this.gridY = config.gridY;
        this.color = config.color; // red ou blue
        this.tiles = config.tiles;
        this.facing = config.facing || "front"; // front ou back
        this.isPeao = config.isPeao || false;
        this.id = config.id;

        this.frameSize = 32;
        this.drawSize = this.tiles.TILE_SIZE;

        this.recalculatePixelPosition();
    }

    recalculatePixelPosition(){
        this.pixelX = (this.gridX * this.tiles.TILE_SIZE);
        this.pixelY = (this.gridY * this.tiles.TILE_SIZE);
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

    isMovementFreeLines(futureGridX, futureGridY) {
        if (this.gridX == futureGridX) {
            // Movimento vertical
            if (this.gridY > futureGridY) {
                // Movimento para frente
                for (var i = this.gridY-1; i > futureGridY; i--) {
                    if (this.tiles.findPecaAt(this.gridX, i)) {
                        // Se encontrou uma peça
                        return false;
                    };
                }
                return true;
            }

            if (this.gridY < futureGridY) {
                // Movimento para trás
                for (var i = this.gridY+1; i < futureGridY; i++) {
                    if (this.tiles.findPecaAt(this.gridX, i)) {
                        return false;
                    };
                }
                return true;
            }
        }
        if (this.gridY == futureGridY) {
            // Movimento horizontal
            if (this.gridX > futureGridX) {
                // Movimento para a esquerda
                for (var i = this.gridX-1; i > futureGridX; i--) {
                    if (this.tiles.findPecaAt(i, this.gridY)) {
                        return false;
                    };
                }
                return true;
            }

            if (this.gridX < futureGridX) {
                // Movimento para trás
                for (var i = this.gridX+1; i < futureGridX; i++) {
                    if (this.tiles.findPecaAt(i, this.gridY)) {
                        return false;
                    };
                }
                return true;
            }
        }
    }

    isMovementFreeDiagonal(futureGridX, futureGridY) {
        if (futureGridX > this.gridX) {
            // Movimentando em direção à direita
            if (futureGridY > this.gridY) {
                // Voltando no tabuleiro
                for (var i = 1; i < futureGridX-this.gridX; i++) {
                    if (this.tiles.findPecaAt(this.gridX+i, this.gridY+i)) {
                        return false;
                    };
                }
                return true;
            } else {
                // Avançando no tabuleiro
                for (var i = 1; i < futureGridX-this.gridX; i++) {
                    if (this.tiles.findPecaAt(this.gridX+i, this.gridY-i)) {
                        return false;
                    };
                }
                return true;
            }
        } else if (futureGridX < this.gridX) {
            // Movimentando em direção à esquerda
            if (futureGridY > this.gridY) {
                // Voltando no tabuleiro
                for (var i = 1; i < this.gridX-futureGridX; i++) {
                    if (this.tiles.findPecaAt(this.gridX-i, this.gridY+i)) {
                        return false;
                    };
                }
                return true;
            } else {
                // Avançando no tabuleiro
                for (var i = 1; i < this.gridX-futureGridX; i++) {
                    if (this.tiles.findPecaAt(this.gridX-i, this.gridY-i)) {
                        return false;
                    };
                }
                return true;
            }
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