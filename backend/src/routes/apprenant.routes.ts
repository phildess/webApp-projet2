import { Router } from 'express';
import * as apprenantController from '../controllers/apprenant.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Routes accessibles par ADMIN et FORMATEUR
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'FORMATEUR'),
  apprenantController.getAllApprenants
);

router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'FORMATEUR', 'APPRENANT'),
  apprenantController.getApprenantById
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'APPRENANT'),
  apprenantController.updateApprenant
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  apprenantController.deleteApprenant
);

router.get(
  '/:id/inscriptions',
  authenticate,
  authorize('ADMIN', 'FORMATEUR', 'APPRENANT'),
  apprenantController.getApprenantInscriptions
);

export default router;
