const { createContext } = require("react");

const ws = new WebSocket("ws://localhost:51171");

console.log("Script carregado");

// const msgBox = document.getElementById("messages");
// const input = document.getElementById("msgInput");
// const sendBtn = document.getElementById("sendBtn");

// ws.onopen = () => {
//     msgBox.innerHTML += "<div><i>Conectado ao servidor</i></div>";
// };

// ws.onmessage = (event) => {
//     msgBox.innerHTML += `<div><b>Mensagem:</b> ${event.data}</div>`;
// };

// sendBtn.addEventListener("click", () => {
//     const msg = input.value.trim();
//     if (msg !== "") {
//         ws.send(msg);
//         msgBox.innerHTML += `<div><b>Você:</b> ${msg}</div>`;
//         input.value = "";
//     }
// });

// Tamanho do tabuleiro e dos tiles
const BOARD_SIZE = 512;
const TILE_SIZE = BOARD_SIZE / 8;

let selectedTile = null;

// Carrega a imagem do tabuleiro
const boardImage = new Image();
boardImage.src = "./assets/hud/background/xadrezFundo.png"

boardImage.onload = () => {
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(boardImage, 0, 0, canvas.width, canvas.height);

    if(selectedTile) {
        const pixelX = selectedTile.x * TILE_SIZE;
        const pixelY = selectedTile.y * TILE_SIZE;

        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
    }
}

canvas.addEventListener("click", (event) => {
    //Pega a posição do clieque no canvas.
    const clickX = event.offsetX;
    const clickY = event.offsetY;

    // Converte a posição do pixel para um índice de tile
    const tileX = Math.floor(clickX / TILE_SIZE);
    const tileY = Math.floor(clickY / TILE_SIZE);

    // lógica de ligar e desligar o tile
    if(selectedTile && selectedTile.x === tileX && selectedTile.y === tileY) {
        selectedTitle = null;
    } else {
        selectedTile = { x: tileX, y: tileY };
    }

    //Para testes
    console.log(`Clique detectado no tile (x, y): ${tileX}, ${tileY}`);
    if (selectedTile) {
        console.log("Tile selecionado.");
    } else {
        console.log("Tile desmarcado.");
    }

    draw();
});

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
    buttons.forEach(button => {
        button.onclick = () => { 
            setTimeout(() => {
                evolucaoWindow.remove();
                camadaEscura.remove();
            }, 300);
        }
    })
}
