import { createServer } from "http";

const server = createServer(async (request, response) => {  
    response.end('Hello World !');

    return;

    if (request.url === "...") {
        // function of the route (routes folder)
    }
});

server.listen(8000, "localhost", () => {
  console.log("Server started on http://localhost:8000");
});
