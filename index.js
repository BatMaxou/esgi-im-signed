import { createServer } from "http";
import { getList, postList } from "./routes/list.js";

const server = createServer(async (request, response) => {
  let html = null;
  let redirectUrl = null;
  let isNotFound = false;
  let isRedirection = false;

  const { url } = request;
  const [rawUrl, query] = url.split('?');

  switch (rawUrl) {
    case '/':
      if (request.method === 'POST') {
        redirectUrl = await postList(request, response);
        isRedirection = true;
      } else {
        html = await getList(query);
      }

      break;
    case '/inscription':
      // render form
      break;
    default:
      // 404
      break;
  }

  if (isRedirection && redirectUrl) {
    response.writeHead(301, { "Location": redirectUrl });
  } else {
    response.writeHead(isNotFound ? 404 : 200, { "Content-Type": "text/html" });
  }

  response.end(html);
});

server.listen(8000, "localhost", () => {
  console.log("Server started on http://localhost:8000");
});
