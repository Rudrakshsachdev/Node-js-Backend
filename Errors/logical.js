// this file is all about testing logical errors in a module.


const logical = () => {
    console.log("This is a logical testing function.");

    let a = 10;
    let b = 20;
    if (a > b) {
        console.log("a is greater than b");
    } else {
        console.log("a is not greater than b");
    }   

};

module.exports = logical;