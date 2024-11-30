import { createServer } from "http";
import { getList, postList } from "./routes/list.js";
import { getRegister, postRegister } from "./routes/register.js";
import { getLogin, postLogin } from "./routes/login.js";
import { readFile } from "fs/promises";

const server = createServer(async (request, response) => {
  let html = null;
  let redirectUrl = null;
  let isNotFound = false;
  let isRedirection = false;

  const { url } = request;
  const [rawUrl, query] = url.split("?");

  switch (rawUrl) {
    case "/":
      if (request.method === "POST") {
        redirectUrl = await postList(request);
        isRedirection = true;
      } else {
        html = await getList(query);
      }

      break;
    case "/inscription":
      if (request.method === "POST") {
        redirectUrl = await postRegister(request);
        isRedirection = true;
      } else {
        html = await getRegister();
      }
      break;
    case "/login":
      if (request.method === "POST") {
        const token = await postLogin(request);
        if (!token) {
          response.writeHead(401);
          response.end();

          return;
        }
        
        response.writeHead(200, {
          "Content-Type": "application/json",
        });
        response.end(JSON.stringify({ token }));

        return;
      } else {
        html = await getLogin();
      }
      break;
    case "/js/login.js":
      response.writeHead(200, { "Content-Type": "application/javascript" });
      response.end(await readFile("./public/js/login.js"));

      return;
    default:
      // 404
      break;
  }

  if (isRedirection && redirectUrl) {
    response.writeHead(301, { Location: redirectUrl });
  } else {
    response.writeHead(isNotFound ? 404 : 200, { "Content-Type": "text/html" });
  }

  response.end(html);
});

server.listen(8000, "localhost", () => {
  console.log("Server started on http://localhost:8000");
});
