class Rainha extends Peca {
    constructor(config) {
        super(config);
    }

    canBeMoved(futureGridX, futureGridY) {
        if (this.belongsToDiagonal(futureGridX, futureGridY)) {
            // Se é um movimento para a diagonal
            return true;
        } else if ((this.gridX == futureGridX && this.gridY != futureGridY) || (this.gridX != futureGridX && this.gridY == futureGridY)) {
            // Se for um movimento reto
            return true;
        } else {
            return false;
        }
        
    }

}