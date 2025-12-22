// this file is all about routing based on user input in the URL paths. this file tells how to create a simple server that serves a form to the user. Here, we create a server that serves an HTML form to the user. When the user submits the form, their details are written to a file named 'userDetails.txt'.

const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    console.log('User requested URL:', req.url);


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
        fs.writeFileSync('userDetails.txt', 'User details submitted successfully!');

        res.statusCode = 302; 
        res.setHeader('Location', '/');
        return res.end();
    }
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
});