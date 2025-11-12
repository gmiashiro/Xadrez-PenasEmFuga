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

// Lista de conexões
wss.on("connection", (ws) => {
    console.log("Novo cliente conectado servidor!");
    if (jogador1 === null) {
        jogador1 = ws;
        ws.jogadorId = 1;
        console.log("Jogador 1 conectado.");
        ws.send(JSON.stringify({
            tipo: "novoJogador",
            jogador: 1,
            turno: turnoAtual
        }));
    } else if (jogador2 === null) {
        jogador2 = ws;
        ws.jogadorId = 2;
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

        // Encontra o destinatário
        let destinatario = null;
        if (remetenteId === 1 && jogador2) {
            destinatario = jogador2;
        } else if (remetenteId === 2 && jogador1) {
            destinatario = jogador1;
        }

        // Se houver um destinatário e ele estiver online, envie a mensagem
        if (destinatario && destinatario.readyState === WebSocket.OPEN) {
            // Criamos novos tipos de mensagem para o oponente
            let msgParaOponente = { ...msgCliente }; // Copia a mensagem

            if (msgCliente.tipo === "pecaMovida") {
                msgParaOponente.tipo = "oponenteMoveuPeca";
            } else if (msgCliente.tipo === "pecaCapturada") {
                msgParaOponente.tipo = "oponenteCapturouPeca";
            }

            destinatario.send(JSON.stringify(msgParaOponente));
        }

        if (msgCliente.tipo === "pecaMovida") {
            // 1. Inverte o turno
            turnoAtual = (turnoAtual === 1) ? 2 : 1;
            console.log("Turno atualizado para:", turnoAtual);

            // 2. Cria a mensagem de atualização de turno
            const msgTurno = JSON.stringify({
                tipo: "atualizarTurno",
                turno: turnoAtual
            });

            // 3. Envia a atualização para AMBOS os jogadores
            if (jogador1 && jogador1.readyState === WebSocket.OPEN) {
                jogador1.send(msgTurno);
            }
            if (jogador2 && jogador2.readyState === WebSocket.OPEN) {
                jogador2.send(msgTurno);
            }
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
