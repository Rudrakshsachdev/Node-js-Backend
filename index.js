// Simple console log and file operation in Node.js
console.log('Hello, World! Learning Node.js is fun!');



const fs = require('fs');

fs.writeFile("output.txt", "Performing file operations in Node.js", (err) => {
    if (err) throw err;
    console.log("File has been created and data written to it.");
});



