const sumRequestHandler = (req, res) => {
  console.log("Sum request received", req.url, req.method);

  const body = [];

  req.on("data", (chunk) => {
    console.log("Received chunk: ", chunk);

    body.push(chunk);
  });

  req.on("end", () => {
    const fullBody = Buffer.concat(body).toString();

    const params = new URLSearchParams(fullBody);

    const bodyObj = Object.fromEntries(params);

    const result = Number(bodyObj.num1) + Number(bodyObj.num2);

    console.log("Calculation Result: ", result);

    res.setHeader("Content-Type", "text/html");
    res.write("<html>");

    res.write("<head><title>Sum Result</title></head>");
    res.write("<body>");

    res.write(`<h1>Sum Calculation </h1>`);
    res.write(`<p>Result: ${result}</p>`);
    res.write("</body>");
    res.write("</html>");
    res.end();
  });
};

exports.sumRequestHandler = sumRequestHandler;
