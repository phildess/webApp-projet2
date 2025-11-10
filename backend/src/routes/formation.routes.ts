import { Router } from 'express';
import * as formationController from '../controllers/formation.controller';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Routes publiques (accessibles à tous les utilisateurs authentifiés)
router.get('/', authenticate, formationController.getAllFormations);
router.get('/:id', authenticate, formationController.getFormationById);

// Routes ADMIN uniquement
router.post('/', authenticate, authorize(Role.ADMIN), formationController.createFormation);
router.put('/:id', authenticate, authorize(Role.ADMIN), formationController.updateFormation);
router.delete('/:id', authenticate, authorize(Role.ADMIN), formationController.deleteFormation);

// Sessions
router.post(
  '/:formationId/sessions',
  authenticate,
  authorize(Role.ADMIN),
  formationController.createSession
);

router.post(
  '/sessions/:sessionId/inscrire',
  authenticate,
  authorize(Role.ADMIN, Role.APPRENANT),
  formationController.inscrireApprenant
);

export default router;
