import { readFile } from "fs/promises";
import jsonwebtoken from "jsonwebtoken";

import { db } from "../db.js";
import { getBody } from "../library/body.js";
import { jwtSecret } from "../utils/secrets.js";

export const postLogin = async (request) => {
  const body = JSON.parse(await getBody(request));

  const email = body.email ?? null;
  const password = body.password ?? null;

  const [result,] = await db.promise().query(`SELECT * FROM users WHERE email = "${email}" AND password = "${password}";`);

  if (result.length === 0) {
    return null;
  }

  return jsonwebtoken.sign(result[0], jwtSecret);
}

export const getLogin = async (errors = '') => {
  const pageTemplate = (await readFile("./templates/page.html")).toString();
  const contentTemplate = (await readFile("./templates/login/form.html")).toString();
  
  return pageTemplate
    .replace("{{title}}", "Inscription")
    .replace("{{content}}", contentTemplate.replace("{{errors}}", errors));
};
