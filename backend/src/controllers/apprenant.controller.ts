import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllApprenants = async (req: Request, res: Response) => {
  try {
    const { statut, search } = req.query;

    const apprenants = await prisma.apprenant.findMany({
      where: {
        ...(statut && { statut: statut as any }),
        ...(search && {
          OR: [
            { user: { nom: { contains: search as string, mode: 'insensitive' } } },
            { user: { prenom: { contains: search as string, mode: 'insensitive' } } },
            { user: { email: { contains: search as string, mode: 'insensitive' } } },
          ],
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
        inscriptions: {
          include: {
            session: {
              include: {
                formation: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateInscription: 'desc',
      },
    });

    res.json(apprenants);
  } catch (error) {
    console.error('Erreur lors de la récupération des apprenants:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des apprenants' });
  }
};

export const getApprenantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const apprenant = await prisma.apprenant.findUnique({
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
        inscriptions: {
          include: {
            session: {
              include: {
                formation: true,
              },
            },
          },
        },
        notes: {
          include: {
            evaluation: true,
          },
        },
        competencesAcquises: {
          include: {
            competence: true,
          },
        },
        documents: true,
      },
    });

    if (!apprenant) {
      return res.status(404).json({ error: 'Apprenant non trouvé' });
    }

    res.json(apprenant);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'apprenant:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'apprenant' });
  }
};

export const updateApprenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      dateNaissance,
      adresse,
      ville,
      codePostal,
      pays,
      statut,
      pieceIdentite,
      numeroPieceIdentite,
    } = req.body;

    const apprenant = await prisma.apprenant.update({
      where: { id },
      data: {
        dateNaissance,
        adresse,
        ville,
        codePostal,
        pays,
        statut,
        pieceIdentite,
        numeroPieceIdentite,
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
      message: 'Apprenant mis à jour avec succès',
      apprenant,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'apprenant:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'apprenant' });
  }
};

export const deleteApprenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.apprenant.delete({
      where: { id },
    });

    res.json({ message: 'Apprenant supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'apprenant:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'apprenant' });
  }
};

export const getApprenantInscriptions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const inscriptions = await prisma.inscription.findMany({
      where: { apprenantId: id },
      include: {
        session: {
          include: {
            formation: true,
            formateurPrincipal: {
              include: {
                user: {
                  select: {
                    nom: true,
                    prenom: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        dateInscription: 'desc',
      },
    });

    res.json(inscriptions);
  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des inscriptions' });
  }
};
