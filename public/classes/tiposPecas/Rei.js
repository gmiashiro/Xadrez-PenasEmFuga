class Rei extends Peca {
    constructor(config) {
        super(config);
    }

    canBeMoved(futureGridX, futureGridY) {
        return true;
    }

}