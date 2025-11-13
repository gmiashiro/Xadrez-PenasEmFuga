// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

// Cria servidor HTTP para servir os arquivos estáticos (HTML, CSS, JS)
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Arquivo não encontrado");
            return;
        }

        // Tipo de conteúdo básico
        const ext = path.extname(filePath);
        let contentType = "text/html"; // Padrão

        switch (ext) {
            case ".css":
                contentType = "text/css";
                break;
            case ".js":
                contentType = "application/javascript";
                break;
            case ".png":
                contentType = "image/png";
                break;
            case ".jpg":
            case ".jpeg":
                contentType = "image/jpeg";
                break;
            case ".gif":
                contentType = "image/gif";
                break;
            case ".woff":
            case ".woff2":
                contentType = "font/woff2";
                break;
            // Adicione mais tipos conforme necessário (ex: .mp3, .svg)
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
});

// Cria servidor WebSocket
const wss = new WebSocket.Server({ server });

let jogador1 = null;
let jogador2 = null;
let turnoAtual = 1;

let jogoEmAndamento = true;
let jogador1QuerRecomecar = false;
let jogador2QuerRecomecar = false;

// Lista de conexões
wss.on("connection", (ws) => {
    console.log("Novo cliente conectado servidor!");
    if (jogador1 === null) {
        jogador1 = ws;
        ws.jogadorId = 1;
        jogoEmAndamento = true;
        jogador1QuerRecomecar = false;
        jogador2QuerRecomecar = false;
        console.log("Jogador 1 conectado.");
        ws.send(JSON.stringify({
            tipo: "novoJogador",
            jogador: 1,
            turno: turnoAtual
        }));
    } else if (jogador2 === null) {
        jogador2 = ws;
        ws.jogadorId = 2;
        jogoEmAndamento = true;
        jogador1QuerRecomecar = false;
        jogador2QuerRecomecar = false;
        console.log("Jogador 2 conectado.");
        ws.send(JSON.stringify({
            tipo: "novoJogador",
            jogador: 2,
            turno: turnoAtual
        }));
    } else {
        // Jogo cheio
        console.log("Conexão recusada. Jogo cheio.");
        ws.send(JSON.stringify({
            tipo: "passouQuantidadeJogadores"
        }));
        ws.close();
        return;
    }

    ws.on("message", (message) => {
        const msgCliente = JSON.parse(message.toString());
        const remetenteId = ws.jogadorId;

        if (!jogoEmAndamento && msgCliente.tipo !== "querRecomecar") {
            return; // Ignora movimentos de peças, etc.
        }

        // Encontra o destinatário
        let destinatario = null;
        if (remetenteId === 1 && jogador2) {
            destinatario = jogador2;
        } else if (remetenteId === 2 && jogador1) {
            destinatario = jogador1;
        }

        switch (msgCliente.tipo) {

            // Caso: Jogador moveu uma peça
            case "pecaMovida":
                // 1. Atualiza o turno

                if (jogoEmAndamento) {
                    turnoAtual = (turnoAtual === 1) ? 2 : 1;
                    const msgTurno = JSON.stringify({ tipo: "atualizarTurno", turno: turnoAtual });
                    if (jogador1) jogador1.send(msgTurno);
                    if (jogador2) jogador2.send(msgTurno);
                }


                // 2. Retransmite o movimento (traduzido)
                if (destinatario) {
                    let msgMovimento = { ...msgCliente, tipo: "oponenteMoveuPeca" };
                    // --- LOG ---
                    console.log(`[LOG SERVIDOR] Enviando "oponenteMoveuPeca" para Jogador ${destinatario.jogadorId}`);
                    destinatario.send(JSON.stringify(msgMovimento));
                }
                console.log(`Jogador ${remetenteId} moveu...`);
                break;

            // Caso: Jogador capturou uma peça
            case "pecaCapturada":
                // Apenas retransmite (traduzido)
                if (destinatario) {
                    let msgCaptura = { ...msgCliente, tipo: "oponenteCapturouPeca" };
                    // --- LOG ---
                    console.log(`[LOG SERVIDOR] Enviando "oponenteCapturouPeca" para Jogador ${destinatario.jogadorId}`);
                    destinatario.send(JSON.stringify(msgCaptura));
                }
                console.log(`Jogador ${remetenteId} capturou...`);
                break;

            case "oponenteEvoluiu":
                // Apenas retransmite (traduzido)
                if (destinatario) {
                    let msgCaptura = { ...msgCliente, tipo: "oponenteEvoluiu" };
                    // --- LOG ---
                    console.log(`[LOG SERVIDOR] Enviando "oponenteEvoluiu" para Jogador ${destinatario.jogadorId}`);
                    destinatario.send(JSON.stringify(msgCaptura));
                }
                console.log(`Jogador ${remetenteId} evoluiu...`);
                break;

            // Caso: Jogo terminou (Rei capturado)
            case "jogoTerminou":
                console.log(`Jogo terminou. Vencedor: Jogador ${msgCliente.winnerPlayer}`);
                jogoEmAndamento = false;
                // Avisa o outro jogador (o perdedor)
                if (destinatario) {
                    const msgParaPerdedor = {
                        tipo: "jogoTerminouOponente",
                        winnerColor: msgCliente.winnerColor,
                        winnerPlayer: msgCliente.winnerPlayer
                    };

                    console.log(`[LOG SERVIDOR] Enviando "jogoTerminouOponente" para Jogador ${destinatario.jogadorId}`);
                    destinatario.send(JSON.stringify(msgParaPerdedor));
                }
                break;

            // Caso: Um jogador quer recomeçar
            case "querRecomecar":
                console.log(`Jogador ${remetenteId} quer recomeçar.`);
                if (remetenteId === 1) jogador1QuerRecomecar = true;
                if (remetenteId === 2) jogador2QuerRecomecar = true;

                // Verifica se AMBOS querem recomeçar
                if (jogador1QuerRecomecar && jogador2QuerRecomecar) {
                    console.log("Ambos os jogadores concordaram. Reiniciando...");
                    // 1. Envia a ordem de recomeçar
                    const msgRestart = JSON.stringify({ tipo: "recomecarJogo" });
                    if (jogador1) jogador1.send(msgRestart);
                    if (jogador2) jogador2.send(msgRestart);

                    // 2. Reseta o estado do servidor
                    jogador1QuerRecomecar = false;
                    jogador2QuerRecomecar = false;
                    jogoEmAndamento = true;
                    turnoAtual = 1;
                }
                break;
        }

        // Log no servidor (como antes)
        if (msgCliente.tipo === "pecaMovida") {
            console.log(`Jogador ${remetenteId} moveu ${msgCliente.antigoX},${msgCliente.antigoY} para ${msgCliente.novoX},${msgCliente.novoY}, ${msgCliente.id}`);
        }
        if (msgCliente.tipo === "pecaCapturada") {
            console.log(`Jogador ${remetenteId} capturou ${msgCliente.pecaCapturadaX},${msgCliente.pecaCapturadaY}, ${msgCliente.id}`);
        }
    });

    // 3. LIDAR COM DESCONEXÃO (CLEANUP)
    ws.on("close", () => {
        const remetenteId = ws.jogadorId;
        let oponente = null;

        if (remetenteId === 1) {
            jogador1 = null; // Libera o slot
            oponente = jogador2;
            console.log("Jogador 1 desconectado.");
        } else if (remetenteId === 2) {
            jogador2 = null; // Libera o slot
            oponente = jogador1;
            console.log("Jogador 2 desconectado.");
        }

        // Reseta o turno se o jogo esvaziar ou ambos saírem
        if (jogador1 === null && jogador2 === null) {
            turnoAtual = 1; // Reseta para o Jogador 1
        }

        // Avisa o oponente que o outro jogador saiu
        if (oponente && oponente.readyState === WebSocket.OPEN) {
            oponente.send(JSON.stringify({ tipo: "oponenteDesconectou" }));
        }
    });
});

// Inicia o servidor
const PORT = 51171;
server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

// GAME MANAGER
