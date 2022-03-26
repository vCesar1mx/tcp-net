
const Net = require('net');
const port = 8080;
const host = 'localhost';

const client = new Net.Socket();
var a = 0;
function conn(a) {
    client.connect({ port: port, host: host }, function () {
        console.log('Conexion tcp establecida');
        client.write(`{"method": "server.init", "params": []}`);
    })
    client.on('data', function (chunk) {
        console.log(chunk.toString());
        if (a == 1) {
            console.log('Socket Reconnected with Success')
        }
    })

    client.on('end', function () {
        console.log('TCP CLOSED')
    })

    client.on('error', function (e) {
        console.log('debug', 'connection with error -> ' + e)
    });

    client.on('close', function (e) {
        console.log('debug', 'connection closed -> ' + e)
        setTimeout(() => {
            console.log('debug', 'trying to reconnect')
            var a = 1;
            reconnect(a);
        }, 5000);
    });


}
function reconnect(a) {
    client.removeAllListeners();
    conn(a);
}

conn(a);