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

    getPossibleMoves(futureGridX, futureGridY) {

        // Começo de uma lógica que pode ser usada para brilhar os tiles possíveis

        // var possibleMoves= [];
        // // Tentar horizontal
        // for (var x = 0; x < 8; x++) {
        //     if (x != futureGridX && this.canBeMoved(x, this.gridY)) {
        //         possibleMoves.push([x, this.gridY]);
        //     }
        // }
        // console.table(possibleMoves);
        // // Tentar vertical

        // for (var y = 0; y < 8; y++) {
        //     if (y != futureGridY && this.canBeMoved(this.gridX, y)) {
        //         possibleMoves.push([this.gridX, y]);
        //     }
        // }
        // console.table(possibleMoves);
    }

}