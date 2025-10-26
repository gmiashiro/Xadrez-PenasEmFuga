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
        const contentType = ext === ".css" ? "text/css" :
            ext === ".js" ? "application/javascript" : "text/html";

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
});

// Cria servidor WebSocket
const wss = new WebSocket.Server({ server });

// Lista de conexões
wss.on("connection", (ws) => {
    console.log("Novo cliente conectado!");

    ws.on("message", (msg) => {
        console.log("Mensagem recebida:", msg.toString());

        // Reenvia a mensagem para todos os clientes (broadcast)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });

    ws.on("close", () => {
        console.log("Cliente desconectado.");
    });
});

// Inicia o servidor
const PORT = 51171;
server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
