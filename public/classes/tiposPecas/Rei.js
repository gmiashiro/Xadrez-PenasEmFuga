class Rei extends Peca {
    constructor(config) {
        super(config);
    }

    canBeMoved(futureGridX, futureGridY) {
        if (futureGridX > this.gridX+1 || futureGridX < this.gridX-1 || futureGridY > this.gridY+1 || futureGridY < this.gridY-1) {
            // Se o movimento for mais longo que 1 quadrado
            return false;
        } else {
            return true;
        }
        
    }

}