const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const DATA_FILE = path.join(__dirname, 'data.json');
const API_KEY = 'TA_CLE_API';

app.use(express.json());
app.use(express.static(__dirname)); // Servir les fichiers statiques

// API pour recevoir les compteurs
app.post('/api/receive-counters', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return res.status(401).send('Clé API invalide ou manquante');
  }

  const data = req.body;
  console.log('[INFO] Données reçues:', data);

  let existing = [];
  if (fs.existsSync(DATA_FILE)) {
    existing = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  existing.push(data);
  fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
  res.status(200).send('OK');
});

// Supprimer toutes les données
app.delete('/data.json', (req, res) => {
  fs.writeFileSync(DATA_FILE, '[]');
  res.status(200).send('Fichier vidé');
});

// Servir viewer.html à la racine et sur /viewer.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

app.get('/viewer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

// Démarrage du serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`[INFO] API en écoute sur port ${PORT}`);
});