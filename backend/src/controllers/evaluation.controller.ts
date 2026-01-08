import { Request, Response } from 'express';
import prisma from '../config/database';

export const createEvaluation = async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      moduleId,
      titre,
      description,
      type,
      dateEvaluation,
      dureeMinutes,
      coefficient,
      noteMax,
      createurId,
    } = req.body;

    const evaluation = await prisma.evaluation.create({
      data: {
        sessionId,
        moduleId,
        titre,
        description,
        type,
        dateEvaluation: new Date(dateEvaluation),
        dureeMinutes,
        coefficient,
        noteMax,
        createurId,
      },
      include: {
        session: {
          include: {
            formation: true,
          },
        },
        module: true,
        createur: {
          include: {
            user: {
              select: {
                nom: true,
                prenom: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: 'Évaluation créée avec succès',
      evaluation,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'évaluation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'évaluation' });
  }
};

export const getEvaluationsBySession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const evaluations = await prisma.evaluation.findMany({
      where: { sessionId },
      include: {
        module: true,
        createur: {
          include: {
            user: {
              select: {
                nom: true,
                prenom: true,
              },
            },
          },
        },
        notes: {
          include: {
            apprenant: {
              include: {
                user: {
                  select: {
                    nom: true,
                    prenom: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        dateEvaluation: 'asc',
      },
    });

    res.json(evaluations);
  } catch (error) {
    console.error('Erreur lors de la récupération des évaluations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des évaluations' });
  }
};

export const saisirNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { evaluationId, apprenantId, note, commentaire } = req.body;

    // Vérifier que l'évaluation existe
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
    });

    if (!evaluation) {
      res.status(404).json({ error: 'Évaluation non trouvée' });
      return;
    }

    // Vérifier que la note est dans la plage valide
    if (note !== null && evaluation.noteMax && note > evaluation.noteMax) {
      res.status(400).json({
        error: `La note ne peut pas dépasser ${evaluation.noteMax}`,
      });
      return;
    }

    // Créer ou mettre à jour la note
    const noteResult = await prisma.note.upsert({
      where: {
        evaluationId_apprenantId: {
          evaluationId,
          apprenantId,
        },
      },
      update: {
        note,
        commentaire,
      },
      create: {
        evaluationId,
        apprenantId,
        note,
        commentaire,
      },
      include: {
        apprenant: {
          include: {
            user: {
              select: {
                nom: true,
                prenom: true,
              },
            },
          },
        },
        evaluation: true,
      },
    });

    res.json({
      message: 'Note enregistrée avec succès',
      note: noteResult,
    });
  } catch (error) {
    console.error('Erreur lors de la saisie de la note:', error);
    res.status(500).json({ error: 'Erreur lors de la saisie de la note' });
  }
};

export const getNotesApprenant = async (req: Request, res: Response) => {
  try {
    const { apprenantId } = req.params;
    const { sessionId } = req.query;

    const notes = await prisma.note.findMany({
      where: {
        apprenantId,
        ...(sessionId && {
          evaluation: {
            sessionId: sessionId as string,
          },
        }),
      },
      include: {
        evaluation: {
          include: {
            session: {
              include: {
                formation: true,
              },
            },
            module: true,
          },
        },
      },
      orderBy: {
        dateSaisie: 'desc',
      },
    });

    // Calculer les statistiques
    const notesValides = notes.filter((n: any) => n.note !== null);
    const moyenne =
      notesValides.length > 0
        ? notesValides.reduce((sum: number, n: any) => {
            const noteNormalisee = (n.note! / (n.evaluation.noteMax || 20)) * 20;
            return sum + noteNormalisee * n.evaluation.coefficient;
          }, 0) /
          notesValides.reduce((sum: number, n: any) => sum + n.evaluation.coefficient, 0)
        : null;

    res.json({
      notes,
      statistiques: {
        nombreNotes: notes.length,
        moyenne: moyenne ? Math.round(moyenne * 100) / 100 : null,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
};

export const validerCompetence = async (req: Request, res: Response) => {
  try {
    const { apprenantId, competenceId, niveau, commentaire } = req.body;

    const competenceApprenant = await prisma.competenceApprenant.upsert({
      where: {
        apprenantId_competenceId: {
          apprenantId,
          competenceId,
        },
      },
      update: {
        niveau,
        commentaire,
        dateAcquisition: new Date(),
      },
      create: {
        apprenantId,
        competenceId,
        niveau,
        commentaire,
      },
      include: {
        competence: true,
        apprenant: {
          include: {
            user: {
              select: {
                nom: true,
                prenom: true,
              },
            },
          },
        },
      },
    });

    res.json({
      message: 'Compétence validée avec succès',
      competence: competenceApprenant,
    });
  } catch (error) {
    console.error('Erreur lors de la validation de la compétence:', error);
    res.status(500).json({ error: 'Erreur lors de la validation de la compétence' });
  }
};
