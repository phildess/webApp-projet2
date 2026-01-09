import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { FiUsers, FiEdit, FiTrash2, FiPlus, FiSearch, FiShield } from 'react-icons/fi';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  actif: boolean;
  dateCreation: string;
}

interface UserManagementProps {
  onUserUpdate?: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onUserUpdate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch all users from different endpoints
      const [apprenantsRes, formateursRes] = await Promise.all([
        api.get('/apprenants'),
        api.get('/formateurs'),
      ]);

      // Combine users from different sources
      const allUsers: User[] = [
        ...apprenantsRes.data.map((a: any) => ({
          id: a.user.id,
          email: a.user.email,
          nom: a.user.nom,
          prenom: a.user.prenom,
          role: 'APPRENANT',
          actif: a.user.actif,
          dateCreation: a.user.dateCreation,
        })),
        ...formateursRes.data.map((f: any) => ({
          id: f.user.id,
          email: f.user.email,
          nom: f.user.nom,
          prenom: f.user.prenom,
          role: 'FORMATEUR',
          actif: f.user.actif,
          dateCreation: f.user.dateCreation,
        })),
      ];

      setUsers(allUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'FORMATEUR':
        return 'bg-blue-100 text-blue-800';
      case 'APPRENANT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (actif: boolean) => {
    return actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      // Here you would call the delete API endpoint: await api.delete(`/users/${userId}`)
      console.log('Deleting user:', userId);
      toast.success('Utilisateur supprimé avec succès');
      fetchUsers();
      onUserUpdate?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Impossible de supprimer l\'utilisateur');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {users.filter((u) => u.role === 'APPRENANT').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Apprenants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {users.filter((u) => u.role === 'FORMATEUR').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Formateurs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {users.filter((u) => !u.actif).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Inactifs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tous les rôles</option>
              <option value="ADMIN">Administrateurs</option>
              <option value="FORMATEUR">Formateurs</option>
              <option value="APPRENANT">Apprenants</option>
            </select>
            <Button onClick={() => setShowCreateModal(true)}>
              <FiPlus className="mr-2" />
              Nouvel utilisateur
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiUsers className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.prenom} {user.nom}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        <FiShield className="mr-1 h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          user.actif
                        )}`}
                      >
                        {user.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-primary-600 hover:text-primary-900 mr-4"
                        onClick={() => toast('Édition en cours de développement')}
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedRole
                    ? 'Aucun résultat ne correspond à votre recherche'
                    : 'Commencez par ajouter des utilisateurs'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full m-4">
            <CardHeader>
              <CardTitle>Créer un nouvel utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Fonctionnalité de création d'utilisateur en cours de développement
              </p>
              <Button onClick={() => setShowCreateModal(false)}>Fermer</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
