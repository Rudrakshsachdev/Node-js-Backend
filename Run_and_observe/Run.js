const fs = require('fs');

console.log('1. Start of script');

// Synchronous (blocking) operation
console.log('2. Reading file synchronously');
const datasync = fs.readFileSync('userDetails.txt', 'utf-8');
console.log('3. File content (sync):', datasync);

// Asynchronous (non-blocking) operation
console.log('4. Reading file asynchronously');

fs.readFile('userDetails.txt', 'utf-8',(err, datasync) => {
    if (err) throw err;
    console.log('6. File content (async):', datasync);
});

console.log('5. End of script');