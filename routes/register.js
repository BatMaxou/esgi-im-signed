import { readFile } from "fs/promises";
import { db } from "../db.js";

export async function postRegister(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    // Lire les données du POST
    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      const data = new URLSearchParams(body);
      const username = data.get("username");
      const email = data.get("email");
      const password = data.get("password");
      const datetime = new Date().toISOString().slice(0, 19).replace("T", " ");

      // Faille de sécurité Injection SQL
      db.query(
        `INSERT INTO users (createdAt, username, email, password) VALUES ('${datetime}', '${username}', '${email}', '${password}')`,
        (err, result) => {
          if (err) {
            console.error(err);
            resolve(`/inscription?error=${err}`); // Redirection en cas d'erreur
            return;
          }
          resolve("/?success=1"); // Redirection en cas de succès
        }
      );
    });
  });
}

export const getRegister = async () => {
  const errors = "";
  return await auth(errors);
};

const auth = async (errors) => {
  const pageTemplate = (await readFile("./templates/page.html")).toString();
  const contentTemplate = (await readFile("./templates/register/form.html")).toString();

  return pageTemplate
    .replace("{{title}}", "JeSuisInscrit.com")
    .replace("{{content}}", contentTemplate.replace("{{errors}}", errors));
};
