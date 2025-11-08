class Peao extends Peca {
    constructor(config) {
        super(config);
        this.isPeao = true;
        this.evoluiu = false;

        this.isCaptureActive = false;
        // Para saber se uma peça vai ser capturada
        document.addEventListener(("isCapture"), (e) => {
            this.isCaptureActive = true;
        });
    }

    canBeMoved(futureGridX, futureGridY) {
        if (this.isCaptureActive == true) {
            // Se for um movimento de captura, o peão anda na diagonal
            if (this.belongsToDiagonal(futureGridX, futureGridY) && futureGridY == this.gridY-1) {
                return true;
            } else {
                return false;
            }
        } else {
            if (this.gridY == 6) {
                // se for o primeiro movimento do peão, ele pode andar duas casas
                if (futureGridY >= this.gridY-2 && futureGridX == this.gridX  && this.tiles.findPecaAt(this.gridX, this.gridY-1) === undefined) {
                    return true;
                }
            } else {
                if (futureGridY == this.gridY-1 && futureGridX == this.gridX) {
                    return true;
                }
            }
        }

        return false;
    }

    evolucao() {
        if (this.evoluiu) {
            return;
        } else {
            this.evoluiu = true;
            openEvolucaoPeaoWindow();
        }
    }

}