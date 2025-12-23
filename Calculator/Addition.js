const sumRequestHandler = (req, res) => {
    console.log('Sum request received', req.url, req.method);

    const body = [];

    req.on('data', (chunk) => {
        console.log('Received chunk: ', chunk);

        body.push(chunk);
    });

    req.on('end', () => {
        const fullBody = Buffer.concat(body).toString();

        const params = new URLSearchParams(fullBody);

        const bodyObj = Object.fromEntries(params);

        const result = bodyObj.num1 + bodyObj.num2;

        console.log('Calculation Result: ', result);
    });
};

exports.sumRequestHandler = sumRequestHandler;