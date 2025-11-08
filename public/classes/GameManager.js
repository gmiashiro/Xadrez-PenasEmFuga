class GameManager {
    constructor() {
        this.quantJogadores = 0;
        this.tabuleiro;

    }

    startTabuleiro(jogador) {
        switch (jogador) {
            case 2:
                console.log("Juninho Jr entrou no jogo");
                break;
            case 1:
                console.log("Pingo entrou no jogo");
                break;
        }
        this.tabuleiro = new Tabuleiro(jogador);
        this.tabuleiro.startTabuleiro();
    }

}