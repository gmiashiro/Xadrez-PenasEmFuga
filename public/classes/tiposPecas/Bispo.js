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

}