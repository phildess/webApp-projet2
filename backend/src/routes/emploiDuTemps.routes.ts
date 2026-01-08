import { Router } from 'express';
import * as emploiDuTempsController from '../controllers/emploiDuTemps.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, emploiDuTempsController.getEmploiDuTemps);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  emploiDuTempsController.createEmploiDuTemps
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  emploiDuTempsController.updateEmploiDuTemps
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  emploiDuTempsController.deleteEmploiDuTemps
);

// Salles
router.get('/salles', authenticate, emploiDuTempsController.getAllSalles);
router.post(
  '/salles',
  authenticate,
  authorize('ADMIN'),
  emploiDuTempsController.createSalle
);

export default router;
