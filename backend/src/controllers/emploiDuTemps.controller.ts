import { Request, Response } from 'express';
import prisma from '../config/database';

export const createEmploiDuTemps = async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      titre,
      description,
      dateDebut,
      dateFin,
      salleId,
      formateurId,
      recurrence,
      joursSemaine,
    } = req.body;

    // Vérifier la disponibilité de la salle
    if (salleId) {
      const conflit = await prisma.emploiDuTemps.findFirst({
        where: {
          salleId,
          OR: [
            {
              dateDebut: {
                lte: new Date(dateFin),
              },
              dateFin: {
                gte: new Date(dateDebut),
              },
            },
          ],
        },
      });

      if (conflit) {
        return res.status(400).json({
          error: 'La salle est déjà réservée pour cette période',
        });
      }
    }

    const emploiDuTemps = await prisma.emploiDuTemps.create({
      data: {
        sessionId,
        titre,
        description,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        salleId,
        formateurId,
        recurrence,
        joursSemaine,
      },
      include: {
        session: {
          include: {
            formation: true,
          },
        },
        salle: true,
        formateur: {
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
      message: 'Emploi du temps créé avec succès',
      emploiDuTemps,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'emploi du temps:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'emploi du temps' });
  }
};

export const getEmploiDuTemps = async (req: Request, res: Response) => {
  try {
    const { dateDebut, dateFin, sessionId, formateurId, salleId } = req.query;

    const emploiDuTemps = await prisma.emploiDuTemps.findMany({
      where: {
        ...(sessionId && { sessionId: sessionId as string }),
        ...(formateurId && { formateurId: formateurId as string }),
        ...(salleId && { salleId: salleId as string }),
        ...(dateDebut && {
          dateDebut: {
            gte: new Date(dateDebut as string),
          },
        }),
        ...(dateFin && {
          dateFin: {
            lte: new Date(dateFin as string),
          },
        }),
      },
      include: {
        session: {
          include: {
            formation: true,
          },
        },
        salle: true,
        formateur: {
          include: {
            user: {
              select: {
                nom: true,
                prenom: true,
                photo: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateDebut: 'asc',
      },
    });

    res.json(emploiDuTemps);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'emploi du temps' });
  }
};

export const updateEmploiDuTemps = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titre, description, dateDebut, dateFin, salleId, formateurId } = req.body;

    const emploiDuTemps = await prisma.emploiDuTemps.update({
      where: { id },
      data: {
        titre,
        description,
        dateDebut: dateDebut ? new Date(dateDebut) : undefined,
        dateFin: dateFin ? new Date(dateFin) : undefined,
        salleId,
        formateurId,
      },
      include: {
        session: {
          include: {
            formation: true,
          },
        },
        salle: true,
        formateur: {
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
      message: 'Emploi du temps mis à jour avec succès',
      emploiDuTemps,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'emploi du temps:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'emploi du temps' });
  }
};

export const deleteEmploiDuTemps = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.emploiDuTemps.delete({
      where: { id },
    });

    res.json({ message: 'Emploi du temps supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'emploi du temps:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'emploi du temps' });
  }
};

// Gestion des salles
export const getAllSalles = async (req: Request, res: Response) => {
  try {
    const salles = await prisma.salle.findMany({
      where: {
        actif: true,
      },
      include: {
        _count: {
          select: {
            emploiDuTemps: true,
          },
        },
      },
    });

    res.json(salles);
  } catch (error) {
    console.error('Erreur lors de la récupération des salles:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des salles' });
  }
};

export const createSalle = async (req: Request, res: Response) => {
  try {
    const { nom, capacite, equipements, localisation } = req.body;

    const salle = await prisma.salle.create({
      data: {
        nom,
        capacite,
        equipements,
        localisation,
      },
    });

    res.status(201).json({
      message: 'Salle créée avec succès',
      salle,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la salle:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la salle' });
  }
};
