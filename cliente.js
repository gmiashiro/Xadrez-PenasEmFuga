const WebSocket = require("ws");
const readline = require("readline");

const ws = new WebSocket("ws://localhost:51171");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

ws.on("open", () => {
    console.log("Conectado ao servidor WebSocket teste");
    perguntar();
});

ws.on("message", (msg) => {111
    console.log("Servidor:", msg.toString());
});

function perguntar() {
    rl.question("Mensagem: ", (input) => {
        ws.send(input);
        if (input === "exit") {
            ws.close();
            rl.close();
        } else {
            perguntar();
        }
    });
}


/*
HTML
<!-- <h1>Chat WebSocket</h1>
    <div id="messages"></div>
    <input id="msgInput" placeholder="Digite sua mensagem..." />
    <button id="sendBtn">Enviar</button> -->

*/