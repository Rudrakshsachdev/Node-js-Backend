const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    console.log('User requested URL:', req.url, req.method);


    if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');

        res.write('<html>');

        res.write('<head><title>Home Page</title></head>');

        res.write('<body><h1>Welcome to the Home Page! Enter Your Details Below</h1>');

        res.write('<form action="/submit-details" method="POST">');

        res.write('Name: <input type="text" name="username" placeholder="Enter your name"><br>');

        res.write('<label for="gender>Gender:</label><br>');

        res.write('<label for="male">Male</label>');

        res.write('<input type="radio" id="male" name="gender" value="male" />');

        res.write('<label for="female">Female</label>');

        res.write('<input type="radio" id="female" name="gender" value="female" /> <br>');
        
        res.write('<button type="submit">Submit</button>');

        res.write('</form>')
        res.write('</body>');
        res.write('</html>');
        return res.end();
    } else if (req.url.toLowerCase() === '/submit-details' && req.method === 'POST') {

        // array to store incoming data chunks
        const body = [];

        // to handle incoming data chunks and log them
        req.on('data', (chunk) => {
            console.log('Recieved chunk: ', chunk);
            body.push(chunk); // push each chunk into body array
        });


        // when all data is received, concatenate and log the full body
        req.on('end', () => {
           const fullBody = Buffer.concat(body).toString();
           
           console.log('Parsed Body: ', fullBody);
        });


        fs.writeFileSync('userDetails.txt', 'User details submitted successfully!');

        res.statusCode = 302; 
        res.setHeader('Location', '/');
        return res.end();
    }
});

const PORT = 5100;

server.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
});