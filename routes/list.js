import { readFile } from "fs/promises";
import { db } from "../db.js";
import { getBody } from "../library/body.js";
import moment from "moment";

// allow to search with links (https://imsigned.com/?searchTerm=test)
export const getList = async (rawQuery) => {
  const query = new URLSearchParams(rawQuery);
  const searchTerm = query.get("searchTerm");

  return await list(searchTerm);
};

export const postList = async (request) => {
  const body = new URLSearchParams(await getBody(request));
  const searchTerm = body.get("searchTerm");

  return `${request.headers.origin}?searchTerm=${searchTerm}`;
};

const list = async (searchTerm = null) => {
  // Charger les templates HTML
  const pageTemplate = (await readFile("./templates/page.html")).toString();
  const contentTemplate = (await readFile("./templates/list/content.html")).toString();
  const cardTemplate = (await readFile("./templates/list/card.html")).toString();

  // Récupérer les utilisateurs de la base de données
  const users = await fetchUsersFromDatabase(searchTerm);

  // Générer les cartes dynamiquement en fonction des données de la base
  const cards = users.map(
    (user) =>
      cardTemplate
        .replace("{{username}}", user.username)
        .replace("{{registerDate}}", user.createdAt || "N/A")
  );

  // Remplir le contenu de la page avec les résultats
  return pageTemplate
    .replace("{{title}}", "JeSuisInscrit.com")
    .replace(
      "{{content}}",
      contentTemplate.replace("{{searchTerm}}", searchTerm || "").replace("{{cards}}", cards.join(" "))
    );
};

// Fonction pour récupérer les utilisateurs depuis la base de données
const fetchUsersFromDatabase = (searchTerm) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM users";
    let params = [];

    if (searchTerm) {
      sql += " WHERE username LIKE ? OR email LIKE ?";
      params = [`%${searchTerm}%`, `%${searchTerm}%`];
    }

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Erreur lors de la recherche :", err.message);
        reject([]);
        return;
      }
      
      const users = results.map((user) => ({
        username: user.username,
        createdAt: moment(user.createdAt).format("DD/MM/YYYY"),
      }));
      resolve(users);
    });
  });
};
