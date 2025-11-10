import { Router } from 'express';
import * as emploiDuTempsController from '../controllers/emploiDuTemps.controller';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', authenticate, emploiDuTempsController.getEmploiDuTemps);

router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  emploiDuTempsController.createEmploiDuTemps
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  emploiDuTempsController.updateEmploiDuTemps
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  emploiDuTempsController.deleteEmploiDuTemps
);

// Salles
router.get('/salles', authenticate, emploiDuTempsController.getAllSalles);
router.post(
  '/salles',
  authenticate,
  authorize(Role.ADMIN),
  emploiDuTempsController.createSalle
);

export default router;
