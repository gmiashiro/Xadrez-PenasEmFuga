class Cavalo extends Peca {
    constructor(config) {
        super(config);
    }

    // Exclui as linhas retas e diagonais!
    canBeMoved(futureGridX, futureGridY) {
        if ((this.gridX == futureGridX && this.gridY != futureGridY) || (this.gridX != futureGridX && this.gridY == futureGridY)) {
            // Se for linha reta
            return false;
        } else if (this.belongsToDiagonal(futureGridX, futureGridY)) {
            // Se for diagonal
            return false;
        } else if (futureGridX > this.gridX+2 || futureGridX < this.gridX-2 || futureGridY > this.gridY+2 || futureGridY < this.gridY-2) {
            // Se passar de um raio de 2
            return false;
        } else {
            return true;
        }
    }

    getPossibleMoves() {
        // Usa o método genérico da classe Peca
        return super.getPossibleMoves();
    }

}