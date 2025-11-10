import { Router } from 'express';
import * as formateurController from '../controllers/formateur.controller';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(Role.ADMIN, Role.FORMATEUR),
  formateurController.getAllFormateurs
);

router.get(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.FORMATEUR),
  formateurController.getFormateurById
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.FORMATEUR),
  formateurController.updateFormateur
);

router.get(
  '/:id/emploi-du-temps',
  authenticate,
  authorize(Role.ADMIN, Role.FORMATEUR),
  formateurController.getFormateurEmploiDuTemps
);

export default router;
