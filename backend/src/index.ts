import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import apprenantRoutes from './routes/apprenant.routes';
import formationRoutes from './routes/formation.routes';
import formateurRoutes from './routes/formateur.routes';
import evaluationRoutes from './routes/evaluation.routes';
import emploiDuTempsRoutes from './routes/emploiDuTemps.routes';

// Charger les variables d'environnement
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/apprenants', apprenantRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/formateurs', formateurRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/emploi-du-temps', emploiDuTempsRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Centre de Formation - Running',
    timestamp: new Date().toISOString(),
  });
});

// Gestion des erreurs (doit être en dernier)
app.use(errorHandler);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   🎓 API Centre de Formation pour Adultes                ║
║                                                           ║
║   Serveur démarré avec succès !                          ║
║   Port: ${PORT}                                           ║
║   Environnement: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
║   URL API: http://localhost:${PORT}                       ║
║   Health Check: http://localhost:${PORT}/health           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
