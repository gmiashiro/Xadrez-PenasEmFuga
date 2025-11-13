class Tabuleiro {
    constructor(jogador) {
        this.jogador = jogador;
        // 2 = Juninho Jr
        // 1 = Pingo
        this.tiles = null;
    }

    startTabuleiro() {
        // Código retirado de script

        // 1. Cria uma instância do nosso gerenciador de tabuleiro
        const canvas = document.querySelector(".game-canvas");
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
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

        console.log(`Recebido movimento do oponente: ${msg.antigoX},${msg.antigoY} -> ${msg.novoX},${msg.novoY}, ${msg.id}`);
        
        // Encontra a peça do oponente na posição antiga
        // const peca = this.tiles.findPecaAt(msg.antigoX, msg.antigoY);
        const peca = this.tiles.findPecaId(msg.id);
        console.log(msg.id);
        console.log("teste")
        
        if (peca) {
            peca.moveTo(this.espelharMovimento(msg.novoX), this.espelharMovimento(msg.novoY));
        } else {
            console.log("Erro: Não encontrei a peça do oponente para mover.");
        }
    }

    aplicarCapturaOponente(msg) {
        // msg contém: { pecaCapturadaX, pecaCapturadaY, ... }
        if (!this.tiles) return;

        console.log(`Oponente capturou peça em: ${msg.pecaCapturadaX},${msg.pecaCapturadaY}`);
        
        // Encontra a peça (que é nossa) que foi capturada
        const pecaCapturada = this.tiles.findPecaId(msg.id);
        
        if (pecaCapturada) {
            this.tiles.capturePeca(pecaCapturada);
        } else {
            console.log("Erro: Não encontrei a peça que o oponente capturou.");
        }
    }

    aplicarEvolucaoOponente(msg) {
        // msg tem: idPeao, idNova
        console.log(`Oponente evoluiu peça: ${msg.idPeao}, para ${msg.idNova}`);
        const peao = this.tiles.findPecaId(msg.idPeao);
        var tipo = null;
        
        if (msg.idNova.includes("Ra")) {
            tipo = "Rainha";
        } else if (msg.idNova.includes("B")) {
            tipo = "Bispo";
        } else if (msg.idNova.includes("T")) {
            tipo = "Torre";
        } else if (msg.idNova.includes("C")) {
            tipo = "Cavalo";
        }

        if(peao) {
            this.tiles.capturePeca(peao); // Usa a função de captura mesmo para tirar a peça do peão
            this.tiles.evolucaoPeao(tipo, peao, false)
        } else {
            console.log("Erro: Não foi possível encontrar o peão que evoluiu");
        }

    }

    atualizarTurno(eMeuTurno) {
        if (this.tiles) {
            this.tiles.meuTurno = eMeuTurno;
            // Log para depuração
            if (eMeuTurno) {
                console.log("É o meu turno!");
            } else {
                console.log("Aguardando o oponente...");
            }
        }
    }

    espelharMovimento(grid) {
        switch (grid) {
            case 0:
                return 7;
            case 1:
                return 6;
            case 2:
                return 5;
            case 3:
                return 4;
            case 4:
                return 3;
            case 5:
                return 2;
            case 6:
                return 1;
            case 7:
                return 0;
        }
    }
}