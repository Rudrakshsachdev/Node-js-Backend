// this file is all about creating a request handler for a server that serves an HTML form to the user. When the user submits the form, we parse the submitted data and write it to a file named 'userDetails.txt'.

// We handle incoming data chunks, concatenate them, parse the full body into key-value pairs, and then write those details to the file.


const http = require('http');
const fs = require('fs');


const requestHandler = (req, res) => {
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

            // Parsing the full body string into URLSearchParams object
           const fullBody = Buffer.concat(body).toString();
           
           console.log('Parsed Body: ', fullBody);


            // Converting URLSearchParams to a regular object
           const params = new URLSearchParams(fullBody);

           const BodyObject = {}; // empty object to hold key-value pairs

           // iterating over params and populating BodyObject
           for (const [key, value] of params) {
                BodyObject[key] = value;
           }

            console.log('Body as Object: ', BodyObject);


            // the above process can be done using a single line and logic as well

            // const BodyObject = Object.fromEntries(new URLSearchParams(fullBody)); here we directly convert URLSearchParams to object using Object.fromEntries

            // Writing the BodyObject to userDetails.txt as a JSON string
            fs.writeFile('userDetails.txt', JSON.stringify(BodyObject), error => {
                console.log('Data written to file successfully.');
                res.statusCode = 302; 
                res.setHeader('Location', '/');
        return res.end();
            });
        });


        

        
    }
};

// Exporting the requestHandler function to be used in other files
module.exports = requestHandler;