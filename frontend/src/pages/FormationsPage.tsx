import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { formationService } from '@/services/formation.service';
import { Formation, NiveauFormation } from '@/types';
import { FiSearch, FiClock, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const FormationsPage: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState<string>('');

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    try {
      setLoading(true);
      const data = await formationService.getAllFormations({
        search,
        niveau: selectedNiveau,
      });
      setFormations(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des formations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadFormations();
  };

  const getNiveauColor = (niveau: NiveauFormation) => {
    const colors = {
      [NiveauFormation.DEBUTANT]: 'bg-green-100 text-green-800',
      [NiveauFormation.INTERMEDIAIRE]: 'bg-blue-100 text-blue-800',
      [NiveauFormation.AVANCE]: 'bg-purple-100 text-purple-800',
      [NiveauFormation.EXPERT]: 'bg-red-100 text-red-800',
    };
    return colors[niveau];
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catalogue de Formations</h1>
            <p className="mt-2 text-gray-600">
              Découvrez nos formations et développez vos compétences
            </p>
          </div>
        </div>

        {/* Filtres */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une formation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select
              value={selectedNiveau}
              onChange={(e) => setSelectedNiveau(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les niveaux</option>
              <option value={NiveauFormation.DEBUTANT}>Débutant</option>
              <option value={NiveauFormation.INTERMEDIAIRE}>Intermédiaire</option>
              <option value={NiveauFormation.AVANCE}>Avancé</option>
              <option value={NiveauFormation.EXPERT}>Expert</option>
            </select>
            <Button onClick={handleSearch}>
              <FiSearch className="mr-2" />
              Rechercher
            </Button>
          </div>
        </Card>

        {/* Liste des formations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((formation) => (
            <Card key={formation.id} hover className="flex flex-col">
              {formation.image && (
                <img
                  src={formation.image}
                  alt={formation.titre}
                  className="w-full h-48 object-cover rounded-t-lg -m-6 mb-4"
                />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex-1">{formation.titre}</CardTitle>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getNiveauColor(
                      formation.niveau
                    )}`}
                  >
                    {formation.niveau}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {formation.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    {formation.dureeHeures}h
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-1" />
                    {formation.sessions?.length || 0} sessions
                  </div>
                </div>
                {formation.cout && (
                  <p className="text-lg font-bold text-primary-600 mb-4">
                    {formation.cout.toLocaleString('fr-FR')} €
                  </p>
                )}
                <Link to={`/formations/${formation.id}`}>
                  <Button variant="outline" className="w-full">
                    Voir les détails
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {formations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune formation trouvée</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
