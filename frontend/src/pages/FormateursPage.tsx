import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { FiPlus, FiEdit, FiTrash2, FiMail, FiPhone, FiUser, FiBriefcase } from 'react-icons/fi';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Formateur {
  id: string;
  user: {
    email: string;
    nom: string;
    prenom: string;
    telephone?: string;
  };
  qualifications?: string[];
  domainesExpertise?: string[];
  typeContrat?: string;
}

export const FormateursPage: React.FC = () => {
  const [formateurs, setFormateurs] = useState<Formateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFormateurs();
  }, []);

  const fetchFormateurs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/formateurs');
      setFormateurs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des formateurs:', error);
      toast.error('Impossible de charger les formateurs');
    } finally {
      setLoading(false);
    }
  };

  const filteredFormateurs = formateurs.filter((formateur) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      formateur.user.nom.toLowerCase().includes(searchLower) ||
      formateur.user.prenom.toLowerCase().includes(searchLower) ||
      formateur.user.email.toLowerCase().includes(searchLower)
    );
  });

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Formateurs</h1>
            <p className="mt-2 text-gray-600">
              Gérez l'équipe pédagogique du centre de formation
            </p>
          </div>
          <Button>
            <FiPlus className="mr-2" />
            Nouveau formateur
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent>
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{formateurs.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total formateurs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {formateurs.filter((f) => f.typeContrat === 'CDI').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">CDI</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {formateurs.filter((f) => f.typeContrat === 'CDD' || f.typeContrat === 'PRESTATAIRE').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">CDD / Prestataires</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formateurs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormateurs.map((formateur) => (
            <Card key={formateur.id} hover>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUser className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {formateur.user.prenom} {formateur.user.nom}
                      </h3>
                      {formateur.typeContrat && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          <FiBriefcase className="mr-1 h-3 w-3" />
                          {formateur.typeContrat}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-900">
                      <FiEdit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMail className="mr-2 h-4 w-4 text-gray-400" />
                    {formateur.user.email}
                  </div>
                  {formateur.user.telephone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FiPhone className="mr-2 h-4 w-4 text-gray-400" />
                      {formateur.user.telephone}
                    </div>
                  )}
                </div>

                {formateur.domainesExpertise && formateur.domainesExpertise.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Domaines d'expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {formateur.domainesExpertise.slice(0, 3).map((domaine, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {domaine}
                        </span>
                      ))}
                      {formateur.domainesExpertise.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{formateur.domainesExpertise.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFormateurs.length === 0 && (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun formateur</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? 'Aucun résultat ne correspond à votre recherche'
                    : 'Commencez par ajouter un nouveau formateur'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
