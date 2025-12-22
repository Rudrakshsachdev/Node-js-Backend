// create a basic HTTP server that logs incoming requests

const http = require('http');

function requestListener(req, res) {
    console.log('Received request: ', req);
    process.exit(); // Exit after logging the request
};

const server = http.createServer(requestListener);



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});