const Net = require('net');
const port = 8080;

const server = new Net.Server();
server.listen(port, function () {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});
const clients = [];
server.on('connection', function (socket) {
    console.log('CONNECTION: ' + socket.remoteAddress +':'+ socket.remotePort);
    //console.log(socket)
    //console.log('A new connection has been established.');
    //clients.push(socket);
    //console.log('client connect, count: ', clients.length);
    //socket.write('Hello, client.');
    //Close all connections --> 
    

    socket.on('data', function (chunk) {
        clients.push(socket);
        console.log('client connect, count: ', clients.length);
        
        var realdata = chunk.toString();
        console.log(`Data received from client:`);
        var json = JSON.parse(realdata);
        console.log(json)
        if (json.method == "server.init") {
            socket.write(`{"action": "idle", "assignID": ${clients.length} }`)
            //closeAll();
            
        }
    });

    socket.on('end', function () {
        console.log('Closing connection with the client');
        clients.splice(clients.indexOf(socket), 1);
    });

    socket.on('error', function (err) {
        console.log(`Error: ${err}`);
        clients.splice(clients.indexOf(socket), 1);
    });

    function closeAll() {
        for (var i in clients) {
            clients[i].write('{"action": "EMERGENCY RESTART"}')
        }
        setTimeout(() => {
            socket.write('{"action": "Server Closed All Connections"}')
            for (var i in clients) {
                clients[i].destroy();
                clients.length = 0;
            }
        }, 4000);
    }
    
});