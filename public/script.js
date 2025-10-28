const ws = new WebSocket("ws://localhost:51171");

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
