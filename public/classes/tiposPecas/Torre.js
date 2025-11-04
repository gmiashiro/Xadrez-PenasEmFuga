class Torre extends Peca {
    constructor(config) {
        super(config);
    }


    canBeMoved(futureGridX, futureGridY) {
        if ((this.gridX == futureGridX && this.gridY != futureGridY) || (this.gridX != futureGridX && this.gridY == futureGridY)) {
            console.log(this.gridX, this.gridY, futureGridX, futureGridY);
            return true;
        } else {
            console.log(this.gridX, this.gridY, futureGridX, futureGridY);
            console.log("nao");
            return false;
        }
    }

}