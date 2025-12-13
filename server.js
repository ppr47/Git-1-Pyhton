// Simple Bun HTTP Server for Flappy Snake Game
const server = Bun.serve({
    port: 3333,
    async fetch(req) {
        const url = new URL(req.url);
        let filePath = url.pathname === '/' ? '/index.html' : url.pathname;

        try {
            const file = Bun.file(`.${filePath}`);

            // Determine content type
            let contentType = 'text/html';
            if (filePath.endsWith('.css')) contentType = 'text/css';
            else if (filePath.endsWith('.js')) contentType = 'application/javascript';
            else if (filePath.endsWith('.png')) contentType = 'image/png';
            else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';

            return new Response(file, {
                headers: {
                    'Content-Type': contentType,
                },
            });
        } catch (error) {
            return new Response('File not found', { status: 404 });
        }
    },
});

console.log(`🔥 Flappy Snake Game Server Running! 🔥`);
console.log(`🎮 Open your browser at: http://localhost:${server.port}`);
console.log(`\n🐍 Use SPACE or CLICK to make the snake fly!`);
console.log(`🏢 Dodge the buildings in the burning city!`);
console.log(`\nPress Ctrl+C to stop the server.`);
