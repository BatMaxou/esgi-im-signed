import { createServer } from "http";
import { list } from "./routes/list.js";

const server = createServer(async (request, response) => {
  let html = null;
  let isNotFound = false;

  switch (request.url) {
    case '/':
      html = await list()
      break;
    case '/inscription':
      // render form
      break;
    default:
      // 404
      break;
  }

  response.writeHead(isNotFound ? 404 : 200, { "Content-Type": "text/html" });
  response.end(html);
});

server.listen(8000, "localhost", () => {
  console.log("Server started on http://localhost:8000");
});
