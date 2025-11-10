export enum Role {
  ADMIN = 'ADMIN',
  FORMATEUR = 'FORMATEUR',
  APPRENANT = 'APPRENANT',
}

export enum StatutApprenant {
  ACTIF = 'ACTIF',
  EN_ATTENTE = 'EN_ATTENTE',
  TERMINE = 'TERMINE',
  SUSPENDU = 'SUSPENDU',
}

export enum NiveauFormation {
  DEBUTANT = 'DEBUTANT',
  INTERMEDIAIRE = 'INTERMEDIAIRE',
  AVANCE = 'AVANCE',
  EXPERT = 'EXPERT',
}

export enum StatutSession {
  PLANIFIEE = 'PLANIFIEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE',
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  telephone?: string;
  photo?: string;
  actif: boolean;
  apprenant?: Apprenant;
  formateur?: Formateur;
}

export interface Apprenant {
  id: string;
  userId: string;
  dateNaissance: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  statut: StatutApprenant;
  dateInscription: string;
  user?: User;
}

export interface Formateur {
  id: string;
  userId: string;
  qualifications: string[];
  domainesExpertise: string[];
  biographie?: string;
  typeContrat?: string;
  tauxHoraire?: number;
  user?: User;
}

export interface Formation {
  id: string;
  titre: string;
  description: string;
  objectifs: string[];
  prerequis: string[];
  publicVise?: string;
  dureeHeures: number;
  niveau: NiveauFormation;
  cout?: number;
  domaine: string;
  actif: boolean;
  image?: string;
  sessions?: SessionFormation[];
  modules?: ModuleFormation[];
  competences?: Competence[];
}

export interface SessionFormation {
  id: string;
  formationId: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  nombrePlaces: number;
  placesRestantes: number;
  statut: StatutSession;
  formation?: Formation;
  formateurPrincipal?: Formateur;
  inscriptions?: Inscription[];
}

export interface Inscription {
  id: string;
  apprenantId: string;
  sessionId: string;
  dateInscription: string;
  statut: string;
  apprenant?: Apprenant;
  session?: SessionFormation;
}

export interface ModuleFormation {
  id: string;
  formationId: string;
  titre: string;
  description?: string;
  objectifsPedagogiques: string[];
  contenu: string;
  dureeHeures: number;
  ordre: number;
  formateur?: Formateur;
  ressources?: Ressource[];
}

export interface Ressource {
  id: string;
  moduleId: string;
  titre: string;
  description?: string;
  type: string;
  url?: string;
  fichier?: string;
  dateAjout: string;
}

export interface Competence {
  id: string;
  formationId?: string;
  moduleId?: string;
  nom: string;
  description?: string;
  categorie?: string;
}

export interface Evaluation {
  id: string;
  sessionId: string;
  moduleId?: string;
  titre: string;
  description?: string;
  type: string;
  dateEvaluation: string;
  dureeMinutes?: number;
  coefficient: number;
  noteMax?: number;
  notes?: Note[];
}

export interface Note {
  id: string;
  evaluationId: string;
  apprenantId: string;
  note?: number;
  commentaire?: string;
  dateSaisie: string;
  evaluation?: Evaluation;
}

export interface EmploiDuTemps {
  id: string;
  sessionId: string;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  salleId?: string;
  formateurId?: string;
  session?: SessionFormation;
  salle?: Salle;
  formateur?: Formateur;
}

export interface Salle {
  id: string;
  nom: string;
  capacite: number;
  equipements: string[];
  localisation?: string;
  actif: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: Role;
  telephone?: string;
  dateNaissance?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}
