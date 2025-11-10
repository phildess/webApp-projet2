import { body, param, query, ValidationChain } from 'express-validator';

// Validations communes
export const emailValidation: ValidationChain = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Email invalide');

export const passwordValidation: ValidationChain = body('password')
  .isLength({ min: 6 })
  .withMessage('Le mot de passe doit contenir au moins 6 caractères');

export const idValidation = (field: string = 'id'): ValidationChain =>
  param(field).isString().notEmpty().withMessage('ID invalide');

// Validations pour l'inscription
export const registerValidation = [
  emailValidation,
  passwordValidation,
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
  body('role').isIn(['ADMIN', 'FORMATEUR', 'APPRENANT']).withMessage('Rôle invalide'),
];

// Validations pour la connexion
export const loginValidation = [
  emailValidation,
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
];
