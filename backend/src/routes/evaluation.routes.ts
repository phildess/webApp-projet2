import { Router } from 'express';
import * as evaluationController from '../controllers/evaluation.controller';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN, Role.FORMATEUR),
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
  authorize(Role.ADMIN, Role.FORMATEUR),
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
  authorize(Role.ADMIN, Role.FORMATEUR),
  evaluationController.validerCompetence
);

export default router;
