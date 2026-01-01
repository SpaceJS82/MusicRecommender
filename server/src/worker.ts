// server/src/worker.ts
import net from 'net';

const PIPE_NAME = "\\\\.\\pipe\\music-analysis-pipe";

const server = net.createServer((stream) => {
    stream.on('data', (data) => {
        const steamTags = JSON.parse(data.toString());
        
        // Logika analize: Če so med tagi "Horror" ali "Dark", dajemo nizek BPM
        const analysis = {
            targetBPM: steamTags.includes('Horror') ? 70 : 120,
            energy: steamTags.includes('Action') ? 'high' : 'chill',
            processedAt: new Date().toLocaleTimeString()
        };

        stream.write(JSON.stringify(analysis));
    });
});

server.listen(PIPE_NAME, () => console.log("IPC Worker: Čakam na podatke preko cevi..."));