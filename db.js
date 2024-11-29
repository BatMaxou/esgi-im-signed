import mysql from "mysql2";

// Mise en place de la connexion
export const db = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "root",
  database: "im_signed",
  multipleStatements: true,
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.message);
    return;
  }
  console.log("Connecté à la base de données MySQL.");

  // Création de la table users si elle n'existe pas
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      createdAt DATETIME NOT NULL
    );
  `;

  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Erreur lors de la création de la table :", err.message);
      return;
    }
    console.log("La table 'users' est prête.");
  });
});
