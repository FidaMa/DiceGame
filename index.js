import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware pour servir des fichiers statiques depuis le dossier 'static'
app.use("/static", express.static(path.join(__dirname, "/static")));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.redirect(302, "/static/html/index.html");
});

// Endpoint pour soumettre les scores (POST)
app.post('/submit-score', (req, res) => {
    const { players, scores } = req.body;
    console.log('Scores reçus:', players, scores);
    
    // Ici, vous pouvez enregistrer les scores dans une base de données ou un fichier
    res.json({ message: 'Scores soumis avec succès' });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
