class Tabuleiro {
    constructor(jogador) {
        this.jogador = jogador;
        // 1 = Juninho Jr
        // 2 = Pingo
        this.tiles = null;
    }

    startTabuleiro() {
        // Código retirado de script

        // 1. Cria uma instância do nosso gerenciador de tabuleiro
        const canvas = document.querySelector(".game-canvas");
        const ctx = canvas.getContext("2d");
        //const tiles = new Tiles(canvas, ctx, this.jogador);
        this.tiles = new Tiles(canvas, ctx, this.jogador);

        // 2. Adiciona o listener de clique no canvas
        canvas.addEventListener("click", (event) => {
            // Pega a posição do clique relativa ao canvas
            const clickX = event.offsetX;
            const clickY = event.offsetY;

            // Converte a posição do pixel (ex: 130px) para o índice da grade (ex: 2)
            // A própria classe Tiles sabe seu tamanho, então pedimos para ela converter
            const tileCoords = this.tiles.getTileCoordsFromPixels(clickX, clickY);

            if (tileCoords) {
                // Delega o evento de clique para a classe Tiles
                this.tiles.handleGridClick(tileCoords.x, tileCoords.y);
            }
        });
    }

    aplicarMovimentoOponente(msg) {
        // msg contém: { antigoX, antigoY, novoX, novoY, ... }
        if (!this.tiles) return;

        console.log(`Recebido movimento do oponente: ${msg.antigoX},${msg.antigoY} -> ${msg.novoX},${msg.novoY}`);
        
        // Encontra a peça do oponente na posição antiga
        const peca = this.tiles.findPecaAt(msg.antigoX, msg.antigoY);
        
        if (peca) {
            peca.moveTo(msg.novoX, msg.novoY);
        } else {
            console.log("Erro: Não encontrei a peça do oponente para mover.");
        }
    }

    aplicarCapturaOponente(msg) {
        // msg contém: { pecaCapturadaX, pecaCapturadaY, ... }
        if (!this.tiles) return;

        console.log(`Oponente capturou peça em: ${msg.pecaCapturadaX},${msg.pecaCapturadaY}`);
        
        // Encontra a peça (que é nossa) que foi capturada
        const pecaCapturada = this.tiles.findPecaAt(msg.pecaCapturadaX, msg.pecaCapturadaY);
        
        if (pecaCapturada) {
            this.tiles.capturePeca(pecaCapturada);
        } else {
            console.log("Erro: Não encontrei a peça que o oponente capturou.");
        }
    }
}