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

// Lista de conexões
wss.on("connection", (ws) => {
    console.log("Novo cliente conectado servidor!");
    if (jogador1 === null) {
        jogador1 = ws;
        ws.jogadorId = 1;
        console.log("Jogador 1 conectado.");
        ws.send(JSON.stringify({
            tipo: "novoJogador",
            jogador: 1
        }));
    } else if (jogador2 === null) {
        jogador2 = ws;
        ws.jogadorId = 2;
        console.log("Jogador 2 conectado.");
        ws.send(JSON.stringify({
            tipo: "novoJogador",
            jogador: 2
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
