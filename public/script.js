//const { createContext } = require("react");
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const gameManager = new GameManager();
const soundEffects = new EfeitosSonoros();

// Aqui no script, ele escuta e envia mensagens ao servidor, comunicando sobre o jogo em si

const ws = new WebSocket("ws://localhost:51171");
ws.onopen = () => {
    console.log("Conectado ao servidor WebSocket");

    // Escutando acontecimentos do jogo e comunicando ao servidor sobre elas
    document.addEventListener("capturandoPeca", (e) => {

        if (sound) {
            soundEffects.playCaptureSound();
        }

        addPecaCapturadaScore(e.detail);
        ws.send(JSON.stringify({
            tipo: "pecaCapturada",
            pecaCapturadaX: e.detail.pecaCapturadaX,
            pecaCapturadaY: e.detail.pecaCapturadaY,
            jogadorQueCapturou: e.detail.jogadorQueCapturou,
            id: e.detail.id
        }))
    });

    document.addEventListener("pecaMovida", (e) => {

        if (sound) {
            soundEffects.playMovementSound();
        }

        ws.send(JSON.stringify({
            tipo: "pecaMovida",
            antigoX: e.detail.antigoX,
            antigoY: e.detail.antigoY,
            novoX: e.detail.novoX,
            novoY: e.detail.novoY,
            jogador: e.detail.jogador,
            id: e.detail.id
        }))
    });

    document.addEventListener("oponenteEvoluiu", (e) => {
        ws.send(JSON.stringify({
            tipo: "oponenteEvoluiu",
            idPeao: e.detail.idPeao,
            idNova: e.detail.idNova
        }))
    });

    document.addEventListener("reiCapturado", (e) => {
        // 1. Mostra a janela de "Game Over"
        openGameOverWindow(e.detail.winnerColor, e.detail.winnerPlayer);

        // 2. Avisa o servidor que o jogo terminou
        ws.send(JSON.stringify({
            tipo: "jogoTerminou",
            winnerColor: e.detail.winnerColor,
            winnerPlayer: e.detail.winnerPlayer
        }));
    });
};

ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    console.log("[LOG CLIENTE] Recebeu mensagem do servidor:", msg.tipo, msg);

    switch (msg.tipo) {
        case "novoJogador":
            // Inicia o tabuleiro quando o servidor atribui um ID de jogador
            window.playerId = msg.jogador;
            buildScore(msg.jogador);
            gameManager.startTabuleiro(msg.jogador);
            openStartWindow();
            gameManager.tabuleiro.atualizarTurno(msg.jogador === msg.turno);
            break;
        case "passouQuantidadeJogadores":
            alert("O jogo já está cheio. Tente mais tarde.");
            break;

        // --- NOVOS CASOS ---
        case "oponenteMoveuPeca":
            // Passa a jogada para o tabuleiro aplicar
            if (gameManager.tabuleiro) {
                gameManager.tabuleiro.aplicarMovimentoOponente(msg);
            }
            break;
        case "oponenteCapturouPeca":
            // Passa a captura para o tabuleiro aplicar
            if (gameManager.tabuleiro) {
                addPecaCapturadaScore(msg);
                gameManager.tabuleiro.aplicarCapturaOponente(msg);
            }
            break;
        case "oponenteEvoluiu":
            // Passa a evolução para o tabuleiro aplicar
            if (gameManager.tabuleiro) {
                gameManager.tabuleiro.aplicarEvolucaoOponente(msg);
            }
            break;
        case "atualizarTurno":
            if (gameManager.tabuleiro) {
                // Atualiza o estado do turno (true se msg.turno == this.jogador)
                gameManager.tabuleiro.atualizarTurno(gameManager.tabuleiro.jogador === msg.turno);
            }
            break;
        case "oponenteDesconectou":
            alert("Seu oponente desconectou. Atualize a página para encontrar um novo jogo.");
            // (Aqui você pode adicionar uma lógica para resetar o jogo)
            break;
        // O servidor está nos dizendo que o oponente venceu
        case "jogoTerminouOponente":
            // --- LOG ESPECIAL ---
            console.log("[LOG CLIENTE] Processando 'jogoTerminouOponente'!");
            if (gameManager?.tabuleiro || window.playerId) {
                openGameOverWindow(msg.winnerColor, msg.winnerPlayer);
            } else {
                console.warn("Tabuleiro não inicializado — adiando exibição do Game Over.");
                setTimeout(() => openGameOverWindow(msg.winnerColor, msg.winnerPlayer), 500);
            }
            break;

        // O servidor confirmou que ambos os jogadores querem recomeçar
        case "recomecarJogo":
            // A forma mais fácil e segura de resetar o jogo é recarregar a página
            location.reload();
            break;
        // --- FIM DOS NOVOS CASOS ---
    }
};


function openStartWindow() {
    // Cria a aba
    const startWindow = document.createElement("div");
    startWindow.id = "start-window";
    startWindow.classList.add("first");
    // Cria a camada escura que será colocada atrás da aba
    const camadaEscura = document.createElement("div");
    camadaEscura.classList.add("escurecer");
    camadaEscura.id = "camadaEscura";
    // Adiciona toda a estrutura de html da aba
    startWindow.innerHTML = "<h1>Penas no tabuleiro!</h1><span>Um spinoff do grandioso e aclamado 'Penas em fuga!'</span>";
    // <h1>Penas no tabuleiro!</h1>
    // <span>Um spinoff do grandioso e aclamado “Penas em fuga!”</span>

    // Coloca os novos elementos no body
    const body = document.getElementById("body");
    body.appendChild(camadaEscura);
    body.appendChild(startWindow);

    setTimeout(() => {
        startWindow.innerHTML = "<div class='start-window-text'><p>'As regras não mudam, Pingo — o jogo é o mesmo desde os tempos antigos. Cada peça conhece seu caminho. Só resta saber… se você conhece o seu.'</p><p>Juninho Jr.</p></div><div><button onclick='startGame()'>Começar</button></div>";
        startWindow.classList.remove("first");
        startWindow.classList.add("last");
        // <div class='start-window-text'>
        //     <p>'As regras não mudam, Pingo — o jogo é o mesmo desde os tempos antigos. Cada peça conhece seu caminho. Só resta saber… se você conhece o seu.'</p>
        //     <p>Juninho Jr.</p>
        // </div>
        // <div>
        //     <button onclick='startGame()'>Começar</button>
        // </div>
    }, 3000);
}

function startGame() {
    const startWindow = document.getElementById("start-window");
    const camadaEscura = document.getElementById("camadaEscura");
    startWindow.remove();
    camadaEscura.remove();
}




function buildScore(jogador) {
    var scoreLeft = document.getElementById("scoreLeft");
    var scoreRight = document.getElementById("scoreRight");
    var imgDivLeft = document.createElement("div");
    var imgDivRight = document.createElement("div");
    imgDivLeft.classList.add("image");
    imgDivRight.classList.add("image");
    var boxDivRight = document.createElement("div");
    var boxDivLeft = document.createElement("div");
    boxDivLeft.classList.add("retangulo");
    boxDivRight.classList.add("retangulo");

    if (jogador == 1) {
        // LADO ESQUERDO
        imgDivLeft.classList.add("imageBlue");
        imgDivLeft.classList.add("blue");
        boxDivLeft.classList.add("blueB");
        boxDivLeft.id = "blueB";

        // LADO DIREITO
        imgDivRight.classList.add("imageRed");
        imgDivRight.classList.add("red");
        boxDivRight.classList.add("redB");
        boxDivRight.id = "redB";
    } else {
        // LADO ESQUERDO
        imgDivLeft.classList.add("imageRed");
        imgDivLeft.classList.add("red");
        boxDivLeft.classList.add("redB");
        boxDivLeft.id = "redB";

        // LADO DIREITO
        imgDivRight.classList.add("imageBlue");
        imgDivRight.classList.add("blue");
        boxDivRight.classList.add("blueB");
        boxDivRight.id = "blueB";
    }

    scoreLeft.appendChild(boxDivLeft);
    scoreLeft.appendChild(imgDivLeft);
    scoreRight.appendChild(imgDivRight);
    scoreRight.appendChild(boxDivRight);
}

function addPecaCapturadaScore(msg) {
    if (msg.jogadorQueCapturou == 1) {
        // Está jogando com as peças azuis

        var score = document.getElementById("blueB");
        if (msg.id.includes("P")) {
            var peaoRImg = "<img src='./assets/hud/images/icons/pawnRed.png'>";
            score.innerHTML += peaoRImg;
        } else if (msg.id.includes("T")) {
            var torreRImg = "<img src='./assets/hud/images/icons/towerRed.png'>";
            score.innerHTML += torreRImg;
        } else if (msg.id.includes("B")) {
            var bispoRImg = "<img src='./assets/hud/images/icons/bishopRed.png'>";
            score.innerHTML += bispoRImg;
        } else if (msg.id.includes("C")) {
            var cavaloRImg = "<img src='./assets/hud/images/icons/horseRed.png'>";
            score.innerHTML += cavaloRImg;
        } else if (msg.id.includes("Re")) {
            var reiRImg = "<img src='./assets/hud/images/redImage.png'>";
            score.innerHTML += reiRImg;
        } else if (msg.id.includes("Ra")) {
            var rainhaRImg = "<img src='./assets/hud/images/icons/queenRed.png'>";
            score.innerHTML += rainhaRImg;
        }
    } else {
        var score = document.getElementById("redB");
        if (msg.id.includes("P")) {
            var peaoBImg = "<img src='./assets/hud/images/icons/pawnBlue.png'>";
            score.innerHTML += peaoBImg;
        } else if (msg.id.includes("T")) {
            var torreBImg = "<img src='./assets/hud/images/icons/towerBlue.png'>";
            score.innerHTML += torreBImg;
        } else if (msg.id.includes("B")) {
            var bispoBImg = "<img src='./assets/hud/images/icons/bishopBlue.png'>";
            score.innerHTML += bispoBImg;
        } else if (msg.id.includes("C")) {
            var cavaloBImg = "<img src='./assets/hud/images/icons/horseBlue.png'>";
            score.innerHTML += cavaloBImg;
        } else if (msg.id.includes("Re")) {
            var reiBImg = "<img src='./assets/hud/images/blueImage.png'>";
            score.innerHTML += reiBImg;
        } else if (msg.id.includes("Ra")) {
            var rainhaBImg = "<img src='./assets/hud/images/icons/queenBlue.png'>";
            score.innerHTML += rainhaBImg;
        }
    }

}


// A música e o som começam ligadas
var sound = true;
var song = true;

function openConfigWindow() {
    // Cria a aba
    const configWindow = document.createElement("div");
    configWindow.id = "config-window";
    // Cria a camada escura que será colocada atrás da aba
    const camadaEscura = document.createElement("div");
    camadaEscura.classList.add("escurecer");
    // Adiciona toda a estrutura de html da aba
    configWindow.innerHTML += "<div class='config-header'><span class='config-title'>Configurações</span><button class='config-exit-button' id='config-exit-button'>X</button></div><div class='config-window-button-container'><button class='config-window-button' id='sound'></button><button class='config-window-button' id='song'></button></div>";
    // <div class='config-header'>
    //     <span class='config-title'>Configurações</span>
    //     <button class='config-exit-button'>X</button>
    // </div>
    // <div class='config-window-button-container'>
    //     <button class='config-window-button sound'></button>
    //     <button class='config-window-button song'></button>
    // </div>

    // Coloca os novos elementos no body
    const body = document.getElementById("body");
    body.appendChild(camadaEscura);
    body.appendChild(configWindow);

    // Pega o elemento do botão de som e escolhe a sua aparência caso o som esteja ligado ou não
    const soundButton = document.getElementById("sound");
    if (sound) {
        soundButton.classList.add("sound");
    } else {
        soundButton.classList.add("soundOff");
    }

    soundButton.onclick = () => {
        if (sound) {
            // Se o som estiver ligado e quer desligar
            soundButton.classList.remove("sound");
            soundButton.classList.add("soundOff");
            sound = false;
        } else {
            // Se o som estiver desligado e quer ligar
            soundButton.classList.remove("soundOff");
            soundButton.classList.add("sound");
            sound = true;
        }
    }

    // Mesmo processo anterior, mas com o botão de música
    const songButton = document.getElementById("song");
    if (song) {
        songButton.classList.add("song");
    } else {
        songButton.classList.add("songOff");
    }
    songButton.onclick = () => {
        console.log("ok")
        if (song) {
            // Se a música estiver ligada e quer desligar
            songButton.classList.remove("song");
            songButton.classList.add("songOff");
            song = false;
            var desligarSong = new CustomEvent("desligarSong");
            document.dispatchEvent(desligarSong);
            console.log("3")
        } else {
            // Se a música estiver desligada e quer ligar
            songButton.classList.remove("songOff");
            songButton.classList.add("song");
            song = true;
            var ligarSong = new CustomEvent("ligarSong");
            document.dispatchEvent(ligarSong);
            console.log("4")
        }
    }

    // Função do botão de sair da aba
    const exitButton = document.getElementById('config-exit-button');
    exitButton.onclick = () => {
        configWindow.remove();
        camadaEscura.remove();
    }
}


function openEvolucaoPeaoWindow() {
    // Cria a aba
    const evolucaoWindow = document.createElement("div");
    evolucaoWindow.id = "evolucao-window";
    // Cria a camada escura que será colocada atrás da aba
    const camadaEscura = document.createElement("div");
    camadaEscura.classList.add("escurecer");
    // Adiciona toda a estrutura de html da aba
    evolucaoWindow.innerHTML += "<div class='evolucao-header'><span class='evolucao-title'>Promoção</span><p>Escolha sua peça</p></div><div class='evolucao-button-container'><button class='evolucao-button rainha' onclick='chosenPecaEvolucao(1)'></button><button class='evolucao-button torre' onclick='chosenPecaEvolucao(2)'></button><button class='evolucao-button cavalo' onclick='chosenPecaEvolucao(3)'></button><button class='evolucao-button bispo' onclick='chosenPecaEvolucao(4)'></button></div>";
    // <div class='evolucao-header'>
    //     <span class='evolucao-title'>Promoção</span>
    //     <p>Escolha sua peça</p>
    // </div>
    // <div class='evolucao-button-container'>
    //     <button class='evolucao-button rainha' onclick='chosenPecaEvolucao(1)'></button>
    //     <button class='evolucao-button torre' onclick='chosenPecaEvolucao(2)'></button>
    //     <button class='evolucao-button cavalo' onclick='chosenPecaEvolucao(3)'></button>
    //     <button class='evolucao-button bispo' onclick='chosenPecaEvolucao(4)'></button>
    // </div>

    // Coloca os novos elementos no body
    const body = document.getElementById("body");
    body.appendChild(camadaEscura);
    body.appendChild(evolucaoWindow);

    const buttons = document.querySelectorAll(".evolucao-button");

    console.log("veio no script")

    buttons.forEach(button => {
        button.onclick = () => {
            setTimeout(() => {
                console.log("ue")
                evolucaoWindow.remove();
                camadaEscura.remove();
                var classe = null;

                if (button.classList.contains("rainha")) {
                    classe = "Rainha";
                } else if (button.classList.contains("bispo")) {
                    classe = "Bispo";
                } else if (button.classList.contains("torre")) {
                    classe = "Torre";
                } else if (button.classList.contains("cavalo")) {
                    classe = "Cavalo";
                }

                chosenPecaEvolucao(classe);
            }, 300);
        }
    })
}

function chosenPecaEvolucao(tipo) {
    console.log("O QUE");
    console.log(tipo)
    var chosenPecaEvolucao = new CustomEvent("chosenPecaEvolucao", {
        detail: {
            peca: tipo
        }
    });
    document.dispatchEvent(chosenPecaEvolucao);
}

function openGameOverWindow(winnerColor, winnerPlayer) {
    // Para o jogo (impede cliques futuros)
    if (gameManager.tabuleiro && gameManager.tabuleiro.tiles) {
        gameManager.tabuleiro.tiles.meuTurno = false;
    }

    // Cria a camada escura
    const camadaEscura = document.createElement("div");
    camadaEscura.classList.add("escurecer"); // Estilo do style.css

    // Cria a janela
    const gameOverWindow = document.createElement("div");
    gameOverWindow.id = "gameOver-window";

    const title = document.createElement("h2");
    const subTitle = document.createElement("p");

    // Verifica se o jogador local é o vencedor
    const localPlayer = window.playerId || (gameManager.tabuleiro ? gameManager.tabuleiro.jogador : null);

    if (localPlayer === winnerPlayer) {
        title.innerText = "Você Venceu!";
        subTitle.innerText = "Parabéns!";
    } else {
        title.innerText = "Você Perdeu!";
        subTitle.innerText = "Mais sorte na próxima!";
    }

    // Adiciona a classe de cor (blue/red) para o título
    gameOverWindow.classList.add(winnerColor === "blue" ? "vitoria-blue" : "vitoria-red");

    // Cria o botão de recomeçar
    const restartButton = document.createElement("button");
    restartButton.classList.add("restart-button");
    restartButton.innerText = "Recomeçar";

    // Ação de clique do botão
    restartButton.onclick = () => {
        // Envia o "voto" de recomeçar para o servidor
        ws.send(JSON.stringify({ tipo: "querRecomecar" }));

        // Desabilita o botão e muda o texto
        restartButton.innerText = "Aguardando Oponente...";
        restartButton.disabled = true;
    };

    // Monta a janela
    gameOverWindow.appendChild(title);
    gameOverWindow.appendChild(subTitle);
    gameOverWindow.appendChild(restartButton);

    const body = document.getElementById("body");
    body.appendChild(camadaEscura);
    body.appendChild(gameOverWindow);
}