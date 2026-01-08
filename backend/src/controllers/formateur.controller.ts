import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllFormateurs = async (req: Request, res: Response) => {
  try {
    const { search, domaineExpertise } = req.query;

    const formateurs = await prisma.formateur.findMany({
      where: {
        ...(search && {
          OR: [
            { user: { nom: { contains: search as string, mode: 'insensitive' } } },
            { user: { prenom: { contains: search as string, mode: 'insensitive' } } },
            { user: { email: { contains: search as string, mode: 'insensitive' } } },
          ],
        }),
        ...(domaineExpertise && {
          domainesExpertise: {
            has: domaineExpertise as string,
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            telephone: true,
            photo: true,
          },
        },
        sessionsFormation: {
          include: {
            formation: true,
          },
        },
        modulesEnseignes: {
          include: {
            formation: true,
          },
        },
      },
    });

    res.json(formateurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des formateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des formateurs' });
  }
};

export const getFormateurById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const formateur = await prisma.formateur.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            telephone: true,
            photo: true,
          },
        },
        sessionsFormation: {
          include: {
            formation: true,
            inscriptions: true,
          },
        },
        modulesEnseignes: {
          include: {
            formation: true,
          },
        },
        emploiDuTemps: {
          include: {
            session: {
              include: {
                formation: true,
              },
            },
            salle: true,
          },
        },
      },
    });

    if (!formateur) {
      res.status(404).json({ error: 'Formateur non trouvé' });
      return;
    }

    res.json(formateur);
  } catch (error) {
    console.error('Erreur lors de la récupération du formateur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du formateur' });
  }
};

export const updateFormateur = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      qualifications,
      domainesExpertise,
      biographie,
      typeContrat,
      dateDebutContrat,
      dateFinContrat,
      tauxHoraire,
      disponibilites,
    } = req.body;

    const formateur = await prisma.formateur.update({
      where: { id },
      data: {
        qualifications,
        domainesExpertise,
        biographie,
        typeContrat,
        dateDebutContrat: dateDebutContrat ? new Date(dateDebutContrat) : undefined,
        dateFinContrat: dateFinContrat ? new Date(dateFinContrat) : undefined,
        tauxHoraire,
        disponibilites,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            telephone: true,
          },
        },
      },
    });

    res.json({
      message: 'Formateur mis à jour avec succès',
      formateur,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du formateur:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du formateur' });
  }
};

export const getFormateurEmploiDuTemps = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { dateDebut, dateFin } = req.query;

    const emploiDuTemps = await prisma.emploiDuTemps.findMany({
      where: {
        formateurId: id,
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
