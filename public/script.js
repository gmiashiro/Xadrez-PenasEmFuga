//const { createContext } = require("react");
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const gameManager = new GameManager();

// Aqui no script, ele escuta e envia mensagens ao servidor, comunicando sobre o jogo em si

const ws = new WebSocket("ws://localhost:51171");
ws.onopen = () => {
    console.log("Conectado ao servidor WebSocket");

    // Escutando acontecimentos do jogo e comunicando ao servidor sobre elas
    document.addEventListener("capturandoPeca", (e) => {
        ws.send(JSON.stringify({
            tipo: "pecaCapturada",
            pecaCapturadaX: e.detail.pecaCapturadaX,
            pecaCapturadaY: e.detail.pecaCapturadaY,
            jogadorQueCapturou: e.detail.jogadorQueCapturou,
            id: e.detail.id
        }))
    });

    document.addEventListener("pecaMovida", (e) => {
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

    
};

ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    
    switch(msg.tipo) {
        case "novoJogador":
            // Inicia o tabuleiro quando o servidor atribui um ID de jogador
            gameManager.startTabuleiro(msg.jogador);
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
                gameManager.tabuleiro.aplicarCapturaOponente(msg);
            }
            break;
        case "oponenteDesconectou":
            alert("Seu oponente desconectou. Atualize a página para encontrar um novo jogo.");
            // (Aqui você pode adicionar uma lógica para resetar o jogo)
            break;
        // --- FIM DOS NOVOS CASOS ---
    }
};

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
            songButton.classList.remove("song");
            songButton.classList.add("songOff");
            song = false;
            console.log("3")
        } else {
            songButton.classList.remove("songOff");
            songButton.classList.add("song");
            song = true;
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
    evolucaoWindow.innerHTML += "<div class='evolucao-header'><span class='evolucao-title'>Promoção</span><p>Escolha sua peça</p></div><div class='evolucao-button-container'><button class='evolucao-button rainha'></button><button class='evolucao-button torre'></button><button class='evolucao-button cavalo'></button><button class='evolucao-button bispo'></button></div>";
    // <div class='evolucao-header'>
    //     <span class='evolucao-title'>Promoção</span>
    //     <p>Escolha sua peça</p>
    // </div>
    // <div class='evolucao-button-container'>
    //     <button class='evolucao-button rainha'></button>
    //     <button class='evolucao-button torre'></button>
    //     <button class='evolucao-button cavalo'></button>
    //     <button class='evolucao-button bispo'></button>
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
            }, 300);
        }
    })
}

console.log("Script carregado");