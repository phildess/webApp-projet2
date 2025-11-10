import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllFormations = async (req: Request, res: Response) => {
  try {
    const { niveau, domaine, actif, search } = req.query;

    const formations = await prisma.formation.findMany({
      where: {
        ...(niveau && { niveau: niveau as any }),
        ...(domaine && { domaine: domaine as string }),
        ...(actif !== undefined && { actif: actif === 'true' }),
        ...(search && {
          OR: [
            { titre: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        sessions: {
          where: {
            statut: 'PLANIFIEE',
          },
          take: 3,
        },
        modules: {
          orderBy: {
            ordre: 'asc',
          },
        },
        competences: true,
      },
      orderBy: {
        dateCreation: 'desc',
      },
    });

    res.json(formations);
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des formations' });
  }
};

export const getFormationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const formation = await prisma.formation.findUnique({
      where: { id },
      include: {
        sessions: {
          include: {
            formateurPrincipal: {
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
            inscriptions: true,
          },
        },
        modules: {
          include: {
            ressources: true,
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
          orderBy: {
            ordre: 'asc',
          },
        },
        competences: true,
      },
    });

    if (!formation) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }

    res.json(formation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la formation:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la formation' });
  }
};

export const createFormation = async (req: Request, res: Response) => {
  try {
    const {
      titre,
      description,
      objectifs,
      prerequis,
      publicVise,
      dureeHeures,
      niveau,
      cout,
      domaine,
      image,
      brochure,
    } = req.body;

    const formation = await prisma.formation.create({
      data: {
        titre,
        description,
        objectifs,
        prerequis,
        publicVise,
        dureeHeures,
        niveau,
        cout,
        domaine,
        image,
        brochure,
      },
    });

    res.status(201).json({
      message: 'Formation créée avec succès',
      formation,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la formation' });
  }
};

export const updateFormation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      titre,
      description,
      objectifs,
      prerequis,
      publicVise,
      dureeHeures,
      niveau,
      cout,
      domaine,
      actif,
      image,
      brochure,
    } = req.body;

    const formation = await prisma.formation.update({
      where: { id },
      data: {
        titre,
        description,
        objectifs,
        prerequis,
        publicVise,
        dureeHeures,
        niveau,
        cout,
        domaine,
        actif,
        image,
        brochure,
      },
    });

    res.json({
      message: 'Formation mise à jour avec succès',
      formation,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la formation:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la formation' });
  }
};

export const deleteFormation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.formation.delete({
      where: { id },
    });

    res.json({ message: 'Formation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la formation:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la formation' });
  }
};

// Sessions de formation
export const createSession = async (req: Request, res: Response) => {
  try {
    const { formationId } = req.params;
    const { nom, dateDebut, dateFin, nombrePlaces, formateurPrincipalId } = req.body;

    const session = await prisma.sessionFormation.create({
      data: {
        formationId,
        nom,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        nombrePlaces,
        placesRestantes: nombrePlaces,
        formateurPrincipalId,
      },
      include: {
        formation: true,
        formateurPrincipal: {
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
      message: 'Session créée avec succès',
      session,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session' });
  }
};

export const inscrireApprenant = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { apprenantId } = req.body;

    // Vérifier les places disponibles
    const session = await prisma.sessionFormation.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    if (session.placesRestantes <= 0) {
      return res.status(400).json({ error: 'Plus de places disponibles' });
    }

    // Créer l'inscription
    const inscription = await prisma.inscription.create({
      data: {
        apprenantId,
        sessionId,
      },
      include: {
        apprenant: {
          include: {
            user: true,
          },
        },
        session: {
          include: {
            formation: true,
          },
        },
      },
    });

    // Décrémenter les places restantes
    await prisma.sessionFormation.update({
      where: { id: sessionId },
      data: {
        placesRestantes: {
          decrement: 1,
        },
      },
    });

    res.status(201).json({
      message: 'Inscription réussie',
      inscription,
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};
