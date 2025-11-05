class Peao extends Peca {
    constructor(config) {
        super(config);
        this.isPeao = true;

        this.isCaptureActive = false;
        // Para saber se uma peça vai ser capturada
        document.addEventListener(("isCapture"), (e) => {
            this.isCaptureActive = true;
        });

        // Para saber se vai evoluir
        document.addEventListener(("evolucao"), (e) => {
            this.evolucao();
        });

    }

    canBeMoved(futureGridX, futureGridY) {
        switch (this.facing) {
            case "front":
                if (this.isCaptureActive == true) {
                    // Se for um movimento de captura, o peão anda na diagonal
                    if (this.belongsToDiagonal(futureGridX, futureGridY) && futureGridY == this.gridY+1) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (futureGridY == this.gridY+1 && futureGridX == this.gridX) {
                        return true;
                    }
                }

                return false;
            case "back":
                if (this.isCaptureActive == true) {
                    // Se for um movimento de captura, o peão anda na diagonal
                    if (this.belongsToDiagonal(futureGridX, futureGridY) && futureGridY == this.gridY-1) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (futureGridY == this.gridY-1 && futureGridX == this.gridX) {
                        return true;
                    }
                }

                return false;
        }
    }

    evolucao() {
        openEvolucaoPeaoWindow();
    }

}