import app from "./app";
import http from 'http';

// Función para normalizar el puerto
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
};

// Función para manejar errores de servidor
const onError = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requiere privilegios elevados');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' ya está en uso');
            const newPort = normalizePort(process.env.PORT || '3000') + 2;
            app.set('port', newPort);
            server.listen(newPort);
            break;
        default:
            throw error;
    }
};

// Función para registrar el evento de escucha del servidor
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Servidor escuchando en ' + bind);
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app); 
server.listen(port); 
server.on('error', onError); 
server.on('listening', onListening); 

