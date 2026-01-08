import { Router } from 'express';
import * as formationController from '../controllers/formation.controller';
import { authenticate, authorize } from '../middleware/auth';


const router = Router();

// Routes publiques (accessibles à tous les utilisateurs authentifiés)
router.get('/', authenticate, formationController.getAllFormations);
router.get('/:id', authenticate, formationController.getFormationById);

// Routes ADMIN uniquement
router.post('/', authenticate, authorize('ADMIN), formationController.createFormation);
router.put('/:id', authenticate, authorize('ADMIN), formationController.updateFormation);
router.delete('/:id', authenticate, authorize('ADMIN), formationController.deleteFormation);

// Sessions
router.post(
  '/:formationId/sessions',
  authenticate,
  authorize('ADMIN),
  formationController.createSession
);

router.post(
  '/sessions/:sessionId/inscrire',
  authenticate,
  authorize('ADMIN, 'APPRENANT),
  formationController.inscrireApprenant
);

export default router;
