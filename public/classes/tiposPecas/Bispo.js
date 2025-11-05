class Bispo extends Peca {
    constructor(config) {
        super(config);
        this.leftM = 0;
        this.rightM = 0;
        this.leftN = 0;
        this.rightN = 0;
    }

    canBeMoved(futureGridX, futureGridY) {
        if (this.belongsToDiagonal(futureGridX, futureGridY)) {
            return true;
        } else {
            return false;
        }
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

}