import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { FiPlus, FiEdit, FiTrash2, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Apprenant {
  id: string;
  user: {
    email: string;
    nom: string;
    prenom: string;
    telephone?: string;
  };
  dateNaissance?: string;
  statut: string;
  ville?: string;
  dateInscription: string;
}

export const ApprenantsPage: React.FC = () => {
  const [apprenants, setApprenants] = useState<Apprenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApprenants();
  }, []);

  const fetchApprenants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/apprenants');
      setApprenants(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des apprenants:', error);
      toast.error('Impossible de charger les apprenants');
    } finally {
      setLoading(false);
    }
  };

  const filteredApprenants = apprenants.filter((apprenant) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      apprenant.user.nom.toLowerCase().includes(searchLower) ||
      apprenant.user.prenom.toLowerCase().includes(searchLower) ||
      apprenant.user.email.toLowerCase().includes(searchLower)
    );
  });

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'INACTIF':
        return 'bg-gray-100 text-gray-800';
      case 'DIPLOME':
        return 'bg-blue-100 text-blue-800';
      case 'ABANDONNE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Apprenants</h1>
            <p className="mt-2 text-gray-600">
              Gérez les apprenants inscrits au centre de formation
            </p>
          </div>
          <Button>
            <FiPlus className="mr-2" />
            Nouvel apprenant
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{apprenants.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {apprenants.filter((a) => a.statut === 'ACTIF').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Actifs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {apprenants.filter((a) => a.statut === 'DIPLOME').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Diplômés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-600">
                  {apprenants.filter((a) => a.statut === 'INACTIF').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Inactifs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apprenants List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des apprenants ({filteredApprenants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Apprenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ville
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inscription
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApprenants.map((apprenant) => (
                    <tr key={apprenant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {apprenant.user.prenom} {apprenant.user.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiMail className="mr-2 h-4 w-4 text-gray-400" />
                          {apprenant.user.email}
                        </div>
                        {apprenant.user.telephone && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FiPhone className="mr-2 h-4 w-4 text-gray-400" />
                            {apprenant.user.telephone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(
                            apprenant.statut
                          )}`}
                        >
                          {apprenant.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {apprenant.ville || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(apprenant.dateInscription).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredApprenants.length === 0 && (
                <div className="text-center py-12">
                  <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun apprenant</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? 'Aucun résultat ne correspond à votre recherche'
                      : 'Commencez par ajouter un nouvel apprenant'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
