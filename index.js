const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware'); 


// Créer une application Express
const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Routes pour les tâches
app.use('/tasks', taskRoutes);

// Route d'authentification
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Vérification des informations d'identification de l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // Génération du token JWT
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');
  
    // Renvoi du token dans la réponse
    res.json({ token });
  });
// Middleware pour gérer les erreurs
app.use(errorMiddleware);

// Se connecter à la base de données MongoDB
mongoose.connect('mongodb://localhost/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Démarrer le serveur
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
