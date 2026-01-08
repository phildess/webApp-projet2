import { Router } from 'express';
import * as evaluationController from '../controllers/evaluation.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'FORMATEUR'),
  evaluationController.createEvaluation
);

router.get(
  '/sessions/:sessionId',
  authenticate,
  evaluationController.getEvaluationsBySession
);

router.post(
  '/notes',
  authenticate,
  authorize('ADMIN', 'FORMATEUR'),
  evaluationController.saisirNote
);

router.get(
  '/apprenants/:apprenantId/notes',
  authenticate,
  evaluationController.getNotesApprenant
);

router.post(
  '/competences',
  authenticate,
  authorize('ADMIN', 'FORMATEUR'),
  evaluationController.validerCompetence
);

export default router;
