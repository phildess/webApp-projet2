import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { FiBook, FiUsers, FiCalendar, FiAward } from 'react-icons/fi';
import { Role } from '@/types';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  formations: number;
  apprenants: number;
  formateurs: number;
  sessions: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    formations: 0,
    apprenants: 0,
    formateurs: 0,
    sessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [formationsRes, apprenantsRes, formateursRes] = await Promise.all([
        api.get('/formations'),
        api.get('/apprenants'),
        api.get('/formateurs'),
      ]);

      setStats({
        formations: formationsRes.data.length,
        apprenants: apprenantsRes.data.length,
        formateurs: formateursRes.data.length,
        sessions: formationsRes.data.reduce((acc: number, f: any) => acc + (f.sessions?.length || 0), 0),
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      toast.error('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  const statsDisplay = [
    {
      name: 'Formations',
      value: stats.formations.toString(),
      icon: FiBook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Apprenants',
      value: stats.apprenants.toString(),
      icon: FiUsers,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Formateurs',
      value: stats.formateurs.toString(),
      icon: FiCalendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Sessions',
      value: stats.sessions.toString(),
      icon: FiAward,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-2 text-gray-600">
            Bienvenue, {user?.prenom} {user?.nom} ({user?.role})
          </p>
        </div>

        {/* Stats Grid */}
        {user?.role === Role.ADMIN && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsDisplay.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.name} hover>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Cards for non-admin users */}
        {user?.role === Role.FORMATEUR && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Consultez vos cours dans la section "Emploi du temps"
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mes apprenants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Gérez vos apprenants dans la section "Apprenants"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {user?.role === Role.APPRENANT && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes formations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Consultez vos formations inscrites
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mon emploi du temps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Consultez votre planning de cours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/formations"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiBook className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Voir les formations</h3>
                <p className="text-sm text-gray-500 mt-1">Parcourir le catalogue</p>
              </a>
              <a
                href="/emploi-du-temps"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiCalendar className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-medium text-gray-900">Emploi du temps</h3>
                <p className="text-sm text-gray-500 mt-1">Consulter le planning</p>
              </a>
              {user?.role === Role.ADMIN && (
                <a
                  href="/apprenants"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiUsers className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Apprenants</h3>
                  <p className="text-sm text-gray-500 mt-1">Gérer les apprenants</p>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
