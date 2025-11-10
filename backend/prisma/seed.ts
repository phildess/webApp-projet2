import { PrismaClient, Role, NiveauFormation, StatutApprenant, TypeContrat } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // Nettoyer la base de données
  await prisma.note.deleteMany();
  await prisma.competenceApprenant.deleteMany();
  await prisma.evaluationCompetence.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.competence.deleteMany();
  await prisma.ressource.deleteMany();
  await prisma.emploiDuTemps.deleteMany();
  await prisma.inscription.deleteMany();
  await prisma.sessionFormation.deleteMany();
  await prisma.moduleFormation.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.salle.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.apprenant.deleteMany();
  await prisma.formateur.deleteMany();
  await prisma.user.deleteMany();

  // Créer un mot de passe hashé pour tous les utilisateurs de test
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Créer un administrateur
  const admin = await prisma.user.create({
    data: {
      email: 'admin@centre-formation.com',
      password: hashedPassword,
      nom: 'Admin',
      prenom: 'Système',
      role: Role.ADMIN,
      telephone: '0123456789',
    },
  });

  console.log('✅ Administrateur créé');

  // Créer des formateurs
  const formateur1 = await prisma.user.create({
    data: {
      email: 'jean.dupont@centre-formation.com',
      password: hashedPassword,
      nom: 'Dupont',
      prenom: 'Jean',
      role: Role.FORMATEUR,
      telephone: '0123456790',
      formateur: {
        create: {
          qualifications: ['Master en Informatique', 'Certification AWS'],
          domainesExpertise: ['Développement Web', 'Cloud Computing', 'DevOps'],
          biographie: 'Formateur expérimenté avec 10 ans d\'expérience dans le développement web',
          typeContrat: TypeContrat.CDI,
          dateDebutContrat: new Date('2020-01-01'),
          tauxHoraire: 50,
        },
      },
    },
  });

  const formateur2 = await prisma.user.create({
    data: {
      email: 'marie.martin@centre-formation.com',
      password: hashedPassword,
      nom: 'Martin',
      prenom: 'Marie',
      role: Role.FORMATEUR,
      telephone: '0123456791',
      formateur: {
        create: {
          qualifications: ['Licence en Marketing', 'Certification Google Analytics'],
          domainesExpertise: ['Marketing Digital', 'Communication', 'Réseaux Sociaux'],
          biographie: 'Experte en marketing digital et stratégies de communication',
          typeContrat: TypeContrat.CDD,
          dateDebutContrat: new Date('2022-09-01'),
          dateFinContrat: new Date('2024-08-31'),
          tauxHoraire: 45,
        },
      },
    },
  });

  console.log('✅ Formateurs créés');

  // Créer des apprenants
  const apprenant1 = await prisma.user.create({
    data: {
      email: 'pierre.bernard@example.com',
      password: hashedPassword,
      nom: 'Bernard',
      prenom: 'Pierre',
      role: Role.APPRENANT,
      telephone: '0123456792',
      apprenant: {
        create: {
          dateNaissance: new Date('1995-05-15'),
          adresse: '12 Rue de la Paix',
          ville: 'Paris',
          codePostal: '75001',
          pays: 'France',
          statut: StatutApprenant.ACTIF,
        },
      },
    },
  });

  const apprenant2 = await prisma.user.create({
    data: {
      email: 'sophie.dubois@example.com',
      password: hashedPassword,
      nom: 'Dubois',
      prenom: 'Sophie',
      role: Role.APPRENANT,
      telephone: '0123456793',
      apprenant: {
        create: {
          dateNaissance: new Date('1992-08-20'),
          adresse: '45 Avenue des Champs',
          ville: 'Lyon',
          codePostal: '69001',
          pays: 'France',
          statut: StatutApprenant.ACTIF,
        },
      },
    },
  });

  console.log('✅ Apprenants créés');

  // Créer des salles
  const salle1 = await prisma.salle.create({
    data: {
      nom: 'Salle A1',
      capacite: 20,
      equipements: ['Vidéoprojecteur', 'Tableau blanc', 'Wi-Fi', 'Climatisation'],
      localisation: 'Bâtiment A - 1er étage',
    },
  });

  const salle2 = await prisma.salle.create({
    data: {
      nom: 'Salle B2',
      capacite: 15,
      equipements: ['Ordinateurs', 'Vidéoprojecteur', 'Wi-Fi'],
      localisation: 'Bâtiment B - 2ème étage',
    },
  });

  console.log('✅ Salles créées');

  // Créer des formations
  const formationWeb = await prisma.formation.create({
    data: {
      titre: 'Développement Web Full Stack',
      description:
        'Formation complète pour devenir développeur web full stack. Apprenez HTML, CSS, JavaScript, React, Node.js et bien plus.',
      objectifs: [
        'Maîtriser les fondamentaux du développement web',
        'Créer des applications web modernes avec React',
        'Développer des API RESTful avec Node.js',
        'Déployer des applications en production',
      ],
      prerequis: ['Connaissances de base en informatique', 'Motivation et assiduité'],
      publicVise: 'Reconversion professionnelle, demandeurs d\'emploi',
      dureeHeures: 400,
      niveau: NiveauFormation.INTERMEDIAIRE,
      cout: 5000,
      domaine: 'Informatique',
    },
  });

  const formationMarketing = await prisma.formation.create({
    data: {
      titre: 'Marketing Digital et Réseaux Sociaux',
      description:
        'Maîtrisez les stratégies de marketing digital et la gestion des réseaux sociaux pour booster votre visibilité en ligne.',
      objectifs: [
        'Comprendre les fondamentaux du marketing digital',
        'Créer et gérer des campagnes publicitaires',
        'Optimiser la présence sur les réseaux sociaux',
        'Analyser les performances et ROI',
      ],
      prerequis: ['Aucun prérequis technique'],
      publicVise: 'Entrepreneurs, responsables marketing, community managers',
      dureeHeures: 200,
      niveau: NiveauFormation.DEBUTANT,
      cout: 3000,
      domaine: 'Marketing',
    },
  });

  console.log('✅ Formations créées');

  // Créer des modules pour la formation Web
  const module1 = await prisma.moduleFormation.create({
    data: {
      formationId: formationWeb.id,
      titre: 'Fondamentaux HTML/CSS',
      description: 'Apprendre les bases du développement web',
      objectifsPedagogiques: [
        'Maîtriser la structure HTML',
        'Styliser avec CSS',
        'Créer des layouts responsives',
      ],
      contenu: 'Introduction à HTML, CSS, Flexbox, Grid, Responsive Design',
      dureeHeures: 80,
      ordre: 1,
      formateurId: formateur1.formateur?.id,
    },
  });

  const module2 = await prisma.moduleFormation.create({
    data: {
      formationId: formationWeb.id,
      titre: 'JavaScript Moderne',
      description: 'Programmation JavaScript ES6+',
      objectifsPedagogiques: [
        'Comprendre les concepts de JavaScript',
        'Utiliser ES6+ features',
        'Manipuler le DOM',
      ],
      contenu: 'Variables, fonctions, objets, classes, async/await, fetch API',
      dureeHeures: 100,
      ordre: 2,
      formateurId: formateur1.formateur?.id,
    },
  });

  console.log('✅ Modules créés');

  // Créer des compétences
  const comp1 = await prisma.competence.create({
    data: {
      formationId: formationWeb.id,
      moduleId: module1.id,
      nom: 'Intégration HTML/CSS',
      description: 'Capacité à intégrer des maquettes en HTML/CSS responsive',
      categorie: 'Frontend',
    },
  });

  const comp2 = await prisma.competence.create({
    data: {
      formationId: formationWeb.id,
      moduleId: module2.id,
      nom: 'Programmation JavaScript',
      description: 'Maîtrise de JavaScript pour créer des applications interactives',
      categorie: 'Frontend',
    },
  });

  console.log('✅ Compétences créées');

  // Créer des sessions
  const session1 = await prisma.sessionFormation.create({
    data: {
      formationId: formationWeb.id,
      nom: 'Session Janvier 2025',
      dateDebut: new Date('2025-01-15'),
      dateFin: new Date('2025-06-15'),
      nombrePlaces: 15,
      placesRestantes: 13,
      formateurPrincipalId: formateur1.formateur?.id,
    },
  });

  const session2 = await prisma.sessionFormation.create({
    data: {
      formationId: formationMarketing.id,
      nom: 'Session Février 2025',
      dateDebut: new Date('2025-02-01'),
      dateFin: new Date('2025-04-30'),
      nombrePlaces: 20,
      placesRestantes: 18,
      formateurPrincipalId: formateur2.formateur?.id,
    },
  });

  console.log('✅ Sessions créées');

  // Inscrire des apprenants
  const inscription1 = await prisma.inscription.create({
    data: {
      apprenantId: apprenant1.apprenant!.id,
      sessionId: session1.id,
      statut: 'VALIDE',
    },
  });

  const inscription2 = await prisma.inscription.create({
    data: {
      apprenantId: apprenant2.apprenant!.id,
      sessionId: session1.id,
      statut: 'VALIDE',
    },
  });

  console.log('✅ Inscriptions créées');

  // Créer des emplois du temps
  await prisma.emploiDuTemps.create({
    data: {
      sessionId: session1.id,
      titre: 'Cours HTML/CSS',
      description: 'Introduction aux fondamentaux du web',
      dateDebut: new Date('2025-01-15T09:00:00'),
      dateFin: new Date('2025-01-15T12:00:00'),
      salleId: salle1.id,
      formateurId: formateur1.formateur?.id,
      recurrence: 'HEBDOMADAIRE',
      joursSemaine: [1, 3, 5], // Lundi, Mercredi, Vendredi
    },
  });

  console.log('✅ Emplois du temps créés');

  // Créer des évaluations
  const evaluation1 = await prisma.evaluation.create({
    data: {
      sessionId: session1.id,
      moduleId: module1.id,
      titre: 'Évaluation HTML/CSS',
      description: 'Test de connaissances sur HTML et CSS',
      type: 'NOTE_SUR_20',
      dateEvaluation: new Date('2025-02-15'),
      dureeMinutes: 120,
      coefficient: 2,
      noteMax: 20,
      createurId: formateur1.formateur!.id,
    },
  });

  // Créer des notes
  await prisma.note.create({
    data: {
      evaluationId: evaluation1.id,
      apprenantId: apprenant1.apprenant!.id,
      note: 16.5,
      commentaire: 'Très bon travail, continue comme ça !',
    },
  });

  await prisma.note.create({
    data: {
      evaluationId: evaluation1.id,
      apprenantId: apprenant2.apprenant!.id,
      note: 18,
      commentaire: 'Excellent travail !',
    },
  });

  console.log('✅ Évaluations et notes créées');

  console.log('');
  console.log('🎉 Seeding terminé avec succès !');
  console.log('');
  console.log('📧 Comptes de test créés :');
  console.log('   Admin: admin@centre-formation.com / password123');
  console.log('   Formateur 1: jean.dupont@centre-formation.com / password123');
  console.log('   Formateur 2: marie.martin@centre-formation.com / password123');
  console.log('   Apprenant 1: pierre.bernard@example.com / password123');
  console.log('   Apprenant 2: sophie.dubois@example.com / password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
