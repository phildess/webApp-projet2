import { Router } from 'express';
import * as formateurController from '../controllers/formateur.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'FORMATEUR'),
  formateurController.getAllFormateurs
);

router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'FORMATEUR'),
  formateurController.getFormateurById
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'FORMATEUR'),
  formateurController.updateFormateur
);

router.get(
  '/:id/emploi-du-temps',
  authenticate,
  authorize('ADMIN', 'FORMATEUR'),
  formateurController.getFormateurEmploiDuTemps
);

export default router;
