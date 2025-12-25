// this file is all about testing runtime errors in a module.

const runtime = () => {
    console.log("This is a runtime testing function.");

    let num = 0;
    num();
};

module.exports = runtime;