class Tabuleiro {
    constructor(jogador) {
        this.jogador = jogador;
        // 1 = Juninho Jr
        // 2 = Pingo
    }

    startTabuleiro() {
        // Código retirado de script

        // 1. Cria uma instância do nosso gerenciador de tabuleiro
        const canvas = document.querySelector(".game-canvas");
        const ctx = canvas.getContext("2d");
        const tiles = new Tiles(canvas, ctx, this.jogador);

        // 2. Adiciona o listener de clique no canvas
        canvas.addEventListener("click", (event) => {
            // Pega a posição do clique relativa ao canvas
            const clickX = event.offsetX;
            const clickY = event.offsetY;

            // Converte a posição do pixel (ex: 130px) para o índice da grade (ex: 2)
            // A própria classe Tiles sabe seu tamanho, então pedimos para ela converter
            const tileCoords = tiles.getTileCoordsFromPixels(clickX, clickY);

            if (tileCoords) {
                // Delega o evento de clique para a classe Tiles
                tiles.handleGridClick(tileCoords.x, tileCoords.y);
            }
        });
    }

}