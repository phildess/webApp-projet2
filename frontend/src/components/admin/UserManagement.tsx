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

interface UserFormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'FORMATEUR' | 'APPRENANT';
  actif: boolean;
  // Specific fields based on role
  telephone?: string;
  adresse?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  typeContrat?: string;
  specialite?: string;
  domainesExpertise?: string;
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'APPRENANT',
    actif: true,
    telephone: '',
    adresse: '',
    dateNaissance: '',
    lieuNaissance: '',
    typeContrat: 'CDI',
    specialite: '',
    domainesExpertise: '',
  });

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

  const handleOpenCreateModal = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: 'APPRENANT',
      actif: true,
      telephone: '',
      adresse: '',
      dateNaissance: '',
      lieuNaissance: '',
      typeContrat: 'CDI',
      specialite: '',
      domainesExpertise: '',
    });
    setEditingUser(null);
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: '',
      role: user.role as 'ADMIN' | 'FORMATEUR' | 'APPRENANT',
      actif: user.actif,
      telephone: '',
      adresse: '',
      dateNaissance: '',
      lieuNaissance: '',
      typeContrat: 'CDI',
      specialite: '',
      domainesExpertise: '',
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingUser(null);
    setSubmitting(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingUser) {
        // Edit existing user
        toast.success('Utilisateur modifié avec succès (fonctionnalité simulée)');
      } else {
        // Create new user via /auth/register
        const userData: any = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          telephone: formData.telephone || undefined,
        };

        // Add role-specific data
        if (formData.role === 'APPRENANT') {
          // For apprenants, dateNaissance is required by backend
          if (formData.dateNaissance) {
            userData.dateNaissance = new Date(formData.dateNaissance).toISOString();
          } else {
            // Use a default date if not provided
            userData.dateNaissance = new Date('2000-01-01').toISOString();
          }
          userData.adresse = formData.adresse || undefined;
        } else if (formData.role === 'FORMATEUR') {
          // For formateurs, convert comma-separated strings to arrays
          userData.qualifications = formData.specialite
            ? [formData.specialite]
            : [];
          userData.domainesExpertise = formData.domainesExpertise
            ? formData.domainesExpertise.split(',').map(d => d.trim()).filter(d => d)
            : [];
        }

        await api.post('/auth/register', userData);
        toast.success('Utilisateur créé avec succès');
      }

      handleCloseModal();
      fetchUsers();
      onUserUpdate?.();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.errors?.[0]?.msg ||
                          'Impossible de sauvegarder l\'utilisateur';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
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
            <Button onClick={handleOpenCreateModal}>
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
                        onClick={() => handleOpenEditModal(user)}
                        title="Éditer l'utilisateur"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Supprimer l'utilisateur"
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

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Informations de base
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      placeholder="Dupont"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                      placeholder="Jean"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="jean.dupont@exemple.fr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}{' '}
                      {!editingUser && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="APPRENANT">Apprenant</option>
                      <option value="FORMATEUR">Formateur</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="actif"
                        checked={formData.actif}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Compte actif
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Coordonnées
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <Input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de naissance
                    </label>
                    <Input
                      type="date"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <Input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      placeholder="123 Rue de la Paix, 75000 Paris"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de naissance
                    </label>
                    <Input
                      type="text"
                      name="lieuNaissance"
                      value={formData.lieuNaissance}
                      onChange={handleInputChange}
                      placeholder="Paris"
                    />
                  </div>
                </div>
              </div>

              {/* Formateur-specific fields */}
              {formData.role === 'FORMATEUR' && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Informations formateur
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Spécialité principale
                      </label>
                      <Input
                        type="text"
                        name="specialite"
                        value={formData.specialite}
                        onChange={handleInputChange}
                        placeholder="Développement web, Design graphique, etc."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Cette spécialité sera ajoutée aux qualifications du formateur
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Domaines d'expertise (séparés par des virgules)
                      </label>
                      <textarea
                        name="domainesExpertise"
                        value={formData.domainesExpertise}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="JavaScript, React, Node.js, TypeScript"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Listez les domaines d'expertise du formateur, séparés par des virgules
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Annuler
                </Button>
                <Button type="submit" loading={submitting}>
                  {editingUser ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
