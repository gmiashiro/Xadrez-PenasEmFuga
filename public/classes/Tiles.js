class Tiles {
    constructor(canvas, ctx, jogador) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.BOARD_SIZE = 512; // tamanho total do tabuleiro em pixels
        this.TILE_SIZE = this.BOARD_SIZE / 8;

        this.selectedPeca = null;
        this.meuTurno = false;
        this.possibleMoves = [];
        this.pecas = [];

        this.boardImage = new Image();
        this.boardImage.src = "./assets/hud/background/xadrezFundo3.png";

        this.boardImage.onload = () => {

            if (this.jogador == 1) {
                this.initializeBoardPlayer_1();
            } else if (this.jogador == 2) {
                this.initializeBoardPlayer_2();
            }

            
            this.gameLoop();
        };

        this.jogador = jogador;

    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //this.ctx.drawImage(this.boardImage, 0, 0, this.canvas.width, this.canvas.height);

        if(this.selectedPeca) {
            const pixelX = (this.selectedPeca.gridX * this.TILE_SIZE)
            const pixelY = (this.selectedPeca.gridY * this.TILE_SIZE)
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.ctx.fillRect(pixelX, pixelY, this.TILE_SIZE, this.TILE_SIZE);
        }

        this.ctx.fillStyle = "rgba(255, 255, 0, 0.35)"; // Amarelo 
        
        this.possibleMoves.forEach(move => {
            // Calcula o centro do tile
            const pixelX = (move.x * this.TILE_SIZE) + (this.TILE_SIZE / 2);
            const pixelY = (move.y * this.TILE_SIZE) + (this.TILE_SIZE / 2);
            const radius = this.TILE_SIZE / 4; // Raio do círculo

            this.ctx.beginPath();
            this.ctx.arc(pixelX, pixelY, radius, 0, 2 * Math.PI, false);
            this.ctx.fill();
        });

        this.pecas.forEach(peca => peca.draw(this.ctx));
    }

    handleGridClick(tileX, tileY) {

        if (!this.meuTurno) {
            console.log("Não é o seu turno!");
            return;
        }
        
        // descobre qual peça (se houver) está na posição clicada
        const clickedPeca = this.findPecaAt(tileX, tileY);

        if(clickedPeca) { // ERRO: 'this.clickedPeca' não existe
            console.log(`Clicou na peça ${clickedPeca.color} em (${tileX}, ${tileY})`);
        } else {
            console.log(`Clicou na casa vazia em (${tileX}, ${tileY})`);
        }
        //console.log(clickedPeca.facing)
        

        // Já possui uma peça selecionada
        if (this.selectedPeca) {
            // se clicar no mesmo tile da peça selecionada, desseleciona
            if (clickedPeca === this.selectedPeca){
                this.selectedPeca = null;
                this.possibleMoves = [];
                console.log("Peça desselecionada.");
            // se clicar em tile com uma peça amiga
            } else if (clickedPeca && clickedPeca.color === this.selectedPeca.color) {
                this.selectedPeca = clickedPeca;
                this.possibleMoves = this.selectedPeca.getPossibleMoves();
                console.log("selecao trocada para peça amiga");
            // Se clicar em tile vazio (movimento)
            } else if (!clickedPeca && this.selectedPeca.canBeMoved(tileX, tileY)) {
                console.log("movendo a peça para um local vazio");
                console.log(this.jogador);
                console.log(this.selectedPeca.id);
                // this.selectedPeca.getPossibleMoves(tileX, tileY);
                var pecaMovida = new CustomEvent("pecaMovida", {
                        detail: {
                            antigoX: this.selectedPeca.gridX,
                            antigoY: this.selectedPeca.gridY,
                            novoX: tileX,
                            novoY: tileY,
                            jogador: this.jogador,
                            id: this.selectedPeca.id
                        }
                    });
                document.dispatchEvent(pecaMovida);
                this.selectedPeca.moveTo(tileX, tileY);
                if (this.selectedPeca.isPeao) {
                    if ((this.selectedPeca.facing == "front" && tileY == 7) || (this.selectedPeca.facing == "back" && tileY == 0)) {
                        this.selectedPeca.evolucao();
                    } 
                }
                console.log(this.selectedPeca.id);
                this.selectedPeca = null;
                this.possibleMoves = [];
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
                            jogadorQueCapturou: this.jogador,
                            id: clickedPeca.id
                        }
                    });
                    document.dispatchEvent(capturandoPeca);

                    this.capturePeca(clickedPeca);

                    const antigoX = this.selectedPeca.gridX;
                    const antigoY = this.selectedPeca.gridY;

                    this.selectedPeca.moveTo(tileX, tileY);

                    var pecaMovida = new CustomEvent("pecaMovida", {
                        detail: {
                            antigoX: antigoX,
                            antigoY: antigoY,
                            novoX: tileX,
                            novoY: tileY,
                            jogador: this.jogador,
                            id: this.selectedPeca.id
                        }
                    });
                    document.dispatchEvent(pecaMovida);
                    
                    if (this.selectedPeca.isPeao) {
                        if ((this.selectedPeca.facing == "front" && tileY == 7) || (this.selectedPeca.facing == "back" && tileY == 0)) {
                            this.selectedPeca.evolucao();
                        } 
                    }
                    
                    this.selectedPeca = null;
                    this.possibleMoves = [];
                }
            }
        // Não possui peça selecionada
        } else {
            if (clickedPeca && clickedPeca.facing === "back") {
                this.selectedPeca = clickedPeca;
                this.possibleMoves = this.selectedPeca.getPossibleMoves();
                console.log("Peça selecionada:", clickedPeca);
            } else if (clickedPeca && clickedPeca.facing === "front") {
                console.log("peça inimiga")
            }
            // se clicou em um tile vazio, não faz nada
        }
    }

    getTileCoordsFromPixels(pixelX, pixelY) {
        const relativeX = pixelX;
        const relativeY = pixelY;

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

    findPecaId(id) {
        return this.pecas.find(peca => peca.id === id);
    }

    getPossibleMoves(peca) {
        var tipoPeca = peca.constructor.name;
        // console.log(peca.constructor.name);
    }

    // Remove a peça do jogo
    capturePeca(pecaToCapture) {
        this.pecas = this.pecas.filter(peca => peca !== pecaToCapture);
    }

    initializeBoardPlayer_1(){
        const path = "./assets/spriteSheets";
        const rivalConfig = { tiles: this, directionMoviment: "down", color: "red", facing: "front" };
        const playerConfig = { tiles: this, directionMoviment: "up", color: "blue", facing: "back" };

        // Time Vermelho (Traseira - y=0, Peões - y=1)
        this.pecas.push(new Torre({ ...rivalConfig, gridX: 0, gridY: 0, id: "T1_p2", spriteSheet: `${path}/red/torreRed.png` }));
        this.pecas.push(new Cavalo({ ...rivalConfig, gridX: 1, gridY: 0, id: "C1_p2", spriteSheet: `${path}/red/cavaloRed.png` }));
        this.pecas.push(new Bispo({ ...rivalConfig, gridX: 2, gridY: 0, id: "B1_p2", spriteSheet: `${path}/red/bispoRed.png` }));
        this.pecas.push(new Rainha({ ...rivalConfig, gridX: 3, gridY: 0, id: "Ra1_p2", spriteSheet: `${path}/red/rainhaRed.png` }));
        this.pecas.push(new Rei({ ...rivalConfig, gridX: 4, gridY: 0, id: "Re1_p2", spriteSheet: `${path}/red/reiRed.png` }));
        this.pecas.push(new Bispo({ ...rivalConfig, gridX: 5, gridY: 0, id: "B2_p2", spriteSheet: `${path}/red/bispoRed.png` }));
        this.pecas.push(new Cavalo({ ...rivalConfig, gridX: 6, gridY: 0, id: "C2_p2", spriteSheet: `${path}/red/cavaloRed.png` }));
        this.pecas.push(new Torre({ ...rivalConfig, gridX: 7, gridY: 0, id: "T2_p2", spriteSheet: `${path}/red/torreRed.png` }));

        for (let i = 0; i < 8; i++) {
            var pecaId = "P" + (i+1) + "_p2";
            this.pecas.push(new Peao({ ...rivalConfig, gridX: i, gridY: 1, id: pecaId, spriteSheet: `${path}/red/peaoRed.png` }));
        }

        // Time Azul (Traseira - y=7, Peões - y=6)
        this.pecas.push(new Torre({ ...playerConfig, gridX: 0, gridY: 7, id: "T1_p1", spriteSheet: `${path}/blue/torreBlue.png` }));
        this.pecas.push(new Cavalo({ ...playerConfig, gridX: 1, gridY: 7, id: "C1_p1", spriteSheet: `${path}/blue/cavaloBlue.png` }));
        this.pecas.push(new Bispo({ ...playerConfig, gridX: 2, gridY: 7, id: "B1_p1", spriteSheet: `${path}/blue/bispoBlue.png` }));
        this.pecas.push(new Rainha({ ...playerConfig, gridX: 3, gridY: 7, id: "Ra1_p1", spriteSheet: `${path}/blue/rainhaBlue.png` }));
        this.pecas.push(new Rei({ ...playerConfig, gridX: 4, gridY: 7, id: "Re1_p1", spriteSheet: `${path}/blue/reiBlue.png` }));
        this.pecas.push(new Bispo({ ...playerConfig, gridX: 5, gridY: 7, id: "B2_p1", spriteSheet: `${path}/blue/bispoBlue.png` }));
        this.pecas.push(new Cavalo({ ...playerConfig, gridX: 6, gridY: 7, id: "C2_p1", spriteSheet: `${path}/blue/cavaloBlue.png` }));
        this.pecas.push(new Torre({ ...playerConfig, gridX: 7, gridY: 7, id: "T2_p1", spriteSheet: `${path}/blue/torreBlue.png` }));

        for (let i = 0; i < 8; i++) {
            var pecaId = "P" + (i+1) + "_p1";
            this.pecas.push(new Peao({ ...playerConfig, gridX: i, gridY: 6, id: pecaId, spriteSheet: `${path}/blue/peaoBlue.png` }));
        }

        console.log(`Tabuleiro inicializado com ${this.pecas.length} peças.`);
    }

    initializeBoardPlayer_2(){
        const path = "./assets/spriteSheets";
        const rivalConfig = { tiles: this, directionMoviment: "down", color: "blue", facing: "front" };
        const playerConfig = { tiles: this, directionMoviment: "up", color: "red", facing: "back" };

        // Time Azul (Traseira - y=0, Peões - y=1)
        this.pecas.push(new Torre({ ...rivalConfig, gridX: 0, gridY: 0, id: "T2_p1", spriteSheet: `${path}/blue/torreBlue.png` }));
        this.pecas.push(new Cavalo({ ...rivalConfig, gridX: 1, gridY: 0, id: "C2_p1", spriteSheet: `${path}/blue/cavaloBlue.png` }));
        this.pecas.push(new Bispo({ ...rivalConfig, gridX: 2, gridY: 0, id: "B2_p1", spriteSheet: `${path}/blue/bispoBlue.png` }));
        this.pecas.push(new Rainha({ ...rivalConfig, gridX: 4, gridY: 0, id: "Ra1_p1", spriteSheet: `${path}/blue/rainhaBlue.png` }));
        this.pecas.push(new Rei({ ...rivalConfig, gridX: 3, gridY: 0, id: "Re1_p1", spriteSheet: `${path}/blue/reiBlue.png` }));
        this.pecas.push(new Bispo({ ...rivalConfig, gridX: 5, gridY: 0, id: "B1_p1", spriteSheet: `${path}/blue/bispoBlue.png` }));
        this.pecas.push(new Cavalo({ ...rivalConfig, gridX: 6, gridY: 0, id: "C1_p1", spriteSheet: `${path}/blue/cavaloBlue.png` }));
        this.pecas.push(new Torre({ ...rivalConfig, gridX: 7, gridY: 0, id: "T1_p1", spriteSheet: `${path}/blue/torreBlue.png` }));

        for (let i = 7; i >= 0; i--) {
            var pecaId = "P" + (i+1) + "_p1";
            this.pecas.push(new Peao({ ...rivalConfig, gridX: 7-i, gridY: 1, id: pecaId, spriteSheet: `${path}/blue/peaoBlue.png` }));
        }

        // Time Vermelho (Traseira - y=7, Peões - y=6)
        this.pecas.push(new Torre({ ...playerConfig, gridX: 0, gridY: 7, id: "T2_p2", spriteSheet: `${path}/red/torreRed.png` }));
        this.pecas.push(new Cavalo({ ...playerConfig, gridX: 1, gridY: 7, id: "C2_p2", spriteSheet: `${path}/red/cavaloRed.png` }));
        this.pecas.push(new Bispo({ ...playerConfig, gridX: 2, gridY: 7, id: "B2_p2", spriteSheet: `${path}/red/bispoRed.png` }));
        this.pecas.push(new Rainha({ ...playerConfig, gridX: 4, gridY: 7, id: "Ra1_p2", spriteSheet: `${path}/red/rainhaRed.png` }));
        this.pecas.push(new Rei({ ...playerConfig, gridX: 3, gridY: 7, id: "Re1_p2", spriteSheet: `${path}/red/reiRed.png` }));
        this.pecas.push(new Bispo({ ...playerConfig, gridX: 5, gridY: 7, id: "B1_p2", spriteSheet: `${path}/red/bispoRed.png` }));
        this.pecas.push(new Cavalo({ ...playerConfig, gridX: 6, gridY: 7, id: "C1_p2", spriteSheet: `${path}/red/cavaloRed.png` }));
        this.pecas.push(new Torre({ ...playerConfig, gridX: 7, gridY: 7, id: "T1_p2", spriteSheet: `${path}/red/torreRed.png` }));

        for (let i = 7; i >= 0; i--) {
            var pecaId = "P" + (i+1) + "_p2";
            this.pecas.push(new Peao({ ...playerConfig, gridX: 7-i, gridY: 6, id: pecaId, spriteSheet: `${path}/red/peaoRed.png` }));
        }

        console.log(`Tabuleiro inicializado com ${this.pecas.length} peças.`);
    }

    gameLoop(){
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}