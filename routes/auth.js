import { readFile } from "fs/promises";
// const db = require("../db");
import { db } from "../db.js";

import { getBody } from "../library/body.js";

export async function postRegister(request, response) {
  return new Promise((resolve, reject) => {
    let body = "";

    // Lire les données du POST
    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      const data = new URLSearchParams(body);
      const name = data.get("name");
      const email = data.get("email");
      const datetime = new Date().toISOString().slice(0, 19).replace("T", " ");

      db.query(
        "INSERT INTO users (name, email, createdAt) VALUES (?, ?, ?)",
        [name, email, datetime],
        (err, result) => {
          if (err) {
            console.error(err);
            resolve("/inscription?error=1"); // Redirection en cas d'erreur
            return;
          }
          resolve("/?success=1"); // Redirection en cas de succès
        }
      );
    });
  });
}

export const getRegister = async (rawQuery) => {
  // const query = new URLSearchParams(rawQuery);
  // const searchTerm = query.get('searchTerm');

  // handle database call
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
