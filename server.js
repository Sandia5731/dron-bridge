const WebSocket = require('ws');
const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 8080;
const DISCORD_WEBHOOK_URL = "TU_URL_DE_WEBHOOK_AQUÍ";

// 1. Crear servidor HTTP para que Render no nos cierre
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Puente ADN Operativo");
});

// 2. Configurar el WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log("¡Dron conectado exitosamente!");
    
    // Enviar un mensaje de bienvenida (esto ayuda a mantener la conexión)
    ws.send(JSON.stringify({ header: { messagePurpose: "commandRequest" }, body: { statusMessage: "Conectado al Puente de ADN" } }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // Solo procesar si el mensaje viene del Dron
            if (data.type === "export_adn") {
                const postData = JSON.stringify({
                    content: `**📦 PLANO EXPORTADO**\n**ID:** \`${data.id}\`\n**Medidas:** ${data.size}\n**ADN:**\n\`\`\`json\n${data.adn}\n\`\`\``
                });

                const req = https.request(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                req.write(postData);
                req.end();
            }
        } catch (e) {
            console.log("Datos recibidos no son JSON");
        }
    });

    ws.on('error', (err) => console.error("Error en socket:", err));
});

// 3. Encender el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
