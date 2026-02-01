const WebSocket = require('ws');
const https = require('https');

const PORT = process.env.PORT || 8080;
// RECUERDA: Cambia esto por tu URL de Webhook de Discord
const DISCORD_WEBHOOK_URL = "TU_URL_DE_WEBHOOK_AQUÍ"; 

const wss = new WebSocket.Server({ port: PORT });
console.log("Servidor Bridge activo en puerto: " + PORT);

wss.on('connection', (ws) => {
    console.log("Conexión establecida con Minecraft.");

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            const postData = JSON.stringify({
                content: `**📥 PLANO RECIBIDO**\n**ID:** \`${data.id}\`\n**CUBICAJE:** ${data.size}\n**ADN:**\n\`\`\`json\n${data.adn}\n\`\`\``
            });

            const req = https.request(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            req.write(postData);
            req.end();
            console.log("Enviado a Discord.");
        } catch (e) {
            console.log("Error en el paquete de datos.");
        }
    });
});
