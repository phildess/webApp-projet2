import { Router } from 'express';
import * as apprenantController from '../controllers/apprenant.controller';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Routes accessibles par ADMIN et FORMATEUR
router.get(
  '/',
  authenticate,
  authorize(Role.ADMIN, Role.FORMATEUR),
  apprenantController.getAllApprenants
);

router.get(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.FORMATEUR, Role.APPRENANT),
  apprenantController.getApprenantById
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.APPRENANT),
  apprenantController.updateApprenant
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  apprenantController.deleteApprenant
);

router.get(
  '/:id/inscriptions',
  authenticate,
  authorize(Role.ADMIN, Role.FORMATEUR, Role.APPRENANT),
  apprenantController.getApprenantInscriptions
);

export default router;
