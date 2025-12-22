// this file is all about creating a simple server that serves different HTML content based on the URL path requested by the user. Here, we create a server that serves a basic Myntra-like homepage with navigation links to different sections like Products and Contact Us.

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log('User requested URL:', req.url);


    if (req.url === '/') {
        res.setHeader('Content-Type', 'text/html');

        res.write('<html>');

        res.write('<head> <title>Myntra Page</title> </head>');

        res.write('<body>');

        res.write('<nav class="navbar">');

        res.write('<ul class="menu">');
        res.write('<li><a href="/">Home</a></li>');
        res.write('<li><a href="/products">Products</a></li>');
        res.write('<li><a href="/contact">Contact Us</a></li>');
        res.write('</ul>');

        res.write('<div class="search-box">');

        res.write('<input type="text" placeholder="Search for products, brands and more">');

        res.write('<button type="submit">Search</button>');

        res.write('</div>');

        res.write('</nav>');

        res.write('<h1>Welcome to Myntra!</h1>');

        res.write('</body>');

        res.write('</html>');

        return res.end();

    } else if (req.url.toLowerCase() === '/products') {
        res.setHeader('Content-Type', 'text/html');

        res.write('<html>');

        res.write('<head> <title>Products Page</title> </head>');

        res.write('<body>');

        res.write('<h1>Our Products</h1>');

        res.write('<ul>');
        res.write('<li>Product 1</li>');
        res.write('<li>Product 2</li>');
        res.write('<li>Product 3</li>');
        res.write('</ul>');

        res.write('</body>');

        res.write('</html>');

        return res.end();
    } else if (req.url.toLowerCase() === '/contact') {
        res.setHeader('Content-Type', 'text/html');

        res.write('<html>');

        res.write('<head> <title>Contact Us Page</title> </head>');

        res.write('<body>');

        res.write('<h1>Contact Us</h1>');

        res.write('<p>Email: contact@myntra.com</p>');

        res.write('<p>Phone: +1-234-567-890</p>');

        res.write('</body>');

        res.write('</html>');

        return res.end();
    }


});

const PORT = 5500;

server.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
});