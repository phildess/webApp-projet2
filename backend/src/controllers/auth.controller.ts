import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { generateToken } from '../config/jwt';
import { AppError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, nom, prenom, role, telephone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role,
        telephone,
        // Créer automatiquement le profil selon le rôle
        ...(role === 'APPRENANT' && {
          apprenant: {
            create: {
              dateNaissance: req.body.dateNaissance || new Date(),
              adresse: req.body.adresse,
              ville: req.body.ville,
              codePostal: req.body.codePostal,
            },
          },
        }),
        ...(role === 'FORMATEUR' && {
          formateur: {
            create: {
              qualifications: req.body.qualifications || [],
              domainesExpertise: req.body.domainesExpertise || [],
            },
          },
        }),
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        telephone: true,
      },
    });

    // Générer le token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: 'Inscription réussie',
      user,
      token,
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        apprenant: true,
        formateur: true,
      },
    });

    if (!user || !user.actif) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Retirer le mot de passe de la réponse
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        apprenant: true,
        formateur: true,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { nom, prenom, telephone, photo } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        nom,
        prenom,
        telephone,
        photo,
      },
      omit: {
        password: true,
      },
    });

    res.json({
      message: 'Profil mis à jour avec succès',
      user,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
};
