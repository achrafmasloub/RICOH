// ===== Mini API Web de Réception (Node.js Express) =====
// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); // Sert les fichiers statiques (HTML, JSON, etc.)

const DATA_FILE = path.join(__dirname, 'data.json');
const API_KEY = 'TA_CLE_API'; // Clé API

// Fonction pour sauvegarder les données
function saveData(newData) {
  let existingData = [];
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE);
    existingData = JSON.parse(raw);
  }
  existingData.push(newData);
  fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));
}

// Endpoint pour recevoir les compteurs
app.post('/api/receive-counters', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    console.warn('[ALERTE] Accès sans clé API valide.');
    return res.status(401).send('Clé API invalide ou manquante');
  }
  const data = req.body;
  console.log('[INFO] Données reçues:', data);
  saveData(data);
  res.status(200).send('OK');
});

// Endpoint pour supprimer les données (pour le bouton "Supprimer tout")
app.delete('/data.json', (req, res) => {
  fs.writeFileSync(DATA_FILE, '[]');
  console.log('[INFO] Données supprimées.');
  res.status(200).send('Fichier vidé');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[INFO] API en écoute sur port ${PORT}`));
