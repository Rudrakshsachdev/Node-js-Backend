// this file is all about handling requests to the addition operation of the calculator and processing the addition results

// We handle incoming data chunks, concatenate them, parse the full body into key-value pairs, and then write those details to the file.


const sumRequestHandler = (req, res) => {
  console.log("Sum request received", req.url, req.method);

  const body = [];

  let result;

  req.on("data", (chunk) => {
    console.log("Received chunk: ", chunk);

    body.push(chunk);
  });

  req.on("end", () => {

    console.log("End event came")
    const fullBody = Buffer.concat(body).toString();

    const params = new URLSearchParams(fullBody);

    const bodyObj = Object.fromEntries(params);

    result = Number(bodyObj.num1) + Number(bodyObj.num2);

    console.log("Calculation Result: ", result);

    
    
  });

   console.log("Sending the response now");

    res.setHeader("Content-Type", "text/html");
    res.write("<html>");

    res.write("<head><title>Sum Result</title></head>");
    res.write("<body>");

    res.write(`<h1>Sum Calculation </h1>`);
    res.write(`<p>Result: ${result}</p>`);
    res.write("</body>");
    res.write("</html>");

    res.end();
};

exports.sumRequestHandler = sumRequestHandler;
