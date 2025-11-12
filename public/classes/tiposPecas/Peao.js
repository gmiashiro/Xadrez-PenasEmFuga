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
        const pecaNoDestino = this.tiles.findPecaAt(futureGridX, futureGridY);
        const direcao = (this.facing === "back") ? -1 : 1; // -1 para azul/p1, 1 para red/p2
        
        // Ajuste para o Jogador 2 (vermelho)
        if (this.jogador === 2) {
             // Lógica de captura para P2
            if (pecaNoDestino && pecaNoDestino.color !== this.color) {
                if (this.belongsToDiagonal(futureGridX, futureGridY) && futureGridY === this.gridY + 1) {
                    return true;
                }
            }
            // Lógica de movimento para P2
            if (!pecaNoDestino) {
                const primeiroMovimento = (this.gridY === 1);
                if (primeiroMovimento && futureGridY === this.gridY + 2 && futureGridX === this.gridX && !this.tiles.findPecaAt(this.gridX, this.gridY + 1)) {
                    return true; // Pulo duplo
                }
                if (futureGridY === this.gridY + 1 && futureGridX === this.gridX) {
                    return true; // 1 casa
                }
            }
            return false;
        }

        // Lógica de captura para P1 (azul)
        if (pecaNoDestino && pecaNoDestino.color !== this.color) {
            if (this.belongsToDiagonal(futureGridX, futureGridY) && futureGridY === this.gridY + direcao) {
                return true;
            }
        }
        
        // Lógica de movimento para P1 (azul)
        if (!pecaNoDestino) {
            const primeiroMovimento = (this.gridY === 6);
            if (primeiroMovimento && futureGridY === this.gridY + (direcao * 2) && futureGridX === this.gridX && !this.tiles.findPecaAt(this.gridX, this.gridY + direcao)) {
                return true; // Pulo duplo
            }
            if (futureGridY === this.gridY + direcao && futureGridX === this.gridX) {
                return true; // 1 casa
            }
        }

        return false;
    }

    getPossibleMoves() {
        let possibleMoves = [];
        const direcao = (this.facing === "back") ? -1 : 1; // -1 para p1 (azul), 1 para p2 (vermelho)

        // Posições de movimento reto
        const frente1 = this.gridY + direcao;
        const frente2 = this.gridY + (direcao * 2);

        // Posições de captura
        const diagEsq = this.gridX - 1;
        const diagDir = this.gridX + 1;

        // 1. Movimento 1 casa à frente
        if (!this.tiles.findPecaAt(this.gridX, frente1)) {
            possibleMoves.push({ x: this.gridX, y: frente1 });
        }

        // 2. Movimento 2 casas (só no início)
        const primeiroMovimento = (this.facing === "back" && this.gridY === 6) || (this.facing === "front" && this.gridY === 1);
        if (primeiroMovimento && !this.tiles.findPecaAt(this.gridX, frente1) && !this.tiles.findPecaAt(this.gridX, frente2)) {
            possibleMoves.push({ x: this.gridX, y: frente2 });
        }

        // 3. Captura diagonal esquerda
        const pecaDiagEsq = this.tiles.findPecaAt(diagEsq, frente1);
        if (pecaDiagEsq && pecaDiagEsq.color !== this.color) {
            possibleMoves.push({ x: diagEsq, y: frente1 });
        }
        
        // 4. Captura diagonal direita
        const pecaDiagDir = this.tiles.findPecaAt(diagDir, frente1);
        if (pecaDiagDir && pecaDiagDir.color !== this.color) {
            possibleMoves.push({ x: diagDir, y: frente1 });
        }

        return possibleMoves;
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