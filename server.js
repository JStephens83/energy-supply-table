const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

// CORS
app.use(cors());

// Route data.json
app.get('/data', (req, res) => {
  try {
    const data = require(path.join(__dirname, 'data.json')); 
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération de data.json :', error);
    res.status(500).json({ error: 'Erreur lors du chargement de data.json' });
  }
});

// Route countries.json
app.get('/countries', (req, res) => {
  try {
    const countries = require(path.join(__dirname, 'countries.json'));
    res.json(countries);
  } catch (error) {
    console.error('Erreur lors de la récupération de countries.json :', error);
    res.status(500).json({ error: 'Erreur lors du chargement de countries.json' });
  }
});

// démarrae serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
