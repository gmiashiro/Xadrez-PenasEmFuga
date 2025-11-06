class Tiles {
    constructor(canvas, ctx, jogador) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.BOARD_SIZE = 512; // tamanho total do tabuleiro em pixels
        this.GRID_OFFSET = 16; // tamanho da borda ao redor do tabuleiro
        const gridAreaSize = this.BOARD_SIZE - (2 * this.GRID_OFFSET);
        this.TILE_SIZE = gridAreaSize / 8;

        this.selectedPeca = null;

        this.pecas = [];

        this.boardImage = new Image();
        this.boardImage.src = "./assets/hud/background/xadrezFundo.png";

        this.boardImage.onload = () => {
            this._initializeBoard();
            this.gameLoop();
        };

        this.jogador = jogador;

    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(this.boardImage, 0, 0, this.canvas.width, this.canvas.height);

        if(this.selectedPeca) {
            const pixelX = (this.selectedPeca.gridX * this.TILE_SIZE) + this.GRID_OFFSET;
            const pixelY = (this.selectedPeca.gridY * this.TILE_SIZE) + this.GRID_OFFSET;
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.ctx.fillRect(pixelX, pixelY, this.TILE_SIZE, this.TILE_SIZE);
        }

        this.pecas.forEach(peca => peca.draw(this.ctx));
    }

    handleGridClick(tileX, tileY) {
        
        // descobre qual peça (se houver) está na posição clicada
        const clickedPeca = this.findPecaAt(tileX, tileY);

        if(this.clickedPeca) {
            console.log(`Clicou na peça ${clickedPeca.color} em (${tileX}, ${tileY})`);
        } else {
            console.log(`Clicou na casa vazia em (${tileX}, ${tileY})`);
        }

        // Já possui uma peça selecionada
        if (this.selectedPeca) {
            // se clicar no mesmo tile da peça selecionada, desseleciona
            if (clickedPeca === this.selectedPeca){
                this.selectedPeca = null;
                console.log("Peça desselecionada.");
            // se clicar em tile com uma peça amiga
            } else if (clickedPeca && clickedPeca.color === this.selectedPeca.color) {
                this.selectedPeca = clickedPeca;
                console.log("selecao trocada para peça amiga");
            // Se clicar em tile vazio (movimento)
            } else if (!clickedPeca && this.selectedPeca.canBeMoved(tileX, tileY)) {
                console.log("movendo a peça para um local vazio");
                console.log(this.jogador);
                var pecaMovida = new CustomEvent("pecaMovida", {
                        detail: {
                            antigoX: this.selectedPeca.gridX,
                            antigoY: this.selectedPeca.gridY,
                            novoX: tileX,
                            novoY: tileY,
                            jogador: this.jogador
                        }
                    });
                document.dispatchEvent(pecaMovida);

                this.selectedPeca.moveTo(tileX, tileY);
                if (this.selectedPeca.isPeao) {
                    if ((this.selectedPeca.facing == "front" && tileY == 7) || (this.selectedPeca.facing == "back" && tileY == 0)) {
                        this.selectedPeca.evolucao();
                    } 
                }
                
                this.selectedPeca = null;
            // se clicar em um tile da peça inimiga (captura)
            } else if (clickedPeca && clickedPeca.color !== this.selectedPeca.color) {
                var isCapture = new CustomEvent("isCapture");
                document.dispatchEvent(isCapture);
                if (this.selectedPeca.canBeMoved(tileX, tileY)) {
                    console.log("capturando peça inimiga");

                    var capturandoPeca = new CustomEvent("capturandoPeca", {
                        detail: {
                            pecaCapturadaX: clickedPeca.gridX,
                            pecaCapturadaY: clickedPeca.gridY,
                            jogadorQueCapturou: this.jogador
                        }
                    });
                    document.dispatchEvent(capturandoPeca);

                    this.capturePeca(clickedPeca);
                    this.selectedPeca.moveTo(tileX, tileY);
                    
                    if (this.selectedPeca.isPeao) {
                        if ((this.selectedPeca.facing == "front" && tileY == 7) || (this.selectedPeca.facing == "back" && tileY == 0)) {
                            this.selectedPeca.evolucao();
                        } 
                    }
                    
                    this.selectedPeca = null;
                }
            }
        // Não possui peça selecionada
        } else {
            if (clickedPeca) {
                this.selectedPeca = clickedPeca;
                console.log("Peça selecionada:", clickedPeca);
            }
            // se clicou em um tile vazio, não faz nada
        }
    }

    getTileCoordsFromPixels(pixelX, pixelY) {
        const relativeX = pixelX - this.GRID_OFFSET;
        const relativeY = pixelY - this.GRID_OFFSET;

        const tileX = Math.floor(relativeX / this.TILE_SIZE);
        const tileY = Math.floor(relativeY / this.TILE_SIZE); 

        if (tileX < 0 || tileX > 7 || tileY < 0 || tileY > 7) {
            return null;
        }
        return { x: tileX, y: tileY };
    }

    // encontra e retorna o objeto Peca na posição (gridX, gridY), ou undefined se não houver peça
    findPecaAt(gridX, gridY) {
        return this.pecas.find(peca => peca.gridX === gridX && peca.gridY === gridY);
    }

    // Remove a peça do jogo
    capturePeca(pecaToCapture) {
        this.pecas = this.pecas.filter(peca => peca !== pecaToCapture);
    }

    _initializeBoard(){
        const path = "./assets/spriteSheets";
        const redConfig = { tiles: this, directionMoviment: "down", color: "red", facing: "front" };
        const blueConfig = { tiles: this, directionMoviment: "up", color: "blue", facing: "back" };

        // Time Vermelho (Traseira - y=0, Peões - y=1)
        this.pecas.push(new Torre({ ...redConfig, gridX: 0, gridY: 0, spriteSheet: `${path}/red/torreRed.png` }));
        this.pecas.push(new Cavalo({ ...redConfig, gridX: 1, gridY: 0, spriteSheet: `${path}/red/cavaloRed.png` }));
        this.pecas.push(new Bispo({ ...redConfig, gridX: 2, gridY: 0, spriteSheet: `${path}/red/bispoRed.png` }));
        this.pecas.push(new Rainha({ ...redConfig, gridX: 3, gridY: 0, spriteSheet: `${path}/red/rainhaRed.png` }));
        this.pecas.push(new Rei({ ...redConfig, gridX: 4, gridY: 0, spriteSheet: `${path}/red/reiRed.png` }));
        this.pecas.push(new Bispo({ ...redConfig, gridX: 5, gridY: 0, spriteSheet: `${path}/red/bispoRed.png` }));
        this.pecas.push(new Cavalo({ ...redConfig, gridX: 6, gridY: 0, spriteSheet: `${path}/red/cavaloRed.png` }));
        this.pecas.push(new Torre({ ...redConfig, gridX: 7, gridY: 0, spriteSheet: `${path}/red/torreRed.png` }));

        for (let i = 0; i < 8; i++) {
            this.pecas.push(new Peao({ ...redConfig, gridX: i, gridY: 1, spriteSheet: `${path}/red/peaoRed.png` }));
        }

        // Time Azul (Traseira - y=7, Peões - y=6)
        this.pecas.push(new Torre({ ...blueConfig, gridX: 0, gridY: 7, spriteSheet: `${path}/blue/torreBlue.png` }));
        this.pecas.push(new Cavalo({ ...blueConfig, gridX: 1, gridY: 7, spriteSheet: `${path}/blue/cavaloBlue.png` }));
        this.pecas.push(new Bispo({ ...blueConfig, gridX: 2, gridY: 7, spriteSheet: `${path}/blue/bispoBlue.png` }));
        this.pecas.push(new Rainha({ ...blueConfig, gridX: 3, gridY: 7, spriteSheet: `${path}/blue/rainhaBlue.png` }));
        this.pecas.push(new Rei({ ...blueConfig, gridX: 4, gridY: 7, spriteSheet: `${path}/blue/reiBlue.png` }));
        this.pecas.push(new Bispo({ ...blueConfig, gridX: 5, gridY: 7, spriteSheet: `${path}/blue/bispoBlue.png` }));
        this.pecas.push(new Cavalo({ ...blueConfig, gridX: 6, gridY: 7, spriteSheet: `${path}/blue/cavaloBlue.png` }));
        this.pecas.push(new Torre({ ...blueConfig, gridX: 7, gridY: 7, spriteSheet: `${path}/blue/torreBlue.png` }));

        for (let i = 0; i < 8; i++) {
            this.pecas.push(new Peao({ ...blueConfig, gridX: i, gridY: 6, spriteSheet: `${path}/blue/peaoBlue.png` }));
        }

        console.log(`Tabuleiro inicializado com ${this.pecas.length} peças.`);
    }

    gameLoop(){
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}