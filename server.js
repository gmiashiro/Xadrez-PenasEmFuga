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

var quantJogadores = 0;

// Lista de conexões
wss.on("connection", (ws) => {
    console.log("Novo cliente conectado servidor!");
    quantJogadores++;
    console.log(quantJogadores);
    if (quantJogadores > 2) {
        ws.send(JSON.stringify({
            tipo: "passouQuantidadeJogadores",
        }));
    } else {
        ws.send(JSON.stringify({
            tipo: "novoJogador",
            jogador: quantJogadores
        }));
    }
    
    ws.on("message", (event) => {
        const msgCliente = JSON.parse(event);

        if (msgCliente.tipo == "pecaCapturada") {
            console.log("Coordenadas da peça capturada: ("+ msgCliente.pecaCapturadaX + ", " + msgCliente.pecaCapturadaY + ")");
            console.log("Jogador que capturou: " + msgCliente.jogadorQueCapturou);
        }

        if (msgCliente.tipo == "pecaMovida") {
            console.log("Coordenadas antigas da peça: ("+ msgCliente.antigoX + ", " + msgCliente.antigoY + ")");
            console.log("Coordenadas novas da peça: ("+ msgCliente.novoX + ", " + msgCliente.novoY + ")");
            console.log("Jogador: " + msgCliente.jogador);
        }
    });

    ws.on("close", () => {
        quantJogadores--;
        console.log("Cliente desconectado.");
    });
});

// Inicia o servidor
const PORT = 51171;
server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

// GAME MANAGER
