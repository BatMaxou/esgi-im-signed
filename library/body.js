export async function getBody(request) {
    let body = "";

    for await (const chunk of request) {
        body += chunk.toString();
    }

    return body;
}
