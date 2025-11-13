class Torre extends Peca {
    constructor(config) {
        super(config);
    }


    canBeMoved(futureGridX, futureGridY) {
        if (((this.gridX == futureGridX && this.gridY != futureGridY) || (this.gridX != futureGridX && this.gridY == futureGridY)) && this.isMovementFreeLines(futureGridX, futureGridY)) {
            console.log(this.gridX, this.gridY, futureGridX, futureGridY);
            return true;
        } else {
            console.log(this.gridX, this.gridY, futureGridX, futureGridY);
            console.log("nao");
            console.log(futureGridX, futureGridY);
            return false;
        }
    }

    getPossibleMoves() {
        // Usa o método genérico da classe Peca
        return super.getPossibleMoves();
    }

}