const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

//////////////////////////////////
// SERVER
///
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8"); //reading data from data file
const dataObj = JSON.parse(data); //changing data to JS object

//reading templates
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/overview" || pathname === "/") {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(output);

    //product page
  } else if (pathname === "/product") {
    const product = dataObj.find((el) => el.id == +query.id);
    const output = replaceTemplate(templateProduct, product);
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }

  //404
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Error 404, not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000.");
});
