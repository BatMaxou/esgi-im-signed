import { readFile } from "fs/promises";
import { db } from "../db.js";
import { getBody } from "../library/body.js";

// allow to search with links (https://imsigned.com/?searchTerm=test)
export const getList = async (rawQuery) => {
  const query = new URLSearchParams(rawQuery);
  const searchTerm = query.get("searchTerm");

  // handle database call

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

  // Récupérer les données de la base de données
  const users = await fetchUsersFromDatabase(searchTerm);

  // Générer les cartes dynamiquement en fonction des données de la base
  const cards = users.map(
    (user) =>
      cardTemplate
        .replace("{{username}}", user.name)
        .replace("{{color}}", "#d473d4") // Couleur par défaut, peut être personnalisée
        .replace("{{registerDate}}", user.registerDate || "N/A") // Date d'inscription
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
      sql += " WHERE name LIKE ? OR email LIKE ?";
      params = [`%${searchTerm}%`, `%${searchTerm}%`];
    }

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Erreur lors de la recherche :", err.message);
        reject([]);
        return;
      }
      // Mapper les résultats pour ajouter des informations comme une date d'inscription fictive
      const users = results.map((user) => ({
        name: user.name,
        email: user.email,
        registerDate: new Date().toLocaleDateString(), // Exemple : générez une date fictive
      }));
      resolve(users);
    });
  });
};
